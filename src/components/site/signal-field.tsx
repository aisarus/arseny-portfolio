import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { clamp, makeRng, useReducedMotion } from "@/components/concepts/shared";
import { cn } from "@/lib/utils";

type SignalVariant = "broadcast" | "tracking" | "inspection" | "forensic" | "document" | "xray" | "playground" | "calm";

type SignalFieldProps = {
  variant: SignalVariant;
  intensity?: "low" | "medium" | "high";
  className?: string;
  words?: string[];
};

type Tear = { top: number; height: number; shift: number; delay: number; duration: number };

export function SignalField({ variant, intensity = "medium", className, words = [] }: SignalFieldProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const tears = useRef<Tear[] | null>(null);
  if (!tears.current) {
    const rng = makeRng(48391 + variant.length * 977);
    tears.current = Array.from({ length: intensity === "high" ? 11 : intensity === "medium" ? 8 : 5 }, () => ({
      top: rng() * 94,
      height: 0.5 + rng() * 3.5,
      shift: -18 + rng() * 36,
      delay: -rng() * 8,
      duration: 4.2 + rng() * 5.5,
    }));
  }

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host || reduced) return;

    let visible = false;
    let decayFrame = 0;
    let lastInput = 0;
    let strength = 0;
    let lastX = 0;
    let lastY = 0;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const write = (clientX: number, clientY: number, speed = 0) => {
      const bounds = host.getBoundingClientRect();
      const x = clamp((clientX - bounds.left) / Math.max(bounds.width, 1));
      const y = clamp((clientY - bounds.top) / Math.max(bounds.height, 1));
      strength = 1;
      lastInput = performance.now();
      layer.style.setProperty("--signal-x", `${(x * 100).toFixed(2)}%`);
      layer.style.setProperty("--signal-y", `${(y * 100).toFixed(2)}%`);
      layer.style.setProperty("--signal-clear", "1");
      layer.style.setProperty("--signal-radius-boost", `${Math.min(speed * 1.8, 90).toFixed(1)}px`);
    };

    const onPointer = (event: PointerEvent) => {
      const speed = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      lastX = event.clientX;
      lastY = event.clientY;
      write(event.clientX, event.clientY, speed);
    };

    const onScroll = () => {
      if (!coarse || !visible) return;
      const bounds = host.getBoundingClientRect();
      const centerY = clamp((window.innerHeight * 0.5 - bounds.top) / Math.max(bounds.height, 1));
      write(bounds.left + bounds.width * 0.5, bounds.top + bounds.height * centerY, 26);
    };

    const tick = (now: number) => {
      if (visible) {
        const idle = now - lastInput;
        if (idle > 2100) {
          strength += (0 - strength) * 0.012;
          layer.style.setProperty("--signal-clear", strength.toFixed(3));
          layer.style.setProperty("--signal-radius-boost", "0px");
        }
      }
      decayFrame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      layer.dataset["visible"] = visible ? "true" : "false";
      if (visible && coarse) onScroll();
    }, { rootMargin: "20% 0px" });

    observer.observe(host);
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    decayFrame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(decayFrame);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-variant={variant}
      data-intensity={intensity}
      data-static={reduced ? "true" : undefined}
      className={cn("broadcast-glitch", className)}
    >
      <div className="broadcast-rgb" />
      <div className="broadcast-snow" />
      <div className="broadcast-scanlines" />
      <div className="broadcast-roll" />
      <div className="broadcast-tears">
        {tears.current.map((tear, index) => (
          <i
            key={index}
            style={{
              top: `${tear.top}%`,
              height: `${tear.height}%`,
              "--tear-shift": `${tear.shift}px`,
              "--tear-delay": `${tear.delay}s`,
              "--tear-duration": `${tear.duration}s`,
            } as CSSProperties}
          />
        ))}
      </div>
      {words.length ? (
        <div className="broadcast-ghosts">
          {words.map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
        </div>
      ) : null}
    </div>
  );
}
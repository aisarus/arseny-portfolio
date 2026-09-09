import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

/** Deterministic tiny PRNG so layouts are identical on server and client. */
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function clamp(v: number, min = 0, max = 1) {
  return v < min ? min : v > max ? max : v;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export type PointerState = {
  x: number;
  y: number;
  /** inertial / smoothed position */
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  speed: number;
  active: boolean;
};

/**
 * Window-level pointer tracking with an inertial follower.
 * Mutates a ref (no React re-render) — read it inside rAF loops.
 */
export function usePointerField(enabled: boolean) {
  const ref = useRef<PointerState>({
    x: -9999,
    y: -9999,
    sx: -9999,
    sy: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
  });

  useEffect(() => {
    if (!enabled) return;
    const p = ref.current;

    const set = (x: number, y: number) => {
      if (!p.active) {
        p.sx = x;
        p.sy = y;
      }
      p.x = x;
      p.y = y;
      p.active = true;
    };

    const onMove = (e: PointerEvent) => set(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) set(t.clientX, t.clientY);
    };
    const onLeave = () => {
      p.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchend", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchend", onLeave);
    };
  }, [enabled]);

  return ref;
}

/** Advance the inertial follower. Call once per frame. */
export function stepPointer(p: PointerState, ease = 0.16) {
  const px = p.sx;
  const py = p.sy;
  p.sx += (p.x - p.sx) * ease;
  p.sy += (p.y - p.sy) * ease;
  p.vx = p.sx - px;
  p.vy = p.sy - py;
  p.speed = Math.hypot(p.vx, p.vy);
}

const CONCEPTS = [
  { to: "/concepts/glitch/field", label: "Clearing Field" },
  { to: "/concepts/glitch/shards", label: "Shard Reassembly" },
  { to: "/concepts/glitch/trace", label: "Evidence Trace" },
] as const;

export function ConceptNav({
  current,
  tone = "light",
}: {
  current: "field" | "shards" | "trace";
  tone?: "light" | "dark";
}) {
  const i = CONCEPTS.findIndex((c) => c.to.endsWith(current));
  const next = CONCEPTS[(i + 1) % CONCEPTS.length]!;
  const base =
    tone === "dark"
      ? "text-white/55 hover:text-white border-white/20 hover:border-white/60"
      : "text-black/50 hover:text-black border-black/20 hover:border-black/60";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 px-4 pb-4 sm:px-6 sm:pb-5">
      <Link
        to="/concepts/glitch"
        className={`pointer-events-auto border-b pb-0.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors sm:text-[11px] ${base}`}
      >
        ← Concepts
      </Link>
      <Link
        to={next.to}
        className={`pointer-events-auto border-b pb-0.5 text-right font-mono text-[10px] tracking-[0.18em] uppercase transition-colors sm:text-[11px] ${base}`}
      >
        {next.label} →
      </Link>
    </div>
  );
}

/** Inline SVG monochrome grain, usable as a CSS background-image. */
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

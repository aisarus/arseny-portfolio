import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ConceptNav,
  clamp,
  makeRng,
  stepPointer,
  usePointerField,
  useReducedMotion,
} from "@/components/concepts/shared";

const TITLE = "Shard Reassembly — Interference Study 02";
const DESCRIPTION =
  "Prototype: a fractured editorial layout whose shards magnetically snap into alignment around the cursor, then desynchronise.";

export const Route = createFileRoute("/concepts/glitch/shards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ShardsConcept,
});

type Shard = {
  x: number;
  y: number;
  w: number;
  h: number;
  amp: number;
  axis: 0 | 1;
  phase: number;
  rate: number;
};

function buildShards(rows: number, rng: () => number): Shard[] {
  const shards: Shard[] = [];
  let y = 0;
  for (let r = 0; r < rows; r++) {
    const h = r === rows - 1 ? 1 - y : (1 / rows) * (0.6 + rng() * 0.8);
    const hh = Math.min(h, 1 - y);
    const cols = 1 + Math.floor(rng() * 3);
    let x = 0;
    for (let c = 0; c < cols; c++) {
      const w = c === cols - 1 ? 1 - x : (1 / cols) * (0.55 + rng() * 0.9);
      const ww = Math.min(w, 1 - x);
      shards.push({
        x,
        y,
        w: ww,
        h: hh,
        amp: 12 + rng() * 70,
        axis: rng() > 0.72 ? 1 : 0,
        phase: rng() * Math.PI * 2,
        rate: 0.4 + rng() * 1.4,
      });
      x += ww;
      if (x >= 0.999) break;
    }
    y += hh;
    if (y >= 0.999) break;
  }
  return shards;
}

/** The single underlying composition; every shard renders a clipped copy of it. */
function Plane() {
  return (
    <div className="sr-plane" aria-hidden={false}>
      <div className="sr-plane-top">
        <span>Aegis / orchestration</span>
        <span>state: drifting</span>
      </div>
      <h1 className="sr-title">
        The model says done.
        <br />I check.
      </h1>
      <div className="sr-meta">
        <span>Goal → Contract</span>
        <span>Plan → Execution</span>
        <span>Failure → Replan</span>
        <span>Verified</span>
      </div>
      <div className="sr-rule" />
      <div className="sr-foot">
        <span>Acceptance contract</span>
        <span>Regression log</span>
        <span>Manual diagnosis</span>
        <span>Ship</span>
      </div>
    </div>
  );
}

function ShardsConcept() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const shardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointer = usePointerField(mounted && !reduced);

  useEffect(() => {
    setNarrow(window.innerWidth < 700);
    setMounted(true);
    const onResize = () => setNarrow(window.innerWidth < 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const shards = useMemo(() => buildShards(narrow ? 7 : 11, makeRng(770423)), [narrow]);

  useEffect(() => {
    if (!mounted || reduced) return;
    const host = hostRef.current;
    if (!host) return;

    const off = new Float32Array(shards.length);
    const vel = new Float32Array(shards.length);
    let raf = 0;
    let t = 0;

    const loop = () => {
      t += 1 / 60;
      const p = pointer.current;
      stepPointer(p, 0.3);
      const rect = host.getBoundingClientRect();
      const px = p.sx - rect.left;
      const py = p.sy - rect.top;
      const boost = clamp(p.speed / 24, 0, 1);
      const reach = Math.min(rect.width, rect.height) * 0.34;

      for (let i = 0; i < shards.length; i++) {
        const s = shards[i]!;
        const node = shardRefs.current[i];
        if (!node) continue;
        const cx = (s.x + s.w / 2) * rect.width;
        const cy = (s.y + s.h / 2) * rect.height;
        const d = Math.hypot(cx - px, cy - py);
        const near = p.active ? clamp(1 - d / reach) : 0;
        const lock = near * near;

        // drifting target when unlocked, 0 when locked; overshoot comes from a soft spring
        const drift = Math.sin(t * s.rate + s.phase) * s.amp;
        const target = drift * (1 - lock) + (1 - lock) * boost * 22 * Math.sign(drift || 1);

        const stiffness = 0.06 + lock * 0.34;
        const damping = 0.82 - lock * 0.16 - boost * 0.06;
        vel[i] = (vel[i]! + (target - off[i]!) * stiffness) * damping;
        off[i] = off[i]! + vel[i]!;

        const o = off[i]!;
        node.style.transform =
          s.axis === 0 ? `translate3d(${o.toFixed(2)}px,0,0)` : `translate3d(0,${o.toFixed(2)}px,0)`;
        node.style.setProperty("--lock", lock.toFixed(3));
        node.style.setProperty("--ghost", (clamp(Math.abs(o) / 40) * (1 - lock)).toFixed(3));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduced, shards, pointer]);

  return (
    <main className="sr-root">
      <style>{CSS_SHARDS}</style>

      <header className="sr-head">
        <span>Study 02</span>
        <span className="sr-head-name">Shard Reassembly</span>
        <span className="sr-hint">
          {reduced ? "static mode" : "sweep · drag"}
        </span>
      </header>

      <div ref={hostRef} className="sr-host" data-static={reduced ? "true" : undefined}>
        {mounted ? (
          shards.map((s, i) => (
            <div
              key={i}
              ref={(el) => {
                shardRefs.current[i] = el;
              }}
              className="sr-shard"
              style={{
                left: `${s.x * 100}%`,
                top: `${s.y * 100}%`,
                width: `${s.w * 100}%`,
                height: `${s.h * 100}%`,
              }}
            >
              <div
                className="sr-window"
                style={{
                  transform: `translate3d(${-s.x * 100}vw, ${-s.y * 100}dvh, 0)`,
                  width: "100vw",
                  height: "100dvh",
                }}
              >
                <Plane />
              </div>
              <div
                className="sr-window sr-ghost"
                style={{
                  transform: `translate3d(${-s.x * 100}vw, ${-s.y * 100}dvh, 0)`,
                  width: "100vw",
                  height: "100dvh",
                }}
              >
                <Plane />
              </div>
              <i className="sr-scan" aria-hidden />
            </div>
          ))
        ) : (
          <div className="sr-window" style={{ width: "100%", height: "100dvh" }}>
            <Plane />
          </div>
        )}
      </div>

      <ConceptNav current="shards" />
    </main>
  );
}

const CSS_SHARDS = `
.sr-root{position:relative;min-height:100dvh;width:100%;overflow:hidden;background:#0e0e0d;color:#f4f1ea;}
.sr-head{background:linear-gradient(to bottom,rgba(14,14,13,.9) 50%,rgba(14,14,13,0));position:fixed;top:0;left:0;right:0;z-index:40;display:flex;gap:12px;align-items:baseline;
  padding:14px 16px;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(244,241,234,.5);}
.sr-head-name{color:#f4f1ea;}
.sr-hint{margin-left:auto;text-align:right;}
@media (min-width:640px){.sr-head{padding:18px 24px;font-size:11px;}}
.sr-host{position:relative;width:100%;height:100dvh;overflow:hidden;touch-action:none;}
.sr-shard{position:absolute;overflow:hidden;will-change:transform;--lock:0;--ghost:0;
  box-shadow:inset 0 0 0 1px rgba(244,241,234,calc(.05 + var(--lock) * .12));}
.sr-window{position:absolute;top:0;left:0;}
.sr-ghost{opacity:calc(var(--ghost) * .5);color:#7fd6c0;mix-blend-mode:screen;
  margin-left:6px;filter:blur(.4px);}
.sr-scan{position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(to bottom,rgba(0,0,0,.34) 0 1px,transparent 1px 4px);
  opacity:calc(.85 - var(--lock) * .75);}
.sr-plane{position:relative;width:100vw;height:100dvh;padding:64px 16px 60px;display:flex;flex-direction:column;
  justify-content:center;gap:20px;}
@media (min-width:640px){.sr-plane{padding:88px 48px 72px;gap:28px;}}
.sr-plane-top,.sr-meta,.sr-foot{display:flex;flex-wrap:wrap;gap:10px 22px;
  font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(244,241,234,.55);}
@media (min-width:640px){.sr-plane-top,.sr-meta,.sr-foot{font-size:11px;}}
.sr-title{font-family:var(--font-display);font-weight:700;text-transform:uppercase;letter-spacing:-.04em;
  line-height:.86;font-size:clamp(2.1rem,10.5vw,8.4rem);margin:0;color:#f4f1ea;}
.sr-rule{height:1px;background:rgba(244,241,234,.22);}
.sr-host[data-static="true"] .sr-shard{transform:none !important;}
.sr-host[data-static="true"] .sr-scan,.sr-host[data-static="true"] .sr-ghost{display:none;}
@media (prefers-reduced-motion:reduce){
  .sr-shard{transform:none !important;}
  .sr-scan,.sr-ghost{display:none;}
}
`;

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ConceptNav,
  GRAIN_URL,
  clamp,
  makeRng,
  stepPointer,
  usePointerField,
  useReducedMotion,
} from "@/components/concepts/shared";

const TITLE = "Evidence Trace — Interference Study 03";
const DESCRIPTION =
  "Prototype: a forensic dark surface where a decaying verification beam paints a readable path and flips cells from rejected to verified.";

export const Route = createFileRoute("/concepts/glitch/trace")({
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
  component: TraceConcept,
});

const LINES = [
  "Loop terminated on cost, not on completion",
  "Agent reported success; artefact was never written",
  "Concurrency stabilised after resource isolation",
  "Shared lock added around the write path",
  "Acceptance contract restated before execution",
  "Elevated-access path removed from the client",
  "Retry budget bound to a verified end state",
  "Failure recorded, replanned, re-run",
  "Diagnosis before patch, always",
  "The model says done — the log decides",
  "Secrets moved out of tracked config",
  "Regression captured as an executable check",
];

function TraceConcept() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [cols, setCols] = useState(4);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointer = usePointerField(mounted && !reduced);

  useEffect(() => {
    const measure = () => setCols(window.innerWidth < 700 ? 2 : window.innerWidth < 1100 ? 3 : 4);
    measure();
    setMounted(true);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const rows = cols === 2 ? 6 : cols === 3 ? 4 : 3;
  const cells = useMemo(() => {
    const rng = makeRng(31415);
    return Array.from({ length: cols * rows }, (_, i) => ({
      id: i,
      line: LINES[i % LINES.length]!,
      code: `EV-${String(100 + Math.floor(rng() * 800))}`,
    }));
  }, [cols, rows]);

  useEffect(() => {
    if (!mounted || reduced) return;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    type Pt = { x: number; y: number; t: number };
    const trail: Pt[] = [];
    const proof: Array<{ x: number; y: number }> = [];
    const clarity = new Float32Array(cells.length);
    const verified = new Uint8Array(cells.length);
    const TRAIL_MS = 4200;
    let raf = 0;

    const loop = () => {
      const now = performance.now();
      const p = pointer.current;
      stepPointer(p, 0.4);
      const rect = host.getBoundingClientRect();
      const px = p.sx - rect.left;
      const py = p.sy - rect.top;

      if (p.active && px > -50 && py > -50) {
        const last = trail[trail.length - 1];
        if (!last || Math.hypot(px - last.x, py - last.y) > 6) trail.push({ x: px, y: py, t: now });
      }
      while (trail.length && now - trail[0]!.t > TRAIL_MS) trail.shift();

      // cell clarity from nearest trail point, decaying with its age
      for (let i = 0; i < cells.length; i++) {
        const node = cellRefs.current[i];
        if (!node) continue;
        const cr = node.getBoundingClientRect();
        const cx = cr.left - rect.left + cr.width / 2;
        const cy = cr.top - rect.top + cr.height / 2;
        let best = 0;
        for (let k = trail.length - 1; k >= 0; k--) {
          const pt = trail[k]!;
          const d = Math.hypot(pt.x - cx, pt.y - cy);
          const spatial = clamp(1 - d / (Math.max(cr.width, cr.height) * 0.95));
          if (spatial <= 0) continue;
          const age = clamp(1 - (now - pt.t) / TRAIL_MS);
          const v = spatial * (0.35 + age * 0.65);
          if (v > best) best = v;
        }
        const cur = clarity[i]!;
        clarity[i] = cur + (best - cur) * (best > cur ? 0.3 : 0.03);
        const cc = clarity[i]!;
        node.style.setProperty("--c", cc.toFixed(3));
        if (!verified[i] && cc > 0.72) {
          verified[i] = 1;
          node.dataset["state"] = "verified";
          proof.push({ x: cx / rect.width, y: cy / rect.height });
        }
      }

      // beam + persistent proof polyline
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (proof.length > 1) {
        ctx.beginPath();
        ctx.moveTo(proof[0]!.x * rect.width, proof[0]!.y * rect.height);
        for (let i = 1; i < proof.length; i++)
          ctx.lineTo(proof[i]!.x * rect.width, proof[i]!.y * rect.height);
        ctx.strokeStyle = "rgba(126,214,183,0.34)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      for (const pt of proof) {
        ctx.beginPath();
        ctx.arc(pt.x * rect.width, pt.y * rect.height, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(126,214,183,0.6)";
        ctx.fill();
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1]!;
        const b = trail[i]!;
        const age = clamp(1 - (now - b.t) / TRAIL_MS);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(196,255,231,${(age * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1 + age * 8;
        ctx.stroke();
      }
      if (p.active && trail.length) {
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(196,255,231,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mounted, reduced, cells, pointer]);

  return (
    <main className="tr-root">
      <style>{CSS_TRACE}</style>

      <header className="tr-head">
        <span>Study 03</span>
        <span className="tr-head-name">Evidence Trace</span>
        <span className="tr-hint">
          {reduced ? "static mode" : "draw across the panels · drag on touch"}
        </span>
      </header>

      <div
        ref={hostRef}
        className="tr-host"
        data-static={reduced ? "true" : undefined}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            className="tr-cell"
            data-state={reduced ? "verified" : "rejected"}
          >
            <div className="tr-cell-top">
              <span>{c.code}</span>
              <span className="tr-state">
                rejected
                <b>verified</b>
              </span>
            </div>
            <p className="tr-line">
              <span className="tr-dup" aria-hidden>
                {c.line}
              </span>
              <span className="tr-dup tr-dup2" aria-hidden>
                {c.line}
              </span>
              <span className="tr-main">{c.line}</span>
            </p>
            <i className="tr-veil" aria-hidden />
          </div>
        ))}
        <canvas ref={canvasRef} className="tr-canvas" aria-hidden />
      </div>

      <ConceptNav current="trace" tone="dark" />
    </main>
  );
}

const CSS_TRACE = `
.tr-root{position:relative;min-height:100dvh;width:100%;overflow:hidden;background:#0b0c0b;color:#e8e6df;}
.tr-head{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;gap:12px;align-items:baseline;
  padding:14px 16px;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(232,230,223,.45);}
.tr-head-name{color:#e8e6df;}
.tr-hint{margin-left:auto;text-align:right;}
@media (min-width:640px){.tr-head{padding:18px 24px;font-size:11px;}}
.tr-host{position:relative;display:grid;gap:1px;background:rgba(232,230,223,.1);
  width:100%;height:100dvh;padding-top:0;overflow:hidden;touch-action:none;}
.tr-canvas{position:absolute;inset:0;pointer-events:none;z-index:5;}
.tr-cell{position:relative;overflow:hidden;background:#0b0c0b;padding:14px 12px;
  display:flex;flex-direction:column;justify-content:space-between;gap:10px;--c:0;}
@media (min-width:640px){.tr-cell{padding:20px 18px;}}
.tr-cell-top{display:flex;justify-content:space-between;gap:8px;
  font-family:var(--font-mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(232,230,223,.4);}
@media (min-width:640px){.tr-cell-top{font-size:10px;}}
.tr-state{position:relative;color:#d0705f;}
.tr-state b{position:absolute;right:0;top:0;font-weight:400;color:#7ed6b7;opacity:0;}
.tr-cell[data-state="verified"] .tr-state{color:transparent;}
.tr-cell[data-state="verified"] .tr-state b{opacity:1;}
.tr-line{position:relative;margin:0;font-family:var(--font-editorial);
  font-size:clamp(15px,2.4vw,30px);line-height:1.12;letter-spacing:-.01em;}
.tr-main{position:relative;display:block;color:rgba(232,230,223,calc(.28 + var(--c) * .72));
  filter:blur(calc((1 - var(--c)) * 2.6px));}
.tr-dup{position:absolute;inset:0;display:block;color:#7ed6b7;mix-blend-mode:screen;
  opacity:calc((1 - var(--c)) * .32);transform:translate(calc((1 - var(--c)) * 5px),calc((1 - var(--c)) * -3px));
  filter:blur(calc((1 - var(--c)) * 2px));}
.tr-dup2{color:#d0705f;transform:translate(calc((1 - var(--c)) * -6px),calc((1 - var(--c)) * 3px));}
.tr-veil{position:absolute;inset:0;pointer-events:none;background-image:${GRAIN_URL};
  background-size:130px 130px;mix-blend-mode:screen;opacity:calc((1 - var(--c)) * .16);}
.tr-cell[data-state="verified"]{background:#0d100e;}
.tr-host[data-static="true"] .tr-cell{--c:1;}
.tr-host[data-static="true"] .tr-dup,.tr-host[data-static="true"] .tr-veil{display:none;}
@media (prefers-reduced-motion:reduce){
  .tr-cell{--c:1;}
  .tr-dup,.tr-veil{display:none;}
}
`;

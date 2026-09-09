import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ConceptNav,
  GRAIN_URL,
  clamp,
  makeRng,
  smoothstep,
  stepPointer,
  usePointerField,
  useReducedMotion,
} from "@/components/concepts/shared";

const TITLE = "Clearing Field — Interference Study 01";
const DESCRIPTION =
  "Prototype: an irregular editorial mosaic buried under optical interference, cleared by an inertial cursor pressure field.";

export const Route = createFileRoute("/concepts/glitch/field")({
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
  component: FieldConcept,
});

type Rect = { x: number; y: number; w: number; h: number };

function mosaic(depth: number, rng: () => number): Rect[] {
  let rects: Rect[] = [{ x: 0, y: 0, w: 1, h: 1 }];
  for (let d = 0; d < depth; d++) {
    const next: Rect[] = [];
    for (const r of rects) {
      if (rng() < 0.16 && d > 1) {
        next.push(r);
        continue;
      }
      const horizontal = r.w / 1.6 > r.h ? true : r.h / 1.6 > r.w ? false : rng() > 0.5;
      const t = 0.32 + rng() * 0.36;
      if (horizontal) {
        next.push({ ...r, w: r.w * t }, { ...r, x: r.x + r.w * t, w: r.w * (1 - t) });
      } else {
        next.push({ ...r, h: r.h * t }, { ...r, y: r.y + r.h * t, h: r.h * (1 - t) });
      }
    }
    rects = next;
  }
  return rects;
}

const WORDS = [
  "I DON'T WRITE",
  "EVERY LINE",
  "I MAKE THE SYSTEM",
  "FINISH THE JOB",
  "GOAL",
  "CONTRACT",
  "PLAN",
  "EXECUTION",
  "FAILURE",
  "REPLAN",
  "VERIFIED",
  "AMBIGUOUS",
  "DECOMPOSE",
  "BREAK",
  "DIAGNOSE",
  "SHIP",
  "AEGIS",
  "ACCEPTANCE",
  "CONTRACT",
  "TRACE",
  "LOOP",
  "STATE",
  "RETRY",
  "OWNERSHIP",
];

function FieldConcept() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointer = usePointerField(mounted && !reduced);

  useEffect(() => {
    setNarrow(window.innerWidth < 700);
    setMounted(true);
    const onResize = () => setNarrow(window.innerWidth < 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cells = useMemo(() => {
    const rng = makeRng(20260909);
    const rects = mosaic(narrow ? 4 : 6, rng);
    return rects.map((r, i) => ({
      ...r,
      text: WORDS[i % WORDS.length]!,
      lag: 0.55 + rng() * 0.8,
      seed: rng(),
    }));
  }, [narrow]);

  useEffect(() => {
    if (!mounted || reduced) return;
    const host = hostRef.current;
    if (!host) return;

    const clarity = new Float32Array(cells.length);
    const pushX = new Float32Array(cells.length);
    const pushY = new Float32Array(cells.length);
    let raf = 0;

    const loop = () => {
      const p = pointer.current;
      stepPointer(p, 0.14);
      const rect = host.getBoundingClientRect();
      const px = p.sx - rect.left;
      const py = p.sy - rect.top;
      const boost = clamp(p.speed / 26, 0, 1);
      const radius = Math.min(rect.width, rect.height) * (0.3 + boost * 0.22);

      for (let i = 0; i < cells.length; i++) {
        const node = cellRefs.current[i];
        const c = cells[i]!;
        if (!node) continue;
        const cx = (c.x + c.w / 2) * rect.width;
        const cy = (c.y + c.h / 2) * rect.height;
        const dx = cx - px;
        const dy = cy - py;
        const d = Math.hypot(dx, dy) || 0.001;

        const target = p.active ? 1 - smoothstep(radius * 0.18, radius, d) : 0;
        const cur = clarity[i]!;
        // fast to clear, slow to fog back over
        const ease = target > cur ? 0.24 * c.lag : 0.022 * c.lag;
        clarity[i] = cur + (target - cur) * ease;

        const mag = target * (10 + 46 * boost) * (0.6 + c.seed * 0.8);
        pushX[i] = pushX[i]! + ((dx / d) * mag - pushX[i]!) * 0.12;
        pushY[i] = pushY[i]! + ((dy / d) * mag - pushY[i]!) * 0.12;

        const cc = clarity[i]!;
        node.style.setProperty("--c", cc.toFixed(3));
        node.style.setProperty("--px", `${pushX[i]!.toFixed(2)}px`);
        node.style.setProperty("--py", `${pushY[i]!.toFixed(2)}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduced, cells, pointer]);

  return (
    <main className="cf-root">
      <style>{CSS_FIELD}</style>

      <header className="cf-head">
        <span>Study 01</span>
        <span className="cf-head-name">Clearing Field</span>
        <span className="cf-hint">{reduced ? "static mode" : "move the cursor · drag on touch"}</span>
      </header>

      <div ref={hostRef} className="cf-host" data-static={reduced ? "true" : undefined}>
        {mounted
          ? cells.map((c, i) => (
              <div
                key={i}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                className="cf-cell"
                style={{
                  left: `${c.x * 100}%`,
                  top: `${c.y * 100}%`,
                  width: `${c.w * 100}%`,
                  height: `${c.h * 100}%`,
                }}
              >
                <span className="cf-layer cf-r" aria-hidden>
                  {c.text}
                </span>
                <span className="cf-layer cf-b" aria-hidden>
                  {c.text}
                </span>
                <span className="cf-layer cf-m">{c.text}</span>
                <span className="cf-slice" aria-hidden>
                  <span>{c.text}</span>
                </span>
                <i className="cf-grain" aria-hidden />
              </div>
            ))
          : null}
        <div className="cf-vignette" aria-hidden />
      </div>

      <ConceptNav current="field" />
    </main>
  );
}

const CSS_FIELD = `
.cf-root{position:relative;min-height:100dvh;width:100%;overflow:hidden;background:#f2efe8;color:#141312;}
.cf-head{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;gap:12px;align-items:baseline;
  padding:14px 16px;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(20,19,18,.55);mix-blend-mode:multiply;}
.cf-head-name{color:#141312;}
.cf-hint{margin-left:auto;text-align:right;}
@media (min-width:640px){.cf-head{padding:18px 24px;font-size:11px;}}
.cf-host{position:relative;width:100%;height:100dvh;overflow:hidden;background:#f2efe8;touch-action:none;}
.cf-cell{position:absolute;overflow:hidden;container-type:size;
  border-right:1px solid rgba(20,19,18,.1);border-bottom:1px solid rgba(20,19,18,.1);
  --c:0;--px:0px;--py:0px;
  transform:translate3d(calc(var(--px) * .35),calc(var(--py) * .35),0);
  will-change:transform,filter;
  filter:blur(calc((1 - var(--c)) * 3.4px)) contrast(calc(1 + (1 - var(--c)) * .25));}
.cf-layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  padding:2cqw;text-align:center;font-family:var(--font-display);font-weight:700;
  letter-spacing:-.03em;line-height:.9;text-transform:uppercase;
  font-size:clamp(9px,20cqh,44px);white-space:pre-wrap;}
.cf-m{color:#141312;opacity:calc(.32 + var(--c) * .68);}
.cf-r{color:#c8302a;mix-blend-mode:multiply;opacity:calc((1 - var(--c)) * .55);
  transform:translate3d(calc(var(--px) * .22 - (1 - var(--c)) * 3px),calc(var(--py) * .1),0);}
.cf-b{color:#2f4bd0;mix-blend-mode:multiply;opacity:calc((1 - var(--c)) * .5);
  transform:translate3d(calc(var(--px) * -.22 + (1 - var(--c)) * 3px),calc(var(--py) * -.1),0);}
.cf-slice{position:absolute;inset:0;overflow:hidden;pointer-events:none;
  opacity:calc((1 - var(--c)) * .9);
  clip-path:polygon(0 18%,100% 18%,100% 30%,0 30%,0 55%,100% 55%,100% 66%,0 66%);}
.cf-slice > span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  padding:2cqw;text-align:center;font-family:var(--font-display);font-weight:700;letter-spacing:-.03em;
  line-height:.9;text-transform:uppercase;font-size:clamp(9px,20cqh,44px);color:#141312;
  transform:translateX(calc((1 - var(--c)) * 12px + var(--px) * .5));}
.cf-grain{position:absolute;inset:-20%;pointer-events:none;background-image:${GRAIN_URL};
  background-size:150px 150px;mix-blend-mode:multiply;opacity:calc((1 - var(--c)) * .5);
  transform:translate3d(calc(var(--px) * -.6),calc(var(--py) * -.6),0);}
.cf-vignette{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 50% 45%,transparent 55%,rgba(20,19,18,.14) 100%);}
.cf-host[data-static="true"] .cf-cell{--c:1;filter:none;transform:none;}
.cf-host[data-static="true"] .cf-slice,.cf-host[data-static="true"] .cf-grain,
.cf-host[data-static="true"] .cf-r,.cf-host[data-static="true"] .cf-b{display:none;}
@media (prefers-reduced-motion:reduce){
  .cf-cell{--c:1;filter:none;transform:none;}
  .cf-slice,.cf-grain,.cf-r,.cf-b{display:none;}
}
`;

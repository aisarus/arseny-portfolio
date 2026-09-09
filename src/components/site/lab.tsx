import { useEffect, useRef, useState } from "react";
import { Reveal, Shell } from "./primitives";

function TwinPreview() {
  const [t, setT] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onScroll = () => {
      const r = node.getBoundingClientRect();
      const p = 1 - (r.top + r.height) / (window.innerHeight + r.height);
      setT(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="relative h-28 w-full border border-hairline">
      <svg viewBox="0 0 200 70" className="h-full w-full" aria-hidden>
        {Array.from({ length: 33 }).map((_, i) => (
          <line
            key={i}
            x1={4 + i * 6}
            y1={54}
            x2={4 + i * 6}
            y2={i % 8 === 0 ? 34 : 46}
            stroke="currentColor"
            strokeWidth="0.7"
            opacity={i / 32 <= t ? 0.9 : 0.2}
          />
        ))}
        <circle cx={4 + t * 192} cy={20} r="4" fill="currentColor" />
        <line
          x1={4 + t * 192}
          y1={20}
          x2={4 + t * 192}
          y2={58}
          stroke="currentColor"
          strokeWidth="0.7"
          opacity="0.5"
        />
      </svg>
      <span className="label-mono absolute top-2 right-3">
        {(t * 32).toFixed(1)}s / 32s
      </span>
    </div>
  );
}

function BrainPreview() {
  const [p, setP] = useState({ x: 50, y: 50 });
  const nodes = Array.from({ length: 26 }).map((_, i) => {
    const a = (i / 26) * Math.PI * 2;
    const r = 22 + (i % 5) * 6;
    return { x: 50 + Math.cos(a) * r * 1.5, y: 50 + Math.sin(a) * r * 0.85 };
  });

  return (
    <div
      className="relative h-28 w-full border border-hairline"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setP({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        });
      }}
      onMouseLeave={() => setP({ x: 50, y: 50 })}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        {nodes.map((n, i) => {
          const d = Math.hypot(n.x - p.x, n.y - p.y);
          const lit = d < 34;
          return (
            <g key={i}>
              {lit && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={n.x}
                  y2={n.y}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  opacity={0.7 - d / 60}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <circle cx={n.x} cy={n.y} r={lit ? 1.4 : 0.9} fill="currentColor" opacity={lit ? 0.95 : 0.4} />
            </g>
          );
        })}
      </svg>
      <span className="label-mono absolute top-2 right-3">raycast</span>
    </div>
  );
}

function TriPreview() {
  const roles = ["Proposer", "Critic", "Verifier"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % 3), 1600);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="relative flex h-28 w-full items-center justify-between gap-2 border border-hairline px-4">
      {roles.map((r, idx) => (
        <div key={r} className="flex flex-1 flex-col items-center gap-2">
          <span
            className="block rounded-full bg-current transition-all duration-500"
            style={{ width: idx === i ? 12 : 6, height: idx === i ? 12 : 6, opacity: idx === i ? 1 : 0.35 }}
          />
          <span className="label-mono" style={{ opacity: idx === i ? 1 : 0.5 }}>
            {r}
          </span>
        </div>
      ))}
      <span className="label-mono absolute top-2 right-3">cycle</span>
    </div>
  );
}

const ITEMS = [
  {
    id: "twin",
    name: "TWIN",
    kicker: "Motion / determinism",
    body: "A 32-second scroll-film built from CSS and SVG with a deterministic JavaScript motion timeline. The point was reproducible timing: the same scroll position always produces the same frame.",
    preview: <TwinPreview />,
  },
  {
    id: "djbrain",
    name: "Djbrain",
    kicker: "3D / interaction",
    body: "An interactive procedural brain in Three.js — raycasting for pointer picking, touch support, and a visualization that stays responsive on small screens instead of degrading into a static blob.",
    preview: <BrainPreview />,
  },
  {
    id: "tri",
    name: "TRI·TFM",
    kicker: "Prompt optimization research",
    body: "A family of experiments on proposer / critic / verifier loops: diversification and stabilization cycles, convergence behaviour and quality control. An ongoing line of research rather than a single product.",
    preview: <TriPreview />,
  },
];

export function Lab() {
  return (
    <section id="lab" className="scroll-mt-16 py-20 sm:py-28">
      <Shell>
        <div className="hairline-t pt-6">
          <span className="label-mono">04 / Lab · Range</span>
          <Reveal className="mt-8">
            <h2 className="display-xl max-w-[16ch] text-[clamp(2.1rem,6.5vw,4.6rem)]">
              Supporting experiments.
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              Focused technical exercises alongside the flagship work: motion and determinism, 3D
              interaction, and prompt-optimization research.
            </p>

          </Reveal>
        </div>

        <div className="mt-12 grid gap-px sm:mt-16 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 90}
              className="hairline-t flex flex-col gap-5 py-8 lg:pr-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] uppercase">
                  {item.name}
                </h3>
                <span className="label-mono">{item.kicker}</span>
              </div>
              {item.preview}
              <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

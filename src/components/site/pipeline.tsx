import { useState } from "react";

import { cn } from "@/lib/utils";
import { SectionHead, Shell } from "./primitives";
import { SignalField } from "./signal-field";

type Stage = { id: string; name: string; role: string; body: string; artifacts: string[] };

const STAGES: Stage[] = [
  { id: "ambiguous", name: "Ambiguous", role: "Input", body: "A loosely specified product or business problem. Nobody agrees yet on what 'done' means, and the first plausible-sounding plan is usually wrong in a way that only shows up later.", artifacts: ["Raw goal", "Unstated constraints", "Unknown failure surface"] },
  { id: "decompose", name: "Decompose", role: "Contract", body: "The goal is rewritten as falsifiable acceptance criteria, explicit architecture boundaries and routable units of work. What cannot be checked does not enter the plan.", artifacts: ["Acceptance criteria", "Architecture boundaries", "Task routing"] },
  { id: "build", name: "Build", role: "Execution", body: "Implementation runs through coding agents on modern web stacks and real integrations. Generated code is reviewed against the contract, not accepted because it runs.", artifacts: ["Coding agents", "React / TS / Node", "Supabase · Edge · APIs"] },
  { id: "break", name: "Break", role: "Pressure", body: "Systems are pushed until they fail on purpose: concurrency, restarts, quota exhaustion, bad state. Hidden failure is worse than loud failure, so failure is provoked early.", artifacts: ["Concurrency runs", "Restart / crash paths", "Adversarial inputs"] },
  { id: "diagnose", name: "Diagnose", role: "Judgement", body: "The interesting question is which kind of failure it is: model failure, lifecycle bug, wrong system boundary, stale state, or an observability side effect the tooling itself created.", artifacts: ["Root cause, not symptom", "Cost accounting", "Regression test"] },
  { id: "verify", name: "Verify", role: "Evidence", body: "Acceptance is evidence-driven: deterministic checks, logs and artifacts, plus real browser flows. A confident answer without evidence is treated as an unverified claim.", artifacts: ["Deterministic checks", "Collected evidence", "Browser E2E"] },
  { id: "ship", name: "Ship", role: "Output", body: "A working prototype, a documented handoff, and an honest statement of limitations — including what was not validated and why.", artifacts: ["Working prototype", "Documented handoff", "Stated limitations"] },
];

export function Pipeline() {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = STAGES[activeIndex] ?? STAGES[0];
  if (!active) return null;

  const select = (index: number) => setActiveIndex(Math.max(0, Math.min(STAGES.length - 1, index)));

  return (
    <section id="index" className="signal-section pipeline-v3 scroll-mt-16 py-16 sm:py-24">
      <SignalField variant="tracking" intensity="medium" words={["LOCK", "TRACK", "SYNC"]} />
      <Shell className="signal-content">
        <SectionHead index="01" kicker="Operating model" title={<>Tune the work<br />until it locks.</>} lede="Ambiguity is reduced in stages. Each step creates evidence for the next and keeps the final judgement under human control." />
        <div className="signal-tuner mt-12 sm:mt-16" onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          select(Math.round(((event.clientX - bounds.left) / bounds.width) * (STAGES.length - 1)));
        }}>
          <div className="tracking-wave" aria-hidden>
            <svg viewBox="0 0 700 90" preserveAspectRatio="none"><path d="M0 47 C45 47 48 14 92 47 S140 82 184 47 S232 12 276 47 S324 82 368 47 S416 12 460 47 S508 82 552 47 S610 16 700 47" /><line x1={`${(activeIndex / (STAGES.length - 1)) * 700}`} x2={`${(activeIndex / (STAGES.length - 1)) * 700}`} y1="0" y2="90" /></svg>
          </div>
          <div role="tablist" aria-label="Operating model stages" className="tracking-stages">
            {STAGES.map((stage, index) => (
              <button key={stage.id} id={`stage-tab-${stage.id}`} role="tab" aria-selected={index === activeIndex} aria-controls="stage-panel" tabIndex={index === activeIndex ? 0 : -1} onClick={() => select(index)} onFocus={() => select(index)} onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); const next = (activeIndex + 1) % STAGES.length; select(next); document.getElementById(`stage-tab-${STAGES[next]?.id}`)?.focus(); }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); const previous = (activeIndex - 1 + STAGES.length) % STAGES.length; select(previous); document.getElementById(`stage-tab-${STAGES[previous]?.id}`)?.focus(); }
              }} className={cn("tracking-stage", index === activeIndex && "is-locked")}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{stage.name}</strong><i aria-hidden />
              </button>
            ))}
          </div>
        </div>
        <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active.id}`} className="tracking-output">
          <div><span className="label-mono">Signal locked / {active.role}</span><h3>{active.name}</h3></div>
          <p>{active.body}</p>
          <ul>{active.artifacts.map((artifact) => <li key={artifact}>{artifact}</li>)}</ul>
        </div>
      </Shell>
    </section>
  );
}
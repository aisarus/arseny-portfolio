import { useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal, SectionHead, Shell } from "./primitives";

type Stage = {
  id: string;
  name: string;
  role: string;
  body: string;
  artifacts: string[];
};

const STAGES: Stage[] = [
  {
    id: "ambiguous",
    name: "Ambiguous",
    role: "Input",
    body: "A loosely specified product or business problem. Nobody agrees yet on what 'done' means, and the first plausible-sounding plan is usually wrong in a way that only shows up later.",
    artifacts: ["Raw goal", "Unstated constraints", "Unknown failure surface"],
  },
  {
    id: "decompose",
    name: "Decompose",
    role: "Contract",
    body: "The goal is rewritten as falsifiable acceptance criteria, explicit architecture boundaries and routable units of work. What cannot be checked does not enter the plan.",
    artifacts: ["Acceptance criteria", "Architecture boundaries", "Task routing"],
  },
  {
    id: "build",
    name: "Build",
    role: "Execution",
    body: "Implementation runs through coding agents on modern web stacks and real integrations. Generated code is reviewed against the contract, not accepted because it runs.",
    artifacts: ["Coding agents", "React / TS / Node", "Supabase · Edge · APIs"],
  },
  {
    id: "break",
    name: "Break",
    role: "Pressure",
    body: "Systems are pushed until they fail on purpose: concurrency, restarts, quota exhaustion, bad state. Hidden failure is worse than loud failure, so failure is provoked early.",
    artifacts: ["Concurrency runs", "Restart / crash paths", "Adversarial inputs"],
  },
  {
    id: "diagnose",
    name: "Diagnose",
    role: "Judgement",
    body: "The interesting question is which kind of failure it is: model failure, lifecycle bug, wrong system boundary, stale state, or an observability side effect the tooling itself created.",
    artifacts: ["Root cause, not symptom", "Cost accounting", "Regression test"],
  },
  {
    id: "verify",
    name: "Verify",
    role: "Evidence",
    body: "Acceptance is evidence-driven: deterministic checks, logs and artifacts, plus real browser flows. A confident answer without evidence is treated as an unverified claim.",
    artifacts: ["Deterministic checks", "Collected evidence", "Browser E2E"],
  },
  {
    id: "ship",
    name: "Ship",
    role: "Output",
    body: "A working prototype, a documented handoff, and an honest statement of limitations — including what was not validated and why.",
    artifacts: ["Working prototype", "Documented handoff", "Stated limitations"],
  },
];

export function Pipeline() {
  const [activeId, setActiveId] = useState(STAGES[1]!.id);
  const activeIndex = STAGES.findIndex((s) => s.id === activeId);
  const active = STAGES[activeIndex] ?? STAGES[0]!;

  return (
    <section id="index" className="scroll-mt-16 py-16 sm:py-24">
      <Shell>
        <SectionHead
          index="01"
          kicker="Operating model"
          title={
            <>
              The way the work
              <br />
              actually runs.
            </>
          }
          lede="Not a methodology poster. Select a stage to see what happens there, what it produces, and what gets rejected."
        />

        <Reveal className="mt-12 sm:mt-16">
          <div
            role="tablist"
            aria-label="Operating model stages"
            aria-orientation="horizontal"
            className="hairline-t hairline-b flex flex-col md:flex-row"
          >
            {STAGES.map((stage, i) => {
              const isActive = stage.id === activeId;
              const isPast = i < activeIndex;
              return (
                <button
                  key={stage.id}
                  role="tab"
                  id={`stage-tab-${stage.id}`}
                  aria-selected={isActive}
                  aria-controls="stage-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(stage.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      const next = STAGES[(activeIndex + 1) % STAGES.length]!;
                      setActiveId(next.id);
                      document.getElementById(`stage-tab-${next.id}`)?.focus();
                    }
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const prev = STAGES[(activeIndex - 1 + STAGES.length) % STAGES.length]!;
                      setActiveId(prev.id);
                      document.getElementById(`stage-tab-${prev.id}`)?.focus();
                    }
                  }}
                  className={cn(
                    "group relative flex flex-1 items-center gap-3 px-3 py-4 text-left transition-colors md:flex-col md:items-start md:justify-between md:px-4 md:py-5",
                    "border-b border-hairline last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0",
                    isActive ? "bg-foreground text-background" : "hover:bg-foreground/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.18em]",
                      isActive
                        ? "text-background/70"
                        : isPast
                          ? "text-foreground/50"
                          : "text-muted-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-sm font-bold tracking-[-0.01em] uppercase md:mt-6 md:text-base">
                    {stage.name}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto font-mono text-[10px] md:mt-1 md:ml-0",
                      isActive ? "text-background/60" : "text-muted-foreground",
                    )}
                  >
                    {stage.role}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${active.id}`}
          className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        >
          <div key={`h-${active.id}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="label-mono">Evidence panel</p>
            <h3 className="display-xl mt-4 text-[clamp(1.9rem,6vw,3.4rem)]">{active.name}</h3>
            <ul className="mt-6 space-y-2">
              {active.artifacts.map((a) => (
                <li key={a} className="flex items-baseline gap-3 font-mono text-xs">
                  <span aria-hidden className="text-muted-foreground">
                    —
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <p
            key={`b-${active.id}`}
            className="animate-in fade-in slide-in-from-bottom-2 text-lg leading-relaxed duration-500 sm:text-2xl sm:leading-snug"
          >
            {active.body}
          </p>
        </div>
      </Shell>
    </section>
  );
}

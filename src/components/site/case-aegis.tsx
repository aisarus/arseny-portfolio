import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Reveal, Shell, Tag } from "./primitives";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  detail: string;
};

const NODES: Node[] = [
  { id: "goal", label: "Vague goal", x: 8, y: 50, detail: "An owner-stated objective with no testable definition of done." },
  { id: "contract", label: "Acceptance contract", x: 26, y: 20, detail: "The goal is compiled into falsifiable acceptance criteria before any work is scheduled." },
  { id: "strategy", label: "Strategy + jobs", x: 26, y: 80, detail: "A strategy is built and compiled into discrete jobs with explicit dependencies." },
  { id: "text", label: "Text workers", x: 50, y: 18, detail: "Reasoning and research work is routed to text models." },
  { id: "code", label: "Coding agents", x: 50, y: 82, detail: "Filesystem, shell, test and git work is routed to coding agents." },
  { id: "evidence", label: "Evidence", x: 72, y: 50, detail: "Artifacts, logs and check results are collected as the basis for acceptance." },
  { id: "verdict", label: "Accept / reject", x: 88, y: 22, detail: "An independent verdict step accepts or rejects the work against the contract." },
  { id: "replan", label: "Replan", x: 88, y: 78, detail: "Rejected work triggers replanning instead of silent retries; final control returns to the owner." },
];

const EDGES: [string, string][] = [
  ["goal", "contract"],
  ["goal", "strategy"],
  ["contract", "strategy"],
  ["strategy", "text"],
  ["strategy", "code"],
  ["text", "evidence"],
  ["code", "evidence"],
  ["evidence", "verdict"],
  ["evidence", "replan"],
  ["replan", "strategy"],
];

const EVIDENCE = [
  { k: "12 / 12", v: "acceptance criteria passed in a documented owner run; owner accepted the result." },
  { k: "7 / 7", v: "criteria passed in a documented mixed text→code run, with no manual intervention during execution." },
  { k: "1/3 → 3/3", v: "successful concurrency runs after resource isolation and shared locks were introduced." },
];

export function CaseAegis() {
  const [hover, setHover] = useState<string | null>(null);
  const activeNode = NODES.find((n) => n.id === hover);

  return (
    <section id="aegis" className="on-ink scroll-mt-16 bg-background py-20 text-foreground sm:py-28">
      <Shell>
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4">
          <span className="label-mono">Flagship 01 / Aegis</span>
          <span className="label-mono">Autonomous AI development operator</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {["Systems", "Orchestration", "Reliability"].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <Reveal className="mt-8">
          <h2 className="font-editorial max-w-[20ch] text-[clamp(2rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
            What if the AI worker wasn’t the system — but one worker inside it?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal className="space-y-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            <p>
              Aegis converts vague goals into falsifiable acceptance contracts. It builds a strategy,
              compiles that strategy into jobs, and routes each job by its nature: reasoning and
              research to text workers, filesystem, shell, test and git work to coding agents.
            </p>
            <p>
              It then collects evidence, independently accepts or rejects the work against the
              contract, replans after failures instead of retrying blindly, and returns final control
              to the owner rather than declaring itself finished.
            </p>
            <p className="text-foreground">
              Role, stated honestly: a substantial part of the implementation code was produced with
              coding agents. I owned the product concept and constraints, the architecture decisions,
              the decomposition, the agent steering, the review of code and results, the failure
              diagnosis, verification and iteration. I did not hand-write every line or every test,
              and the project does not need that claim to be interesting.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <p className="label-mono">System diagram — hover or focus a node</p>
            <div className="relative mt-4 aspect-[4/3] w-full border border-hairline sm:aspect-[16/10]">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                {EDGES.map(([a, b]) => {
                  const na = NODES.find((n) => n.id === a)!;
                  const nb = NODES.find((n) => n.id === b)!;
                  const lit = hover === a || hover === b;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      stroke="currentColor"
                      strokeWidth={lit ? 0.5 : 0.22}
                      className={cn(
                        "transition-opacity duration-300",
                        lit ? "opacity-90" : "opacity-25",
                      )}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>

              {NODES.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setHover((c) => (c === n.id ? null : n.id))}
                  aria-label={`${n.label}: ${n.detail}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      hover === n.id
                        ? "size-3 bg-foreground"
                        : "size-2 bg-foreground/45 hover:bg-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.1em] whitespace-nowrap uppercase transition-opacity sm:text-[10px]",
                      hover === n.id ? "text-foreground opacity-100" : "text-foreground/55",
                    )}
                  >
                    {n.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 min-h-[3.5rem] text-sm leading-relaxed text-foreground/70">
              {activeNode ? activeNode.detail : "Owner goal in, evidence-checked result out. Rejection loops back to strategy, not to a blind retry."}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <p className="label-mono">Verified evidence</p>
          <dl className="hairline-t mt-4 grid gap-px sm:grid-cols-3">
            {EVIDENCE.map((e) => (
              <div key={e.k} className="hairline-b py-6 sm:pr-8">
                <dt className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  {e.k}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-foreground/70">{e.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12 flex flex-col gap-4 border border-hairline p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[62ch] text-sm leading-relaxed text-foreground/70">
            The public repository is the historical predecessor and the public hiring bridge for this
            work. The current development repository is private while publication hygiene and history
            are being handled.
          </p>
          <ExternalLink href="https://github.com/aisarus/aegis-autopilot">
            aegis-autopilot
          </ExternalLink>
        </Reveal>
      </Shell>
    </section>
  );
}

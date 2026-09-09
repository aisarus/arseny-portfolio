import { useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal, Shell } from "./primitives";

type Entry = {
  id: string;
  project: string;
  title: string;
  cost?: string;
  symptom: string;
  tempting: string;
  cause: string;
  fix: string;
  verified: string;
};

const ENTRIES: Entry[] = [
  {
    id: "ledger",
    project: "Aegis",
    title: "The observer changed the thing it observed",
    cost: "$4.01",
    symptom:
      "Loop detection never fired. The same round of work repeated six times while the system insisted every state was new.",
    tempting:
      "‘The loop-detection heuristic is too weak — make the hashing smarter or add a repetition counter.’",
    cause:
      "ledger.jsonl lived inside the workspace being hashed. Every log write mutated the hash, so identical states never looked identical.",
    fix: "Move the ledger outside the observed zone, and add a regression test that proves a repeated state is recognised.",
    verified:
      "Repeated-state detection now triggers; documented cost of the incident was $4.01 and the regression test guards the boundary.",
  },
  {
    id: "quota",
    project: "Aegis",
    title: "A plausible diagnosis that was completely wrong",
    symptom:
      "First Claude Code calls failed with ‘No conversation found with session ID’. The fallback to Codex then hit a genuine quota limit.",
    tempting:
      "‘We are out of quota — the provider is the problem, so add budget or switch models.’",
    cause:
      "session.started was set before the call arguments were computed, so the very first call incorrectly used --resume against a session that did not exist. The quota error was real but downstream, and it produced a confident, wrong overall explanation.",
    fix: "Correct the lifecycle order, validate create-versus-resume against the live session state, and add a regression test for the first-call path.",
    verified:
      "First calls now create rather than resume; the create/resume decision is validated live and covered by a regression test.",
  },
  {
    id: "budget",
    project: "Aegis",
    title: "A ghost holding the money",
    symptom:
      "After an app or process restart, the system could report ‘no money’ while nothing was actually running.",
    tempting: "‘The budget accounting is off — raise the limit or reset the counter.’",
    cause:
      "Stale budget reservations survived the restart. Dead holders still owned reserved funds, creating a false exhausted state.",
    fix: "A conservative sweep that distinguishes live, dead and unknown holders, releasing only what is provably dead — plus preserving the user's task text when a launch fails.",
    verified:
      "Restart no longer produces a false exhausted budget, and a failed launch no longer loses the task the user typed.",
  },
  {
    id: "godmode",
    project: "BotForge",
    title: "Authorization that lived in the browser",
    symptom:
      "A client-side ‘master / god mode’ path granted elevated access to anyone who found the flag.",
    tempting:
      "‘It is behind a hidden flag and nobody knows about it — low severity, defer it.’",
    cause:
      "The authorization decision was made in code the user fully controls. Anything decided in the bundle is decided by the client, not by the system.",
    fix: "Remove the bypass, remove the tracked .env file from the repository, and document the remaining secret-management work.",
    verified:
      "The bypass and the tracked .env are gone. The project is described as a prototype, and client-side AES with a bundled passphrase is labelled obfuscation, not confidentiality.",

  },
];

const FIELDS: [keyof Entry, string][] = [
  ["symptom", "Observed symptom"],
  ["tempting", "Tempting wrong explanation"],
  ["cause", "Root cause"],
  ["fix", "Fix"],
  ["verified", "What was verified"],
];

export function FailureIndex() {
  const [open, setOpen] = useState<string>("ledger");

  return (
    <section id="failures" className="scroll-mt-16 overflow-hidden py-20 sm:py-28">
      <Shell>
        <div className="hairline-t pt-6">
          <span className="label-mono">02 / Failure index</span>
          <Reveal className="mt-8">
            <h2 className="display-xl max-w-[14ch] text-[clamp(2.3rem,8.5vw,6rem)]">
              The work gets interesting when it breaks.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              Four real incidents. Each one had an explanation that sounded right and was wrong. The
              value is not in the fix — it is in the distance between the first plausible story and
              the actual cause.
            </p>
          </Reveal>
        </div>

        <ol className="mt-12 sm:mt-16">
          {ENTRIES.map((e, i) => {
            const isOpen = open === e.id;
            return (
              <li key={e.id} className={cn("hairline-t", i === ENTRIES.length - 1 && "hairline-b")}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`failure-${e.id}`}
                    onClick={() => setOpen(isOpen ? "" : e.id)}
                    className="group flex w-full items-start gap-4 py-6 text-left sm:gap-8"
                  >
                    <span className="label-mono mt-2 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="label-mono block">{e.project}</span>
                      <span
                        className={cn(
                          "mt-2 block font-display text-xl leading-[1.05] font-bold tracking-[-0.025em] uppercase transition-transform duration-500 sm:text-3xl lg:text-4xl",
                          isOpen ? "sm:translate-x-0" : "group-hover:sm:translate-x-1.5",
                        )}
                      >
                        {e.title}
                      </span>
                    </span>
                    {e.cost ? (
                      <span className="label-mono mt-2 hidden shrink-0 text-warn sm:block">
                        cost {e.cost}
                      </span>
                    ) : null}
                    <span
                      aria-hidden
                      className={cn(
                        "mt-1 shrink-0 text-2xl leading-none transition-transform duration-500",
                        isOpen && "rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={`failure-${e.id}`}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <dl className="grid gap-x-10 gap-y-6 pb-10 sm:grid-cols-2 sm:pl-12 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
                      {FIELDS.map(([key, label], fi) => (
                        <div key={key} className="hairline-t pt-4">
                          <dt className="label-mono">
                            {String(fi + 1).padStart(2, "0")} {label}
                          </dt>
                          <dd
                            className={cn(
                              "mt-3 text-sm leading-relaxed",
                              key === "tempting"
                                ? "font-editorial text-base text-muted-foreground italic sm:text-lg"
                                : "text-muted-foreground",
                              key === "verified" && "text-foreground",
                            )}
                          >
                            {e[key] as string}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Shell>
    </section>
  );
}

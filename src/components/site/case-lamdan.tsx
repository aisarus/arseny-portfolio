import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Reveal, Shell, Tag } from "./primitives";

const CORRECTION = [
  {
    id: "start",
    label: "Immersive ‘Study Room’",
    body: "The original idea was an immersive AI study environment — atmospheric, metaphor-heavy, and pleasant to demo.",
    verdict: "Discarded",
  },
  {
    id: "correct",
    label: "Deliberate product correction",
    body: "Direction was corrected toward a source-linked academic workspace: material that can be traced back to what it came from.",
    verdict: "Adopted",
  },
  {
    id: "guardrails",
    label: "Product guardrails",
    body: "Guardrails were written down so later AI coding sessions could not casually reintroduce the discarded metaphors as ‘improvements’.",
    verdict: "Enforced",
  },
  {
    id: "drafts",
    label: "Drafts, not authority",
    body: "AI-generated notes, flashcards and quizzes are reviewable drafts tied to sources — never presented as authoritative answers.",
    verdict: "Core rule",
  },
];

const RELIABILITY = [
  ["Durable persistence", "State survives restarts rather than living only in a session."],
  ["Backup & rollback", "A bad generation or import can be undone."],
  ["Provider cancellation", "In-flight AI calls can be cancelled cleanly."],
  ["Local & multilingual search", "Search works across mixed-language material without a round trip."],
  ["Browser E2E flows", "Real end-to-end flows in a browser, not only unit assertions."],
];

export function CaseLamdan() {
  const [step, setStep] = useState(1);

  return (
    <section id="lamdan" className="scroll-mt-16 py-20 sm:py-28">
      <Shell>
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4">
          <span className="label-mono">Flagship 02 / Lamdan</span>
          <span className="label-mono">AI-first academic content workspace</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {["Product", "Trust", "Learning"].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <Reveal className="mt-8">
          <h2 className="font-editorial max-w-[22ch] text-[clamp(2rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
            How do you make generated study material useful without pretending it is authoritative?
          </h2>
        </Reveal>

        <div className="lamdan-flow mt-12" aria-label="Source to saved study material workflow">
          {["Source", "Draft", "Review", "Save"].map((item, index) => (
            <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <p className="label-mono">Direction correction</p>
            <ol className="hairline-t mt-4">
              {CORRECTION.map((c, i) => {
                const open = step === i;
                return (
                  <li key={c.id} className="hairline-b">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setStep(open ? -1 : i)}
                      className="flex w-full items-baseline gap-4 py-4 text-left transition-colors hover:text-foreground/70"
                    >
                      <span className="label-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-display text-base font-bold tracking-[-0.01em] uppercase sm:text-lg">
                        {c.label}
                      </span>
                      <span
                        className={cn(
                          "label-mono shrink-0 transition-opacity",
                          open ? "opacity-100" : "opacity-50",
                        )}
                      >
                        {c.verdict}
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[52ch] pb-5 pl-10 text-sm leading-relaxed text-muted-foreground">
                          {c.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={80} className="space-y-6">
            <p className="text-lg leading-relaxed sm:text-xl">
              Lamdan treats generated content as material under review. Every note, flashcard and quiz
              stays attached to the source it came from, so a student can check it instead of trusting
              it.
            </p>
            <div>
              <p className="label-mono">Reliability work</p>
              <dl className="hairline-t mt-3">
                {RELIABILITY.map(([k, v]) => (
                  <div key={k} className="hairline-b grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="font-mono text-xs tracking-[0.08em] uppercase">{k}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="border-l-2 border-foreground/30 pl-5 text-sm leading-relaxed text-muted-foreground">
              Current limitations: OCR quality and educational-outcome claims are not validated.
              Licensed evaluation data was not available, so those claims stay open rather than being
              presented as results.
            </p>

            <ExternalLink href="https://github.com/aisarus/syllabus-to-os">
              syllabus-to-os
            </ExternalLink>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

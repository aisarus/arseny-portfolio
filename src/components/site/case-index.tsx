import { Shell } from "./primitives";

const CASES = [
  {
    name: "Aegis Operator",
    href: "/work/aegis/",
    problem: "Make AI-assisted development prove completion instead of merely claiming it.",
    role: "Product concept · architecture · agent direction · diagnosis · verification",
    evidence: "Public source snapshot + regression tests + documented failure analysis",
  },
  {
    name: "Lamdan",
    href: "/work/lamdan/",
    problem: "Make generated study material useful without pretending it is authoritative.",
    role: "Product reframing · trust boundaries · AI-assisted implementation direction",
    evidence: "Source provenance, reviewable drafts, persistence/recovery and browser E2E work",
  },
  {
    name: "BotForge",
    href: "/work/botforge/",
    problem: "Turn a convincing generated SaaS demo into inspectable real integrations.",
    role: "Product definition · integration direction · security review · debugging",
    evidence: "Supabase/Auth/RLS, Edge Functions, Telegram integration and documented limitations",
  },
] as const;

export function CaseIndex() {
  return (
    <section aria-labelledby="case-index-title" className="py-12 sm:py-16">
      <Shell>
        <div className="hairline-t pt-6">
          <span className="label-mono">Selected case studies · recruiter scan</span>
          <h2 id="case-index-title" className="mt-5 max-w-[20ch] text-2xl font-semibold tracking-tight sm:text-3xl">
            Three projects. Problem, role, evidence — then the full case.
          </h2>
        </div>
        <div className="mt-8 grid gap-px border border-hairline bg-hairline md:grid-cols-3">
          {CASES.map((item) => (
            <article key={item.name} className="flex min-w-0 flex-col bg-background p-5 sm:p-6">
              <h3 className="text-xl font-semibold tracking-tight">{item.name}</h3>
              <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                <div>
                  <dt className="label-mono">Problem</dt>
                  <dd className="mt-1 text-foreground/80">{item.problem}</dd>
                </div>
                <div>
                  <dt className="label-mono">My role</dt>
                  <dd className="mt-1 text-foreground/80">{item.role}</dd>
                </div>
                <div>
                  <dt className="label-mono">Evidence</dt>
                  <dd className="mt-1 text-foreground/80">{item.evidence}</dd>
                </div>
              </dl>
              <a
                href={item.href}
                className="mt-6 inline-flex w-fit items-center gap-2 border-b border-current/30 pb-0.5 font-mono text-xs uppercase tracking-[0.12em] hover:border-current"
              >
                Read case study <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
}

import { Reveal, Shell } from "./primitives";

const GROUPS = [
  {
    title: "Product & requirements",
    items: [
      "Ambiguity reduction",
      "Acceptance criteria",
      "Product guardrails",
      "Rapid prototyping",
    ],
  },
  {
    title: "AI-native delivery",
    items: [
      "Task decomposition",
      "Multi-model & coding-agent workflows",
      "Prompt and contract design",
      "Review of generated implementations",
    ],
  },
  {
    title: "Reliability",
    items: [
      "Incident diagnosis",
      "Evidence-driven acceptance",
      "Recovery semantics",
      "Cost / capability trade-offs",
    ],
  },
];

const ENVIRONMENT = [
  "Git / GitHub",
  "React / TypeScript",
  "JavaScript / Node",
  "Electron",
  "Vite",
  "Tailwind",
  "Supabase / PostgreSQL / RLS concepts",
  "Edge Functions",
  "REST / webhooks",
  "Telegram Bot API",
  "Python / FastAPI exposure",
  "Three.js experimentation",
];

export function About() {
  return (
    <section id="about" className="on-ink scroll-mt-16 bg-background py-20 text-foreground sm:py-28">
      <Shell>
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4">
          <span className="label-mono">05 / Working style</span>
          <span className="label-mono">Arseniy Perel</span>
        </div>

        <Reveal className="mt-12">
          <p className="font-editorial max-w-[24ch] text-[clamp(1.8rem,5.2vw,3.6rem)] leading-[1.06] tracking-[-0.02em] sm:max-w-[26ch]">
            “Most of my implementation work is AI-assisted, and that is the method, not a footnote.
            My job is to turn an unclear goal into a system that can be built, challenged and
            verified — and to catch the confident answer that is wrong.”
          </p>

        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={i * 80} className="hairline-t pt-5">
              <h3 className="font-mono text-xs tracking-[0.16em] uppercase">{g.title}</h3>
              <ul className="mt-5 space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="flex items-baseline gap-3 text-base leading-snug">
                    <span aria-hidden className="text-foreground/40">
                      ·
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="hairline-t mt-14 pt-5">
          <h3 className="font-mono text-xs tracking-[0.16em] uppercase">
            Working technical environment
          </h3>
          <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
            {ENVIRONMENT.map((e) => (
              <li
                key={e}
                className="border border-hairline px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-foreground/75"
              >
                {e}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-foreground/60">
            Depth varies per item: some are daily working tools, others are areas I have shipped
            against but do not claim as specialisms.
          </p>

        </Reveal>
      </Shell>
    </section>
  );
}

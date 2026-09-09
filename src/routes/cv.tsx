import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const TITLE = "Arseniy Perel — CV";
const DESCRIPTION =
  "CV of Arseniy Perel: AI Product Builder, AI Automation, Rapid Prototyping. Selected projects Aegis, Lamdan, BotForge. Ramat Gan, Israel.";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CvPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="mt-8 cv-section">
      <h2 className="border-b border-foreground/30 pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Project({
  name,
  subtitle,
  role,
  year,
  url,
  points,
}: {
  name: string;
  subtitle: string;
  role: string;
  year: string;
  url: string;
  points: string[];
}) {
  return (
    <article className="mt-5 first:mt-0">
      <header>
        <h3 className="text-[15px] font-semibold uppercase tracking-wide">
          {name} <span className="font-normal normal-case text-muted-foreground">— {subtitle}</span>
        </h3>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          {role} · {year}
        </p>
      </header>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="mt-2 text-[13px]">
        Link:{" "}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-muted-foreground"
        >
          {url.replace("https://", "")}
        </a>
      </p>
    </article>
  );
}

function CvPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="no-print sticky top-0 z-10 border-b border-hairline bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[820px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to portfolio
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-foreground/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[820px] px-5 py-10 sm:px-8 sm:py-14 cv-sheet">
        <header>
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Arseniy Perel
          </h1>
          <p className="mt-2 text-[15px] font-medium">
            AI Product Builder · AI Automation · Rapid Prototyping
          </p>
          <address className="mt-3 text-[13.5px] not-italic leading-relaxed text-muted-foreground">
            Ramat Gan, Israel
            <br />
            <a href="mailto:arielperseny@gmail.com" className="underline underline-offset-2 hover:text-foreground">
              arielperseny@gmail.com
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/aisarus"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-foreground"
            >
              github.com/aisarus
            </a>{" "}
            ·{" "}
            <a
              href="https://arseny-perel.lovable.app"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2 hover:text-foreground"
            >
              arseny-perel.lovable.app
            </a>
          </address>
        </header>

        <Section title="Profile">
          <p className="text-[13.5px] leading-relaxed">
            AI-native product builder focused on turning ambiguous product and business problems
            into working, verifiable systems. Works primarily through coding agents and
            AI-assisted development: defining requirements, decomposing tasks, designing system
            boundaries, directing implementation, diagnosing failures, reviewing generated code
            and iterating until the result can be tested against evidence. Strongest at the
            intersection of product thinking, AI orchestration, rapid prototyping, implementation
            oversight and debugging.
          </p>
        </Section>

        <Section title="Selected Projects">
          <Project
            name="Aegis"
            subtitle="Autonomous AI Development Operator"
            role="Product Owner / System Designer / AI-native Builder"
            year="2026"
            url="https://github.com/aisarus/aegis-operator"
            points={[
              "Designed an experimental autonomous task-execution system that turns vague goals into falsifiable acceptance contracts, compiles work into capability-based jobs, routes reasoning/research to text workers and filesystem/shell/test/git work to coding agents, collects evidence and independently accepts or rejects results.",
              "Introduced replanning, cost/capability-aware routing, owner approval gates, Telegram control and isolated Git worktrees.",
              "Diagnosed and corrected live failure modes involving session lifecycle, false quota diagnosis, observation/loop-detection interference, stale state and concurrency/resource isolation.",
              "Development is AI-assisted by design: Arseniy owns the product concept, constraints, architecture, decomposition, agent steering, review, failure diagnosis and verification.",
            ]}
          />
          <Project
            name="Lamdan"
            subtitle="AI-first Academic Content Workspace"
            role="Product Owner / AI-native Builder"
            year="2026"
            url="https://github.com/aisarus/syllabus-to-os"
            points={[
              "Evolved an AI study prototype into a source-linked academic workspace for multilingual university material.",
              "Defined product guardrails, syllabus/material workflows and reviewable AI-generated notes/flashcards/quizzes linked to sources.",
              "Directed reliability work around durable persistence, backup/rollback, provider cancellation, local/multilingual search and browser E2E flows.",
              "OCR quality and educational-outcome claims are not presented as validated where suitable evaluation data was unavailable.",
            ]}
          />
          <Project
            name="BotForge"
            subtitle="AI Telegram Automation SaaS Prototype"
            role="Product Owner / AI-native Builder"
            year="2026"
            url="https://github.com/aisarus/ai-employee-forge"
            points={[
              "Expanded a generated SaaS concept into a working multi-service prototype with React/TypeScript, Supabase Auth, PostgreSQL/RLS, Deno Edge Functions, Telegram Bot API, conversation history and BYOK model access.",
              "Used repository/security review to distinguish convincing UI simulation from actual backend behavior and removed a client-side authorization bypass rather than hiding it.",
              "Treat as a working prototype, not production-ready software.",
            ]}
          />
        </Section>

        <Section title="Core Capabilities">
          <dl className="space-y-3 text-[13.5px] leading-relaxed">
            <div>
              <dt className="font-semibold">AI-native delivery</dt>
              <dd className="text-muted-foreground">
                Task decomposition, coding-agent workflows, prompt/contract design, review of
                generated implementations, failure diagnosis and corrective iteration.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Product &amp; systems</dt>
              <dd className="text-muted-foreground">
                Rapid prototyping, requirements definition, acceptance criteria, product
                guardrails, human-in-the-loop workflow design, cost/capability trade-offs,
                incident analysis.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Working technical environment</dt>
              <dd className="text-muted-foreground">
                Git/GitHub; React/TypeScript; JavaScript/Node.js; Electron; Vite; Tailwind CSS;
                Supabase; PostgreSQL/RLS concepts; Edge Functions; REST/webhooks; Telegram Bot
                API; Python/FastAPI exposure; Three.js experimentation.
              </dd>
            </div>
          </dl>
        </Section>

        <Section title="Other Experience">
          <ul className="space-y-4 text-[13.5px] leading-relaxed">
            <li>
              <p className="font-semibold">
                Shifka / Wix — Operations &amp; Logistics{" "}
                <span className="font-normal text-muted-foreground">· Nov 2024–Mar 2025</span>
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Managed recurring workplace logistics and internal distribution, supplies,
                ordering and time-sensitive daily routines in a large office environment.
              </p>
            </li>
            <li>
              <p className="font-semibold">
                Israel Defense Forces — Education NCO / Mashak Hinukh{" "}
                <span className="font-normal text-muted-foreground">· 2023–Aug 2024</span>
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Educational and organizational role coordinating activities and working directly
                with soldiers and staff.
              </p>
            </li>
          </ul>
        </Section>

        <Section title="Education">
          <ul className="space-y-2 text-[13.5px] leading-relaxed">
            <li>
              Bar-Ilan University — Incoming B.A. student, Multidisciplinary Social Sciences, Hi-Tech Track — 2026
            </li>
            <li>Bar-Ilan University — Mechinat Olim — completed 2026</li>
          </ul>
        </Section>

        <Section title="Languages">
          <ul className="space-y-1 text-[13.5px] leading-relaxed">
            <li>Russian — Native</li>
            <li>English — Professional working proficiency</li>
            <li>Hebrew — Working / academic proficiency</li>
          </ul>
        </Section>
      </div>
    </main>
  );
}

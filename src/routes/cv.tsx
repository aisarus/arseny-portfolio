import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const TITLE = "Arseniy Perel — CV | AI Product Builder";
const DESCRIPTION =
  "CV of Arseniy Perel: AI Product Builder focused on AI automation, rapid prototyping, agent workflows, debugging and verifiable delivery in Israel.";
const CANONICAL = "https://arseny-portfolio-aisarus-projects-37ae3e37.vercel.app/cv";
const OG_IMAGE = "https://arseny-portfolio-aisarus-projects-37ae3e37.vercel.app/og-card.png";
const LINKEDIN =
  "https://www.linkedin.com/in/%D0%B0%D1%80%D1%81%D0%B5%D0%BD%D0%B8%D0%B9-%D0%BF%D0%B5%D1%80%D0%B5%D0%BB%D1%8C-68a21132b/";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: CvPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="mt-7 cv-section">
      <h2 className="border-b border-foreground/30 pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Project({
  name,
  subtitle,
  url,
  points,
}: {
  name: string;
  subtitle: string;
  url: string;
  points: string[];
}) {
  return (
    <article className="mt-4 first:mt-0">
      <h3 className="text-[15px] font-semibold tracking-tight">
        {name} <span className="font-normal text-muted-foreground">— {subtitle}</span>
      </h3>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">
        Product Owner / AI-native Builder · 2026 ·{" "}
        <a href={url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">
          {url.replace("https://", "")}
        </a>
      </p>
      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-relaxed">
        {points.map((point) => <li key={point}>{point}</li>)}
      </ul>
    </article>
  );
}

function CvPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="no-print sticky top-0 z-10 border-b border-hairline bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[820px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
            ← Back to portfolio
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/cv.pdf"
              download="Arseniy_Perel_CV.pdf"
              className="border border-foreground px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
            >
              Download PDF
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-foreground/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-foreground"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[820px] px-5 py-9 sm:px-8 sm:py-12 cv-sheet">
        <header>
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">Arseniy Perel</h1>
          <p className="mt-2 text-[15px] font-medium">AI Product Builder · AI Automation · Rapid Prototyping</p>
          <address className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[13px] not-italic leading-relaxed text-muted-foreground">
            <span>Ramat Gan, Israel</span><span>·</span>
            <a href="mailto:arielperseny@gmail.com" className="underline underline-offset-2 hover:text-foreground">Email</a><span>·</span>
            <a href={LINKEDIN} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-foreground">LinkedIn</a><span>·</span>
            <a href="https://github.com/aisarus" target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-foreground">GitHub</a><span>·</span>
            <a href="https://arseny-portfolio-aisarus-projects-37ae3e37.vercel.app" className="underline underline-offset-2 hover:text-foreground">Portfolio</a>
          </address>
        </header>

        <Section title="Profile">
          <p className="text-[13.5px] leading-relaxed">
            AI-native product builder focused on turning ambiguous product and business problems into working, verifiable systems. Strongest at product definition, task decomposition, agent orchestration, rapid prototyping, implementation oversight, failure diagnosis and evidence-based iteration. Most implementation work is AI-assisted; ownership is in the constraints, architecture, review, diagnosis and verification.
          </p>
        </Section>

        <Section title="Selected Projects">
          <Project
            name="Aegis"
            subtitle="Autonomous AI Development Operator"
            url="https://github.com/aisarus/aegis-operator"
            points={[
              "Designed an experimental operator that compiles vague goals into acceptance contracts and jobs, routes work by capability, collects evidence, rejects bad results and replans instead of blindly retrying.",
              "Diagnosed live failures around session lifecycle, false quota attribution, loop-detection interference, stale state and concurrency/resource isolation; the public snapshot includes representative source and regression tests.",
            ]}
          />
          <Project
            name="Lamdan"
            subtitle="AI-first Academic Content Workspace"
            url="https://github.com/aisarus/syllabus-to-os"
            points={[
              "Directed an AI study prototype toward a source-linked multilingual workspace with reviewable generated material, syllabus workflows, durable persistence, backup/rollback and browser E2E coverage.",
              "Kept claims bounded by evidence: OCR quality and educational outcomes are not presented as validated where suitable evaluation data was unavailable.",
            ]}
          />
          <Project
            name="BotForge"
            subtitle="AI Telegram Automation SaaS Prototype"
            url="https://github.com/aisarus/ai-employee-forge"
            points={[
              "Expanded a generated SaaS concept into a real integration stack using React/TypeScript, Supabase Auth, PostgreSQL/RLS, Deno Edge Functions, Telegram Bot API, conversation history and BYOK model access.",
              "Used repository/security review to separate convincing UI simulation from backend behavior and removed a client-side authorization bypass rather than hiding it.",
            ]}
          />
        </Section>

        <Section title="Core Capabilities">
          <p className="text-[13px] leading-relaxed">
            <strong>AI-native delivery:</strong> coding-agent workflows, prompt/contract design, implementation review, failure diagnosis, corrective iteration. <strong>Product &amp; systems:</strong> requirements, acceptance criteria, guardrails, human-in-the-loop workflows, cost/capability trade-offs, incident analysis. <strong>Technical exposure:</strong> Git/GitHub, React/TypeScript, JavaScript/Node.js, Electron, Vite, Tailwind, Supabase, PostgreSQL/RLS concepts, Edge Functions, REST/webhooks, Telegram Bot API, Python/FastAPI exposure, Three.js.
          </p>
        </Section>

        <Section title="Experience">
          <div className="space-y-2 text-[13px] leading-relaxed">
            <p><strong>Shifka / Wix — Operations &amp; Logistics</strong> · Nov 2024–Mar 2025 — recurring workplace logistics, distribution, supplies, ordering and time-sensitive daily routines in a large office environment.</p>
            <p><strong>Israel Defense Forces — Education NCO / Mashak Hinukh</strong> · 2023–Aug 2024 — educational and organizational role coordinating activities and working directly with soldiers and staff.</p>
          </div>
        </Section>

        <Section title="Education & Languages">
          <p className="text-[13px] leading-relaxed">
            <strong>Bar-Ilan University</strong> — Incoming B.A. student, Multidisciplinary Social Sciences, Hi-Tech Track (2026); Mechinat Olim completed 2026. <strong>Languages:</strong> Russian — Native; English — Professional working proficiency; Hebrew — Working / academic proficiency.
          </p>
        </Section>
      </div>
    </main>
  );
}

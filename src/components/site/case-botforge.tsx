import { useState } from "react";
import type { CSSProperties } from "react";
import { ExternalLink, Reveal, Shell, Tag } from "./primitives";

const LAYERS = [
  {
    id: "ui",
    label: "Client",
    stack: "React · TypeScript · Vite",
    body: "Started life as a Lovable-generated SaaS interface concept — convincing, but wired to nothing.",
  },
  {
    id: "auth",
    label: "Auth & data",
    stack: "Supabase Auth · PostgreSQL · RLS",
    body: "Real accounts, real tables, row-level security policies deciding who can read what.",
  },
  {
    id: "edge",
    label: "Server logic",
    stack: "Deno Edge Functions",
    body: "Server-side handlers for bot logic, AI calls and webhook processing, off the client.",
  },
  {
    id: "telegram",
    label: "Messaging",
    stack: "Telegram Bot API · webhooks",
    body: "Live bot integration with conversation history, so context survives between messages.",
  },
  {
    id: "ai",
    label: "AI access",
    stack: "BYOK providers · connectors",
    body: "Bring-your-own-key model access plus external connector and webhook work.",
  },
];

export function CaseBotforge() {
  const [active, setActive] = useState("edge");
  const current = LAYERS.find((l) => l.id === active) ?? LAYERS[0];

  return (
    <section id="botforge" className="on-ink scroll-mt-16 bg-background py-20 text-foreground sm:py-28">
      <Shell>
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4">
          <span className="label-mono">Flagship 03 / BotForge</span>
          <span className="label-mono">AI Telegram automation SaaS · working prototype</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {["SaaS", "Integrations", "Automation"].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <Reveal className="mt-8">
          <h2 className="font-editorial max-w-[20ch] text-[clamp(2rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">
            Can a convincing AI demo be forced to become a real integration?
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="label-mono">Surface / system — hover, focus or tap</p>
            <div className="botforge-stack mt-4" data-active={active}>
              {LAYERS.map((layer, index) => (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={layer.id === active}
                  onClick={() => setActive(layer.id)}
                  onMouseEnter={() => setActive(layer.id)}
                  onFocus={() => setActive(layer.id)}
                  className="botforge-layer"
                  style={{ "--layer-index": index } as CSSProperties}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{layer.label}</strong>
                  <small>{layer.stack}</small>
                </button>
              ))}
            </div>
            {current ? <p className="mt-6 min-h-[3rem] border-l border-signal pl-4 text-sm leading-relaxed text-foreground/70">{current.body}</p> : null}
          </Reveal>

          <Reveal delay={80} className="space-y-6">
            <p className="text-lg leading-relaxed sm:text-xl">
              Security hardening is part of the build, not an appendix. A client-side “master / god
              mode” authorization bypass was identified and removed, a tracked <code className="font-mono text-[0.9em]">.env</code>{" "}
              file was taken out of the repository, and the remaining secret-management work is
              documented rather than quietly closed.
            </p>

            <div className="border border-warn/50 p-6">
              <p className="label-mono text-warn">Current limitations</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                Client-side AES with a passphrase that ships inside the JavaScript bundle is
                obfuscation, not confidentiality. This is a working multi-service prototype, and it
                is described as one.
              </p>
            </div>


            <ExternalLink href="https://github.com/aisarus/ai-employee-forge">
              ai-employee-forge
            </ExternalLink>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

import { useState } from "react";

import { ExternalLink, Reveal, Shell, Tag } from "./primitives";
import { SignalField } from "./signal-field";

const LAYERS = [
  { id: "ui", label: "Client", stack: "React · TypeScript · Vite", body: "Started life as a Lovable-generated SaaS interface concept — convincing, but wired to nothing." },
  { id: "auth", label: "Auth & data", stack: "Supabase Auth · PostgreSQL · RLS", body: "Real accounts, real tables, row-level security policies deciding who can read what." },
  { id: "edge", label: "Server logic", stack: "Deno Edge Functions", body: "Server-side handlers for bot logic, AI calls and webhook processing, off the client." },
  { id: "telegram", label: "Messaging", stack: "Telegram Bot API · webhooks", body: "Live bot integration with conversation history, so context survives between messages." },
  { id: "ai", label: "AI access", stack: "BYOK providers · connectors", body: "Bring-your-own-key model access plus external connector and webhook work." },
];

export function CaseBotforge() {
  const [active, setActive] = useState("edge");
  const [lens, setLens] = useState({ x: 58, y: 48 });
  const current = LAYERS.find((layer) => layer.id === active) ?? LAYERS[0];

  return (
    <section id="botforge" className="on-ink signal-section botforge-v3 scroll-mt-16 bg-background py-20 text-foreground sm:py-28">
      <SignalField variant="xray" intensity="medium" words={["SURFACE", "AUTH", "POLICY", "SECRET"]} />
      <Shell className="signal-content">
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4"><span className="label-mono">Flagship 03 / BotForge</span><span className="label-mono">AI Telegram automation SaaS · working prototype</span></div>
        <div className="mt-10 flex flex-wrap gap-2">{["SaaS", "Integrations", "Automation"].map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
        <Reveal className="mt-8"><h2 className="font-editorial max-w-[20ch] text-[clamp(2rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.02em]">Can a convincing AI demo be forced to become a real integration?</h2></Reveal>

        <div className="botforge-broadcast mt-14" style={{ "--lens-x": `${lens.x}%`, "--lens-y": `${lens.y}%` } as React.CSSProperties} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); setLens({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 }); }}>
          <div className="botforge-front" aria-hidden><span>BOTFORGE / CONTROL</span><strong>Automation online</strong><div><i /> <i /> <i /></div><p>Campaigns&nbsp;&nbsp; Conversations&nbsp;&nbsp; Agents&nbsp;&nbsp; Settings</p></div>
          <div className="botforge-back"><span className="label-mono">X-ray / actual system</span><div className="botforge-network">{LAYERS.map((layer, index) => <button key={layer.id} type="button" aria-pressed={active === layer.id} onClick={() => setActive(layer.id)} onFocus={() => setActive(layer.id)} onMouseEnter={() => setActive(layer.id)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{layer.label}</strong><small>{layer.stack}</small></button>)}</div></div>
          <div className="botforge-lens" aria-hidden />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <p className="border-l border-signal pl-4 text-sm leading-relaxed text-foreground/75"><span className="label-mono mb-3 block">Inspected layer / {current?.label}</span>{current?.body}</p>
          <div className="space-y-6"><p className="text-lg leading-relaxed sm:text-xl">Security hardening is part of the build, not an appendix. A client-side “master / god mode” authorization bypass was identified and removed, a tracked <code className="font-mono text-[0.9em]">.env</code> file was taken out of the repository, and the remaining secret-management work is documented rather than quietly closed.</p><div className="border border-warn/50 p-6"><p className="label-mono text-warn">Current limitations</p><p className="mt-3 text-sm leading-relaxed text-foreground/80">Client-side AES with a passphrase that ships inside the JavaScript bundle is obfuscation, not confidentiality. This is a working multi-service prototype, and it is described as one.</p></div><ExternalLink href="https://github.com/aisarus/ai-employee-forge">ai-employee-forge</ExternalLink></div>
        </div>
      </Shell>
    </section>
  );
}
import { useEffect, useState } from "react";
import { Shell } from "./primitives";

const LINES = ["I turn ambiguous ideas", "into verifiable products."];

export function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div
        aria-hidden
        className="grid-paper pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]"
      />

      <Shell className="relative">
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3">
          <span className="label-mono">Dossier / 2026</span>
          <span className="label-mono">Ramat Gan · Israel · Remote</span>
        </div>

        <h1 className="mt-10 sm:mt-16">
          <span className="label-mono mb-6 block">
            AI-native product builder · automation · rapid prototyping
          </span>
          {LINES.map((line, i) => (
            <span
              key={line}
              className="mask-up display-xl text-[clamp(2.5rem,10.5vw,8.5rem)]"
              data-visible={ready}
            >
              <span style={{ transitionDelay: `${120 + i * 110}ms` }}>{line}</span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p
              className="max-w-[46ch] text-lg leading-snug text-balance transition-all duration-700 sm:text-2xl"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : "translateY(14px)",
                transitionDelay: "420ms",
              }}
            >
              AI-native product building, orchestration, debugging and implementation oversight.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 transition-all duration-700"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : "translateY(14px)",
                transitionDelay: "540ms",
              }}
            >
              <a
                href="#index"
                className="group inline-flex items-center gap-3 bg-foreground px-6 py-3.5 font-mono text-[11px] tracking-[0.16em] text-background uppercase transition-opacity hover:opacity-85"
              >
                Explore the work
                <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a
                href="https://github.com/aisarus"
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-3 border border-foreground/25 px-6 py-3.5 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors hover:border-foreground"
              >
                GitHub
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <dl
            className="hairline-t grid grid-cols-2 gap-x-6 gap-y-6 pt-6 transition-opacity duration-700 sm:grid-cols-3 lg:grid-cols-2"
            style={{ opacity: ready ? 1 : 0, transitionDelay: "660ms" }}
          >
            {[
              ["Identity", "Arseniy Perel"],
              ["Base", "Ramat Gan, Israel"],
              ["Mode", "Decompose → verify → ship"],
              ["Flagships", "Aegis · Lamdan · BotForge"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label-mono">{k}</dt>
                <dd className="mt-1.5 text-sm leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Shell>
    </section>
  );
}

import { Shell } from "./primitives";
import { OperatorField } from "./v2-scenes";
import { SignalField } from "./signal-field";

export function Hero() {
  return (
    <section id="top" className="operator-hero">
      <div className="operator-sticky">
        <OperatorField />
        <SignalField variant="broadcast" intensity="high" words={["GOAL", "CONTRACT", "FAILURE", "EVIDENCE", "VERIFIED"]} />
        <Shell className="operator-content">
          <div className="operator-topline">
            <span>Arseniy Perel / AI Product Builder</span>
            <span>Ramat Gan · Israel · Remote</span>
          </div>
          <div className="operator-copy">
            <p className="label-mono text-foreground">AI-native delivery · automation · rapid prototyping</p>
            <h1 className="operator-headline">I turn ambiguous ideas into verifiable products.</h1>
            <p className="operator-method">I don’t write every line. I make the system finish the job.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
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
          <div className="operator-hint"><span>signal field</span><span>move · touch</span></div>
        </Shell>
      </div>
    </section>
  );
}

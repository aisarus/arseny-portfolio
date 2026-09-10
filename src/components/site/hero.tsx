import { Shell } from "./primitives";
import { OperatorField } from "./v2-scenes";
import { SignalField } from "./signal-field";

export function Hero() {
  return (
    <section id="top" className="operator-hero">
      <div className="operator-sticky">
        <OperatorField />
        <SignalField
          variant="broadcast"
          intensity="high"
          words={["GOAL", "CONTRACT", "FAILURE", "EVIDENCE", "VERIFIED"]}
        />
        <Shell className="operator-content">
          <div className="operator-topline">
            <span>Arseniy Perel / AI Product Builder</span>
            <span>Ramat Gan · Israel · Remote</span>
          </div>
          <div className="operator-copy">
            <p className="label-mono text-foreground">
              AI automation · rapid prototyping · implementation &amp; verification
            </p>
            <h1 className="operator-headline">I turn ambiguous ideas into verifiable products.</h1>
            <p className="operator-method">
              AI-native builder for teams that need a fuzzy problem turned into a working, checkable
              system.
            </p>
            <p className="mt-4 max-w-[62ch] font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/75 sm:text-[11px]">
              Open to junior / associate · part-time · project · contract work in Israel or remote
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-foreground px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-85"
              >
                Contact me
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#index"
                className="group inline-flex items-center gap-3 border border-foreground/35 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-foreground"
              >
                Explore the work
                <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a
                href="/cv.pdf"
                download="Arseniy_Perel_CV.pdf"
                className="group inline-flex items-center gap-3 border border-foreground/35 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-foreground"
              >
                Download CV
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
          <div className="operator-hint">
            <span>signal field</span>
            <span>move · touch</span>
          </div>
        </Shell>
      </div>
    </section>
  );
}

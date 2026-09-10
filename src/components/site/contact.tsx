import { Link } from "@tanstack/react-router";
import { ExternalLink, Reveal, Shell } from "./primitives";
import { SignalField } from "./signal-field";

const LINKEDIN =
  "https://www.linkedin.com/in/%D0%B0%D1%80%D1%81%D0%B5%D0%BD%D0%B8%D0%B9-%D0%BF%D0%B5%D1%80%D0%B5%D0%BB%D1%8C-68a21132b/";

export function Contact() {
  return (
    <section id="contact" className="signal-section contact-v3 scroll-mt-16 py-20 sm:py-28">
      <SignalField variant="calm" intensity="low" words={["LOCKED", "CLEAR"]} />
      <Shell className="signal-content">
        <div className="hairline-t pt-6">
          <span className="label-mono">06 / Contact · Signal locked</span>
        </div>

        <Reveal className="mt-10">
          <h2 className="display-xl max-w-[13ch] text-[clamp(2.3rem,9vw,6.5rem)]">
            Have a problem that is still too vague to spec?
          </h2>
        </Reveal>

        <div className="hairline-t mt-14 grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label-mono">Name</p>
            <p className="mt-2 text-lg">Arseniy Perel</p>
          </div>
          <div>
            <p className="label-mono">Location</p>
            <p className="mt-2 text-lg">Ramat Gan, Israel</p>
          </div>
          <div>
            <p className="label-mono">Email</p>
            <a
              href="mailto:arielperseny@gmail.com"
              className="mt-2 block text-lg break-all underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              arielperseny@gmail.com
            </a>
            <p className="label-mono mt-5">LinkedIn</p>
            <div className="mt-3">
              <ExternalLink href={LINKEDIN}>LinkedIn profile</ExternalLink>
            </div>
          </div>
          <div>
            <p className="label-mono">GitHub</p>
            <div className="mt-3">
              <ExternalLink href="https://github.com/aisarus">github.com/aisarus</ExternalLink>
            </div>
            <p className="label-mono mt-5">CV</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <a
                href="/cv.pdf"
                download="Arseniy_Perel_CV.pdf"
                className="group inline-flex items-baseline gap-2 border-b border-current/30 pb-0.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:border-current"
              >
                Download PDF
                <span aria-hidden>↓</span>
              </a>
              <Link
                to="/cv"
                className="group inline-flex items-baseline gap-2 border-b border-current/30 pb-0.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:border-current"
              >
                View resume
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        <footer className="hairline-t mt-20 flex flex-wrap items-center justify-between gap-3 py-6">
          <span className="label-mono">© {new Date().getFullYear()} Arseniy Perel</span>
          <span className="label-mono">Decompose · Build · Break · Diagnose · Verify · Ship</span>
        </footer>
      </Shell>
    </section>
  );
}

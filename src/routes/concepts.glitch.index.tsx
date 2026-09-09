import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "Glitch Concepts — Visual R&D | Arseniy Perel";
const DESCRIPTION =
  "Three isolated interaction prototypes exploring cursor-cleared optical interference: Clearing Field, Shard Reassembly, Evidence Trace.";

export const Route = createFileRoute("/concepts/glitch/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptsIndex,
});

const ITEMS = [
  {
    id: "01",
    to: "/concepts/glitch/field",
    name: "Clearing Field",
    note: "Inertial pressure field. Interference is pushed aside like fog and drifts back.",
    tech: "CSS filters · rAF · irregular mosaic",
  },
  {
    id: "02",
    to: "/concepts/glitch/shards",
    name: "Shard Reassembly",
    note: "Fractured editorial layout. Shards magnetically snap into alignment, then desynchronise.",
    tech: "Spring physics · clip bands · overshoot",
  },
  {
    id: "03",
    to: "/concepts/glitch/trace",
    name: "Evidence Trace",
    note: "Forensic surface. A decaying verification beam paints a readable path through the system.",
    tech: "Canvas trail · decay buffer · state flips",
  },
] as const;

function ConceptsIndex() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-3 pb-5">
          <span className="label-mono">R&amp;D / v2 art direction</span>
          <Link
            to="/"
            className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            ← Portfolio
          </Link>
        </div>

        <h1 className="display-xl mt-10 max-w-[14ch] text-[clamp(2.4rem,9vw,6rem)]">
          Interference studies
        </h1>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
          Three isolated prototypes of one idea: the surface is obscured, and the visitor clears it
          with the cursor. Each takes a deliberately different physical model. Desktop pointer is
          primary; touch drag works on mobile. Reduced motion degrades to a static, readable page.
        </p>

        <ul className="mt-16">
          {ITEMS.map((it) => (
            <li key={it.id} className="hairline-t">
              <Link to={it.to} className="group block py-8 sm:py-10">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <span className="label-mono">{it.id}</span>
                  <h2 className="display-xl text-[clamp(1.7rem,5.5vw,3.4rem)] transition-transform duration-500 group-hover:translate-x-2">
                    {it.name}
                  </h2>
                  <span aria-hidden className="ml-auto font-mono text-xs">
                    ↗
                  </span>
                </div>
                <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {it.note}
                </p>
                <p className="label-mono mt-3">{it.tech}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

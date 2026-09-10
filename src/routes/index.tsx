import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { EffectsProvider } from "@/components/site/effects";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { Pipeline } from "@/components/site/pipeline";
import { CaseIndex } from "@/components/site/case-index";
import { Contact } from "@/components/site/contact";

const CaseAegis = lazy(() =>
  import("@/components/site/case-aegis").then((module) => ({ default: module.CaseAegis })),
);
const CaseLamdan = lazy(() =>
  import("@/components/site/case-lamdan").then((module) => ({ default: module.CaseLamdan })),
);
const CaseBotforge = lazy(() =>
  import("@/components/site/case-botforge").then((module) => ({ default: module.CaseBotforge })),
);
const FailureIndex = lazy(() =>
  import("@/components/site/failure-index").then((module) => ({ default: module.FailureIndex })),
);
const Lab = lazy(() => import("@/components/site/lab").then((module) => ({ default: module.Lab })));
const About = lazy(() =>
  import("@/components/site/about").then((module) => ({ default: module.About })),
);

const TITLE = "Arseniy Perel — AI Product Builder in Israel | Automation & Prototyping";
const DESCRIPTION =
  "Arseniy Perel is an AI Product Builder in Ramat Gan, Israel. AI automation, rapid prototyping, agent workflows, API integrations, debugging and evidence-driven delivery.";
const CANONICAL = "https://arseny-perel.lovable.app/";
const OG_IMAGE = `${CANONICAL}og-card.png`;
const LINKEDIN =
  "https://www.linkedin.com/in/%D0%B0%D1%80%D1%81%D0%B5%D0%BD%D0%B8%D0%B9-%D0%BF%D0%B5%D1%80%D0%B5%D0%BB%D1%8C-68a21132b/";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${CANONICAL}#website`,
      url: CANONICAL,
      name: "Arseniy Perel — AI Product Builder",
      description: DESCRIPTION,
      inLanguage: "en",
      author: { "@id": `${CANONICAL}#person` },
    },
    {
      "@type": "Person",
      "@id": `${CANONICAL}#person`,
      name: "Arseniy Perel",
      url: CANONICAL,
      email: "mailto:arielperseny@gmail.com",
      jobTitle: "AI Product Builder",
      description:
        "AI-native product builder focused on AI automation, rapid prototyping, agent orchestration, debugging and verifiable delivery.",
      homeLocation: {
        "@type": "Place",
        name: "Ramat Gan, Israel",
      },
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Bar-Ilan University",
        url: "https://www.biu.ac.il/",
      },
      knowsAbout: [
        "AI automation",
        "AI-assisted product development",
        "agent orchestration",
        "rapid prototyping",
        "API integrations",
        "prompt engineering",
        "debugging",
        "software verification",
      ],
      sameAs: ["https://github.com/aisarus", LINKEDIN],
    },
    {
      "@type": "ItemList",
      "@id": `${CANONICAL}#projects`,
      name: "Selected AI product and automation work",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: "Aegis Operator",
            codeRepository: "https://github.com/aisarus/aegis-operator",
            programmingLanguage: ["JavaScript"],
            description:
              "Autonomous operator architecture that turns an ambiguous goal into contracts, jobs, evidence, replanning and owner review.",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "SoftwareSourceCode",
            name: "Lamdan",
            codeRepository: "https://github.com/aisarus/syllabus-to-os",
            description:
              "Source-linked academic workspace prototype for reviewable AI-assisted study material.",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "SoftwareSourceCode",
            name: "BotForge",
            codeRepository: "https://github.com/aisarus/ai-employee-forge",
            description:
              "AI SaaS prototype hardened into a real integration stack with authentication, database boundaries, edge functions and Telegram connectivity.",
          },
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: CANONICAL },
      { property: "og:site_name", content: "Arseniy Perel — AI Product Builder" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Arseniy Perel — AI Product Builder, AI Automation, Rapid Prototyping",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "alternate", type: "text/plain", href: `${CANONICAL}llms.txt` },
      { rel: "alternate", type: "application/json", href: `${CANONICAL}profile.json` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  component: Index,
});

function LazyFallback() {
  return <div className="h-16 sm:h-24" aria-hidden />;
}

function Index() {
  return (
    <EffectsProvider>
      <main className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <Hero />
        <Pipeline />
        <CaseIndex />
        <Suspense fallback={<LazyFallback />}>
          <CaseAegis />
        </Suspense>
        <Suspense fallback={<LazyFallback />}>
          <CaseLamdan />
        </Suspense>
        <Suspense fallback={<LazyFallback />}>
          <CaseBotforge />
        </Suspense>
        <Suspense fallback={<LazyFallback />}>
          <FailureIndex />
        </Suspense>
        <Suspense fallback={<LazyFallback />}>
          <Lab />
        </Suspense>
        <Suspense fallback={<LazyFallback />}>
          <About />
        </Suspense>
        <Contact />
      </main>
    </EffectsProvider>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { EffectsProvider } from "@/components/site/effects";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { Pipeline } from "@/components/site/pipeline";
import { CaseAegis } from "@/components/site/case-aegis";
import { CaseLamdan } from "@/components/site/case-lamdan";
import { CaseBotforge } from "@/components/site/case-botforge";
import { FailureIndex } from "@/components/site/failure-index";
import { Lab } from "@/components/site/lab";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";

const TITLE = "Arseniy Perel — AI Product Builder in Israel | Automation & Prototyping";
const DESCRIPTION =
  "Arseniy Perel is an AI Product Builder in Ramat Gan, Israel. AI automation, rapid prototyping, agent workflows, API integrations, debugging and evidence-driven delivery.";
const CANONICAL = "https://aisarus.github.io/arseny-portfolio/";

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
      sameAs: [
        "https://github.com/aisarus",
        "https://arseny-perel.lovable.app",
      ],
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
      { name: "twitter:card", content: "summary_large_image" },
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

function Index() {
  return (
    <EffectsProvider>
      <main className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <Hero />
        <Pipeline />
        <CaseAegis />
        <CaseLamdan />
        <CaseBotforge />
        <FailureIndex />
        <Lab />
        <About />
        <Contact />
      </main>
    </EffectsProvider>
  );
}

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

const TITLE = "Arseniy Perel — AI-Native Product Builder & Automation";
const DESCRIPTION =
  "I turn ambiguous ideas into verifiable products. AI-native product building, orchestration, debugging and implementation oversight. Case studies: Aegis, Lamdan, BotForge.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
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

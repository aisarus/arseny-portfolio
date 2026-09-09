# Arseniy: Verified Products

Build a premium, portfolio-grade single-page website for Arseniy Perel, an AI-native Product Builder / AI Automation / Rapid Prototyping specialist. This is NOT a generic developer portfolio, not a CV pasted into cards, and not a “Hi, I’m X” template. No portrait/photo. English-first.

CORE NARRATIVE
The entire site must prove one claim: “I turn ambiguous ideas into verifiable products.” The visual and interaction system should itself demonstrate the way Arseniy works with AI systems: decompose, build, break, diagnose, verify, ship.

VISUAL DIRECTION
High-end editorial / technical dossier aesthetic: large typography, strict grid, generous whitespace, sophisticated black/near-black + warm off-white palette, subtle hairlines, small monospaced telemetry labels, strong typographic contrast. Think premium design studio / research lab / operating-system dossier, not cyberpunk, not neon AI gradients, not glassmorphism SaaS, not terminal cosplay. Motion should feel intentional and physical: masking, split text, pinned sections, timeline progression, diagram nodes reacting to cursor/scroll, but remain fast and readable. Mobile must be excellent at 375px with no horizontal overflow. Respect prefers-reduced-motion.

HERO
Huge editorial headline:
I TURN AMBIGUOUS IDEAS
INTO VERIFIABLE PRODUCTS.
Supporting line: “AI-native product building, orchestration, debugging and implementation oversight.”
Small identity line: “Arseniy Perel — Ramat Gan, Israel.”
Primary actions: “Explore the work” and “GitHub”.
Do not add a profile image.

INTERACTIVE OPERATING MODEL
Immediately after hero, create an interactive horizontal pipeline on desktop and vertical pipeline on mobile:
AMBIGUOUS → DECOMPOSE → BUILD → BREAK → DIAGNOSE → VERIFY → SHIP
Each stage is selectable and changes a central evidence panel. The content must be concrete, not motivational fluff.
Examples:
- AMBIGUOUS: loosely specified product/business problem.
- DECOMPOSE: acceptance criteria, architecture boundaries, task routing.
- BUILD: coding agents / modern web stacks / integrations.
- BREAK: expose real failures instead of hiding them.
- DIAGNOSE: distinguish model failure, lifecycle bug, bad system boundary, stale state, etc.
- VERIFY: deterministic checks + evidence + browser testing.
- SHIP: working prototype / documented handoff / honest limitations.

THREE FLAGSHIP CASE STUDIES
Do not use equal little project cards. Each flagship should feel like a full editorial chapter with a distinct visual grammar and an interactive system diagram.

1) AEGIS — Autonomous AI Development Operator
Tag: SYSTEMS / ORCHESTRATION / RELIABILITY
Question/headline: “What if the AI worker wasn’t the system — but one worker inside it?”
Explain: Aegis converts vague goals into falsifiable acceptance contracts, builds strategy, compiles work into jobs, routes reasoning/research to text workers and filesystem/shell/test/git work to coding agents, collects evidence, independently accepts/rejects work, replans after failures, and returns final control to the owner.
Verified evidence that may be shown:
- documented owner run: 12/12 acceptance criteria passed and owner accepted the result;
- documented mixed text→code run: 7/7 criteria passed, no manual intervention during execution;
- concurrency regression improved from 1/3 to 3/3 successful runs after resource isolation/shared locks.
Real incident stories for interactive “Failure log”:
A. Observability side effect: ledger.jsonl was inside the workspace being hashed for loop detection, so every log write changed the hash and prevented loop recognition; six repeated rounds, documented cost $4.01. Fix: move ledger outside observed zone + regression test.
B. Misleading quota diagnosis: first Claude Code calls failed with “No conversation found with session ID”; fallback to Codex then hit a real quota, producing a plausible but wrong overall diagnosis. Root cause: session.started was set before arguments were computed, so the first call incorrectly used --resume. Fix: lifecycle order + live create/resume validation + regression test.
C. Stale budget reservation after app/process restart could create a false “no money” state. Fix: conservative sweep distinguishing live/dead/unknown holders; also preserve user task text when launch fails.
Author role framing MUST be honest: substantial implementation code was produced with coding agents. Arseniy owned product concept, constraints, architecture decisions, decomposition, agent steering, code/result review, failure diagnosis, verification and iteration. Never imply he manually wrote every line or every test.
Public case-study link: https://github.com/aisarus/aegis-autopilot . Clarify that this public repo is the historical predecessor + public hiring bridge; the current development repository is private while publication hygiene/history is being handled.

2) LAMDAN — AI-first Academic Content Workspace
Tag: PRODUCT / TRUST / LEARNING
Question/headline: “How do you make generated study material useful without pretending it is authoritative?”
Narrative: began as an immersive AI ‘Study Room’ idea, then product direction was deliberately corrected toward a source-linked academic workspace. Establish product guardrails so later AI coding sessions cannot casually reintroduce discarded metaphors. AI-generated notes/flashcards/quizzes are reviewable drafts tied to sources. Reliability work includes durable persistence, backup/rollback, provider cancellation, local/multilingual search, and real browser E2E flows. Be explicit that OCR/educational-quality claims are not presented as validated where real licensed/private evaluation data was unavailable.
Repo: https://github.com/aisarus/syllabus-to-os

3) BOTFORGE — AI Telegram Automation SaaS Prototype
Tag: SAAS / INTEGRATIONS / AUTOMATION
Question/headline: “Can a convincing AI demo be forced to become a real integration?”
Narrative: started from a Lovable-generated SaaS UI concept and evolved into a working multi-service prototype with React/TypeScript, Supabase Auth/PostgreSQL/RLS, Deno Edge Functions, Telegram Bot API, conversation history, BYOK AI access and external webhook/connector work. The portfolio/security audit is part of the story: a client-side ‘master/god mode’ bypass was discovered and removed, a tracked .env was removed, and remaining secret-management debt is documented honestly. Do NOT call this production-ready. Client-side AES with a passphrase available in the JS bundle is obfuscation, not production confidentiality.
Repo: https://github.com/aisarus/ai-employee-forge

FAILURE INDEX
Create a dedicated section called “THE WORK GETS INTERESTING WHEN IT BREAKS.” Show 4 failure entries as an interactive index/timeline: the three Aegis incidents above plus BotForge’s client-side authorization bypass. Each expands into: observed symptom → tempting wrong explanation → root cause → fix → what was verified. This section should be one of the strongest visual moments on the page.

LAB / RANGE
A restrained section showing supporting experiments, not equal flagship projects:
- TWIN — 32-second CSS/SVG scroll-film / deterministic JS motion timeline.
- Djbrain — interactive Three.js procedural brain / raycasting / touch / responsive visualization.
- TRI·TFM / prompt optimization research — proposer/critic/verifier, diversification/stabilization cycles, convergence/quality-control experiments. Mark as a family of experiments; do not pretend one repo is canonical yet.
Use text-led entries and small generative/diagram previews, not stock screenshots.

ABOUT / WORKING STYLE
Short, unsentimental copy:
“Most of my implementation work is AI-assisted. That is the point, not something I hide. My job is to turn an unclear goal into a system that can be built, challenged and verified — and to notice when the model’s confident answer is wrong.”
Then capabilities grouped as:
Product & requirements: ambiguity reduction, acceptance criteria, product guardrails, rapid prototyping.
AI-native delivery: task decomposition, multi-model/coding-agent workflows, prompt/contract design, review of generated implementations.
Reliability: incident diagnosis, evidence-driven acceptance, recovery semantics, cost/capability trade-offs.
Working technical environment: Git/GitHub, React/TypeScript, JS/Node, Electron, Vite, Tailwind, Supabase/PostgreSQL/RLS concepts, Edge Functions, REST/webhooks, Telegram Bot API, Python/FastAPI exposure, Three.js experimentation.
Do NOT label him as Senior Software Engineer or claim advanced mastery of every stack item.

CONTACT
Minimal final CTA: “Have a problem that is still too vague to spec?”
Arseniy Perel
Ramat Gan, Israel
GitHub: https://github.com/aisarus
Email: arielperseny@gmail.com

IMPLEMENTATION QUALITY
- Build this as a real responsive application, not static mockup screenshots.
- Use React/TypeScript/Tailwind/shadcn where useful.
- Use Framer Motion or disciplined CSS motion for scroll/interactions; only add heavyweight 3D if it materially improves the site.
- All interactions keyboard-accessible; semantic headings and visible focus states.
- Mobile 375px must have no horizontal overflow and preserve the narrative.
- No fake testimonials, fake company logos, fake employment dates, fake impact numbers or invented metrics.
- Do not bury case-study text in modals; core story must be crawlable/readable.
- Add a compact sticky navigation: Index / Aegis / Lamdan / BotForge / Lab / Contact.
- Make the first screen visually memorable without relying on images.
- Add polished loading/entry motion but no long splash screen.
- Add a clean metadata title/description for hiring/search sharing.

Name the project something professional like “Arseniy — AI Product Builder Portfolio”. Build the complete first version now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/54d55b40-0055-4adc-b60d-f8fab9bc090a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

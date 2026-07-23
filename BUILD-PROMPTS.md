# Portfolio v2 — Parallel Build Prompts (6 tabs)

Each section below is a **self-contained prompt**. Open 6 Claude tabs, paste one prompt per tab.
Run order: **start Tab 1 first** (it creates the scaffold + tokens others import), then Tabs 2–5 in parallel, then **Tab 6 last** to integrate.

Every prompt embeds the same **SHARED CONTRACT** so the pieces fit together. Do not edit it per-tab.

> **Open each tab in this repo folder** so `CLAUDE.md` + `.claude/` (contract, architecture,
> conventions, mistakes/decisions/progress logs, review subagents, `/log-mistake` & `/sync-progress`
> commands) auto-load as context. The pasted prompt then just tells the tab *which slice* it owns.

---

## SHARED CONTRACT (identical in every tab)

```
PROJECT: New folder `portfolio-v2/` next to the existing CRA app (do NOT touch the old app).
Vite + React 18. A minimal, modern personal site whose centerpiece is an AI "agent concierge"
that answers questions about Siddhartha Arora in FIRST PERSON ("I built…"), on an ambient
Three.js background. PHASE 1 IS FULLY MOCK — no API key, no network, $0.

STACK: Vite, React 18, react-three-fiber + @react-three/drei, gsap + framer-motion,
CSS Modules + design tokens (CSS variables). No Tailwind, no component kit.

FOLDER OWNERSHIP — only create/edit files in YOUR folder; never edit another tab's files:
  Tab 1 (Foundation): package.json, vite.config.js, index.html, src/main.jsx,
        src/App.jsx (shell only), src/styles/*, src/ui/*, src/lib/sceneBus.js,
        src/agent/agentClient.js (interface + stub), CONTRACT.md
  Tab 2 (3D):        src/scene/*
  Tab 3 (Agent UI):  src/agent/* EXCEPT agentClient.js & mockClient.js
  Tab 4 (Brain+Data):src/content/*, src/agent/mockClient.js
  Tab 5 (Sections):  src/sections/*
  Tab 6 (Integrate): wires src/App.jsx, deploy config, README — RUNS LAST

ISOLATION RULE: build & test your slice standalone. If you need something another tab owns
and it doesn't exist yet, create a minimal local stub marked:
  // STUB: owned by Tab N — remove on integration

DESIGN TOKENS (src/styles/tokens.css, owned by Tab 1 — assume these CSS vars exist):
  --bg:#0a0a0f; --surface:#13131a; --border:#23232e; --fg:#f5f5f7; --muted:#8a8a99;
  --accent:#6366f1; --accent-2:#22d3ee; --radius:14px; --maxw:1100px;
  --font-sans:'Inter',system-ui,sans-serif;
  Aesthetic: dark, minimal, generous whitespace, bold type, one accent. Subtle motion only.

DATA (src/content/profile.json, owned by Tab 4). Schema:
  { identity:{name,title,tagline,location,email,links:{github,linkedin,portfolio}},
    personas:{recruiter:{focus,depth}, engineer:{focus,depth}, founder:{focus,depth}},
    experience:[{id,company,role,period,summary,highlights[],tags[]}],
    projects:[{id,name,stack[],period,summary,highlights[]}],
    skills:{languages[],genai[],distributed[],cloud[],backend[],databases[]},
    facts:[{id,text,sourceLabel}] }   // atomic, citeable statements

AGENT EVENT PROTOCOL — THE critical contract. Tab 3 RENDERS these, Tab 4 EMITS them.
  agentClient.streamAgent({message, persona, history}) returns an async iterable yielding:
    {type:'plan',     text}                 // one-line plan
    {type:'tool',     name, args, status}   // status:'start'|'done' e.g. name:'search_experience'
    {type:'token',    text}                 // answer, streamed word-by-word
    {type:'citation', factId, label}        // factId matches profile.facts[].id
    {type:'refusal',  reason}               // guardrail: off-topic / adversarial input
    {type:'done'}
  Voice: FIRST PERSON as Siddhartha.

SCENE BUS (src/lib/sceneBus.js, owned by Tab 1 — tiny pub/sub):
  sceneBus.emit('tool-call',{name});  sceneBus.on('tool-call', cb)  // returns unsubscribe
  Tab 2 listens and pulses the 3D scene; Tab 3/4 emit on each tool event.

COMPONENT API (so Tab 6 can compose):
  <AmbientField/>                         // Tab 2, fixed full-screen background
  <AgentPanel persona client/>            // Tab 3
  <Hero/> <Experience data/> <Projects data/> <Skills data/> <Contact/>  // Tab 5

API KEYS: Phase 1 = NONE. For the later real-LLM phase use a FREE tier
  (Groq / Google Gemini / OpenRouter free models) via an env var (VITE_* or a serverless
  function). NEVER hardcode or commit a key.

CONTEXT (read before you start): root CLAUDE.md, .claude/contract.md (the canonical source of
  truth — this block mirrors it; if they ever differ, contract.md wins), .claude/architecture.md,
  .claude/conventions.md. These auto-load when the tab is opened in this repo.

LOGGING (so the work is reviewable): when you finish a milestone, append to .claude/progress.md
  or run /sync-progress. On any bug, contract gap, or wrong turn, append to .claude/mistakes.md
  or run /log-mistake. Non-obvious choices → .claude/decisions.md. Before integration, a reviewer
  may run the contract-guardian subagent against your output.
```

---

## TAB 1 — Foundation, Design System & Shared Interfaces (start this first)

> Paste the SHARED CONTRACT above, then:

You are Tab 1 of a 6-tab parallel build. You own the **foundation**. Deliver a runnable, styled, empty shell that the other 5 tabs drop into.

Create:
1. `portfolio-v2/` via Vite (React, JS). Add deps: `three @react-three/fiber @react-three/drei gsap framer-motion`. `package.json`, `vite.config.js`, `index.html` (load Inter font).
2. `src/main.jsx`, `src/App.jsx` — App is a **shell only**: a `<div className="app">` that renders, in order, placeholders/imports for `<AmbientField/>` (bg), a `<main>` with the section slots, and `<AgentPanel/>`. Use commented imports + visible placeholder boxes labeled "owned by Tab N" so it boots before others land.
3. `src/styles/tokens.css` (the design tokens from the contract) + `src/styles/global.css` (reset, base type, layout container `--maxw`).
4. `src/ui/` primitives with CSS Modules: `Button.jsx`, `Chip.jsx`, `Panel.jsx` (glassy surface), `Glow.jsx`. Clean, minimal, token-driven. Export from `src/ui/index.js`.
5. `src/lib/sceneBus.js` — the pub/sub from the contract (emit/on/unsubscribe, no deps).
6. `src/agent/agentClient.js` — export `streamAgent` matching the **event protocol**, but as a **stub** that yields a tiny canned sequence (plan → 1 tool → a few tokens → done). Tab 4 will replace the implementation; keep the signature identical. Document the seam where the real Azure/free-LLM backend plugs in later.
7. `CONTRACT.md` at repo root containing the SHARED CONTRACT verbatim (source of truth for all tabs).

Acceptance: `npm run dev` boots a styled dark shell with placeholder boxes and no errors. Keep everything token-driven so restyling is global.

---

## TAB 2 — Ambient Three.js Scene + Signature 3D Icon

> Paste the SHARED CONTRACT above, then:

You are Tab 2. You own `src/scene/*`. Build a **subtle, performant** ambient background — atmosphere, not a game.

Create:
1. `src/scene/AmbientField.jsx` — a fixed, full-screen `<Canvas>` (react-three-fiber) behind all content (`position:fixed; inset:0; z-index:0; pointer-events:none`). Contents:
   - A slow particle/star field OR a soft shader gradient (dark, low contrast, uses `--accent`/`--accent-2`).
   - A **signature 3D icon**: a slowly rotating icosahedron using drei `MeshDistortMaterial` (subtle wobble) OR an extruded "SA" monogram via drei `Text3D`. This is the brand mark. Keep it small, off to one edge, gentle.
2. Reaction: subscribe via `sceneBus.on('tool-call', …)` → on each agent tool-call, ripple/pulse the icon or emit a brief particle burst, then settle. This visually ties the 3D to the agent.
3. Performance: cap pixel ratio (`dpr={[1,2]}`), pause/throttle when tab hidden, and a **reduced/static fallback** on mobile or `prefers-reduced-motion` (fewer particles or a CSS gradient). Never block the main thread.
4. `src/scene/AmbientField.module.css` for the canvas wrapper.

Study these for the bar + technique (don't clone, adapt):
- https://bruno-simon.com — the credibility benchmark for a 3D dev site
- https://threejs.org/examples/ — official examples (points, shaders)
- https://r3f.docs.pmnd.rs/getting-started/examples — React Three Fiber gallery
- https://github.com/pmndrs/drei — MeshDistortMaterial, Float, Text3D, Sparkles helpers
- https://www.awwwards.com/sites/3d-minimal-portfolio-nik-r — "quiet 3D" / minimal reference

Acceptance: renders standalone (temporary test mount is fine), holds 60fps on desktop, degrades gracefully on mobile, and visibly reacts when `sceneBus.emit('tool-call',{name:'x'})` is fired from the console.

---

## TAB 3 — Agent UI Shell (chat + reasoning trace + personas + citations)

> Paste the SHARED CONTRACT above, then:

You are Tab 3. You own `src/agent/*` EXCEPT `agentClient.js` and `mockClient.js`. Build the **agent interface** that renders the event protocol. This is the centerpiece UI.

Create:
1. `src/agent/AgentPanel.jsx` — the container. A docked/floating panel (glassy `Panel`) with a header, message list, persona toggle, suggested-question chips, and an input box. Accepts props `{ persona, client }`.
2. `src/agent/useAgent.js` — hook that calls `client.streamAgent(...)`, consumes the async-iterable events, and maintains message state. Emits `sceneBus.emit('tool-call', …)` whenever a `{type:'tool'}` event arrives.
3. `src/agent/ReasoningTrace.jsx` — **the signature feature.** Renders `plan` and `tool` events as a compact, animated step list above each answer, e.g.:
   `→ planning…`  `→ search_experience("Infosys") ✓`  `→ synthesizing…`
   Use framer-motion for the step-in animation; show a spinner on `status:'start'`, check on `'done'`.
4. `src/agent/MessageList.jsx` + `Message.jsx` — streams `token` events word-by-word (first person). User vs agent styling.
5. `src/agent/Citation.jsx` — renders `citation` events as inline chips `[Infosys · resume]` that link/scroll to the relevant section or show the source fact on hover.
6. `src/agent/PersonaToggle.jsx` — Recruiter / Engineer / Founder segmented control; lifts persona to `AgentPanel`.
7. `src/agent/SuggestedChips.jsx` — clickable starter questions (e.g. "Would Siddhartha fit a 3-month agentic-AI contract?", "Show me the LangGraph project", "What's his Azure experience?").
8. Handle `{type:'refusal'}` with a calm, on-brand declined message.

Import UI primitives from `src/ui` and style with CSS Modules + tokens. For standalone dev, import `streamAgent` from `src/agent/agentClient.js` (Tab 1's stub) — do NOT implement the brain.

Acceptance: with the stub client, a question produces a full sequence — reasoning trace animates, answer streams in first person, a citation chip appears, persona toggle works, refusal renders cleanly.

---

## TAB 4 — Agent Brain (offline mock) + Content/RAG Data

> Paste the SHARED CONTRACT above, then:

You are Tab 4. You own `src/content/*` and `src/agent/mockClient.js`. Build the **offline brain** + the data it reasons over. NO API key, NO network — it must feel real but run fully local.

Create:
1. `src/content/profile.json` — populate from the seed below (complete/extend it faithfully; first-person facts).
2. `src/content/personas.js` — per-persona answer shaping: `recruiter` (fit, outcomes, availability — concise), `engineer` (architecture, trade-offs, stack — detailed), `founder` (impact, ROI, speed). Export depth/tone modifiers.
3. `src/agent/mockClient.js` — export `streamAgent({message, persona, history})` as an **async generator** matching the event protocol exactly:
   - Lightweight intent/keyword retrieval over `profile.facts` + `experience` + `projects` (simple scoring is fine).
   - Emit a realistic sequence: `plan` → one or more `tool` events (`search_experience`, `retrieve_project`, `match_role`) with `start`/`done` → `token` stream of a **first-person** answer shaped by `persona` → one+ `citation` events (factId from the matched fact) → `done`.
   - **Guardrails:** detect off-topic or prompt-injection ("ignore your instructions…") and emit `{type:'refusal'}` with a polite first-person decline; keep a console/log hook so attempts can be counted (mirrors his resume's "100% guardrail violations caught").
   - Add small delays between events so streaming feels live.
   - Leave a clearly documented seam: `// PHASE 2: replace retrieval+generation with a free-tier LLM (Groq/Gemini/OpenRouter) via serverless; same event output.`

profile.json seed (extend from résumé):
```json
{
  "identity": {
    "name": "Siddhartha Arora",
    "title": "Software Engineer · Agentic AI",
    "tagline": "I build production LLM & GenAI systems — and distributed backends.",
    "location": "India",
    "email": "siddharthaarora2131@gmail.com",
    "links": { "github": "TODO", "linkedin": "TODO", "portfolio": "TODO" }
  },
  "personas": {
    "recruiter": { "focus": "fit, outcomes, availability", "depth": "concise" },
    "engineer":  { "focus": "architecture, trade-offs, stack", "depth": "detailed" },
    "founder":   { "focus": "impact, ROI, delivery speed", "depth": "outcome-first" }
  },
  "experience": [
    { "id": "infosys", "company": "Infosys", "role": "Specialist Programmer",
      "period": "Mar 2026 – Present",
      "summary": "Own architecture & deployment of LLM-powered GenAI systems.",
      "highlights": [
        "Architected LLM/GenAI pipelines with Python, LangChain, LangGraph — cut manual intervention 40% across 2 enterprise clients.",
        "Led architecture proposals (planner-executor vs sequential chains) with FastAPI; onboarded 3 model integrations in one sprint.",
        "Built structured observability that caught 100% of agent guardrail violations before customer impact.",
        "Shipped on 2-week Agile sprints via CI/CD across remote teams."
      ],
      "tags": ["LLM","LangGraph","FastAPI","observability","Agile"] },
    { "id": "bookedeat", "company": "BookedEat", "role": "Software Engineer — Contract",
      "period": "Jun 2025 – Present",
      "summary": "Distributed-systems design for a production mobile app.",
      "highlights": [
        "Designed delta-sync with sync cursors + tombstone delete propagation; reasoned about eventual consistency and clock skew.",
        "Built backward-compatible incremental sync APIs + recovery paths; cut redundant API calls from 5+ to near-zero on warm loads."
      ],
      "tags": ["distributed-systems","delta-sync","eventual-consistency"] }
  ],
  "projects": [
    { "id": "genai-app", "name": "Generative AI LLM Application",
      "stack": ["Python","LangChain","LangGraph","FastAPI","Azure","Docker","CI/CD"],
      "period": "Jan 2025 – Present",
      "summary": "Stateful, distributed LLM orchestration deployed on Azure.",
      "highlights": [
        "Stateful LangGraph orchestration over 5+ workflow chains with output guardrails — 60% reduction in task-creation time.",
        "Azure CI/CD via GitHub Actions + Docker — 80%+ test coverage, deploy time 45→8 min."
      ] }
  ],
  "skills": {
    "languages": ["Python","JavaScript","Java","SQL"],
    "genai": ["LangChain","LangGraph","RAG","prompt engineering","MCP","LLM inferencing"],
    "distributed": ["delta sync","sync cursors","eventual consistency","fault tolerance"],
    "cloud": ["Azure (AZ-900)","AWS","Docker","GitHub Actions","CI/CD","Git"],
    "backend": ["FastAPI","REST APIs","structured logging","observability"],
    "databases": ["PostgreSQL","MongoDB","SQLite","MySQL","Redis"]
  },
  "facts": [
    { "id": "f-llm-40", "text": "I cut manual intervention 40% with LangChain/LangGraph pipelines at Infosys.", "sourceLabel": "Infosys · resume" },
    { "id": "f-guardrails", "text": "My observability layer caught 100% of agent guardrail violations before customer impact.", "sourceLabel": "Infosys · resume" },
    { "id": "f-deltasync", "text": "I designed delta-sync with sync cursors + tombstones at BookedEat, cutting redundant API calls from 5+ to near-zero.", "sourceLabel": "BookedEat · resume" },
    { "id": "f-azure-cicd", "text": "I ship to Azure via GitHub Actions + Docker with 80%+ coverage; deploy time dropped 45→8 min.", "sourceLabel": "GenAI project · resume" },
    { "id": "f-az900", "text": "I'm Microsoft Certified: Azure Fundamentals (AZ-900).", "sourceLabel": "certifications · resume" }
  ]
}
```

Acceptance: importing `mockClient.streamAgent` and feeding sample questions ("What's his Azure experience?", "Is he a fit for a 3-month agentic contract?", and an injection attempt) yields correct, first-person, persona-shaped event sequences with citations and a guardrail refusal — all offline.

---

## TAB 5 — Sections & Page Layout (the site around the agent)

> Paste the SHARED CONTRACT above, then:

You are Tab 5. You own `src/sections/*`. Build the scrollable site that frames the agent — minimal, modern, content-driven from `profile.json`.

Create (each reads from a `data` prop shaped like profile.json, with a local STUB import for standalone dev):
1. `src/sections/Hero.jsx` — name, title, tagline, one line of positioning, and a primary CTA that focuses the agent ("Ask my AI anything"). Big type, lots of whitespace.
2. `src/sections/Experience.jsx` — Infosys + BookedEat as clean cards (role, period, 2–3 highlights, tags).
3. `src/sections/Projects.jsx` — the GenAI LLM app as a feature card (stack chips, highlights, metrics).
4. `src/sections/Skills.jsx` — grouped, scannable skill chips (languages / genai / distributed / cloud / backend / databases).
5. `src/sections/Contact.jsx` — email + GitHub/LinkedIn/portfolio links + a short "open to contract work" line.
6. Motion: subtle GSAP or framer-motion scroll-reveal (fade/translate). Respect `prefers-reduced-motion`. Fully responsive (mobile-first).
7. CSS Modules per section, token-driven, consistent vertical rhythm.

Use UI primitives from `src/ui` (Chip, Panel, Button). Do NOT build the agent or the 3D scene.

Acceptance: renders a complete, responsive, animated single-page site from the profile data with no agent/scene dependency.

---

## TAB 6 — Integration, Responsiveness & Deploy (run LAST)

> Paste the SHARED CONTRACT above, then:

You are Tab 6. You run **after Tabs 1–5 report done**. You own integration — wiring, layering, polish, deploy. Minimize edits to others' files; if a contract mismatch exists, note it and adapt at the seam.

Do:
1. Finalize `src/App.jsx`: `<AmbientField/>` fixed at z-0; `<main>` (Hero → Experience → Projects → Skills → Contact) at z-10; `<AgentPanel persona client/>` docked/floating above. Wire persona state at the App level.
2. Swap Tab 1's `agentClient.js` stub usage for Tab 4's `mockClient` (single import switch). Remove any `// STUB: owned by Tab N` blocks now that real files exist.
3. Pass `profile.json` into the sections and the agent. Confirm `sceneBus` fires from agent tool-calls and the 3D scene reacts.
4. Responsive pass: agent panel becomes a bottom sheet / full-screen on mobile; sections reflow; 3D uses the reduced fallback.
5. Polish: z-index/layering, focus states, keyboard access for the agent input, loading/empty states.
6. Deploy config: Azure Static Web Apps (or Vercel) config + a `.env.example` with placeholder `VITE_*` keys for the future LLM phase (documented, empty). `README.md` with run/build/deploy steps and the Phase 2 plan (free-tier LLM + analytics + CMS).

Acceptance: `npm run build` succeeds; one cohesive site — ambient 3D, a working first-person agent (mock) with reasoning trace/personas/citations/guardrails, and the full resume content — responsive and deployable.

---

## After integration (Phase 2 — later, not now)
- Replace `mockClient` generation with a **free-tier LLM** (Groq / Gemini / OpenRouter) behind an Azure Function; keep the same event protocol.
- Add visitor + chat analytics (Cosmos DB / Postgres) — "who visited, what they asked."
- Add a content edit path (headless CMS or admin JSON) so updates need no redeploy.

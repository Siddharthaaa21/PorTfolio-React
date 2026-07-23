# SHARED CONTRACT — Source of Truth (all tabs)

> Verbatim copy of the build contract embedded in every tab's prompt.
> The canonical version is [`.claude/contract.md`](.claude/contract.md); **if they ever differ, `.claude/contract.md` wins.**
> Changing anything here is a cross-tab event: log it in `.claude/decisions.md` and ping every tab.

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
  Tab 3 (Agent UI):  src/agent/* (except agentClient.js & mockClient.js)
  Tab 4 (Brain+Data):src/content/*, src/agent/mockClient.js
  Tab 5 (Sections):  src/sections/*
  Tab 6 (Integrate): App.jsx wiring, deploy config, README.md — RUNS LAST

ISOLATION RULE: build & test your slice standalone. Need something another tab owns and it
doesn't exist yet? Create a minimal local stub marked `// STUB: owned by Tab N — remove on integration`.

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
```

# Shared Contract — Source of Truth

This is the canonical contract for the parallel build. The block embedded in `BUILD-PROMPTS.md`
mirrors this file. **If they ever disagree, this file wins** — and someone should fix the prompt.

Changing anything here is a cross-tab event: log it in `.claude/decisions.md` and ping every tab.

---

## Project
New folder `portfolio-v2/` next to the existing CRA app (do **not** touch the old app).
Vite + React 18. A minimal, modern personal site whose centerpiece is an AI "agent concierge"
that answers questions about Siddhartha Arora in **first person** ("I built…"), on an ambient
Three.js background. **Phase 1 is fully MOCK — no API key, no network, $0.**

## Stack
Vite · React 18 · react-three-fiber + @react-three/drei · gsap + framer-motion ·
CSS Modules + design tokens (CSS variables). **No Tailwind, no component kit.**

## Folder ownership — only create/edit files in YOUR folder
| Tab | Owns |
|-----|------|
| 1 Foundation | `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx` (shell only), `src/styles/*`, `src/ui/*`, `src/lib/sceneBus.js`, `src/agent/agentClient.js` (interface + stub) |
| 2 Scene | `src/scene/*` |
| 3 Agent UI | `src/agent/*` **except** `agentClient.js` & `mockClient.js` |
| 4 Brain+Data | `src/content/*`, `src/agent/mockClient.js` |
| 5 Sections | `src/sections/*` |
| 6 Integration | wires `src/App.jsx`, deploy config, `README.md` — **runs last** |

**Isolation rule:** build & test your slice standalone. Need something another tab owns and it
doesn't exist yet? Create a minimal local stub marked `// STUB: owned by Tab N — remove on integration`.

## Design tokens (`src/styles/tokens.css`, owned by Tab 1 — assume these CSS vars exist)
```
--bg:#0a0a0f; --surface:#13131a; --border:#23232e; --fg:#f5f5f7; --muted:#8a8a99;
--accent:#6366f1; --accent-2:#22d3ee; --radius:14px; --maxw:1100px;
--font-sans:'Inter',system-ui,sans-serif;
```
Aesthetic: dark, minimal, generous whitespace, bold type, one accent, subtle motion only.

## Data (`src/content/profile.json`, owned by Tab 4) — schema
```
{ identity:{name,title,tagline,location,email,links:{github,linkedin,portfolio}},
  personas:{recruiter:{focus,depth}, engineer:{focus,depth}, founder:{focus,depth}},
  experience:[{id,company,role,period,summary,highlights[],tags[]}],
  projects:[{id,name,stack[],period,summary,highlights[]}],
  skills:{languages[],genai[],distributed[],cloud[],backend[],databases[]},
  facts:[{id,text,sourceLabel}] }   // atomic, citeable statements
```

## Agent event protocol — THE critical contract
Tab 3 **renders** these events; Tab 4 **emits** them. Neither needs the other's code.

`agentClient.streamAgent({ message, persona, history })` → async iterable yielding:
```
{type:'plan',     text}                 // one-line plan
{type:'tool',     name, args, status}   // status:'start'|'done'  e.g. name:'search_experience'
{type:'token',    text}                 // answer, streamed word-by-word
{type:'citation', factId, label}        // factId matches profile.facts[].id
{type:'refusal',  reason}               // guardrail: off-topic / adversarial input
{type:'done'}
```
Voice: **first person as Siddhartha.**

## Scene bus (`src/lib/sceneBus.js`, owned by Tab 1 — tiny pub/sub)
```
sceneBus.emit('tool-call', { name });
const off = sceneBus.on('tool-call', cb);   // returns an unsubscribe fn
```
Tab 2 listens → pulses the 3D scene. Tabs 3/4 emit on each tool event.

## Component API (so Tab 6 can compose)
```
<AmbientField/>                            // Tab 2, fixed full-screen background
<AgentPanel persona client/>               // Tab 3
<Hero/> <Experience data/> <Projects data/> <Skills data/> <Contact/>   // Tab 5, data from profile.json
```

## API keys
Phase 1 = **NONE.** For the later real-LLM phase use a **free tier** (Groq / Google Gemini /
OpenRouter free models) via an env var (`VITE_*` or a serverless function).
**Never hardcode or commit a key.**

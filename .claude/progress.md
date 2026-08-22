# Progress Board

Live status of the parallel build. Each tab updates its own section when it finishes a milestone
(`/sync-progress` automates this). Keep it honest — don't mark work done that isn't.

Status legend: ⬜ not started · 🟨 in progress · ✅ done · ⛔ blocked

> **Phase 1 COMPLETE — integrated build is green and serves (HTTP 200), fully offline.**

---

## Tab 1 — Foundation  ✅
- **Delivered:** Vite+React18 scaffold; deps installed; `styles/tokens.css`+`global.css`; `ui/` primitives (Button, Chip, Panel, Glow) + barrel; `lib/sceneBus.js`; `agent/agentClient.js` stub; `App.jsx` shell; `index.html` (Inter).
- **Blockers:** —

## Tab 2 — Scene  ✅
- **Delivered:** `scene/AmbientF◊ield.jsx` (+css, barrel) — drei Points starfield + icosahedron w/ `MeshDistortMaterial`; subscribes to `sceneBus('tool-call')` → ripple/particle burst; `dpr` cap, hidden-tab pause, mobile + `prefers-reduced-motion` static fallback. `pointer-events:none`.
- **Notes:** a few hex literals exist only as crash-guard fallbacks in the token-reader (live colors come from `getComputedStyle` on real CSS vars) — accepted.

## Tab 3 — Agent UI  ✅
- **Delivered:** `AgentPanel` (forwardRef, `focus()`), `useAgent`, `ReasoningTrace`, `Message`/`MessageList`, `Citation`, `PersonaToggle`, `SuggestedChips` (+css each). Full event-protocol coverage; emits `sceneBus('tool-call')` on tool events; self-verified against `mockClient` — no gaps.
- **Blockers:** —

## Tab 4 — Brain + Data  ✅
- **Delivered:** `content/profile.json` (11 facts, from résumé), `content/personas.js` (getPersona/shapeFact). `agent/mockClient.js` **written by orchestrator** after the agent died mid-write (see mistakes.md) — offline RAG-lite, persona-shaped first-person answers, citations, injection + off-topic guardrails.
- **Blockers:** —

## Tab 5 — Sections  ✅
- **Delivered:** `Hero`/`Experience`/`Projects`/`Skills`/`Contact` (+css), barrel, `Reveal` (framer-motion scroll-reveal), `SectionHeading`. Each reads `data={profile}`; Hero/Contact expose `onAsk`. Responsive, reduced-motion safe.
- **Blockers:** —

## Tab 6 — Integration  ✅
- **Delivered:** `App.jsx` wired — `<AmbientField/>` (z-index:-1 bg) → sections (`data={profile}`, Hero/Contact `onAsk=focusAgent`) → `<AgentPanel client={mockClient} persona ref>` in sticky sidebar; persona lifted to App; corrected two stale commented imports (default `AgentPanel`, `mockClient`). **`npm run build` ✅ (1024 modules, 0 errors); `vite preview` ✅ HTTP 200; offline ✅.**
- **Blockers:** —

---

## Follow-ups (post-Phase-1)
- [x] Fill `profile.json` `identity.links` (GitHub, LinkedIn, Portfolio).
- [x] Code-split the 3D scene (`React.lazy` + dynamic import) — initial bundle reduced from 1.12 MB to 290 KB (95 KB gzipped).
- [x] Add `id="fact-<id>"` targets and `:target` animated styling so citation `#fact-<id>` links deep-scroll.
- [x] Root `package.json` proxy scripts (`npm run dev`, `npm run build`, `npm run preview`, `npm run api`).
- Phase 2 (DONE locally): Gemini RAG agent at `/api/agent` (`api/`), `apiClient` wired with mock fallback. **To go live:** create a free Gemini key → `.env.local`, then `npm run api` + `npm run dev`. **Remaining:** deploy `api/` as an Azure Function (same handler) for production; optional multi-turn history + LLM tool-calling.

## Changelog
<!-- newest first; one line per milestone: YYYY-MM-DD · Tab N · what shipped -->
- 2026-08-21 · Structure & Perf · Code-split Three.js ambient scene, added citation deep-linking targets + pulse animation, updated root package scripts and profile links
- 2026-07-01 · Phase 2 · real-LLM pipeline built — Gemini (free) behind `/api/agent`, RAG-as-tools, NDJSON stream, `apiClient` + mock fallback; shared `retrieval.js`; frontend build green, API smoke-tested (health + events + guardrail on the fallback path); Gemini endpoint reachability confirmed (HTTP 400 w/ fake key)
- 2026-07-01 · verify · live browser check (Playwright/headless) — all features render, 0 runtime errors, mobile reflows; caught + fixed an injection-regex guardrail gap
- 2026-07-01 · Tab 6 · INTEGRATED — App.jsx wired, build green (1024 mods), preview HTTP 200, offline verified
- 2026-07-01 · Tab 5 · sections shipped (Hero/Experience/Projects/Skills/Contact + reveal)
- 2026-07-01 · Tab 4 · profile.json + personas.js (agent); mockClient.js (orchestrator, after mid-write API error)
- 2026-07-01 · Tab 3 · agent UI shipped (panel, reasoning trace, personas, citations, guardrail rendering)
- 2026-07-01 · Tab 2 · ambient 3D scene + reactive icon shipped
- 2026-07-01 · Tab 1 · foundation shipped: scaffold + tokens + ui kit + sceneBus + agentClient stub + App shell; build + dev verified
- 2026-07-01 · setup · agent-dev scaffold created (CLAUDE.md, .claude/ context, BUILD-PROMPTS.md)

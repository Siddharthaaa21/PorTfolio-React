## Decision Log (ADR-lite)

Why we built it this way. Append a short entry when you make a non-obvious or cross-tab choice,
so future-you (and the other tabs) don't relitigate it. Newest at the top.

### Entry template
```
### YYYY-MM-DD · <decision title>
- **Decision:** <what was decided>
- **Why:** <the reasoning / what it buys us>
- **Alternatives considered:** <what we rejected and why>
- **Affects:** <tabs / files>
```

---

### 2026-07-01 · Phase 2: Google Gemini (free) + RAG pipeline, behind a swappable /api/agent
- **Decision:** Real LLM = Google Gemini free tier via its OpenAI-compatible endpoint, called from a serverless handler (`api/agent.mjs`) at `/api/agent`. Reasoning trace = a deterministic RAG pipeline: the server retrieves facts (the visible "tools"), then the LLM writes a grounded, cited, first-person answer. Same event protocol as the mock.
- **Why:** Free + fast streaming; OpenAI-compatible, so Groq / OpenRouter / Azure-OpenAI / Claude become a base-URL swap later. RAG-as-tools keeps the trace truthful and works on any free model (no reliance on function-calling quality). Key stays server-side; the UI is unchanged.
- **Alternatives considered:** LLM-driven tool-calling (more agentic but higher latency/failure on free models — deferred); answer-only (loses the visible tools); Groq/OpenRouter (kept as easy swaps via env).
- **Affects:** new `api/`, `src/agent/apiClient.js`, `src/agent/retrieval.js` (shared RAG+guardrail), `vite.config.js` proxy, `App.jsx` (`client=apiClient` with mock fallback).

### 2026-07-01 · Concept: AI-agent concierge + ambient 3D (hybrid)
- **Decision:** Centerpiece is a first-person agent over résumé data with a visible reasoning trace, on a subtle Three.js background.
- **Why:** Directly demonstrates Siddhartha's agentic-AI work (LangGraph/observability/guardrails) instead of just listing it; memorable for recruiters/contract clients.
- **Alternatives considered:** Plain RAG chatbot (too basic), terminal-style (overdone), 3D-hero-only (visual but off-message).
- **Affects:** all tabs.

### 2026-07-01 · Phase 1 is an offline mock — no API key
- **Decision:** Ship a fully local `mockClient` that emits realistic event streams; no LLM call until Phase 2.
- **Why:** $0, deployable day one, no key management; the event protocol lets us swap the real brain in later with zero UI changes. User asked to stay on free tiers.
- **Alternatives considered:** Wire a real LLM now (cost + key risk + slows the parallel build).
- **Affects:** Tab 3 (renders), Tab 4 (emits), Tab 6 (swap).

### 2026-07-01 · Parallelize by contract, not by code
- **Decision:** Freeze folder ownership + `profile.json` schema + event protocol + `sceneBus` in `.claude/contract.md`; tabs build in isolation with stubs.
- **Why:** Lets 6 tabs work simultaneously and integrate mechanically; the UI↔brain seam (the hardest) is decoupled by event shapes.
- **Alternatives considered:** Sequential build (slow); shared mutable scaffold (merge conflicts).
- **Affects:** all tabs; integration (Tab 6).

### 2026-07-01 · Vite + CSS Modules + tokens (no CRA, no Tailwind)
- **Decision:** Migrate off CRA to Vite; style with CSS Modules + CSS-variable design tokens.
- **Why:** CRA is deprecated/slow; CSS Modules per component avoid a shared config file that every tab would edit (fewer merge conflicts than a global Tailwind config).
- **Alternatives considered:** Keep CRA (legacy); Tailwind (shared config = contention point).
- **Affects:** Tab 1 (tokens/primitives), all styling.

### 2026-07-01 · Agent voice = first person "as Siddhartha"
- **Decision:** The agent speaks as Siddhartha ("I built…").
- **Why:** More personal and memorable than a third-person concierge.
- **Alternatives considered:** Third-person assistant (clearer it's a demo, less personal).
- **Affects:** Tab 4 (generation), Tab 3 (rendering).

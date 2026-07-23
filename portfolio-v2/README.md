# Portfolio v2 — Siddhartha Arora

An **AI-agent concierge** portfolio: a first-person agent answers questions about me over my
résumé data, showing a **visible reasoning trace** (plan → tool-calls → grounded answer), on an
ambient Three.js background. Built with Vite + React + react-three-fiber.

## Quick start (offline — no key, $0)

```bash
npm install
npm run dev          # → http://localhost:5173
```

The agent runs on a fully offline mock brain (RAG-lite over `src/content/profile.json`), so the
whole site works with zero configuration. Production build: `npm run build` → `npm run preview`.

## Go live with a real LLM (Phase 2 — Google Gemini, free tier)

```bash
cp .env.example .env.local           # then paste your free key into .env.local
#   Get a free key: https://aistudio.google.com/apikey

npm run api                          # terminal 1 → agent server on :8787
npm run dev                          # terminal 2 → app on :5173 (proxies /api → :8787)
```

- The key lives **server-side only** (`.env.local`, gitignored) — it never enters the browser bundle.
- Check status: `curl localhost:8787/api/health` → `{ keyConfigured: true, model: "gemini-2.0-flash" }`.
- **No key / API down?** The site still works — `apiClient` falls back to the offline mock, and the
  server returns deterministic answers. Nothing breaks.

### Swapping providers
The agent calls an **OpenAI-compatible** endpoint, so Groq / OpenRouter / Azure OpenAI are just env
changes in `.env.local` — set `GEMINI_BASE_URL`, `GEMINI_MODEL`, `GEMINI_API_KEY` accordingly.

## How the agent works (RAG pipeline)

```
Browser  src/agent/apiClient.js ──POST /api/agent──▶  api/agent.mjs
  parses NDJSON → events                              ├─ guardrail: injection check
  {plan,tool,token,citation,refusal,done}             ├─ retrieve facts (the visible "tools")
AgentPanel renders them (unchanged)  ◀───────────────┴─ Gemini streams a grounded, cited answer
```

Retrieval (the "tools" in the trace) is deterministic and truthful; the LLM only writes the final
answer, grounded in the retrieved `facts`, so it can't invent employers or numbers. The offline mock
and the server share the same RAG + guardrail logic via `src/agent/retrieval.js`.

## Structure

```
src/
  scene/      Ambient Three.js (AmbientField) + reactive 3D icon
  agent/      AgentPanel/useAgent/ReasoningTrace/… UI · agentClient (stub) · mockClient (offline)
              apiClient (real, /api/agent) · retrieval.js (shared RAG + guardrails)
  content/    profile.json (résumé as citeable data) · personas.js
  sections/   Hero/Experience/Projects/Skills/Contact
  ui/         design-system primitives · styles/ tokens
api/          agent.mjs (serverless handler) · server.mjs (local host; Azure-ready)
```

## Deploy

- **Frontend:** `npm run build` → static `dist/` (Vercel / Azure Static Web Apps / Netlify).
- **Agent API:** wrap `streamAgentEvents()` from `api/agent.mjs` in an Azure Function (same handler,
  key in app settings). Point the deployed `/api` route at it. _(Phase 2 deploy is the remaining step.)_

## TODO
- Fill `identity.links` in `src/content/profile.json` (GitHub / LinkedIn / portfolio are `"TODO"`).
- Optional: multi-turn history, LLM-driven tool-calling, code-split the 3D bundle.

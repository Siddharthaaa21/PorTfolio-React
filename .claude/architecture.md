# Architecture

## One-paragraph mental model
A static React SPA renders a résumé site (sections) with an always-present **agent panel**. When a
visitor asks a question, the panel calls `streamAgent()` and renders the resulting **event stream**:
a one-line plan, animated tool-call steps (the "reasoning trace"), a word-by-word first-person
answer, and citation chips back to the résumé. Every tool-call also pings a `sceneBus`, which makes
the ambient Three.js background pulse. In Phase 1 the brain is a local mock (no network); in Phase 2
the same `streamAgent` contract is fulfilled by a free-tier LLM behind an Azure Function.

## Component / data flow
```
            user question
                 │
                 ▼
        ┌──────────────────┐     events (plan/tool/token/citation/refusal/done)
        │  AgentPanel (T3) │◀───────────────────────────────────────┐
        │  useAgent hook   │                                         │
        └────────┬─────────┘                                         │
                 │ streamAgent({message,persona,history})            │
                 ▼                                                   │
        ┌──────────────────┐   reads   ┌─────────────────────────┐  │
        │ mockClient (T4)  │──────────▶│ profile.json (facts,exp)│  │
        │  intent + RAG-lite│           └─────────────────────────┘  │
        └────────┬─────────┘                                         │
                 │ on {type:'tool'}                                  │
                 ▼                                                   │
        sceneBus.emit('tool-call') ──▶ AmbientField (T2) pulses 3D   │
                                                                     │
   ReasoningTrace + MessageList + Citation (T3) render the stream ───┘

   Sections (T5): Hero/Experience/Projects/Skills/Contact ← profile.json
   Shell + tokens + ui/ primitives + sceneBus (T1)
   App.jsx wiring, responsive, deploy (T6)
```

## Why these seams
- **Event protocol** decouples the UI (Tab 3) from the brain (Tab 4) — the two hardest-to-coordinate
  pieces develop independently and integrate by shape, not by code.
- **`sceneBus`** decouples the 3D (Tab 2) from everything else — the scene only reacts to events on a bus.
- **`agentClient` interface + stub** lets Tab 3 build against a real signature on day one; Tab 4's
  `mockClient` and (later) the Azure client are drop-in implementations.
- **`profile.json` as the single data source** means sections (Tab 5) and the agent (Tab 4) never drift.

## Phasing
- **Phase 1 (now):** scaffold + ambient 3D + agent shell + offline mock. Fully deployable, $0, no key.
- **Phase 2:** replace mock generation with a free-tier LLM (Groq/Gemini/OpenRouter) behind an Azure
  Function. Same event protocol; add real RAG (embeddings) over `profile.json`; server-side guardrails.
- **Phase 3:** visitor + chat analytics (Cosmos DB / Postgres) — "who visited, what they asked"; a
  content-edit path (headless CMS or admin JSON) so updates need no redeploy.

## Performance & accessibility guardrails
- 3D caps `dpr`, pauses when the tab is hidden, and has a reduced/static fallback on mobile and
  `prefers-reduced-motion`.
- Agent input is keyboard-accessible; streaming respects reduced-motion; sections are mobile-first.

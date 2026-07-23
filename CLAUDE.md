# Portfolio v2 — Siddhartha Arora

An **AI-agent concierge** portfolio. A first-person "agent" answers questions about Siddhartha
over his résumé data, showing a **visible reasoning trace** (plan → tool-calls → answer), on an
**ambient Three.js** background. Built in parallel across **6 Claude tabs** against a shared contract.

> **Legacy:** the old Create-React-App portfolio at the repo root (`src/`, CRA + react-bootstrap)
> is **REFERENCE ONLY — do not extend it.** All new work happens in `portfolio-v2/`.

## Architecture
- **Vite + React 18** SPA — `portfolio-v2/`
- **react-three-fiber + drei** — ambient 3D background + a signature 3D icon — `src/scene/` (Tab 2)
- **Agent UI** — chat + reasoning-trace + persona modes + citations; renders a streamed **event protocol** — `src/agent/` (Tab 3)
- **Agent brain** — Phase 1 is an **offline mock** (`src/agent/mockClient.js`, $0, no key). Phase 2 swaps in a free-tier LLM behind Azure Functions — **same event protocol** — `src/agent/` (Tab 4)
- **Content** — résumé as structured, citeable data (the RAG source) — `src/content/profile.json` (Tab 4)
- **CSS Modules + design tokens** — dark, minimal — `src/styles/tokens.css` (Tab 1)

Deeper detail → [.claude/architecture.md](.claude/architecture.md).
The rules every tab codes against → [.claude/contract.md](.claude/contract.md) **(source of truth).**

## Project Structure
```
portfolio-v2/
  src/
    scene/      Ambient Three.js + 3D icon            (Tab 2)
    agent/      Agent UI (Tab 3) · agentClient interface/stub (Tab 1) · mockClient brain (Tab 4)
    content/    profile.json + personas.js            (Tab 4)
    sections/   Hero/Experience/Projects/Skills/Contact (Tab 5)
    ui/         Design-system primitives              (Tab 1)
    styles/     tokens.css + global.css               (Tab 1)
    lib/        sceneBus.js                            (Tab 1)
    App.jsx     Shell (Tab 1) → wired on integration  (Tab 6)
.claude/        Agent-dev context (contract, architecture, logs, subagents, commands)
BUILD-PROMPTS.md  The 6 copy-paste tab prompts
```

## The Parallel Build (6 tabs)
Ownership + run order live in [.claude/tabs.md](.claude/tabs.md). In one line:
**Tab 1 scaffolds → Tabs 2–5 build in parallel → Tab 6 integrates.** Each tab owns a folder and never edits another's.

## Golden Rules
1. **Stay in your lane.** Only edit files your tab owns (see `.claude/tabs.md`). Need another tab's file? Stub it: `// STUB: owned by Tab N — remove on integration`.
2. **The contract is law.** Folder ownership, the `profile.json` schema, the agent **event protocol**, and `sceneBus` are frozen in `.claude/contract.md`. Don't change a shared shape unilaterally — if you must, log it in `.claude/mistakes.md` **and** `.claude/decisions.md`.
3. **First person.** The agent always speaks **as Siddhartha** ("I built…", "I led…").
4. **Phase 1 is offline.** No API key, no network calls. The mock must *feel* real.
5. **Token-driven styling.** No hardcoded colors/spacing — use the CSS vars in `tokens.css`.

## Logging protocol — so we can review what the agents did
- **Finished a milestone?** Append a dated entry to `.claude/progress.md` (what you built, files touched, status) — or run `/sync-progress`.
- **Hit a bug, a contract gap, or made a wrong turn?** Append to `.claude/mistakes.md` using the template — or run `/log-mistake`. This is how we stop the same error recurring across tabs.
- **Made a non-obvious choice?** Add an entry to `.claude/decisions.md`.

## Review workflow (agent-dev)
- Run the **`contract-guardian`** subagent to check a tab's output against the contract **before** integration.
- Run the **`integration-reviewer`** subagent during Tab 6.

## Commands & checks (`portfolio-v2/`)
- Dev `npm run dev` · Build `npm run build` · Preview `npm run preview`
- Lint/format: set up by Tab 1 (TODO — record the exact command here once it exists).

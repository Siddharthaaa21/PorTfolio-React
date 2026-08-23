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

## Dynamic TDD Multi-Agent Workflow
For active development and new features:
1. **Milestone Planner (`milestone-planner`)**: Decomposes user goals into testable milestones & branch prompts.
2. **TDD Developer (`tdd-developer`)**: Operates on branch workspaces adhering to **Red -> Green -> Refactor**.
3. **QA & Validator (`qa-validator`)**: Runs test suite (`npm test`), verifies contracts, and clears merges.
Details -> [.claude/workflow.md](.claude/workflow.md).

## Golden Rules
1. **TDD First.** Write failing unit/integration tests before writing implementation code.
2. **The contract is law.** Folder ownership, the `profile.json` schema, the agent **event protocol**, and `sceneBus` are frozen in `.claude/contract.md`.
3. **First person.** The agent always speaks **as Siddhartha** ("I built…", "I led…").
4. **Token-driven styling.** No hardcoded colors/spacing — use the CSS vars in `tokens.css`.
5. **Continuous Verification.** Always verify with `npm test` (Vitest) and `npm run build` before completing a milestone.

## Commands & checks (run from root or `portfolio-v2/`)
- Test: `npm test` (run Vitest suite) · `npm run test:watch`
- Dev: `npm run dev` · Build: `npm run build` · Preview: `npm run preview`
- API Dev Server: `npm run api`


# Conventions

Keep new code reading like one author wrote it. When in doubt, match the surrounding file.

## Components
- Function components + hooks only. One component per file; filename matches the component (`AgentPanel.jsx`).
- Co-locate styles: `Foo.jsx` + `Foo.module.css`. Import as `import s from './Foo.module.css'`.
- Props are explicit; no prop-drilling more than one level — lift to `App.jsx` or use context sparingly.
- Side effects in hooks, not in render. Clean up subscriptions (`sceneBus.on` returns an unsubscribe).

## Styling
- **Tokens only** — never hardcode a hex color, font, or radius. Use the CSS vars from `tokens.css`.
- CSS Modules for component styles; `global.css` only for reset + base element styles.
- Motion via framer-motion or gsap; always gate on `prefers-reduced-motion`.

## Naming
- Components `PascalCase`; hooks `useThing`; files match. Vars/functions `camelCase`. Event names
  on `sceneBus` are `kebab-case` strings (`'tool-call'`).
- Agent tool names are `snake_case` verbs (`search_experience`, `retrieve_project`, `match_role`).

## The contract
- Treat `.claude/contract.md` shapes as frozen: the `profile.json` schema, the event protocol,
  `sceneBus`, and the component API. Don't rename a field or event without logging a decision.

## Stubs (for parallel isolation)
- Anything you need from another tab that doesn't exist yet → minimal local stub marked exactly:
  `// STUB: owned by Tab N — remove on integration`. Tab 6 greps for this marker and removes them.

## Phase-1 discipline
- **Zero network calls.** No `fetch`/`axios`/SDKs to any LLM. The mock is local. (Contract-guardian
  flags any network call in Phase 1.)
- No secrets in code. Future keys load from env (`VITE_*`) — provide `.env.example`, never `.env`.

## Commits (when asked to commit)
- Small, scoped commits per tab. Message style: `tab2: ambient field + reactive 3D icon`.
- Don't commit `node_modules`, `.env`, or build output.

## Accessibility baseline
- Agent input reachable by keyboard; visible focus states; sufficient contrast against `--bg`;
  the 3D layer is `pointer-events:none` and never traps focus.

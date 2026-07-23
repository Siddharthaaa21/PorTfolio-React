# The 6 Tabs — Ownership, Order & Status

Full copy-paste prompts live in [`BUILD-PROMPTS.md`](../BUILD-PROMPTS.md).
This file is the quick map + live status. Detailed status → [`progress.md`](progress.md).

> **Phase 1 complete — all 6 done, integrated, build green, serves HTTP 200, fully offline.**

## Run order
**Tab 1 first** (scaffold + tokens others import) → **Tabs 2–5 in parallel** → **Tab 6 last** (integrate).
Tabs 2–5 don't wait on Tab 1's *code* — they code against `.claude/contract.md` and stub anything missing.

## Map
| Tab | Mission | Owns | Reads | Acceptance | Status |
|-----|---------|------|-------|-----------|--------|
| **1 Foundation** | Runnable styled shell + shared interfaces | scaffold, `styles/*`, `ui/*`, `lib/sceneBus.js`, `agent/agentClient.js` (stub), `App.jsx` shell | contract | `npm run dev` boots dark shell, no errors | ✅ done |
| **2 Scene** | Ambient 3D bg + signature 3D icon that reacts to tool-calls | `src/scene/*` | contract, `sceneBus` | 60fps desktop, mobile fallback, reacts to `sceneBus.emit('tool-call')` | ✅ done |
| **3 Agent UI** | Chat + reasoning trace + personas + citations | `src/agent/*` (not `agentClient.js`/`mockClient.js`) | contract, event protocol, `agentClient` stub | full sequence renders from stub: trace animates, answer streams, citation + persona + refusal work | ✅ done |
| **4 Brain+Data** | Offline mock brain + résumé data | `src/content/*`, `src/agent/mockClient.js` | contract, résumé | sample Qs → correct first-person, persona-shaped event streams w/ citations + a guardrail refusal, all offline | ✅ done |
| **5 Sections** | The site around the agent | `src/sections/*` | contract, `profile.json` schema | full responsive animated page from profile data | ✅ done |
| **6 Integration** | Wire everything, responsive, deploy | `App.jsx`, deploy cfg, `README.md` | everything | `npm run build` passes; one cohesive, responsive, deployable site | ✅ done |

Legend: ⬜ not started · 🟨 in progress · ✅ done · ⛔ blocked (note blocker in `progress.md`)

## Riskiest coordination points (how they resolved)
- **Tab 3 ↔ Tab 4** (event protocol) — Tab 3 self-verified against `mockClient.js`; no gaps. ✅
- **Tab 2 ↔ Tabs 3/4** (`sceneBus`) — name `'tool-call'`, payload `{name}` matched on both sides. ✅
- **Tab 4 ↔ Tab 5** (`profile.json`) — both read the same object; schema held. ✅

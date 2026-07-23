/**
 * mockClient — the offline agent brain (Phase 1 / fallback). NO API key, NO network.
 *
 * Implements the `streamAgent` event contract (same as `agentClient.js`) with real
 * retrieval over `profile.json`, so it FEELS like a live agent. Shares its RAG +
 * guardrail logic with the serverless handler via `retrieval.js`, so both brains
 * behave identically offline.
 *
 * In Phase 2 this stays as the automatic fallback: `apiClient.js` uses it whenever
 * the real LLM endpoint (`/api/agent`) is unreachable or unconfigured.
 */
import profile from '../content/profile.json';
import { getPersona, shapeFact } from '../content/personas.js';
import { retrieve, pickTools, INJECTION, OFFTOPIC } from './retrieval.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let guardrailHits = 0;
export const guardrailCount = () => guardrailHits;

async function* streamWords(text, delay) {
  for (const chunk of text.split(/(\s+)/)) {
    if (!chunk) continue;
    await sleep(chunk.trim() ? delay : Math.round(delay / 2));
    yield { type: 'token', text: chunk };
  }
}

export async function* streamAgent({ message = '', persona = 'recruiter', history = [] } = {}) {
  const p = getPersona(persona);
  await sleep(140);

  // 1) hard guardrail — prompt injection
  if (INJECTION.test(message)) {
    guardrailHits += 1;
    await sleep(160);
    yield {
      type: 'refusal',
      reason:
        "That reads like a prompt-injection attempt — I keep my guardrails on. Ask me something real about my work, projects, or whether I'd fit a role, and I'm all yours.",
    };
    yield { type: 'done' };
    return;
  }

  yield {
    type: 'plan',
    text: `Reading that as a ${p.label.toLowerCase()} question — pulling the most relevant parts of my background.`,
  };

  // 2) retrieve
  const facts = retrieve(message, p.maxFacts, profile.facts);
  const isGreeting = /\b(hi|hello|hey|who are you|introduce|about yourself|what do you do)\b/i.test(message);

  // 2b) soft guardrail — clearly off-topic with nothing to ground on
  if (facts.length === 0 && !isGreeting && OFFTOPIC.test(message)) {
    guardrailHits += 1;
    await sleep(120);
    yield {
      type: 'refusal',
      reason:
        "That's outside what I cover here — I'm Siddhartha's portfolio agent. Ask me about my engineering work, my projects, or how I'd fit a role.",
    };
    yield { type: 'done' };
    return;
  }

  // 3) tool calls (each pings the 3D scene via the UI's sceneBus emit)
  for (const name of pickTools(message)) {
    yield { type: 'tool', name, args: { query: message.slice(0, 80) }, status: 'start' };
    await sleep(260);
    yield { type: 'tool', name, args: { query: message.slice(0, 80) }, status: 'done' };
  }
  await sleep(120);

  // 4) compose a first-person, persona-shaped answer
  const parts = [];
  if (facts.length === 0) {
    parts.push(`${p.lead} I'm ${profile.identity.name} — ${profile.identity.tagline}`);
    const intro = profile.facts.find((f) => f.id === 'f-llm-40');
    if (intro) parts.push(shapeFact(intro.text, p.id));
  } else {
    parts.push(`${p.lead} ${shapeFact(facts[0].text, p.id)}`);
    if (facts[1]) parts.push(`${p.connect} ${shapeFact(facts[1].text, p.id)}`);
    if (facts[2] && p.wantsArchitecture) parts.push(shapeFact(facts[2].text, p.id));
  }
  if (p.close) parts.push(p.close);

  for await (const ev of streamWords(parts.join(' '), p.wordDelay)) yield ev;

  // 5) citations — ground every answer in the résumé facts used
  const cited = facts.length ? facts : [profile.facts.find((f) => f.id === 'f-llm-40')].filter(Boolean);
  await sleep(120);
  for (const f of cited) yield { type: 'citation', factId: f.id, label: f.sourceLabel };

  yield { type: 'done' };
}

export const mockClient = { streamAgent, guardrailCount };
export default mockClient;

/**
 * agentClient — the shared agent interface (Tab 1 owns this signature + stub).
 *
 * THE CRITICAL SEAM. Tab 3 (Agent UI) renders the events this yields; Tab 4
 * (Brain) provides the real offline mock implementation in `mockClient.js`.
 * Both develop against this SHAPE, not each other's code.
 *
 *   streamAgent({ message, persona, history }) -> async iterable yielding:
 *     { type:'plan',     text }
 *     { type:'tool',     name, args, status }   // status: 'start' | 'done'
 *     { type:'token',    text }                 // answer, streamed word-by-word
 *     { type:'citation', factId, label }        // factId matches profile.facts[].id
 *     { type:'refusal',  reason }
 *     { type:'done' }
 *
 * Voice: FIRST PERSON as Siddhartha ("I built…").
 *
 * ─────────────────────────────────────────────────────────────────────────
 * BACKEND SEAM — how this gets replaced later:
 *   Phase 1 (now):   this canned stub, then Tab 4's `mockClient` (fully offline, $0).
 *   Phase 2 (later): a real free-tier LLM (Groq / Gemini / OpenRouter) behind an
 *                    Azure Function. The serverless endpoint streams the SAME event
 *                    objects (SSE / chunked); swap the body of `streamAgent` to read
 *                    that stream. The signature and event protocol DO NOT change, so
 *                    Tab 3's UI keeps working untouched. Never hardcode a key — load
 *                    from env (VITE_*) or keep it server-side in the Function.
 * ─────────────────────────────────────────────────────────────────────────
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * STUB implementation: yields a tiny canned sequence so Tab 3 can build the UI
 * before Tab 4 lands. Tab 4 replaces this with the real mock brain (same shape).
 *
 * @param {{ message:string, persona:string, history?:Array }} params
 * @returns {AsyncGenerator} event objects per the protocol above
 */
export async function* streamAgent({ message = '', persona = 'recruiter', history = [] } = {}) {
  await sleep(150);
  yield { type: 'plan', text: `Answering as Siddhartha for a ${persona}.` };

  await sleep(250);
  yield { type: 'tool', name: 'search_experience', args: { query: message }, status: 'start' };
  await sleep(400);
  yield { type: 'tool', name: 'search_experience', args: { query: message }, status: 'done' };

  const answer = "Hi — I'm a stubbed response. Tab 4 will wire up the real offline brain.";
  for (const word of answer.split(' ')) {
    await sleep(60);
    yield { type: 'token', text: word + ' ' };
  }

  await sleep(120);
  yield { type: 'citation', factId: 'stub-fact', label: 'Stub citation' };

  await sleep(120);
  yield { type: 'done' };
}

/** Default agent client. Tab 6 swaps this for Tab 4's mockClient at integration. */
export const agentClient = { streamAgent };

export default agentClient;

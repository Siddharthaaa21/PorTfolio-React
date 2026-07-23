/**
 * apiClient — Phase 2 client. POSTs to the serverless RAG agent at /api/agent and
 * parses its NDJSON event stream into the SAME protocol the UI already renders.
 *
 * If the endpoint is unreachable or unconfigured (no server / no key / network
 * error before any event), it transparently FALLS BACK to the offline mockClient,
 * so the deployed site never breaks.
 */
import mockClient from './mockClient.js';

const ENDPOINT = '/api/agent';

export async function* streamAgent(args = {}) {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!res.ok || !res.body) throw new Error(`api ${res && res.status}`);
  } catch {
    yield* mockClient.streamAgent(args); // offline / no server → graceful fallback
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let got = false;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        try { const ev = JSON.parse(line); got = true; yield ev; } catch { /* skip malformed line */ }
      }
    }
    const tail = buf.trim();
    if (tail) { try { yield JSON.parse(tail); } catch { /* ignore */ } }
  } catch {
    if (!got) yield* mockClient.streamAgent(args); // failed before any event → fallback
  }
}

export const apiClient = { streamAgent };
export default apiClient;

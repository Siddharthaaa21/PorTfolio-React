/**
 * retrieval.js — shared, offline RAG-lite + guardrail primitives.
 *
 * PURE functions, zero imports, no DOM, no network: `facts` are passed in, so the
 * SAME logic powers the offline mock (`mockClient.js`) AND the serverless handler
 * (`api/agent.mjs`). Keeping it dependency-free means both Node and Vite load it
 * as-is, and a guardrail/retrieval fix lands in both brains at once.
 */

const STOP = new Set([
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'did', 'what', 'how', 'why', 'who',
  'tell', 'me', 'about', 'your', 'you', 'his', 'him', 'of', 'to', 'in', 'on', 'for',
  'and', 'with', 'can', 'could', 'would', 'i', 'siddhartha', 'he', 'have', 'has',
]);

export const tokenize = (s) =>
  (String(s).toLowerCase().match(/[a-z0-9+]+/g) || []).filter((w) => w.length > 1 && !STOP.has(w));

// Topical hints → fact ids, for synonyms that may not appear in the fact text verbatim.
export const HINTS = {
  azure: ['f-azure-cicd', 'f-az900'], cloud: ['f-azure-cicd', 'f-az900'],
  deploy: ['f-azure-cicd'], deployment: ['f-azure-cicd'], cicd: ['f-azure-cicd'], docker: ['f-azure-cicd'],
  langgraph: ['f-langgraph-orchestration', 'f-llm-40'], langchain: ['f-llm-40', 'f-langgraph-orchestration'],
  agent: ['f-langgraph-orchestration', 'f-guardrails', 'f-arch-proposals'],
  agentic: ['f-langgraph-orchestration', 'f-arch-proposals', 'f-availability'],
  llm: ['f-llm-40', 'f-langgraph-orchestration'], genai: ['f-llm-40', 'f-langgraph-orchestration'],
  guardrail: ['f-guardrails'], guardrails: ['f-guardrails'], observability: ['f-guardrails'],
  distributed: ['f-deltasync', 'f-consistency'], sync: ['f-deltasync', 'f-consistency'],
  consistency: ['f-consistency'], scale: ['f-deltasync', 'f-langgraph-orchestration'],
  rag: ['f-rag'], retrieval: ['f-rag'], hallucinate: ['f-rag'], hallucination: ['f-rag'],
  certified: ['f-az900'], certification: ['f-az900'], az900: ['f-az900'],
  fit: ['f-availability'], hire: ['f-availability'], contract: ['f-availability'],
  available: ['f-availability'], availability: ['f-availability'], role: ['f-availability'],
  infosys: ['f-llm-40', 'f-arch-proposals', 'f-guardrails', 'f-agile-cicd'],
  bookedeat: ['f-deltasync', 'f-consistency'], fastapi: ['f-arch-proposals'],
  agile: ['f-agile-cicd'], sprint: ['f-agile-cicd'], experience: ['f-llm-40', 'f-deltasync'],
};

/** Rank `facts` by keyword + hint overlap with `message`; return the top `limit`. */
export function retrieve(message, limit, facts = []) {
  const tokens = tokenize(message);
  const scores = new Map();
  const bump = (id, n) => scores.set(id, (scores.get(id) || 0) + n);
  for (const f of facts) {
    const text = f.text.toLowerCase();
    for (const t of tokens) if (text.includes(t)) bump(f.id, 2);
  }
  for (const t of tokens) for (const id of HINTS[t] || []) bump(id, 3);
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => facts.find((f) => f.id === id))
    .filter(Boolean);
}

// ── guardrails (mirrors the résumé's "100% guardrail violations caught") ────
export const INJECTION =
  /\b(ignore|disregard|forget|override|bypass)\b[\s\w]*\b(instruction|instructions|prompt|prompts|rule|rules|guardrail|guardrails|directive|directives|context|persona)\b|system prompt|jailbreak|you are now|pretend (to be|you are|you're)|reveal (your |the )?(system )?(prompt|instruction|instructions)|act as (a|an|if|though)/i;

export const OFFTOPIC =
  /\b(weather|poem|joke|recipe|cook|football|cricket|movie|stock|bitcoin|crypto|girlfriend|president|capital of|translate|write me|code (this|me)|do my homework|sing)\b/i;

/** Route the question to the tool name(s) the trace will show. */
export function pickTools(message) {
  const m = String(message).toLowerCase();
  if (/\b(fit|hire|contract|role|job|available|work with us|work together|engage|good for)\b/.test(m)) return ['match_role'];
  if (/\b(project|langgraph|genai|app|built|build|azure|deploy|orchestrat|pipeline)\b/.test(m))
    return ['retrieve_project', 'search_experience'];
  return ['search_experience'];
}

/**
 * personas.js — per-persona answer shaping for the offline agent brain.
 *
 * The mock brain (`src/agent/mockClient.js`) retrieves the same underlying
 * facts regardless of who's asking, then SHAPES the reply by audience:
 *
 *   recruiter → fit, outcomes, availability  — concise, plain-language
 *   engineer  → architecture, trade-offs, stack — detailed, technical
 *   founder   → impact, ROI, delivery speed   — outcome-first, punchy
 *
 * Everything here is data/string-shaping only — no network, no LLM.
 * The voice is always FIRST PERSON as Siddhartha ("I built…").
 */

/**
 * Tone + depth modifiers, keyed by persona id. Mirrors the `personas` block
 * in profile.json but adds the knobs the generator actually reads.
 *
 *   maxFacts   — how many retrieved facts to fold into one answer
 *   wordDelay  — ms between streamed tokens (founder reads fastest)
 *   lead       — first-person opener that frames the answer for this audience
 *   connect    — phrase that joins a second supporting fact
 *   close      — optional first-person sign-off (recruiter/founder nudge to action)
 *   wantsMetrics / wantsArchitecture — bias retrieval + phrasing
 */
export const personas = {
  recruiter: {
    id: 'recruiter',
    label: 'Recruiter',
    focus: 'fit, outcomes, availability',
    depth: 'concise',
    maxFacts: 2,
    wordDelay: 34,
    wantsMetrics: true,
    wantsArchitecture: false,
    lead: 'Short version —',
    connect: 'On top of that,',
    close: "I'm open to contract work, so happy to talk timelines.",
  },

  engineer: {
    id: 'engineer',
    label: 'Engineer',
    focus: 'architecture, trade-offs, stack',
    depth: 'detailed',
    maxFacts: 3,
    wordDelay: 30,
    wantsMetrics: true,
    wantsArchitecture: true,
    lead: 'Here’s how I actually approached it.',
    connect: 'The trade-off worth calling out:',
    close: 'Happy to go deeper on any part of the design.',
  },

  founder: {
    id: 'founder',
    label: 'Founder',
    focus: 'impact, ROI, delivery speed',
    depth: 'outcome-first',
    maxFacts: 2,
    wordDelay: 26,
    wantsMetrics: true,
    wantsArchitecture: false,
    lead: 'Bottom line up front:',
    connect: 'And the speed angle —',
    close: 'I move fast and ship in 2-week sprints, so I can start delivering value early.',
  },
};

/** The persona used when none is supplied or an unknown id comes in. */
export const DEFAULT_PERSONA = 'recruiter';

/**
 * Safe lookup — always returns a valid persona descriptor.
 * @param {string} id
 * @returns {typeof personas.recruiter}
 */
export function getPersona(id) {
  return personas[id] || personas[DEFAULT_PERSONA];
}

/**
 * Light prose tweaks applied to a fact's text so the same fact reads naturally
 * for a different audience. Kept deliberately simple (string ops only) — Phase 2
 * hands this shaping to the LLM via the persona's `focus`/`depth` in the prompt.
 *
 * @param {string} text   the raw first-person fact text
 * @param {string} personaId
 * @returns {string}
 */
export function shapeFact(text, personaId) {
  const p = getPersona(personaId);
  // Founders skim — trim a trailing clause after the last comma to tighten it.
  if (p.id === 'founder' && text.length > 90 && text.includes(',')) {
    const cut = text.lastIndexOf(',');
    return text.slice(0, cut) + '.';
  }
  return text;
}

export default personas;

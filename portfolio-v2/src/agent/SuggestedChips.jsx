import { Chip } from '../ui';
import s from './SuggestedChips.module.css';

/** Default starter questions that show the agent's range. */
export const DEFAULT_QUESTIONS = [
  'Would Siddhartha fit a 3-month agentic-AI contract?',
  'Show me the LangGraph project',
  "What's his Azure experience?",
];

/**
 * SuggestedChips — clickable starter questions. Clicking one submits it as the
 * next agent question via `onPick`. Hidden once a conversation is underway
 * (the parent decides when to render this).
 *
 * @param {{ questions?: string[], onPick: (q:string)=>void, disabled?: boolean }} props
 */
export default function SuggestedChips({ questions = DEFAULT_QUESTIONS, onPick, disabled = false }) {
  if (!questions.length) return null;

  return (
    <div className={s.wrap} role="list" aria-label="Suggested questions">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          role="listitem"
          className={s.chipBtn}
          disabled={disabled}
          onClick={() => onPick?.(q)}
        >
          <Chip className={s.chip}>{q}</Chip>
        </button>
      ))}
    </div>
  );
}

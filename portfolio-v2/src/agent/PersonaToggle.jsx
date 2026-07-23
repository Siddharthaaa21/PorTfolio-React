import { motion, useReducedMotion } from 'framer-motion';
import s from './PersonaToggle.module.css';

/**
 * The three personas the agent can answer as. Keys match
 * profile.personas.{recruiter,engineer,founder} in the contract.
 */
export const PERSONAS = [
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'engineer', label: 'Engineer' },
  { id: 'founder', label: 'Founder' },
];

/**
 * PersonaToggle — segmented control that lifts the active persona to the parent.
 *
 * Keyboard accessible (radiogroup semantics + arrow-key roving via tablist
 * pattern is overkill here; native buttons + aria-pressed is sufficient and
 * robust). The active pill slides between options via a shared layoutId.
 *
 * @param {{ persona: string, onChange: (id:string)=>void, disabled?: boolean }} props
 */
export default function PersonaToggle({ persona = 'recruiter', onChange, disabled = false }) {
  const reduce = useReducedMotion();

  return (
    <div className={s.group} role="group" aria-label="Answer persona">
      {PERSONAS.map((p) => {
        const active = p.id === persona;
        return (
          <button
            key={p.id}
            type="button"
            className={`${s.option} ${active ? s.active : ''}`}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => !active && onChange?.(p.id)}
          >
            {active && (
              <motion.span
                layoutId="persona-pill"
                className={s.pill}
                aria-hidden="true"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 480, damping: 36 }
                }
              />
            )}
            <span className={s.label}>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

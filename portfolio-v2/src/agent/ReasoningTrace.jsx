import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import s from './ReasoningTrace.module.css';

/**
 * Format a tool's args into a compact, human-readable signature like
 *   search_experience("Infosys")   or   match_role({ months: 3 })
 * Falls back to an empty arg list when there's nothing meaningful to show.
 */
function formatArgs(args) {
  if (args == null) return '';
  if (typeof args === 'string') return JSON.stringify(args);
  if (typeof args !== 'object') return String(args);

  const keys = Object.keys(args);
  if (keys.length === 0) return '';

  // Common case: a single query-ish string arg → show it bare and quoted.
  if (keys.length === 1) {
    const v = args[keys[0]];
    if (typeof v === 'string') return JSON.stringify(v);
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  }

  // Otherwise show a trimmed object literal.
  const parts = keys.slice(0, 3).map((k) => {
    const v = args[k];
    const sval = typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v);
    return `${k}: ${sval}`;
  });
  const more = keys.length > 3 ? ', …' : '';
  return `{ ${parts.join(', ')}${more} }`;
}

/** Build the label text for a single trace step. */
function stepLabel(step) {
  if (step.kind === 'plan') return step.text;
  const sig = formatArgs(step.args);
  return `${step.name}(${sig})`;
}

/**
 * ReasoningTrace — the signature visible reasoning trace.
 *
 * Renders a turn's `plan` + `tool` events as a compact animated step list above
 * the answer. Each step animates in; tool steps show a spinner while
 * status==='start' and a check once status==='done'.
 *
 * @param {{ trace: Array<{kind:'plan'|'tool', text?:string, name?:string, args?:any, status?:'start'|'done'}>, streaming?: boolean }} props
 */
export default function ReasoningTrace({ trace = [], streaming = false }) {
  const reduce = useReducedMotion();
  if (!trace.length) return null;

  const itemVariants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: -6, height: 0 },
        animate: { opacity: 1, x: 0, height: 'auto' },
        exit: { opacity: 0, x: -6, height: 0 },
      };

  return (
    <motion.ul
      className={s.trace}
      aria-label="Reasoning steps"
      initial={false}
      // Subtle stagger between steps as they appear.
      transition={{ staggerChildren: reduce ? 0 : 0.04 }}
    >
      <AnimatePresence initial={!reduce}>
        {trace.map((step, i) => {
          const isTool = step.kind === 'tool';
          const done = isTool && step.status === 'done';
          const running = isTool && step.status !== 'done';

          return (
            <motion.li
              key={`${step.kind}-${step.name || 'plan'}-${i}`}
              className={s.step}
              data-kind={step.kind}
              data-status={isTool ? step.status : undefined}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={s.arrow} aria-hidden="true">
                →
              </span>

              <span className={s.label}>{stepLabel(step)}</span>

              {/* Status glyph: spinner while running, check when done. Plan steps
                  get a quiet pulse dot while the turn is still streaming. */}
              {isTool && running && (
                <motion.span
                  className={s.spinner}
                  aria-label="running"
                  role="status"
                  animate={reduce ? {} : { rotate: 360 }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 0.9 }}
                />
              )}
              {done && (
                <motion.span
                  className={s.check}
                  aria-label="done"
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: reduce ? 'tween' : 'spring', stiffness: 500, damping: 22 }}
                >
                  ✓
                </motion.span>
              )}
              {step.kind === 'plan' && streaming && (
                <span className={s.dot} aria-hidden="true" />
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}

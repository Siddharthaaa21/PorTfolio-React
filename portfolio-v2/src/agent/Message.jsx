import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ReasoningTrace from './ReasoningTrace.jsx';
import Citation from './Citation.jsx';
import s from './Message.module.css';

/**
 * Split accumulated answer text into renderable word tokens. The client streams
 * `token` events word-by-word and useAgent concatenates them, so `text` grows
 * over time; we re-split here purely to fade each new word in.
 */
function toWords(text) {
  // Keep trailing spaces attached to each word so spacing is preserved.
  return text.match(/\S+\s*|\s+/g) || [];
}

/**
 * Message — one conversation turn.
 *
 * User turns: a compact right-aligned bubble.
 * Agent turns: the <ReasoningTrace/> (plan + tool steps), then the streamed
 * first-person answer with a live caret while streaming, then citation chips.
 * A `refusal` renders a calm, on-brand declined message instead of the answer.
 *
 * @param {{ message: object, onCitation?: (factId:string)=>void }} props
 */
export default function Message({ message, onCitation }) {
  const reduce = useReducedMotion();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        className={`${s.row} ${s.user}`}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={s.bubble}>{message.text}</div>
      </motion.div>
    );
  }

  const { trace = [], text = '', citations = [], refusal, streaming } = message;
  const words = toWords(text);

  return (
    <motion.div
      className={`${s.row} ${s.agent}`}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={s.agentInner}>
        <ReasoningTrace trace={trace} streaming={streaming} />

        {refusal ? (
          <motion.p
            className={s.refusal}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {refusal}
          </motion.p>
        ) : (
          <p className={s.answer}>
            <AnimatePresence initial={false}>
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className={s.word}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                >
                  {w}
                </motion.span>
              ))}
            </AnimatePresence>
            {streaming && <span className={s.caret} aria-hidden="true" />}
          </p>
        )}

        {citations.length > 0 && (
          <motion.div
            className={s.citations}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {citations.map((c, i) => (
              <Citation
                key={`${c.factId || 'c'}-${i}`}
                factId={c.factId}
                label={c.label}
                onSelect={onCitation}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

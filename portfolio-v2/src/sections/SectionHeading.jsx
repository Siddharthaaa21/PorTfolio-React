import Reveal from './Reveal.jsx';
import s from './SectionHeading.module.css';

/**
 * SectionHeading — shared eyebrow + title used by Experience/Projects/Skills/Contact
 * to keep consistent vertical rhythm and type scale across sections (Tab 5).
 *
 * @param {string} index   small monospace-ish counter, e.g. '01'
 * @param {string} eyebrow short uppercase label
 * @param {string} title   the section heading text
 * @param {string} [id]    anchor id for in-page navigation
 */
export default function SectionHeading({ index, eyebrow, title, id }) {
  return (
    <Reveal as="header" className={s.head}>
      <div className={s.eyebrow}>
        {index ? <span className={s.index}>{index}</span> : null}
        <span>{eyebrow}</span>
      </div>
      <h2 id={id} className={s.title}>
        {title}
      </h2>
    </Reveal>
  );
}

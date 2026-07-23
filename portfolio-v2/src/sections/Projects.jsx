import { Panel, Chip } from '../ui';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import s from './Projects.module.css';

// Emphasise metric-like tokens (40%, 5+, 45→8 min, 80%+, 2x) inside a highlight
// line so the numbers pop, without inventing a metrics[] schema field. Splits the
// string on those tokens and wraps them; everything else renders as plain text.
// Capturing group => split() keeps the delimiters. Non-global so each token can be
// re-tested statelessly (a /g regex would carry lastIndex between calls).
const METRIC_RE =
  /(\d+(?:\.\d+)?\s*[→\-–]\s*\d+\s*[\w%]+|\d+(?:\.\d+)?\s*%\+?|\d+(?:\.\d+)?\s*[x×]|\d+\+)/;

function emphasizeMetrics(text) {
  return text.split(METRIC_RE).map((part, i) =>
    part && METRIC_RE.test(part) ? (
      <strong key={i} className={s.metric}>
        {part.replace(/\s+/g, '')}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * Projects — feature card for the flagship GenAI LLM application (Tab 5).
 * Reads data.projects[] = [{ id, name, stack[], period, summary, highlights[] }].
 *
 * @param {object} [data] profile.json-shaped object
 */
export default function Projects({ data }) {
  const items = data.projects ?? [];

  return (
    <section id="projects" className={s.section} aria-labelledby="projects-title">
      <SectionHeading index="02" eyebrow="What I've shipped" title="Projects" id="projects-title" />

      <div className={s.list}>
        {items.map((p, i) => (
          <Reveal key={p.id ?? i} delay={i * 0.06}>
            <Panel as="article" className={s.card}>
              <span className={s.featured}>Featured</span>

              <div className={s.head}>
                <h3 className={s.name}>{p.name}</h3>
                {p.period ? <span className={s.period}>{p.period}</span> : null}
              </div>

              {p.summary ? <p className={s.summary}>{p.summary}</p> : null}

              {p.stack?.length ? (
                <div className={s.stack}>
                  {p.stack.map((tech) => (
                    <Chip key={tech} tone="accent">
                      {tech}
                    </Chip>
                  ))}
                </div>
              ) : null}

              {p.highlights?.length ? (
                <ul className={s.highlights}>
                  {p.highlights.map((h, hi) => (
                    <li key={hi}>{emphasizeMetrics(h)}</li>
                  ))}
                </ul>
              ) : null}
            </Panel>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

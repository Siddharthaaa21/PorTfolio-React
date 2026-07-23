import { Panel, Chip } from '../ui';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import s from './Experience.module.css';

/**
 * Experience — work history as clean cards (Tab 5).
 * Reads data.experience[] = [{ id, company, role, period, summary, highlights[], tags[] }].
 *
 * @param {object} [data] profile.json-shaped object
 */
export default function Experience({ data }) {
  const items = data.experience ?? [];

  return (
    <section id="experience" className={s.section} aria-labelledby="experience-title">
      <SectionHeading index="01" eyebrow="Where I've worked" title="Experience" id="experience-title" />

      <div className={s.list}>
        {items.map((job, i) => (
          <Reveal key={job.id ?? i} delay={i * 0.06}>
            <Panel as="article" className={s.card}>
              <div className={s.top}>
                <div className={s.heading}>
                  <h3 className={s.role}>{job.role}</h3>
                  <p className={s.company}>{job.company}</p>
                </div>
                {job.period ? <span className={s.period}>{job.period}</span> : null}
              </div>

              {job.summary ? <p className={s.summary}>{job.summary}</p> : null}

              {job.highlights?.length ? (
                <ul className={s.highlights}>
                  {job.highlights.map((h, hi) => (
                    <li key={hi}>{h}</li>
                  ))}
                </ul>
              ) : null}

              {job.tags?.length ? (
                <div className={s.tags}>
                  {job.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              ) : null}
            </Panel>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

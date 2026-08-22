import { Chip } from '../ui';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import s from './Skills.module.css';

// Display labels + order for the skill groups. Falls back to the raw key for any
// group the schema gains later, so adding a category never silently drops it.
const GROUP_LABELS = {
  languages: 'Languages',
  genai: 'GenAI & LLMs',
  distributed: 'Distributed Systems',
  cloud: 'Cloud & DevOps',
  backend: 'Backend',
  databases: 'Databases',
};
const GROUP_ORDER = ['languages', 'genai', 'distributed', 'cloud', 'backend', 'databases'];

function labelFor(key) {
  return GROUP_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

function getSkillFactId(skill) {
  if (skill === 'RAG') return 'fact-f-rag';
  if (/AZ-900/i.test(skill)) return 'fact-f-az900';
  return undefined;
}

/**
 * Skills — grouped, scannable skill chips (Tab 5).
 * Reads data.skills = { languages[], genai[], distributed[], cloud[], backend[], databases[] }.
 * GenAI is highlighted as the headline strength.
 *
 * @param {object} [data] profile.json-shaped object
 */
export default function Skills({ data }) {
  const skills = data.skills ?? {};
  // known groups first (in order), then any unknown groups the schema may add
  const keys = [
    ...GROUP_ORDER.filter((k) => skills[k]?.length),
    ...Object.keys(skills).filter((k) => !GROUP_ORDER.includes(k) && skills[k]?.length),
  ];

  return (
    <section id="skills" className={s.section} aria-labelledby="skills-title">
      <SectionHeading index="03" eyebrow="What I work with" title="Skills" id="skills-title" />

      <div className={s.groups}>
        {keys.map((key, i) => (
          <Reveal as="div" key={key} delay={i * 0.05} className={s.group}>
            <h3 className={s.groupLabel}>{labelFor(key)}</h3>
            <div className={s.chips}>
              {skills[key].map((skill) => (
                <Chip
                  id={getSkillFactId(skill)}
                  key={skill}
                  tone={key === 'genai' ? 'accent' : 'default'}
                >
                  {skill}
                </Chip>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

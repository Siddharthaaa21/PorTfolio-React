import { Panel, Button } from '../ui';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import s from './Contact.module.css';

// Link rows are derived from identity.links; only links that are present and
// look real (not the schema's "TODO" placeholder) are rendered.
const LINK_META = {
  github: { label: 'GitHub', handle: (u) => prettify(u) },
  linkedin: { label: 'LinkedIn', handle: (u) => prettify(u) },
  portfolio: { label: 'Portfolio', handle: (u) => prettify(u) },
};
const LINK_ORDER = ['github', 'linkedin', 'portfolio'];

function isReal(url) {
  return typeof url === 'string' && url.trim() && url.trim().toUpperCase() !== 'TODO';
}
function prettify(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * Contact — email, social/portfolio links, and an availability line (Tab 5).
 * Reads data.identity.{email, links:{github,linkedin,portfolio}}.
 *
 * @param {object}     [data]  profile.json-shaped object
 * @param {() => void} [onAsk] optional — wire the closing CTA to focus the agent (Tab 6)
 */
export default function Contact({ data, onAsk }) {
  const { email, links = {} } = data.identity ?? {};
  const linkKeys = LINK_ORDER.filter((k) => isReal(links[k]));

  return (
    <section id="contact" className={s.section} aria-labelledby="contact-title">
      <SectionHeading index="04" eyebrow="Get in touch" title="Let's talk" id="contact-title" />

      <Reveal>
        <Panel className={s.card}>
          <p className={s.lede}>
            <span className={s.dot} aria-hidden="true" />
            Open to contract work — agentic AI, LLM/GenAI systems, and distributed backends.
          </p>

          <div className={s.actions}>
            {email ? (
              <a href={`mailto:${email}`} className={s.emailLink}>
                <Button variant="primary" className={s.emailBtn}>
                  {email}
                </Button>
              </a>
            ) : null}

            {onAsk ? (
              <Button variant="ghost" onClick={onAsk}>
                Ask my AI instead
              </Button>
            ) : null}
          </div>

          {linkKeys.length ? (
            <ul className={s.links}>
              {linkKeys.map((k) => (
                <li key={k}>
                  <a
                    href={links[k]}
                    className={s.link}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className={s.linkLabel}>{LINK_META[k].label}</span>
                    <span className={s.linkHandle}>{LINK_META[k].handle(links[k])}</span>
                    <span aria-hidden="true" className={s.linkArrow}>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </Reveal>
    </section>
  );
}

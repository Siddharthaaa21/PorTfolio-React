import { Button, Chip } from '../ui';
import Reveal from './Reveal.jsx';
import s from './Hero.module.css';

/**
 * Hero — the opening statement (Tab 5).
 * Big type, generous whitespace. The primary CTA focuses the agent.
 *
 * @param {object}   [data]   profile.json-shaped object; uses identity.{name,title,tagline,location}
 * @param {() => void} [onAsk] CTA handler — Tab 6 wires this to focus <AgentPanel/>'s input
 */
export default function Hero({ data, onAsk }) {
  const { name, title, tagline, location } = data.identity;

  return (
    <section id="hero" className={s.hero} aria-labelledby="hero-name">
      <Reveal as="div" className={s.inner}>
        <Reveal as="p" className={s.kicker} delay={0.05}>
          <Chip tone="accent">AI-agent concierge</Chip>
          <span className={s.avail}>● Open to contract work</span>
        </Reveal>

        <h1 id="hero-name" className={s.name}>
          {name}
        </h1>

        <p className={s.title}>{title}</p>

        <p className={s.tagline}>{tagline}</p>

        <p className={s.positioning}>
          I ship production LLM &amp; GenAI systems end-to-end — agentic orchestration,
          guardrails, and the distributed backends behind them.
          {location ? ` Based in ${location}, working remotely.` : ''}
        </p>

        <div className={s.actions}>
          <Button variant="primary" className={s.cta} onClick={onAsk}>
            Ask my AI anything
            <span aria-hidden="true" className={s.arrow}>
              →
            </span>
          </Button>
          <a className={s.scrollHint} href="#experience">
            or scroll the résumé
          </a>
        </div>
      </Reveal>
    </section>
  );
}

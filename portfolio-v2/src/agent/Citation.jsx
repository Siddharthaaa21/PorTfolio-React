import { Chip } from '../ui';
import s from './Citation.module.css';

/**
 * Citation — an inline source chip rendered from a `{type:'citation'}` event.
 *
 * Looks like `[Infosys · resume]`. The `label` is the human-readable source
 * (from profile.facts[].sourceLabel); `factId` ties back to the underlying fact
 * so a host can deep-link to it. When a `factId` is present we render the chip as
 * an anchor to `#fact-<id>` so Tab 6 can wire scroll-to-source if it chooses; the
 * `title` exposes the id on hover as a lightweight provenance affordance.
 *
 * @param {{ factId?: string, label?: string, onSelect?: (factId:string)=>void }} props
 */
export default function Citation({ factId, label, onSelect }) {
  const text = label || factId || 'source';

  const handleClick = (e) => {
    if (onSelect && factId) {
      e.preventDefault();
      onSelect(factId);
      return;
    }
    const target = document.getElementById(`fact-${factId}`);
    if (target) {
      e.preventDefault();
      try {
        window.history.pushState(null, '', `#fact-${factId}`);
      } catch {
        /* ignore sandbox history errors */
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const inner = (
    <Chip tone="accent" className={s.chip}>
      <span className={s.bracket} aria-hidden="true">
        [
      </span>
      <span className={s.text}>{text}</span>
      <span className={s.bracket} aria-hidden="true">
        ]
      </span>
    </Chip>
  );

  if (!factId) {
    return (
      <span className={s.wrap} title={text}>
        {inner}
      </span>
    );
  }

  return (
    <a
      className={s.wrap}
      href={`#fact-${factId}`}
      title={`Source: ${text}`}
      onClick={handleClick}
    >
      {inner}
    </a>
  );
}

import s from './Glow.module.css';

/**
 * Soft radial accent glow — a decorative, non-interactive backdrop accent.
 * Purely visual: pointer-events disabled so it never traps focus or clicks.
 * @param {'accent'|'accent-2'} [color]
 */
export default function Glow({ color = 'accent', className = '', style, ...rest }) {
  const cls = [s.glow, className].filter(Boolean).join(' ');
  const tint = color === 'accent-2' ? 'var(--accent-2)' : 'var(--accent)';
  return <div aria-hidden="true" className={cls} style={{ '--glow-tint': tint, ...style }} {...rest} />;
}

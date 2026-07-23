import s from './Chip.module.css';

/**
 * Small pill — used for tags, skills, and citation chips.
 * @param {'default'|'accent'} [tone]
 */
export default function Chip({ tone = 'default', className = '', children, ...rest }) {
  const cls = [s.chip, s[tone], className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}

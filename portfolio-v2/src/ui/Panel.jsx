import s from './Panel.module.css';

/**
 * Glassy surface container — the base for the agent panel and section cards.
 */
export default function Panel({ as: Tag = 'div', className = '', children, ...rest }) {
  const cls = [s.panel, className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}

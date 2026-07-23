import s from './Button.module.css';

/**
 * Token-driven button.
 * @param {'primary'|'ghost'} [variant]
 */
export default function Button({ variant = 'primary', className = '', children, ...rest }) {
  const cls = [s.btn, s[variant], className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

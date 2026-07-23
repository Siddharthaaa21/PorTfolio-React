import { useReducedMotion, motion } from 'framer-motion';

/**
 * Reveal — subtle scroll-reveal wrapper used by every section (Tab 5).
 * Fades + lifts its children into view once, then settles. Honours
 * `prefers-reduced-motion`: when set, it renders a plain element with no motion.
 *
 * Internal section helper (NOT a UI primitive). Style stays token-driven —
 * this only animates opacity/transform, no color.
 *
 * @param {React.ElementType} [as]   element/component to render (default 'div')
 * @param {number} [delay]           stagger in seconds
 * @param {number} [y]               initial vertical offset in px
 */
export default function Reveal({ as = 'div', delay = 0, y = 20, children, ...rest }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag {...rest}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

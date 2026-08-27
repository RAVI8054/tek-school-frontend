import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered fade + slide-up entrance.
 * Stagger with delay or index prop.
 */
export function Reveal({ children, delay = 0, index, className = '', as: As = 'div', y = 24 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setTimeout(() => setShown(true), 0); return; }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setShown(true); io.disconnect(); break; }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const staggerDelay = typeof index === 'number' ? Math.min(index, 7) * 90 : 0;
  const totalDelay = delay + staggerDelay;

  const style = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
    transition: `opacity var(--dur-enter) var(--ease-out-soft) ${totalDelay}ms, transform var(--dur-enter) var(--ease-out-soft) ${totalDelay}ms`,
    willChange: 'opacity, transform',
  };

  return <As ref={ref} className={className} style={style}>{children}</As>;
}

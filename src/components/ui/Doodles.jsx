/** Hand-drawn sky-blue squiggle doodles */

export function Squiggle({ className = '', color = 'var(--sky)', ...props }) {
  return (
    <svg viewBox="0 0 400 200" fill="none" className={className} {...props}>
      <path d="M10 100 C 60 20, 120 180, 180 100 S 300 20, 390 100" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Loop({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" className={className} {...props}>
      <path d="M40 150 C 40 60, 260 60, 260 150 C 260 240, 40 240, 40 150 Z M60 150 C 100 100, 220 200, 260 150" stroke="var(--sky)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Arrow({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} {...props}>
      <path d="M20 30 C 60 60, 140 40, 160 140" stroke="var(--sky)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 120 L 160 145 L 180 135" stroke="var(--sky)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Asterisk({ className = '', color = 'var(--primary)' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g fill={color}>
        <rect x="17" y="2" width="6" height="36" rx="3" />
        <rect x="17" y="2" width="6" height="36" rx="3" transform="rotate(60 20 20)" />
        <rect x="17" y="2" width="6" height="36" rx="3" transform="rotate(120 20 20)" />
      </g>
    </svg>
  );
}

export function Flower({ className = '', color = 'var(--coral)' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g fill={color}>
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cx="20" cy="8" rx="4" ry="8" transform={`rotate(${r} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="3" fill="white" />
      </g>
    </svg>
  );
}

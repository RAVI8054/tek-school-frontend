import tekschoolLogo from '../../assets/tekschool-logo.png';

export function Logo({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tek-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5BA4E8" />
          <stop offset="100%" stopColor="#2D5FA8" />
        </linearGradient>
      </defs>
      <path
        d="M20 3 C 28 12, 33 20, 33 26 A 13 13 0 1 1 7 26 C 7 20, 12 12, 20 3 Z"
        fill="url(#tek-drop)"
      />
      <circle cx="15" cy="22" r="2.2" fill="white" opacity="0.85" />
    </svg>
  );
}

export function LogoLockup({ className = 'h-9' }) {
  return (
    <img
      src={tekschoolLogo}
      alt="TekSchool"
      className={`${className} w-auto object-contain`}
    />
  );
}

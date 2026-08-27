import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

let openCount = 0;
function bump(n) {
  openCount = Math.max(0, openCount + n);
  if (typeof document === 'undefined') return;
  if (openCount > 0) document.documentElement.setAttribute('data-modal-open', 'true');
  else document.documentElement.removeAttribute('data-modal-open');
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = 'md',
  tone = 'default',
}) {
  useEffect(() => {
    if (!open) return;
    bump(1);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      bump(-1);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size];
  const toneRing = {
    default: 'border-slate-200',
    navy: 'border-[#1E1B4B]/20',
    coral: 'border-coral/40',
    lavender: 'border-lavender/50',
  }[tone];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6 motion-safe:animate-[fade-in_.15s_ease-out]"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
      />
      <div
        className={`relative w-full ${sizes} rounded-t-3xl bg-white p-6 shadow-2xl motion-safe:animate-[scale-in_.18s_ease-out] sm:rounded-3xl sm:p-7 border ${toneRing}`}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        {title && <h2 className="pr-10 font-display text-xl font-bold leading-tight sm:text-2xl">{title}</h2>}
        {children && <div className="mt-4 text-sm text-slate-600">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function PrimaryBtn({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_var(--accent-blue-deep)] hover:opacity-95"
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
      {children}
    </button>
  );
}

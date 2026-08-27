import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";

export function FormModalShell({ open, onClose, badge, title, subtitle, children, footer, maxWidth = "520px", label }) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={label ?? (typeof title === "string" ? title : "Dialog")} className="fixed inset-0 z-[110]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="absolute inset-0 grid place-items-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_40px_100px_-20px_rgba(15,42,82,0.55)] motion-safe:animate-[scale-in_.2s_ease-out]"
          style={{ maxWidth }}
        >
          <div className="relative shrink-0 px-6 pb-7 pt-6 sm:px-8" style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 55%, #1E3A8A 100%)" }}>
            <svg aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-40" viewBox="0 0 200 140" fill="none">
              <path d="M0 90 C 40 20, 80 130, 120 60 S 180 10, 210 70" stroke="white" strokeOpacity="0.5" strokeWidth="2" fill="none" />
              <circle cx="150" cy="105" r="4" fill="white" fillOpacity="0.45" />
            </svg>
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.6)]">
                <Sparkles className="h-3.5 w-3.5" /> {badge}
              </span>
            )}
            <h2 className="mt-4 pr-10 font-display text-3xl font-bold leading-tight text-white">{title}</h2>
            {subtitle && <p className="mt-2 max-w-[90%] text-sm text-white/85">{subtitle}</p>}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
          {footer && <div className="shrink-0 border-t border-slate-100 px-6 py-4 sm:px-8">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}

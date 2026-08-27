import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function Drawer({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  
  if (!open || typeof document === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/40" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl motion-safe:animate-[slide-in-right_.2s_ease-out]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="min-w-0 pr-3 font-display text-lg font-bold">{title}</div>
          <button aria-label="Close" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm">{children}</div>
        {footer && <div className="border-t border-slate-100 px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BookDemoForm } from "./BookDemoForm.jsx";
import { FormModalShell } from "./FormModalShell.jsx";

export function BookDemoDrawer({
  open,
  onClose,
  workshopTitle,
  presetProgram,
  heading,
  variant = "drawer",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const isModal = variant === "modal";

  if (isModal) {
    return (
      <FormModalShell
        open={open}
        onClose={onClose}
        badge="New cohort open"
        title={heading ?? (workshopTitle ? "Reserve your seat" : "Join TekSchool")}
        subtitle={workshopTitle ?? "Be part of India's most hands-on engineering school."}
      >
        <BookDemoForm onClose={onClose} workshopTitle={workshopTitle} presetProgram={presetProgram} heading={heading} hideHeader />
      </FormModalShell>
    );
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Join the free demo" className="fixed inset-0 z-[110]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" />
      {(
        <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl motion-safe:animate-[slide-in-right_.25s_ease-out]">
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-[#0F2A52]"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1 overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-14">
            <BookDemoForm onClose={onClose} workshopTitle={workshopTitle} presetProgram={presetProgram} heading={heading} />
          </div>
        </aside>
      )}
    </div>,
    document.body,
  );
}

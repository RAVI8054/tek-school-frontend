import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const colorClass = (c) =>
  c === "coral" ? "bg-[#FF6B6B] text-white"
    : c === "lavender" ? "bg-[#E6E6FA] text-[#0F2A52]"
    : c === "blue" ? "bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] text-white"
    : "bg-[#0F2A52] text-white";

export function MegaMenu({ label, to, active, rows, feature, variant = "icons" }) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); setFocusIdx(-1); }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => Math.min(rows.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx((i) => Math.max(0, i - 1)); }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, rows.length]);

  useEffect(() => {
    if (open && focusIdx >= 0) {
      const el = wrapRef.current?.querySelectorAll("[data-mm-row]")[focusIdx];
      el?.focus();
    }
  }, [focusIdx, open]);

  const openNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          active ? "bg-white text-[#0F2A52] shadow-sm" : "text-slate-500 hover:text-[#0F2A52]"
        }`}
      >
        {label}
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <>
          {/* hover bridge so the pointer can cross the gap */}
          <div className="absolute left-0 right-0 top-full h-3" aria-hidden />
          <div
            role="menu"
            className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] z-50 ${feature ? "w-[720px] max-w-[92vw]" : "w-[420px] max-w-[92vw]"} rounded-[1.75rem] bg-white border border-slate-200 shadow-[0_30px_60px_-20px_rgba(30,27,75,0.35)] p-4`}
            style={{ animation: "mm-in 160ms ease-out both" }}
          >

            <div className={`grid gap-4 ${feature ? "grid-cols-[1fr_260px]" : "grid-cols-1"}`}>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase hover:text-[#0F2A52]"
                  >
                    All {label}  →
                  </Link>
                </li>
                {rows.map((r, i) => (
                  <li key={r.to + i}>
                    {r.divider && (
                      <div className="my-2 border-t border-slate-200/70" aria-hidden />
                    )}
                    <Link
                      to={r.to}
                      data-mm-row
                      onClick={() => setOpen(false)}
                      className="group flex items-start gap-3 rounded-2xl px-3 py-2.5 hover:bg-slate-50 focus:bg-slate-50 outline-none"
                    >
                      {variant === "thumbs" && r.thumb ? (
                        <span className="shrink-0 h-11 w-11 rounded-xl overflow-hidden bg-slate-100">
                          <img src={r.thumb} alt="" className="h-full w-full object-cover" />
                        </span>
                      ) : (
                        <span className={`shrink-0 grid place-items-center h-10 w-10 rounded-full ${colorClass(r.color)}`}>
                          {r.icon}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display font-bold text-[15px] leading-tight text-[#0F2A52]">{r.title}</span>
                          {r.tag && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 text-[10px] py-0.5 px-2">{r.tag}</span>
                          )}
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5 line-clamp-1">{r.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {feature && (
                <Link
                  to={feature.to}
                  onClick={() => setOpen(false)}
                  className="relative overflow-hidden rounded-2xl bg-[#0F2A52] text-white group"
                >
                  <img
                    src={feature.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A52] via-[#0F2A52]/60 to-transparent" />
                  <div className="relative p-4 flex h-full min-h-[220px] flex-col justify-end">
                    <p className="text-[11px] font-bold tracking-wider uppercase opacity-80">{feature.eyebrow}</p>
                    <p className="font-display font-bold text-xl leading-tight mt-1">{feature.title}</p>
                    <span className="inline-flex items-center rounded-full mt-3 self-start bg-white text-[#0F2A52] text-xs font-semibold px-3 py-1">Explore →</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes mm-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

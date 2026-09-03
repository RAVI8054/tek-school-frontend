import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, MapPin, Users, Check, ArrowLeft, Sparkles } from "lucide-react";
import { BookDemoForm } from "../BookDemoForm.jsx";

const trackPill = (t) =>
  t === "AI"
    ? "bg-[color:var(--coral)] text-[color:var(--coral-foreground)]"
    : t === "Cloud"
      ? "bg-[color:var(--lavender)] text-[color:var(--lavender-foreground)]"
      : t === "Career"
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-foreground";

export function WorkshopDrawer({ workshop, showForm, onShowForm, onClose }) {
  useEffect(() => {
    if (!workshop) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [workshop, onClose]);

  if (!workshop || typeof document === "undefined") return null;
  const w = workshop;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={w.title} className="fixed inset-0 z-[110]">
      <button aria-label="Close" onClick={onClose} className="tek-overlay-in absolute inset-0 bg-slate-900/55 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-hidden bg-white shadow-2xl motion-safe:animate-[slide-in-right_.32s_var(--ease-out-soft)]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-500 backdrop-blur transition-colors hover:bg-white hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="flex h-full flex-1 items-stretch transition-transform duration-500 [transition-timing-function:var(--ease-out-soft)]"
          style={{ transform: showForm ? "translateX(-100%)" : "translateX(0)" }}
        >
          {/* Pane 1 — full details */}
          <div className="h-full w-full shrink-0 overflow-y-auto" aria-hidden={showForm}>
            <div className="relative h-48">
              <img src={w.image} alt={w.title} className="h-full w-full object-cover" />
              <span className={`absolute left-5 top-5 pill-tag text-[10px] ${trackPill(w.track)}`}>{w.track}</span>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="font-display text-3xl font-bold leading-tight">{w.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.blurb}</p>

              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {w.date}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {w.time} · {w.duration}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {w.format}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> {w.seatsLeft}/{w.seats} open</span>
              </div>

              <Section title="What this workshop is about">
                <p className="text-sm leading-relaxed text-muted-foreground">{w.about}</p>
              </Section>

              <Section title="How the session runs">
                <ol className="space-y-3.5">
                  {w.agenda.map((a) => (
                    <li key={a.time} className="flex gap-4 text-sm">
                      <span className="w-12 shrink-0 font-mono text-xs font-semibold text-[color:var(--accent-blue-deep)]">{a.time}</span>
                      <span className="text-muted-foreground">{a.label}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title="Your mentor">
                <div className="rounded-2xl bg-muted p-5">
                  <div className="flex items-center gap-4">
                    <img src={w.hostPhoto} alt={w.host} className="h-14 w-14 rounded-full object-cover" />
                    <div>
                      <p className="font-display text-lg font-bold leading-tight">{w.host}</p>
                      <p className="text-xs text-muted-foreground">{w.hostRole}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{w.hostBio}</p>
                  <ul className="mt-4 space-y-2">
                    {w.hostCreds.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--accent-blue-deep)]" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              <Section title="What you'll take away">
                <ul className="space-y-3">
                  {w.takeaways.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {t}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Who it's for">
                <ul className="space-y-3">
                  {w.forWho.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--coral)]" /> {t}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="What to bring">
                <p className="text-sm leading-relaxed text-muted-foreground">{w.prereqs}</p>
              </Section>

              <div className="mt-10 pb-4">
                <p className="text-center text-xs text-muted-foreground">{w.seatsLeft} of {w.seats} seats still open</p>
              </div>
            </div>
          </div>

          {/* Pane 2 — booking form */}
          <div className="h-full w-full shrink-0 overflow-y-auto" aria-hidden={!showForm}>
            <div className="p-6 pt-14 sm:p-8 sm:pt-14">
              <button
                onClick={() => onShowForm(false)}
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to details
              </button>
              <BookDemoForm workshopTitle={w.title} onClose={onClose} />
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-9">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

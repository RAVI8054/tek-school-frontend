import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Users, Loader2 } from "lucide-react";
import { FormModalShell } from "./FormModalShell.jsx";

const NAVY = "#0F2A52";
const PROGRAMS = ["AI Engineering", "Software Engineering", "Cloud Engineering", "Future Engineering"];
const TIMES = ["10:00 am", "1:00 pm", "4:00 pm"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+971", "+65"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const fieldCls = "w-full rounded-[10px] bg-[#F3F4F6] p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30";
const labelCls = "mb-1.5 block text-xs font-medium text-[#6B7280]";

function Req() {
  return <span className="text-red-500"> *</span>;
}

export function BookDemoModal({ open, onClose, workshopTitle, presetProgram, heading, variant = "modal" }) {
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
    </div>,
    document.body
  );
}



function BookDemoForm({ onClose, workshopTitle, presetProgram, heading, hideHeader = false }) {
  const [program, setProgram] = useState(presetProgram ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [month, setMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [formError, setFormError] = useState(null);

  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email.trim());
  const todayStart = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const slot = date && time ? `${date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · ${time}` : "";
  const complete = useMemo(() => !!program && name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 6 && !!slot, [program, name, email, phone, slot]);

  async function onSubmit(e) {
    e.preventDefault();
    setTouchedEmail(true);
    setFormError(null);
    if (!complete) {
      setFormError("Please complete every required field and pick a demo slot.");
      return;
    }
    setSubmitting(true);
    try {
      // Mock submit
      await new Promise(r => setTimeout(r, 1000));
      setDone(slot);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0F2A52] text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-[#0F2A52]">You're booked</h2>
        <p className="mt-2 text-sm text-[#6B7280]">Confirmation sent for {done}.</p>
        {onClose && (
          <button type="button" onClick={onClose} className="mt-8 w-full rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90">
            Done
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {!hideHeader && (
        <div className="text-center">
          <h2 className="font-display text-2xl font-medium" style={{ color: NAVY }}>
            {heading ?? (workshopTitle ? "Reserve your seat" : "Join the free demo")}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">{workshopTitle ?? "Code, Create, Innovate!"}</p>
        </div>
      )}

      <div>
        <label htmlFor="bd-program" className={labelCls}>Program<Req /></label>
        <select id="bd-program" required value={program} onChange={(e) => setProgram(e.target.value)} className={fieldCls}>
          <option value="">Select a program</option>
          {(presetProgram && !PROGRAMS.includes(presetProgram) ? [presetProgram, ...PROGRAMS] : PROGRAMS).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bd-name" className={labelCls}>Name<Req /></label>
        <input id="bd-name" required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} placeholder="Aarav Sharma" />
      </div>

      <div>
        <label htmlFor="bd-email" className={labelCls}>Email<Req /></label>
        <input id="bd-email" type="email" required maxLength={255} autoComplete="email" value={email} onBlur={() => setTouchedEmail(true)} onChange={(e) => setEmail(e.target.value)} aria-invalid={emailInvalid} className={fieldCls} placeholder="aarav@example.com" />
        {(emailInvalid || (touchedEmail && !email)) && (
          <p id="bd-email-err" className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
        )}
      </div>

      <div>
        <label htmlFor="bd-phone" className={labelCls}>Phone number<Req /></label>
        <div className="grid grid-cols-[6rem_1fr] gap-2">
          <select aria-label="Country code" value={code} onChange={(e) => setCode(e.target.value)} className={fieldCls}>
            {COUNTRY_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input id="bd-phone" required inputMode="tel" maxLength={20} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))} className={`${fieldCls} min-w-0`} placeholder="98765 43210" />
        </div>
      </div>

      <fieldset>
        <legend className={labelCls}>Pick a demo slot<Req /></legend>
        <div className="rounded-[12px] bg-[#F3F4F6] p-3">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))} className="grid h-7 w-7 place-items-center rounded-full text-[#0F2A52] hover:bg-white">‹</button>
            <p className="text-xs font-semibold text-[#0F2A52]">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
            <button type="button" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))} className="grid h-7 w-7 place-items-center rounded-full text-[#0F2A52] hover:bg-white">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#9CA3AF]">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
              const past = d < todayStart;
              const active = !!date && d.toDateString() === date.toDateString();
              return (
                <button key={i} type="button" disabled={past} onClick={() => setDate(d)} className={`h-8 rounded-full text-xs font-semibold transition-colors ${active ? "bg-[#0F2A52] text-white" : past ? "text-[#D1D5DB]" : "text-[#0F2A52] hover:bg-white"}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TIMES.map((t) => {
            const active = time === t;
            return (
              <button key={t} type="button" disabled={!date} onClick={() => setTime(t)} className={`rounded-full px-2 py-2 text-xs font-semibold transition-colors disabled:opacity-40 ${active ? "bg-[#0F2A52] text-white" : "bg-[#F3F4F6] text-[#0F2A52] hover:bg-[#E5E7EB]"}`}>
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center gap-2 rounded-[10px] bg-amber-100 px-3 py-2 text-xs font-medium text-amber-900">
        <Users className="h-4 w-4 shrink-0" aria-hidden />
        Only 4 seats left in the next cohort
      </div>

      {formError && <p role="alert" className="text-xs text-red-600">{formError}</p>}

      <button type="submit" disabled={!complete || submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90 disabled:cursor-not-allowed disabled:opacity-50">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}

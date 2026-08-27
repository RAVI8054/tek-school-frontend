import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Users, Loader2 } from "lucide-react";

const NAVY = "#0F2A52";

const PROGRAMS = ["AI Engineering", "Software Engineering", "Cloud Engineering", "Future Engineering"];
const TIMES = ["10:00 am", "1:00 pm", "4:00 pm"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+971", "+65"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const fieldCls =
  "w-full rounded-[10px] bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30";
const labelCls = "mb-1.5 block text-xs font-medium text-slate-500";

function Req() {
  return <span className="text-[#FF6B6B]"> *</span>;
}

export function BookDemoForm({
  onClose,
  workshopTitle,
  presetProgram,
  heading,
  hideHeader = false,
}) {
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
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const next = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) {
      const v = p.get(k);
      if (v) next[k] = v.slice(0, 120);
    }
    setTimeout(() => setUtm(next), 0);
  }, []);

  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email.trim());
  const todayStart = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const slot =
    date && time
      ? `${date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · ${time}`
      : "";
  const complete = useMemo(
    () =>
      !!program &&
      name.trim().length >= 2 &&
      EMAIL_RE.test(email.trim()) &&
      phone.trim().length >= 6 &&
      !!slot,
    [program, name, email, phone, slot],
  );

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
      await new Promise(resolve => setTimeout(resolve, 800));
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
        <p className="mt-2 text-sm text-slate-500">Confirmation sent for {done}.</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-8 w-full rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white"
          >
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
          <p className="mt-1 text-sm text-slate-500">{workshopTitle ?? "Code, Create, Innovate!"}</p>
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
        <input
          id="bd-email"
          type="email"
          required
          maxLength={255}
          autoComplete="email"
          value={email}
          onBlur={() => setTouchedEmail(true)}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailInvalid}
          aria-describedby={emailInvalid ? "bd-email-err" : undefined}
          className={fieldCls}
          placeholder="aarav@example.com"
        />
        {(emailInvalid || (touchedEmail && !email)) && (
          <p id="bd-email-err" className="mt-1 text-xs text-[#FF6B6B]">Enter a valid email address.</p>
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
        <div className="rounded-[12px] bg-slate-100 p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="grid h-7 w-7 place-items-center rounded-full text-[#0F2A52] hover:bg-white"
            >
              ‹
            </button>
            <p className="text-xs font-semibold text-[#0F2A52]">
              {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="grid h-7 w-7 place-items-center rounded-full text-[#0F2A52] hover:bg-white"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
              const past = d < todayStart;
              const active = !!date && d.toDateString() === date.toDateString();
              return (
                <button
                  key={i}
                  type="button"
                  disabled={past}
                  aria-pressed={active}
                  onClick={() => setDate(d)}
                  className={`h-8 rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? "bg-[#0F2A52] text-white"
                      : past
                        ? "text-slate-300"
                        : "text-[#0F2A52] hover:bg-white"
                  }`}
                >
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
              <button
                key={t}
                type="button"
                disabled={!date}
                aria-pressed={active}
                onClick={() => setTime(t)}
                className={`rounded-full px-2 py-2 text-xs font-semibold transition-colors disabled:opacity-40 ${
                  active ? "bg-[#0F2A52] text-white" : "bg-slate-100 text-[#0F2A52] hover:bg-slate-200"
                }`}
              >
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

      {formError && <p role="alert" className="text-xs text-[#FF6B6B]">{formError}</p>}

      <button
        type="submit"
        disabled={!complete || submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}

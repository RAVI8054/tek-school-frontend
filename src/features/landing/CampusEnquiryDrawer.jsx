import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Loader2, Building2 } from "lucide-react";

const TYPES = ["College / University", "School", "Polytechnic / ITI", "Training centre"];
const PROGRAMS = ["Tek Campus at college", "Tek Campus at school", "Campus internships", "Not sure yet"];
const WINDOWS = ["This semester", "Next semester", "Next academic year", "Exploring"];
const SIZES = ["Under 50", "50–150", "150–400", "400+"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const fieldCls =
  "w-full rounded-[10px] border-0 bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none focus:ring-2 focus:ring-[#0F2A52]/30";
const labelCls = "mb-1.5 block text-xs font-medium text-slate-500";

function Req() {
  return <span className="text-[#FF6B6B]"> *</span>;
}

export function CampusEnquiryDrawer({ open, onClose }) {
  const [institution, setInstitution] = useState("");
  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [students, setStudents] = useState("");
  const [program, setProgram] = useState("");
  const [startWindow, setStartWindow] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

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

  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email.trim());
  const complete = useMemo(
    () =>
      institution.trim().length >= 2 &&
      !!type &&
      contact.trim().length >= 2 &&
      EMAIL_RE.test(email.trim()) &&
      phone.trim().length >= 6 &&
      !!program,
    [institution, type, contact, email, phone, program],
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!complete) {
      setError("Please complete every required field.");
      return;
    }
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Bring Tek Campus to us" className="fixed inset-0 z-[110]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl motion-safe:animate-[slide-in-right_.3s_var(--ease-out-soft)]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0F2A52]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-14">
          {done ? (
            <div className="py-14 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0F2A52] text-white">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-[#0F2A52]">Enquiry received</h2>
              <p className="mt-2 text-sm text-slate-500">
                Our campus team will reach out to {institution.trim()} within two working days.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 w-full rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div className="text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-slate-100">
                  <Building2 className="h-5 w-5 text-[#1D4ED8]" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold text-[#0F2A52]">Bring Tek Campus to us</h2>
                <p className="mt-1 text-sm text-slate-500">Tell us about your institution — we'll design a cohort around your calendar.</p>
              </div>

              <div>
                <label htmlFor="ce-inst" className={labelCls}>Institution name<Req /></label>
                <input id="ce-inst" required maxLength={140} value={institution} onChange={(e) => setInstitution(e.target.value)} className={fieldCls} placeholder="RV College of Engineering" />
              </div>

              <div>
                <label htmlFor="ce-type" className={labelCls}>Institution type<Req /></label>
                <select id="ce-type" required value={type} onChange={(e) => setType(e.target.value)} className={fieldCls}>
                  <option value="">Select a type</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ce-name" className={labelCls}>Your name<Req /></label>
                  <input id="ce-name" required maxLength={100} autoComplete="name" value={contact} onChange={(e) => setContact(e.target.value)} className={fieldCls} placeholder="Aarav Sharma" />
                </div>
                <div>
                  <label htmlFor="ce-role" className={labelCls}>Your role</label>
                  <input id="ce-role" maxLength={100} value={role} onChange={(e) => setRole(e.target.value)} className={fieldCls} placeholder="HOD, CSE" />
                </div>
              </div>

              <div>
                <label htmlFor="ce-email" className={labelCls}>Work email<Req /></label>
                <input
                  id="ce-email"
                  type="email"
                  required
                  maxLength={255}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={emailInvalid}
                  aria-describedby={emailInvalid ? "ce-email-err" : undefined}
                  className={fieldCls}
                  placeholder="aarav@college.edu"
                />
                {emailInvalid && <p id="ce-email-err" className="mt-1 text-xs text-[#FF6B6B]">Enter a valid email address.</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ce-phone" className={labelCls}>Phone<Req /></label>
                  <input id="ce-phone" required inputMode="tel" maxLength={20} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))} className={fieldCls} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label htmlFor="ce-city" className={labelCls}>City</label>
                  <input id="ce-city" maxLength={100} value={city} onChange={(e) => setCity(e.target.value)} className={fieldCls} placeholder="Bengaluru" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ce-students" className={labelCls}>Students to enrol</label>
                  <select id="ce-students" value={students} onChange={(e) => setStudents(e.target.value)} className={fieldCls}>
                    <option value="">Select a size</option>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ce-window" className={labelCls}>Preferred start</label>
                  <select id="ce-window" value={startWindow} onChange={(e) => setStartWindow(e.target.value)} className={fieldCls}>
                    <option value="">Select a window</option>
                    {WINDOWS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className={labelCls}>Program interest<Req /></legend>
                <div className="grid grid-cols-2 gap-2">
                  {PROGRAMS.map((p) => {
                    const active = program === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setProgram(p)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                          active ? "bg-[#0F2A52] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="ce-msg" className={labelCls}>Anything else?</label>
                <textarea id="ce-msg" maxLength={1000} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={`${fieldCls} resize-none`} placeholder="Lab capacity, semester calendar, goals…" />
              </div>

              {error && <p role="alert" className="text-xs text-[#FF6B6B]">{error}</p>}

              <button
                type="submit"
                disabled={!complete || submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Sending…" : "Send enquiry"}
              </button>
              <p className="text-center text-xs text-slate-500">We reply within two working days.</p>
            </form>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}

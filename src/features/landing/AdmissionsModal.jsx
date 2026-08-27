import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { FormModalShell } from "./FormModalShell.jsx";

const NAVY = "#0F2A52";
const PROGRAMS = ["AI Engineering", "Software Engineering", "Cloud Engineering", "Future Engineering"];
const TIMES = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const fieldCls =
  "w-full rounded-[12px] bg-[#F3F4F6] p-3.5 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#1D4ED8]/30";
const labelCls = "mb-1.5 block text-xs font-semibold text-[#6B7280]";

export function AdmissionsModal({ open, onClose }) {
  const [program, setProgram] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("");
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
    () => !!program && !!when && name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 6,
    [program, when, name, email, phone],
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
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModalShell
      open={open}
      onClose={onClose}
      badge="Admissions open"
      title="Talk to admissions"
      subtitle="Admissions aren't a form on a website — they're a conversation. Tell us where you are and we'll pair you with the right track, cohort and scholarship."
      maxWidth="760px"
      label="Talk to admissions"
      footer={
        done ? undefined : (
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={onClose} className="text-sm font-medium text-[#6B7280] hover:text-[#0F2A52]">
              Maybe later
            </button>
            <button
              type="submit"
              form="admissions-form"
              disabled={!complete || submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F2A52] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Sending…" : "Request a callback"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        )
      }
    >
      {done ? (
        <div className="py-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0F2A52] text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold" style={{ color: NAVY }}>
            We&apos;ll call you back
          </h3>
          <p className="mt-2 text-sm text-[#6B7280]">An admissions counsellor will reach out in the {when.toLowerCase()}.</p>
          <button type="button" onClick={onClose} className="mt-8 rounded-full bg-[#0F2A52] px-8 py-3 text-sm font-semibold text-white">
            Done
          </button>
        </div>
      ) : (
        <form id="admissions-form" onSubmit={onSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="ad-program" className={labelCls}>Program of interest *</label>
            <select id="ad-program" value={program} onChange={(e) => setProgram(e.target.value)} className={fieldCls}>
              <option value="">Select a program</option>
              {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ad-name" className={labelCls}>Name *</label>
              <input id="ad-name" maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} placeholder="Aarav Sharma" />
            </div>
            <div>
              <label htmlFor="ad-email" className={labelCls}>Email *</label>
              <input
                id="ad-email"
                type="email"
                maxLength={255}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldCls}
                placeholder="aarav@example.com"
              />
              {emailInvalid && <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>}
            </div>
          </div>

          <div>
            <label htmlFor="ad-phone" className={labelCls}>Phone number *</label>
            <input id="ad-phone" inputMode="tel" maxLength={20} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))} className={fieldCls} placeholder="+91 98765 43210" />
          </div>

          <fieldset>
            <legend className={labelCls}>Best time to call *</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {TIMES.map((t) => {
                const active = when === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setWhen(t)}
                    className={`rounded-[12px] px-3 py-3 text-xs font-semibold transition-colors ${
                      active ? "bg-[#0F2A52] text-white" : "bg-[#F3F4F6] text-[#0F2A52] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </form>
      )}
    </FormModalShell>
  );
}

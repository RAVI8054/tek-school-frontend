import { useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FormModalShell } from "./FormModalShell.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const fieldCls =
  "w-full rounded-[12px] border border-slate-200 bg-slate-50 p-3 text-sm text-[#0F2A52] outline-none transition-colors focus:border-[#2563EB]/40 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-slate-500";

function Req() {
  return <span className="text-[#FF6B6B]"> *</span>;
}

export function LeadModal({
  open,
  onClose,
  badge,
  title,
  subtitle,
  _interest,
  _institutionType = "General enquiry",
  cta = "Submit request",
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email.trim());
  const complete = useMemo(
    () =>
      name.trim().length >= 2 &&
      EMAIL_RE.test(email.trim()) &&
      phone.trim().length >= 6 &&
      location.trim().length >= 2,
    [name, email, phone, location],
  );

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      setError(null);
    }, 250);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!complete) {
      setError("Please complete every field.");
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
    <FormModalShell open={open} onClose={close} badge={badge} title={title} subtitle={subtitle} maxWidth="480px">
      {done ? (
        <div className="py-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0F2A52] text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold">Request received</h3>
          <p className="mt-2 text-sm text-slate-500">
            Thanks {name.trim().split(" ")[0]} — our team will reach out within two working days.
          </p>
          <button
            type="button"
            onClick={close}
            className="mt-7 w-full rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="lm-name" className={labelCls}>Name<Req /></label>
            <input id="lm-name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} placeholder="Your full name" />
          </div>
          <div>
            <label htmlFor="lm-email" className={labelCls}>Email<Req /></label>
            <input id="lm-email" type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} placeholder="you@example.com" />
            {emailInvalid && <p className="mt-1 text-xs text-[#FF6B6B]">Enter a valid email address.</p>}
          </div>
          <div>
            <label htmlFor="lm-phone" className={labelCls}>Phone number<Req /></label>
            <input id="lm-phone" type="tel" required maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldCls} placeholder="+91 98xxx xxxxx" />
          </div>
          <div>
            <label htmlFor="lm-loc" className={labelCls}>Location<Req /></label>
            <input id="lm-loc" required maxLength={100} value={location} onChange={(e) => setLocation(e.target.value)} className={fieldCls} placeholder="City / institution" />
          </div>

          {error && <p className="text-xs font-medium text-[#FF6B6B]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : cta}
          </button>
          <p className="text-center text-[11px] text-slate-500">We'll only use these details to contact you about this request.</p>
        </form>
      )}
    </FormModalShell>
  );
}

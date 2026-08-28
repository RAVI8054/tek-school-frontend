import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { FormModalShell } from "./FormModalShell.jsx";
import { createEnquiry } from "../../lib/api.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const fieldCls = (hasError) =>
  `w-full rounded-[12px] border bg-slate-50 p-3 text-sm text-[#0F2A52] outline-none transition-colors focus:bg-white focus:ring-2 ${
    hasError 
      ? "border-[#FF6B6B] focus:border-[#FF6B6B]/40 focus:ring-[#FF6B6B]/20" 
      : "border-slate-200 focus:border-[#2563EB]/40 focus:ring-[#2563EB]/20"
  }`;
const labelCls = "mb-1.5 block text-xs font-semibold text-slate-500";

function Req() {
  return <span className="text-[#FF6B6B]"> *</span>;
}

const ErrorText = ({ error, id }) => 
  error ? (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#FF6B6B]">
      <AlertCircle className="h-3 w-3" /> {error}
    </p>
  ) : null;

const INITIAL_STATE = {
  name: "",
  email: "",
  phone: "",
  location: "",
  education: "",
  institutionName: "",
};

export function LeadModal({
  open,
  onClose,
  badge,
  title,
  subtitle,
  _interest,
  _institutionType = "General enquiry",
  cta = "Submit request",
  inquiryType,
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState(null);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      setApiError(null);
      setErrors({});
      setFormData(INITIAL_STATE);
    }, 250);
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters.";
    if (!EMAIL_RE.test(formData.email.trim())) newErrors.email = "Please enter a valid email address.";
    if (formData.phone.trim().length < 6) newErrors.phone = "Please enter a valid phone number.";

    if (inquiryType) {
      if (formData.education.trim().length < 2) newErrors.education = "Education is required.";
      if (formData.institutionName.trim().length < 2) {
        newErrors.institutionName = inquiryType === 'school' ? "School name is required." : "Institution name is required.";
      }
    } else {
      if (formData.location.trim().length < 2) newErrors.location = "Location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e) {
    e.preventDefault();
    setApiError(null);
    
    if (!validate()) return;
    
    setSubmitting(true);
    abortControllerRef.current = new AbortController();
    
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (inquiryType) {
        payload.inquiry_type = inquiryType;
        payload.education = formData.education.trim();
        if (inquiryType === 'school') {
          payload.school_name = formData.institutionName.trim();
        } else {
          payload.institution_name = formData.institutionName.trim();
        }
      } else {
        payload.location = formData.location.trim();
        payload.interest = _interest;
      }

      await createEnquiry(payload, { signal: abortControllerRef.current.signal });
      setDone(true);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const instLabel = inquiryType === 'school' ? 'School name' : 'Institution name';

  return (
    <FormModalShell open={open} onClose={close} badge={badge} title={title} subtitle={subtitle} maxWidth="480px">
      {done ? (
        <div className="py-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0F2A52] text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold">Request received</h3>
          <p className="mt-2 text-sm text-slate-500">
            Thanks {formData.name.trim().split(" ")[0]} — our team will reach out within two working days.
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
            <input 
              id="lm-name" 
              name="name"
              required 
              maxLength={100} 
              value={formData.name} 
              onChange={handleChange} 
              className={fieldCls(errors.name)} 
              placeholder="Your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <ErrorText error={errors.name} id="name-error" />
          </div>
          <div>
            <label htmlFor="lm-email" className={labelCls}>Email<Req /></label>
            <input 
              id="lm-email" 
              name="email"
              type="email" 
              required 
              maxLength={255} 
              value={formData.email} 
              onChange={handleChange} 
              className={fieldCls(errors.email)} 
              placeholder="you@example.com" 
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <ErrorText error={errors.email} id="email-error" />
          </div>
          <div>
            <label htmlFor="lm-phone" className={labelCls}>Phone number<Req /></label>
            <input 
              id="lm-phone" 
              name="phone"
              type="tel" 
              required 
              maxLength={30} 
              value={formData.phone} 
              onChange={handleChange} 
              className={fieldCls(errors.phone)} 
              placeholder="+91 98xxx xxxxx" 
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            <ErrorText error={errors.phone} id="phone-error" />
          </div>
          
          {inquiryType ? (
            <>
              <div>
                <label htmlFor="lm-edu" className={labelCls}>Education<Req /></label>
                <input 
                  id="lm-edu" 
                  name="education"
                  required 
                  maxLength={150} 
                  value={formData.education} 
                  onChange={handleChange} 
                  className={fieldCls(errors.education)} 
                  placeholder="e.g. Bachelors in Computer Science" 
                  aria-invalid={!!errors.education}
                  aria-describedby={errors.education ? "edu-error" : undefined}
                />
                <ErrorText error={errors.education} id="edu-error" />
              </div>
              <div>
                <label htmlFor="lm-inst" className={labelCls}>{instLabel}<Req /></label>
                <input 
                  id="lm-inst" 
                  name="institutionName"
                  required 
                  maxLength={150} 
                  value={formData.institutionName} 
                  onChange={handleChange} 
                  className={fieldCls(errors.institutionName)} 
                  placeholder={instLabel} 
                  aria-invalid={!!errors.institutionName}
                  aria-describedby={errors.institutionName ? "inst-error" : undefined}
                />
                <ErrorText error={errors.institutionName} id="inst-error" />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="lm-loc" className={labelCls}>Location<Req /></label>
              <input 
                id="lm-loc" 
                name="location"
                required 
                maxLength={100} 
                value={formData.location} 
                onChange={handleChange} 
                className={fieldCls(errors.location)} 
                placeholder="City / institution" 
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? "loc-error" : undefined}
              />
              <ErrorText error={errors.location} id="loc-error" />
            </div>
          )}

          {apiError && (
            <div className="rounded-xl bg-[#FF6B6B]/10 p-4 text-sm font-medium text-[#FF6B6B] flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {apiError}
            </div>
          )}

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

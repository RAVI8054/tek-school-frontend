import { useEffect, useMemo, useState } from "react";
import { Brain, Code2, Cloud, Rocket, CheckCircle2, Loader2, Download } from "lucide-react";
import { FormModalShell } from "./FormModalShell.jsx";

const NAVY = "#0F2A52";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const TRACKS = [
  { title: "AI Engineering", blurb: "RAG, agents, evals & MLOps", icon: Brain },
  { title: "Software Engineering", blurb: "Full-stack product engineering", icon: Code2 },
  { title: "Cloud Engineering", blurb: "AWS, Kubernetes & DevOps", icon: Cloud },
  { title: "Future Engineering", blurb: "Ages 6–15 · school programme", icon: Rocket },
];

const STARTS = ["As soon as possible", "In 1–2 months", "Just exploring"];

const fieldCls =
  "w-full rounded-[12px] bg-[#F3F4F6] p-3.5 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#1D4ED8]/30";
const labelCls = "mb-1.5 block text-xs font-semibold text-[#6B7280]";

export function CatalogModal({ open, onClose }) {
  const [track, setTrack] = useState("");
  const [start, setStart] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    () => !!track && !!start && name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 6,
    [track, start, name, email, phone],
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
      badge="Catalog 2026"
      title="Explore our courses"
      subtitle="Pick the track you're curious about and we'll send the full curriculum — module map, projects, mentors, fees and cohort dates."
      maxWidth="760px"
      label="Explore courses"
      footer={
        done ? undefined : (
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={onClose} className="text-sm font-medium text-[#6B7280] hover:text-[#0F2A52]">
              Maybe later
            </button>
            <button
              type="submit"
              form="catalog-form"
              disabled={!complete || submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F2A52] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {submitting ? "Sending…" : "Send me the curriculum"}
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
            Curriculum on its way
          </h3>
          <p className="mt-2 text-sm text-[#6B7280]">
            The {track} curriculum pack is headed to {email.trim()}.
          </p>
          <button type="button" onClick={onClose} className="mt-8 rounded-full bg-[#0F2A52] px-8 py-3 text-sm font-semibold text-white">
            Done
          </button>
        </div>
      ) : (
        <form id="catalog-form" onSubmit={onSubmit} noValidate className="space-y-5">
          <fieldset>
            <legend className={labelCls}>Which course? *</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {TRACKS.map((t) => {
                const active = track === t.title;
                return (
                  <button
                    key={t.title}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTrack(t.title)}
                    className={`flex items-start gap-3 rounded-[14px] p-3.5 text-left transition-colors ${
                      active ? "bg-[#0F2A52] text-white" : "bg-[#F3F4F6] text-[#0F2A52] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${
                        active ? "bg-white/15 text-white" : "bg-white text-[#1D4ED8]"
                      }`}
                    >
                      <t.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{t.title}</span>
                      <span className={`block text-xs ${active ? "text-white/75" : "text-[#6B7280]"}`}>{t.blurb}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cat-name" className={labelCls}>Name *</label>
              <input id="cat-name" maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} placeholder="Aarav Sharma" />
            </div>
            <div>
              <label htmlFor="cat-email" className={labelCls}>Email *</label>
              <input
                id="cat-email"
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
            <label htmlFor="cat-phone" className={labelCls}>Phone number *</label>
            <input
              id="cat-phone"
              inputMode="tel"
              maxLength={20}
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
              className={fieldCls}
              placeholder="+91 98765 43210"
            />
          </div>

          <fieldset>
            <legend className={labelCls}>When would you start? *</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {STARTS.map((s) => {
                const active = start === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStart(s)}
                    className={`rounded-[12px] px-3 py-3 text-xs font-semibold transition-colors ${
                      active ? "bg-[#0F2A52] text-white" : "bg-[#F3F4F6] text-[#0F2A52] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    {s}
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

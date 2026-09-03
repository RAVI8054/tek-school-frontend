import { useEffect } from "react";
import { X, Building2, MapPin, Sparkles, Briefcase, CheckCircle2, Users, Send } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { pushToast } from "../../../../lib/action-bus";
import { useStudentPlacementsStore } from "../../../../store/useStudentPlacementsStore.js";
function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-slate-500"><Icon className="h-4 w-4 text-[var(--accent-blue-deep)]" /> {title}</h3>
      {children}
    </div>
  );
}

export function JobDrawer({ job, onClose }) {
  const { applyForJob } = useStudentPlacementsStore();
  
  useEffect(() => {
    if (!job) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end motion-safe:animate-[fade-in_.2s_ease-out]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl motion-safe:animate-[slide-in-right_.3s_ease-out]">
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-br from-[#F5F0FF] via-white to-[#EAF2FF] p-6 border-b border-border">
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-white"><X className="h-4 w-4" /></button>
          <div className="flex items-start gap-4">
            <CompanyLogo domain={job.logoDomain} name={job.company} />
            <div className="min-w-0 flex-1 pr-8">
              <span className="inline-flex items-center rounded-full bg-accent-blue/12 px-3 py-1 text-[11px] font-bold text-[var(--accent-blue-deep)] ring-1 ring-[var(--accent-blue-deep)]/15">Matches {job.matchTrack}</span>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight">{job.role}</h2>
              <p className="text-sm font-semibold flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {job.company}</p>
              
              {job.skills && job.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                {job.salary && <span>· {job.salary}</span>}
                <span>· Posted {job.postedDays}d ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {job.about &&
            <Section title="About the role" icon={Sparkles}>
              <p className="text-sm leading-relaxed text-slate-600">{job.about}</p>
            </Section>
          }
          {job.responsibilities &&
            <Section title="What you'll do" icon={Briefcase}>
              <ul className="space-y-2">
                {job.responsibilities.map((r) => <li key={r} className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-blue-deep)]" /> {r}</li>)}
              </ul>
            </Section>
          }
          {job.requirements &&
            <Section title="What we're looking for" icon={Users}>
              <ul className="space-y-2">
                {job.requirements.map((r) => <li key={r} className="flex items-start gap-2 text-sm text-slate-600"><div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" /> {r}</li>)}
              </ul>
            </Section>
          }
          {job.benefits &&
            <Section title="Benefits" icon={CheckCircle2}>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b) => <span key={b} className="rounded-full bg-lavender/40 px-3 py-1.5 text-xs font-semibold text-[var(--lavender-foreground)]">{b}</span>)}
              </div>
            </Section>
          }
          <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Placement team tip</p>
            <p className="mt-1">The {job.company} team looks for candidates who can talk through a project they shipped. Have one ready to walk through in 3 minutes.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-white p-4 flex items-center justify-between gap-2">
          <button onClick={() => { pushToast(`Saved ${job.company} for later`); }} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">Save</button>
          <button
            onClick={() => {
              applyForJob(job._id, job.company);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_var(--accent-blue-deep)]">
            <Send className="h-4 w-4" /> Apply now
          </button>
        </div>
      </aside>
    </div>
  );
}

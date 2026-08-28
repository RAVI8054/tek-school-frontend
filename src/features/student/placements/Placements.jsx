import { useMemo, useState, useEffect } from "react";
import { JOBS, APPLICATIONS, EVENTS, formatDate } from "../../../lib/dashboard-data";
import { openAction, pushToast } from "../../../lib/action-bus";
import { Briefcase, Calendar, CheckCircle2, Circle, Target, FileCheck, Video, MapPin, X, Building2, Send, Sparkles, Users } from "lucide-react";


export default PlacementsPage;

const READINESS = [
{ label: "Resume reviewed", done: true },
{ label: "Portfolio live", done: true },
{ label: "Mock interviews (target: 3)", done: false, progress: "2/3" },
{ label: "Applications sent (target: 10)", done: false, progress: "6/10" }];


const STAGES = ["Applied", "Screening", "Interview", "Offer"];

function PlacementsPage() {
  const readinessScore = useMemo(() => Math.round(READINESS.filter((r) => r.done).length / READINESS.length * 100), []);
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#2B4FC7] to-[#4338CA] p-8 md:p-10 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#F4A261]/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="pill-tag -rotate-2 bg-white/15 text-white backdrop-blur"><Briefcase className="h-3 w-3" /> Placement cell</span>
            <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight">Get hired, not just certified.</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">Your placement readiness, roles matched to your track, and every application in one place.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
              { k: "Readiness", v: `${readinessScore}%` },
              { k: "Open roles", v: String(JOBS.length) },
              { k: "Active applications", v: String(APPLICATIONS.length) }].
              map((s) =>
              <div key={s.k} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="font-display text-xl font-bold leading-none">{s.v}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-white/70">{s.k}</p>
                </div>
              )}
            </div>
          </div>
          <div className="relative grid h-28 w-28 place-items-center justify-self-start md:justify-self-end">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray={`${readinessScore}, 100`} strokeLinecap="round" />
            </svg>
            <span className="font-display text-xl font-bold">{readinessScore}%</span>
          </div>
        </div>
      </section>


      {/* Readiness */}
      <section className="rounded-3xl border border-border bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="pill-tag -rotate-2 bg-lavender/50"><Target className="h-3 w-3" /> Readiness tracker</span>
            <h2 className="mt-2 font-display text-xl font-bold">You're {readinessScore}% placement-ready</h2>
            <p className="text-xs text-muted-foreground">Complete the checklist below before the March recruiter meet.</p>
          </div>
          <div className="relative grid h-24 w-24 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-muted)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-accent-blue-deep)" strokeWidth="3" strokeDasharray={`${readinessScore}, 100`} strokeLinecap="round" />
            </svg>
            <span className="font-display text-xl font-bold">{readinessScore}%</span>
          </div>
        </div>
        <ul className="mt-5 grid gap-2 md:grid-cols-2">
          {READINESS.map((r, i) =>
          <li key={i} className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm">
              {r.done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-blue-deep" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
              <span className={r.done ? "line-through opacity-60" : ""}>{r.label}</span>
              {r.progress && <span className="ml-auto text-xs font-semibold text-muted-foreground">{r.progress}</span>}
            </li>
          )}
        </ul>
      </section>

      {/* Opportunities */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Opportunities for you</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {JOBS.map((j) =>
          <div key={j.id} className="group relative rounded-3xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start gap-4">
                <CompanyLogo domain={j.logoDomain} name={j.company} />
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-full bg-accent-blue/12 px-3 py-1 text-[11px] font-bold text-[var(--accent-blue-deep)] ring-1 ring-[var(--accent-blue-deep)]/15">Matches {j.matchTrack}</span>
                  <h3 className="mt-1.5 font-display text-lg font-bold leading-snug">{j.role}</h3>
                  <p className="text-sm font-semibold">{j.company}{j.team && <span className="ml-1 text-xs font-normal text-muted-foreground">· {j.team}</span>}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {j.location}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="text-xs text-muted-foreground">{j.salary} · {j.postedDays}d ago</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedJob(j)} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-slate-50">View</button>
                  <button onClick={() => openAction({ kind: "apply-job", role: j.role, company: j.company, location: j.location, salary: j.salary })} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Apply now</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pipeline */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Your pipeline</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {STAGES.map((stage) => {
            const apps = APPLICATIONS.filter((a) => a.stage === stage);
            const tone = stage === "Offer" ? "bg-lavender/50" : stage === "Interview" ? "bg-accent-blue/20" : "bg-muted";
            return (
              <div key={stage} className={`rounded-3xl p-4 ${tone}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider">{stage}</span>
                  <span className="text-xs font-bold">{apps.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {apps.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
                  {apps.map((a) =>
                  <button key={a.id} onClick={() => openAction({ kind: "view-application", role: a.role, company: a.company, stage: a.stage })} className="w-full rounded-2xl bg-white p-3 text-left text-xs hover:ring-2 hover:ring-[var(--accent-blue-deep)]/40">
                      <p className="font-semibold">{a.company}</p>
                      <p className="text-muted-foreground">{a.role}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{a.lastUpdate}</p>
                    </button>
                  )}
                </div>
              </div>);

          })}
        </div>
      </section>

      {/* Events */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Upcoming placement events</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {EVENTS.map((e) => {
            const Icon = e.kind === "Mock interview" ? Video : e.kind === "Recruiter meet" ? Briefcase : e.kind === "Resume clinic" ? FileCheck : Calendar;
            return (
              <div key={e.id} className="flex items-center gap-4 rounded-3xl border border-border bg-white p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lavender/50"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{e.kind}</p>
                  <p className="font-semibold leading-tight">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                </div>
                <button onClick={() => openAction({ kind: "rsvp-event", title: e.title, kind_: e.kind, when: formatDate(e.date) })} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold">RSVP</button>
              </div>);

          })}
        </div>
      </section>

      <JobDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>);

}

function CompanyLogo({ domain, name }) {
  const [broken, setBroken] = useState(false);
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (broken) {
    return <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent-blue-deep)] to-[var(--accent-blue)] text-sm font-bold text-white">{initials}</div>;
  }
  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-white p-2 overflow-hidden">
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={`${name} logo`}
        onError={() => setBroken(true)}
        className="h-full w-full object-contain" />
      
    </div>);

}

function JobDrawer({ job, onClose }) {
  useEffect(() => {
    if (!job) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {window.removeEventListener("keydown", onKey);document.body.style.overflow = prev;};
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
              <p className="text-sm font-semibold flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {job.company}{job.team && <span className="text-xs font-normal text-muted-foreground">· {job.team}</span>}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                {job.salary && <span>· {job.salary}</span>}
                {job.seniority && <span>· {job.seniority}</span>}
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
                {job.requirements.map((r) => <li key={r} className="flex items-start gap-2 text-sm text-slate-600"><Circle className="mt-1.5 h-1.5 w-1.5 shrink-0 fill-current" /> {r}</li>)}
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
          <button onClick={() => {pushToast(`Saved ${job.company} for later`);}} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">Save</button>
          <button
            onClick={() => {onClose();openAction({ kind: "apply-job", role: job.role, company: job.company, location: job.location, salary: job.salary });}}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_var(--accent-blue-deep)]">
            
            <Send className="h-4 w-4" /> Apply now
          </button>
        </div>
      </aside>
    </div>);

}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-slate-500"><Icon className="h-4 w-4 text-[var(--accent-blue-deep)]" /> {title}</h3>
      {children}
    </div>);

}
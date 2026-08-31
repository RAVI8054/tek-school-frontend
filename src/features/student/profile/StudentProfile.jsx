
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHydrated } from "../../../lib/auth";
import { GAMIFICATION, BADGES, QUESTS, LEADERBOARD, ACTIVITY } from "../../../lib/dashboard-data";
import { getStudentProfile } from "../../../lib/api";
import { pushToast } from "../../../lib/action-bus";
import { Avatar } from "../../../components/Avatar";
import { Mail, MapPin, Pencil, Phone, Sparkles, Brain, Rocket, Target, Medal, Award, Lock, Trophy, Flame, Zap, ChevronRight, TrendingUp, Star, Download, FileText } from "lucide-react";


export default ProfilePage;





function ProfilePage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    cohort: "",
    location: "",
    bio: "",
    profile_img: ""
  });


  useEffect(() => {
    if (!hydrated) return;
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile();
        if (res.data?.profile) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, [hydrated]);

  const initials = profile.name ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "TS";

  const [tab, setTab] = useState("resume");

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#4C3BCF] to-[#5BA4E8] p-6 text-white md:p-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#F4A261]/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/15 font-display text-3xl font-bold text-white ring-2 ring-white/40 backdrop-blur overflow-hidden">
                {profile.profile_img ? <img src={profile.profile_img} alt={profile.name} className="h-full w-full object-cover" /> : initials}
              </div>
              <span className="absolute -bottom-2 -right-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#4C3BCF] shadow">
                LVL {GAMIFICATION.level}
              </span>
            </div>
            <div className="min-w-0">
              <span className="pill-tag -rotate-2 bg-white/15 text-white backdrop-blur"><Sparkles className="h-3 w-3" /> {profile.cohort}</span>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">{profile.name}</h1>
              <p className="mt-1 max-w-lg text-sm text-white/80">{profile.bio}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/75">
                <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:flex-col">
            <button
              onClick={() => downloadResume(profile)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#4C3BCF] hover:bg-white/90">
              
              <Download className="h-4 w-4" /> Download résumé
            </button>
            <button
              onClick={() => navigate("/dashboard/profile/edit")}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/25">
              
              <Pencil className="h-4 w-4" /> Edit profile
            </button>
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
          ["Level", `${GAMIFICATION.level}`, Zap],
          ["XP", GAMIFICATION.xp.toLocaleString(), Star],
          ["Streak", `${GAMIFICATION.streak}d`, Flame],
          ["Weekly rank", `#${GAMIFICATION.weeklyRank}`, TrendingUp]].
          map(([label, value, Icon]) =>
          <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <Icon className="h-4 w-4 text-white/70" />
              <p className="mt-2 font-display text-2xl font-bold leading-none">{value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-white/70">{label}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="relative mt-7 inline-flex rounded-full bg-white/10 p-1 backdrop-blur">
          {[["resume", "Résumé", FileText], ["achievements", "Achievements", Trophy]].map(([key, label, Icon]) =>
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${tab === key ? "bg-white text-[#4C3BCF] shadow-sm" : "text-white/75 hover:text-white"}`}>
            
              <Icon className="h-4 w-4" /> {label}
            </button>
          )}
        </div>

      </section>

      {tab === "resume" ? <ResumeDocument profile={profile} /> : <AchievementsSection />}
    </div>);

}


const SKILLS = [
{ name: "Python", level: 88 },
{ name: "PyTorch", level: 72 },
{ name: "SQL & Data modelling", level: 80 },
{ name: "React / TypeScript", level: 65 },
{ name: "MLOps & Docker", level: 54 }];


const PROJECTS = [
{ title: "Resume ranker with RAG", stack: "Python · LangChain · FAISS", status: "Shipped", note: "Mentor score 9.1/10" },
{ title: "Churn prediction service", stack: "scikit-learn · FastAPI", status: "Shipped", note: "Deployed on Render" },
{ title: "Vision quality inspector", stack: "PyTorch · OpenCV", status: "In progress", note: "Capstone · week 3/6" }];


const CERTIFICATES = [
{ title: "Python for AI Engineering", issued: "Jan 2026" },
{ title: "Applied Machine Learning", issued: "Feb 2026" },
{ title: "Cloud Foundations", issued: "Locked · finish Module 9" }];


const MODULES = [
{ name: "Foundations", pct: 100 },
{ name: "Machine learning", pct: 100 },
{ name: "Deep learning", pct: 62 },
{ name: "Deployment & MLOps", pct: 18 }];


const EXPERIENCE = [
{ role: "AI Engineering Trainee", org: "TekSchool · Capstone track", period: "2026 — present", points: ["Built and shipped 3 production-style AI projects reviewed by industry mentors.", "Weekly 1:1 mentorship with a senior ML engineer; mentor score 9.1/10."] },
{ role: "Open-source contributor", org: "Community projects", period: "2025 — present", points: ["Contributed fixes and docs to Python data tooling repositories."] }];


function ResumeDocument({ profile }) {
  return (
    <section className="overflow-hidden dash-card shadow-sm">
      <div className="px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
        {/* Resume header */}
        <header className="border-b-2 border-slate-900 pb-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">{profile.name}</h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue-deep)]">{profile.cohort}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Left column */}
          <div className="space-y-8">
            <ResumeSection title="Summary">
              <p className="text-base leading-relaxed text-slate-700">{profile.bio}</p>
            </ResumeSection>

            <ResumeSection title="Experience">
              <div className="space-y-5">
                {EXPERIENCE.map((e) =>
                <div key={e.role}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-lg font-bold text-slate-900">{e.role}</p>
                      <span className="text-xs font-semibold text-slate-500">{e.period}</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--accent-blue-deep)]">{e.org}</p>
                    <ul className="mt-2 space-y-1.5">
                      {e.points.map((p) =>
                    <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-blue-deep)]" />{p}
                        </li>
                    )}
                    </ul>
                  </div>
                )}
              </div>
            </ResumeSection>

            <ResumeSection title="Projects">
              <div className="grid items-stretch gap-4 sm:grid-cols-2">
                {PROJECTS.map((p) =>
                <div key={p.title} className="flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-base font-bold text-slate-900">{p.title}</p>
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 shadow-sm">{p.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{p.stack}</p>
                    <p className="mt-auto pt-2 text-xs font-medium text-slate-500">{p.note}</p>
                  </div>
                )}
              </div>
            </ResumeSection>

            <ResumeSection title="Education & programme progress">
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULES.map((m) =>
                <div key={m.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="font-semibold text-slate-700">{m.name}</span>
                    <span className="text-xs font-bold text-slate-500">{m.pct}%</span>
                  </div>
                )}
              </div>
            </ResumeSection>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <ResumeSection title="Skills">
              <div className="flex flex-wrap gap-2.5">
                {SKILLS.map((s) =>
                <span key={s.name} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-semibold text-slate-700">
                    {s.name} <span className="text-slate-400">· {s.level}%</span>
                  </span>
                )}
              </div>
            </ResumeSection>

            <ResumeSection title="Certifications">
              <ul className="space-y-3">
                {CERTIFICATES.map((c) =>
                <li key={c.title} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="font-semibold text-slate-800">{c.title}</span>
                    <span className="shrink-0 text-xs font-semibold text-slate-500">{c.issued}</span>
                  </li>
                )}
              </ul>
            </ResumeSection>

            <ResumeSection title="References">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Ananya Rao</p>
                <p className="text-sm text-slate-600">Senior ML Engineer, lead mentor at TekSchool.</p>
              </div>
            </ResumeSection>
          </div>
        </div>
      </div>
    </section>);

}

function ResumeSection({ title, children }) {
  return (
    <div className="mt-7">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{title}</h3>
      {children}
    </div>);

}

function esc(v) {
  return v.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
}

function downloadResume(profile) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(profile.name)} — Résumé</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;margin:0;padding:48px;max-width:820px}
  h1{font-size:34px;margin:0;letter-spacing:-.5px}
  .role{color:#4C3BCF;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin:6px 0 10px}
  .meta{font-size:12px;color:#475569}
  header{border-bottom:2px solid #0f172a;padding-bottom:16px}
  h2{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#94a3b8;margin:28px 0 10px}
  .item{margin-bottom:14px}
  .row{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
  .t{font-weight:700;font-size:15px}
  .s{font-size:12px;color:#64748b}
  .org{font-size:12px;color:#4C3BCF;font-weight:600}
  ul{margin:6px 0 0;padding-left:18px}
  li{font-size:13px;line-height:1.6;color:#334155}
  .chips span{display:inline-block;border:1px solid #e2e8f0;background:#f8fafc;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:600;margin:0 6px 6px 0}
  p{font-size:13px;line-height:1.65;color:#334155}
  @media print{body{padding:24px}}
</style></head><body>
<header><h1>${esc(profile.name)}</h1><div class="role">${esc(profile.cohort)}</div>
<div class="meta">${esc(profile.email)} · ${esc(profile.phone)} · ${esc(profile.location)}</div></header>
<h2>Summary</h2><p>${esc(profile.bio)}</p>
<h2>Skills</h2><div class="chips">${SKILLS.map((s) => `<span>${esc(s.name)} · ${s.level}%</span>`).join("")}</div>
<h2>Experience</h2>${EXPERIENCE.map((e) => `<div class="item"><div class="row"><span class="t">${esc(e.role)}</span><span class="s">${esc(e.period)}</span></div><div class="org">${esc(e.org)}</div><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}
<h2>Projects</h2>${PROJECTS.map((p) => `<div class="item"><div class="row"><span class="t">${esc(p.title)}</span><span class="s">${esc(p.status)}</span></div><p>${esc(p.stack)} · ${esc(p.note)}</p></div>`).join("")}
<h2>Education & programme progress</h2><ul>${MODULES.map((m) => `<li>${esc(m.name)} — ${m.pct}% complete</li>`).join("")}</ul>
<h2>Certifications</h2><ul>${CERTIFICATES.map((c) => `<li>${esc(c.title)} — ${esc(c.issued)}</li>`).join("")}</ul>
<h2>References</h2><p><strong>Ananya Rao</strong> — Senior ML Engineer, lead mentor at TekSchool.</p>
</body></html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.name.replace(/\s+/g, "-").toLowerCase()}-resume.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }
  pushToast("Résumé downloaded — print dialog opened to save as PDF");
}




// Removed EditProfileModal

const ICONS = { trophy: Trophy, flame: Flame, zap: Zap, target: Target, rocket: Rocket, brain: Brain, medal: Medal, sparkles: Sparkles };
const RARITY_TONES = {
  common: { ring: "ring-slate-200", bg: "bg-slate-50", label: "text-slate-500" },
  rare: { ring: "ring-[var(--accent-blue-deep)]/40", bg: "bg-accent-blue/10", label: "text-[var(--accent-blue-deep)]" },
  epic: { ring: "ring-[var(--lavender-foreground)]/40", bg: "bg-lavender/40", label: "text-[var(--lavender-foreground)]" },
  legendary: { ring: "ring-amber-400", bg: "bg-gradient-to-br from-amber-100 to-orange-100", label: "text-amber-700" }
};

function AchievementsSection() {
  const g = GAMIFICATION;
  const pct = Math.round(g.xp / g.xpForNext * 100);
  const earned = BADGES.filter((b) => b.earned);
  const locked = BADGES.filter((b) => !b.earned);

  return (
    <section id="achievements" className="space-y-8 scroll-mt-28">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-[var(--accent-blue-deep)]" />
        <div>
          <h2 className="font-display text-2xl font-bold">Achievements</h2>
          <p className="text-sm text-muted-foreground">Track your progress, quests, badges, and cohort rank.</p>
        </div>
      </div>

      {/* Level card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2D5FA8] to-[#5BA4E8] p-6 text-white md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">Season 1 · Spring 2026</span>
            <h3 className="mt-3 font-display text-4xl font-bold">Level {g.level}</h3>
            <p className="text-sm text-white/70">{g.xp.toLocaleString()} / {g.xpForNext.toLocaleString()} XP — {g.xpForNext - g.xp} XP to Level {g.level + 1}</p>
            <div className="mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-[#F4A261] to-[#F4CE7A]" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
              <MiniStat label="Badges" value={`${earned.length}/${g.totalBadges}`} />
              <MiniStat label="Streak" value={`${g.streak}d`} />
              <MiniStat label="Weekly rank" value={`#${g.weeklyRank}`} />
            </div>
          </div>
          <div className="grid h-40 w-40 place-items-center rounded-3xl bg-white/10 backdrop-blur">
            <div className="text-center">
              <Trophy className="mx-auto h-16 w-16 text-[#F4CE7A]" strokeWidth={1.5} />
              <p className="mt-2 font-display text-xl font-bold">Lv {g.level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly quests */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold">Weekly quests</h3>
            <p className="text-xs text-muted-foreground">Reset every Monday. Complete all four for a +250 XP bonus.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/20 px-2.5 py-1 text-[11px] font-bold text-[var(--accent-blue-deep)]">{QUESTS.filter((q) => q.progress >= q.total).length}/{QUESTS.length} done</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {QUESTS.map((q) => {
            const done = q.progress >= q.total;
            const questPct = Math.min(100, q.progress / q.total * 100);
            return (
              <div key={q.id} className={`rounded-3xl border p-5 ${done ? "border-[var(--accent-blue-deep)]/40 bg-accent-blue/5" : "border-border bg-white"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold leading-snug">{q.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{q.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-lavender/50 px-2.5 py-1 text-[10px] font-bold text-[var(--lavender-foreground)]">+{q.xp} XP</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)]" style={{ width: `${questPct}%` }} />
                  </div>
                  <span className="shrink-0 text-xs font-bold tabular-nums text-slate-500">{q.progress}/{q.total}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{q.expires}</span>
                  <button onClick={() => pushToast(done ? "Already claimed" : "Keep going — you're close!")} className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--accent-blue-deep)]">
                    {done ? "Claimed" : "View"} <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>);

          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold">Badges</h3>
            <p className="text-xs text-muted-foreground">{earned.length} earned · {locked.length} to unlock</p>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[...earned, ...locked].map((b) => {
            const Icon = ICONS[b.icon];
            const t = RARITY_TONES[b.rarity];
            return (
              <button
                key={b.id}
                onClick={() => pushToast(b.earned ? `${b.name} — earned ${b.earnedOn}` : `Locked: ${b.desc}`)}
                className={`group relative rounded-3xl border border-border bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md ${!b.earned ? "opacity-60" : ""}`}>
                
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ring-2 ${t.ring} ${t.bg}`}>
                  {b.earned ? <Icon className={`h-6 w-6 ${t.label}`} /> : <Lock className="h-5 w-5 text-slate-400" />}
                </div>
                <p className="mt-3 font-display text-sm font-bold">{b.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">{b.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${t.label}`}>{b.rarity}</span>
                  <span className="text-[10px] font-bold text-slate-500">+{b.xp} XP</span>
                </div>
              </button>);

          })}
        </div>
      </div>

      {/* Leaderboard + Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold"><TrendingUp className="h-4 w-4 text-[var(--accent-blue-deep)]" /> Weekly leaderboard</h3>
            <span className="text-xs text-muted-foreground">Cohort · Mar 2026</span>
          </div>
          <ol className="mt-4 space-y-2">
            {LEADERBOARD.map((r) =>
            <li key={r.rank} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${r.isYou ? "bg-gradient-to-r from-[var(--accent-blue-deep)]/10 to-transparent ring-1 ring-[var(--accent-blue-deep)]/30" : ""}`}>
                <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${r.rank === 1 ? "bg-amber-100 text-amber-700" : r.rank === 2 ? "bg-slate-200" : r.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-500"}`}>
                  {r.rank <= 3 ? <Trophy className="h-4 w-4" /> : r.rank}
                </span>
                <Avatar name={r.name} initials={r.initials} photo={r.photo} size={32} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${r.isYou ? "font-bold" : "font-semibold"}`}>{r.name}{r.isYou && <span className="ml-2 rounded-full bg-[var(--accent-blue-deep)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">You</span>}</p>
                </div>
                <span className="tabular-nums text-sm font-bold text-slate-600">{r.xp.toLocaleString()}</span>
              </li>
            )}
          </ol>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Award className="h-4 w-4 text-[var(--accent-blue-deep)]" /> Recent activity</h3>
          <ul className="mt-4 space-y-3">
            {ACTIVITY.map((a) => {
              const icon = a.type === "badge" ? Medal : a.type === "kudos" ? Star : a.type === "streak" ? Flame : a.type === "rank" ? TrendingUp : Zap;
              const Icon = icon;
              return (
                <li key={a.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lavender/40 text-[var(--lavender-foreground)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{a.when}</p>
                  </div>
                </li>);

            })}
          </ul>
        </div>
      </div>
    </section>);

}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</p>
    </div>);

}

import { useState } from "react";
import { TekGuru } from "../../../components/dashboard/TekGuru";
import { TestRunner } from "../../../components/dashboard/TestRunner";
import { CodeRunner } from "../../../components/dashboard/CodeRunner";
import { useSession } from "../../../lib/auth";
import { Sparkles, Dumbbell, FileCheck2, Clock, Play, Check, Gauge, TrendingUp, Target, BookOpen, Code2, Trophy, Flame, Terminal } from "lucide-react";


export default LearningPage;










const DEFAULT_PRACTICE = {
  id: "practice-lab",
  title: "Daily coding lab",
  meta: "Practice",
  duration: "Unlimited",
  mode: "practice"
};

const ASSESSMENTS = [
{ id: "a1", title: "Module 1 test — Python foundations", meta: "Module 1", duration: "60 min", status: "done", score: "91%" },
{ id: "a2", title: "Module 2 test — Statistics for ML", meta: "Module 2", duration: "60 min", status: "done", score: "78%" },
{ id: "a3", title: "Module 3 test — Supervised learning", meta: "Module 3", duration: "75 min", status: "in-progress" },
{ id: "a4", title: "Module 4 test — Deep learning basics", meta: "Module 4", duration: "75 min", status: "not-started" },
{ id: "a5", title: "Capstone assessment", meta: "Final evaluation", duration: "120 min", status: "not-started" }];


const MODULES = [
{
  id: "m1",
  name: "Python foundations",
  lessonsDone: 12,
  lessons: 12,
  score: 91,
  strengths: ["Data structures", "Functions & scope"],
  improve: ["Comprehension chaining", "Error handling edge cases"]
},
{
  id: "m2",
  name: "Statistics for ML",
  lessonsDone: 10,
  lessons: 10,
  score: 78,
  strengths: ["Descriptive stats", "Distributions"],
  improve: ["Hypothesis testing", "Confidence intervals", "Bayes reasoning"]
},
{
  id: "m3",
  name: "Supervised learning",
  lessonsDone: 6,
  lessons: 11,
  score: null,
  strengths: [],
  improve: []
},
{
  id: "m4",
  name: "Deep learning basics",
  lessonsDone: 0,
  lessons: 14,
  score: null,
  strengths: [],
  improve: []
}];


const PRACTICE_STATS = {
  totalProblems: 86,
  solvedProblems: 54,
  successRate: 78,
  streakDays: 6,
  languages: [
  { name: "Python", solved: 32, color: "bg-sky-500" },
  { name: "SQL", solved: 12, color: "bg-amber-500" },
  { name: "JavaScript", solved: 10, color: "bg-violet-500" }],

  weakTopics: ["Recursion", "Dynamic programming", "Joins & subqueries"],
  recent: [
  { id: "p1", title: "Two-sum variant", status: "solved", language: "Python", difficulty: "Easy" },
  { id: "p2", title: "Balanced brackets", status: "solved", language: "Python", difficulty: "Medium" },
  { id: "p3", title: "Longest increasing subsequence", status: "attempted", language: "Python", difficulty: "Hard" },
  { id: "p4", title: "Customer churn query", status: "solved", language: "SQL", difficulty: "Medium" }]

};

const WEEKLY_ACTIVITY = [
{ day: "Mon", minutes: 65 },
{ day: "Tue", minutes: 40 },
{ day: "Wed", minutes: 95 },
{ day: "Thu", minutes: 25 },
{ day: "Fri", minutes: 80 },
{ day: "Sat", minutes: 120 },
{ day: "Sun", minutes: 35 }];


const TIME_STATS = {
  thisWeekMins: 460,
  lastWeekMins: 385,
  totalHours: 68,
  avgSessionMins: 42,
  attendance: 92,
  cohortRank: 7,
  cohortSize: 48
};

const SKILLS = [
{ name: "Python", level: 88 },
{ name: "Statistics", level: 74 },
{ name: "Machine learning", level: 61 },
{ name: "SQL", level: 79 },
{ name: "Problem solving", level: 70 }];


const UPCOMING = [
{ id: "u1", title: "Module 3 test — Supervised learning", due: "Due in 2 days", type: "Assessment" },
{ id: "u2", title: "Assignment: Regression report", due: "Due in 4 days", type: "Assignment" },
{ id: "u3", title: "Live class — Neural nets intro", due: "Tomorrow, 6:00 pm", type: "Live class" }];


const RECENT_SCORES = [
{ id: "s1", title: "Module 2 test", score: 78, date: "12 Aug", delta: -13 },
{ id: "s2", title: "Practice quiz — Distributions", score: 84, date: "08 Aug", delta: +6 },
{ id: "s3", title: "Module 1 test", score: 91, date: "29 Jul", delta: +9 }];



const TABS = [
{ key: "overview", label: "Overview", icon: Gauge },
{ key: "tek-guru", label: "Tek Guru", icon: Sparkles },
{ key: "practice", label: "Practice", icon: Dumbbell },
{ key: "assessment", label: "Assessment", icon: FileCheck2 }];


function LearningPage() {
  const session = useSession();
  const [tab, setTab] = useState("overview");
  const [active, setActive] = useState(null);


  function launch(it) {
    setActive({
      id: it.id,
      title: it.title,
      meta: it.meta,
      duration: it.duration,
      mode: "assessment",
      // Resuming an in-progress test drops the student back in the middle
      startAt: it.status === "in-progress" ? 15 : 0
    });
  }


  if (active) {
    return (
      <div className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col bg-[#F6F7FB] lg:left-28">
        <TestRunner test={active} onExit={() => setActive(null)} className="h-full" />
      </div>);

  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-20 flex flex-col bg-[#F6F7FB] lg:left-28">
      {/* Mobile horizontal tabs — stuck to top, flush left */}
      <div className="no-scrollbar flex shrink-0 overflow-x-auto border-b border-slate-200 bg-white py-2 pl-0 pr-2 lg:hidden">
        {TABS.map((t) =>
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors first:ml-0 ${
          tab === t.key ? "bg-[var(--accent-blue-deep)] text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`
          }>
          
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        )}
      </div>

      {/* Desktop vertical tabs — fixed flush to left edge of viewport */}
      <div className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-28 flex-col bg-white shadow-[2px_0_12px_-4px_rgba(15,23,42,0.08)] lg:flex">
        {TABS.map((t) =>
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`group relative flex flex-1 flex-col items-center justify-center gap-2 border-b border-slate-100 px-3 text-[11px] font-bold uppercase tracking-wide transition-all last:border-b-0 ${
          tab === t.key ?
          "bg-[var(--accent-blue-deep)] text-white" :
          "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`
          }>
          
            <t.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${tab === t.key ? "text-white" : ""}`} />
            <span className="text-center leading-tight">{t.label}</span>
          </button>
        )}
      </div>

      {/* Content — fills remaining fixed viewport area */}
      <div className="flex-1 overflow-hidden">
        {tab === "overview" &&
        <OverviewPanel
          name={session?.name.split(" ")[0]}
          onGoAssessment={() => setTab("assessment")}
          onGoPractice={() => setTab("practice")} />

        }
        {tab === "tek-guru" &&

        <TekGuru studentName={session?.name.split(" ")[0]} className="h-full rounded-none border-0 shadow-none" />
        }
        {tab === "practice" && <CodeRunner test={DEFAULT_PRACTICE} onExit={() => {}} className="h-full" />}
        {tab === "assessment" && <AssessmentList onLaunch={launch} className="h-full" />}
      </div>
    </div>);

}

function AssessmentList({ onLaunch, className }) {
  
  return (
    <div className={`flex h-full flex-col gap-5 overflow-hidden p-4 lg:p-6 ${className ?? ""}`}>
      <div className="grid shrink-0 gap-4 sm:grid-cols-3">
        <StatTile label="Avg score" value="85" unit="%" tone="from-violet-500 to-indigo-500" />
        <StatTile label="This week" value="1" unit="h 35m" tone="from-sky-500 to-cyan-500" />
        <StatTile label="Streak" value="4" unit="days" tone="from-amber-500 to-orange-500" />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden dash-card">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200 px-6 py-4 text-sm text-slate-500 sm:grid-cols-[minmax(0,1fr)_140px_120px_150px]">
          <span>Assessment</span>
          <span className="hidden sm:block">Module</span>
          <span className="hidden sm:block">Duration</span>
          <span className="text-right sm:text-left">Status</span>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {ASSESSMENTS.map((it) => {
            const done = it.status === "done";
            const active = it.status === "in-progress";
            return (
              <li
                key={it.id}
                className={`grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_140px_120px_150px] ${
                active ? "bg-sky-50" : "hover:bg-slate-50/60"}`
                }>
                
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                    done ? "bg-emerald-100 text-emerald-600" : active ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-400"}`
                    }>
                    
                    {done ? <Check className="h-5 w-5" /> : <Play className="h-4 w-4 fill-current" />}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-bold text-slate-900">{it.title.split(" — ")[0]}</h3>
                    <p className="mt-0.5 truncate text-sm text-slate-500">{it.title.split(" — ")[1] ?? it.meta}</p>
                    <p className="mt-0.5 text-xs text-slate-400 sm:hidden">{it.duration}</p>
                  </div>
                </div>
                <span className="hidden text-sm text-slate-600 sm:block">{it.meta}</span>
                <span className="hidden items-center gap-1.5 text-sm text-slate-500 sm:flex">
                  <Clock className="h-4 w-4" />
                  {it.duration}
                </span>
                <div className="flex items-center justify-end sm:justify-start">
                  {done ?
                  <span className="text-base font-semibold text-emerald-600">{it.score}</span> :
                  active ?
                  <button
                    onClick={() => onLaunch(it)}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700">
                    
                      Resume <Play className="h-3.5 w-3.5 fill-current" />
                    </button> :

                  <button
                    onClick={() => onLaunch(it)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    
                      Start <Play className="h-3.5 w-3.5 fill-current" />
                    </button>
                  }
                </div>
              </li>);

          })}
        </ul>
      </div>
    </div>);

}

function StatTile({ label, value, unit, tone }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br p-5 text-white ${tone}`}>
      <p className="text-sm font-semibold text-white/75">{label}</p>
      <p className="mt-1 font-display">
        <span className="text-3xl font-extrabold">{value}</span>
        <span className="text-base font-bold">{unit}</span>
      </p>
    </div>);

}

function OverviewPanel({ name, onGoAssessment, onGoPractice }) {
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons, 0);
  const doneLessons = MODULES.reduce((s, m) => s + m.lessonsDone, 0);
  const learningPct = Math.round(doneLessons / totalLessons * 100);

  const scored = MODULES.filter((m) => m.score !== null);
  const assessDone = ASSESSMENTS.filter((a) => a.status === "done").length;
  const assessPct = Math.round(assessDone / ASSESSMENTS.length * 100);
  const avg = scored.length ? Math.round(scored.reduce((s, m) => s + m.score, 0) / scored.length) : 0;

  const practicePct = Math.round(PRACTICE_STATS.solvedProblems / PRACTICE_STATS.totalProblems * 100);
  const focus = Array.from(new Set([...scored.flatMap((m) => m.improve), ...PRACTICE_STATS.weakTopics]));

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--accent-blue-deep)] via-violet-600 to-indigo-600 p-6 text-white shadow-lg lg:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Learning overview</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold lg:text-3xl">
            {name ? `${name}, you're ${learningPct}% through the course` : `You're ${learningPct}% through the course`}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {doneLessons} of {totalLessons} lessons complete · {assessDone} of {ASSESSMENTS.length} assessments submitted · {PRACTICE_STATS.solvedProblems} coding problems solved
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Ring label="Learning" pct={learningPct} sub={`${doneLessons}/${totalLessons} lessons`} />
            <Ring label="Assessment" pct={assessPct} sub={`${assessDone}/${ASSESSMENTS.length} tests`} />
            <Ring label="Avg score" pct={avg} sub={`${scored.length} modules graded`} />
            <Ring label="Practice" pct={practicePct} sub={`${PRACTICE_STATS.solvedProblems}/${PRACTICE_STATS.totalProblems} solved`} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat label="Total learning time" value={`${TIME_STATS.totalHours}h`} sub="since enrolment" />
          <MiniStat label="Avg session" value={`${TIME_STATS.avgSessionMins}m`} sub="per study session" />
          <MiniStat label="Class attendance" value={`${TIME_STATS.attendance}%`} sub="live sessions joined" />
          <MiniStat label="Cohort rank" value={`#${TIME_STATS.cohortRank}`} sub={`of ${TIME_STATS.cohortSize} students`} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <div className="dash-card p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <BookOpen className="h-4 w-4 text-slate-400" /> Module progress
              </h2>
              <button onClick={onGoAssessment} className="text-sm font-semibold text-[var(--accent-blue-deep)] hover:underline">
                Go to assessments
              </button>
            </div>
            <ul className="mt-4 space-y-4">
              {MODULES.map((m) => {
                  const pct = Math.round(m.lessonsDone / m.lessons * 100);
                  const graded = m.score !== null;
                  return (
                    <li key={m.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.lessonsDone}/{m.lessons} lessons · {pct}% complete</p>
                      </div>
                      {graded ?
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${
                          m.score >= 85 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`
                          }>
                          
                          {m.score}%
                        </span> :

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {pct > 0 ? "Assessment pending" : "Not started"}
                        </span>
                        }
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                          className={`h-full rounded-full ${graded ? "bg-emerald-500" : pct > 0 ? "bg-[var(--accent-blue-deep)]" : "bg-slate-200"}`}
                          style={{ width: `${pct}%` }} />
                        
                    </div>
                    {graded &&
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl bg-emerald-50 p-3">
                          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                            <TrendingUp className="h-3.5 w-3.5" /> Strong in
                          </p>
                          <p className="mt-1 text-sm text-emerald-900">{m.strengths.join(" · ")}</p>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-3">
                          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                            <Target className="h-3.5 w-3.5" /> Improve
                          </p>
                          <p className="mt-1 text-sm text-amber-900">{m.improve.join(" · ")}</p>
                        </div>
                      </div>
                      }
                  </li>);

                })}
            </ul>
            </div>

            <div className="dash-card p-5 lg:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Gauge className="h-4 w-4 text-slate-400" /> Weekly study activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {Math.round(TIME_STATS.thisWeekMins / 60)}h {TIME_STATS.thisWeekMins % 60}m this week ·{" "}
                <span className="font-semibold text-emerald-600">
                  +{Math.round((TIME_STATS.thisWeekMins - TIME_STATS.lastWeekMins) / TIME_STATS.lastWeekMins * 100)}%
                </span>{" "}
                vs last week
              </p>
              <div className="mt-5 flex h-40 items-end gap-3">
                {WEEKLY_ACTIVITY.map((d) => {
                  const max = Math.max(...WEEKLY_ACTIVITY.map((x) => x.minutes));
                  return (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">{d.minutes}m</span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-[var(--accent-blue-deep)] to-violet-500"
                          style={{ height: `${d.minutes / max * 100}%` }} />
                        
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{d.day}</span>
                    </div>);

                })}
              </div>
            </div>

            <div className="dash-card p-5 lg:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <TrendingUp className="h-4 w-4 text-slate-400" /> Skill proficiency
              </h2>
              <div className="mt-4 space-y-4">
                {SKILLS.map((s) =>
                <div key={s.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{s.name}</span>
                      <span className="font-bold text-slate-900">{s.level}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                      className={`h-full rounded-full ${s.level >= 80 ? "bg-emerald-500" : s.level >= 65 ? "bg-[var(--accent-blue-deep)]" : "bg-amber-500"}`}
                      style={{ width: `${s.level}%` }} />
                    
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="dash-card p-5 lg:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <FileCheck2 className="h-4 w-4 text-slate-400" /> Recent scores
              </h2>
              <ul className="mt-4 divide-y divide-slate-100">
                {RECENT_SCORES.map((r) =>
                <li key={r.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{r.title}</p>
                      <p className="text-xs text-slate-500">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${r.delta >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                        {r.delta >= 0 ? "+" : ""}{r.delta}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">{r.score}%</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>


          <div className="flex flex-col gap-5">
            <div className="dash-card h-fit p-5 lg:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Clock className="h-4 w-4 text-slate-400" /> Upcoming
              </h2>
              <ul className="mt-4 space-y-3">
                {UPCOMING.map((u) =>
                <li key={u.id} className="rounded-2xl border border-slate-100 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent-blue-deep)]">{u.type}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{u.title}</p>
                    <p className="text-xs text-slate-500">{u.due}</p>
                  </li>
                )}
              </ul>
            </div>

            <div className="dash-card h-fit p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <Code2 className="h-4 w-4 text-slate-400" /> Practice progress
                </h2>
                <button onClick={onGoPractice} className="text-sm font-semibold text-[var(--accent-blue-deep)] hover:underline">
                  Go to practice
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <p className="font-display text-2xl font-extrabold text-slate-900">{PRACTICE_STATS.solvedProblems}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Solved</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <p className="font-display text-2xl font-extrabold text-slate-900">{PRACTICE_STATS.successRate}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Success</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <p className="font-display text-2xl font-extrabold text-slate-900">{PRACTICE_STATS.streakDays}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Day streak</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Languages</p>
                <div className="mt-3 space-y-3">
                  {PRACTICE_STATS.languages.map((lang) =>
                  <div key={lang.name} className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${lang.color}`} />
                      <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">{lang.name}</span>
                      <span className="text-sm font-bold text-slate-900">{lang.solved}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recent activity</p>
                <ul className="mt-3 space-y-2">
                  {PRACTICE_STATS.recent.map((p) =>
                  <li key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Terminal className="h-4 w-4 shrink-0 text-slate-400" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.language} · {p.difficulty}</p>
                        </div>
                      </div>
                      {p.status === "solved" ?
                    <Trophy className="h-4 w-4 shrink-0 text-emerald-500" /> :

                    <Flame className="h-4 w-4 shrink-0 text-amber-500" />
                    }
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="dash-card h-fit p-5 lg:p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Target className="h-4 w-4 text-slate-400" /> What to improve next
              </h2>
              <p className="mt-1 text-sm text-slate-500">Based on your assessments and practice.</p>
              <ol className="mt-4 space-y-3">
                {focus.slice(0, 5).map((f, i) =>
                <li key={f} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent-blue-deep)] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{f}</p>
                      <p className="text-xs text-slate-500">Revise the lesson, then retry the practice set.</p>
                    </div>
                  </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

function MiniStat({ label, value, sub }) {
  return (
    <div className="dash-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>);

}

function Ring({ label, pct, sub }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
      <div
        className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
        style={{ background: `conic-gradient(#fff ${pct * 3.6}deg, rgba(255,255,255,0.22) 0deg)` }}>
        
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[rgba(30,27,75,0.85)] text-sm font-extrabold">
          {pct}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs text-white/70">{sub}</p>
      </div>
    </div>);

}
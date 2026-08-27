import { Link } from 'react-router-dom';
import { useSession } from '../../lib/auth.js';
import {
  CLASSES,
  ASSIGNMENTS,
  ANNOUNCEMENT,
  APPLICATIONS,
  EVENTS,
  QUESTS,
  LEADERBOARD,
  GAMIFICATION,
  formatDate,
  relativeDay,
} from '../../lib/dashboardData.js';
import {
  Video,
  ArrowUpRight,
  Flame,
  Sparkles,
  Trophy,
  Bell,
  CalendarClock,
  CheckCircle2,
  Zap,
  Target,
  ClipboardList,
  BookOpen,
} from 'lucide-react';
import { openAction } from '../../lib/actionBus.js';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer'];

export function DashboardOverview() {
  const session = useSession();
  if (!session) return null;

  const upcoming = CLASSES.filter((c) => c.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date));
  const nextClass = upcoming[0];
  const attended = CLASSES.filter((c) => c.status === 'completed').length;
  const dueSoon = ASSIGNMENTS.filter((a) => a.status === 'due').sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const completedTasks = ASSIGNMENTS.filter((a) => a.status === 'submitted' || a.status === 'reviewed').length;
  const nextEvent = EVENTS[0];

  const xpPct = Math.min(100, Math.round((GAMIFICATION.xp / GAMIFICATION.xpForNext) * 100));
  const weekPct = Math.round((session.weekCurrent / session.weekTotal) * 100);

  return (
    <div className="space-y-5 pb-5">
        <section className="flex flex-wrap items-center justify-between gap-3 dash-card px-5 py-4 md:px-6 md:py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{session.track}</p>
            <h2 className="mt-1 font-display text-2xl font-bold leading-tight">
              Hey {session.name.split(' ')[0]}
              <span className="text-slate-400">
                {' '}
                — {dueSoon.length ? `${dueSoon.length} things need you today` : "you're all caught up"}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip icon={Flame} tone="coral">{session.streak}-day streak</Chip>
            <Chip icon={Trophy} tone="navy">Level {GAMIFICATION.level}</Chip>
            <Chip icon={Zap} tone="blue">{GAMIFICATION.xp.toLocaleString()} XP · {xpPct}%</Chip>
            <button
              onClick={() => openAction({ kind: 'upgrade-cohort' })}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              <Sparkles className="h-3.5 w-3.5" /> Upgrade cohort
            </button>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={CheckCircle2} value={pad(completedTasks)} label="Tasks completed" accent="navy" />
          <StatTile icon={ClipboardList} value={pad(dueSoon.length)} label="Tasks in progress" accent="blue" />
          <StatTile icon={BookOpen} value={pad(attended)} label="Classes attended" accent="coral" />
          <StatTile icon={Zap} value={pad(EVENTS.length + 2)} sub="/ 12" label="Events this year" accent="lavender" />
        </div>

        <section className="grid items-stretch gap-4 xl:grid-cols-3">
          <Panel title="Tek Leaderboard" action={<Link to="/dashboard/profile" className="text-[11px] font-semibold text-[var(--accent-blue-deep)] hover:underline">See all</Link>}>
            <ul className="space-y-1.5">
              {LEADERBOARD.slice(0, 5).map((r) => (
                <li
                  key={r.rank}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors ${
                    r.isYou ? 'bg-accent-blue/10 ring-1 ring-[var(--accent-blue-deep)]/25' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="w-4 text-xs font-bold tabular-nums text-slate-400">{r.rank}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {r.photo ? <img src={r.photo} alt="" className="h-full w-full object-cover" loading="lazy" /> : r.initials}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">{r.name}</p>
                  <span className="text-[11px] font-bold tabular-nums text-slate-500">{r.xp.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Tek Quests" action={<span className="text-[11px] font-semibold text-slate-400">Click to resume</span>}>
            <ul className="space-y-2.5">
              {QUESTS.slice(0, 3).map((q) => (
                <li key={q.id}>
                  <Link to="/dashboard/profile" className="group block rounded-2xl bg-slate-50/70 px-3.5 py-3 transition-colors hover:bg-accent-blue/10">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 text-[13px] font-semibold leading-snug">{q.title}</p>
                      <span className="shrink-0 rounded-full bg-[#FCE5D0] px-2 py-0.5 text-[10px] font-bold text-[#B45613]">+{q.xp}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200/80">
                        <div className="h-full rounded-full bg-[var(--accent-blue-deep)]" style={{ width: `${(q.progress / q.total) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums text-slate-500">{q.progress}/{q.total}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-blue-deep)] opacity-0 transition-opacity group-hover:opacity-100">
                        Resume <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Tek Placement update"
            action={<Link to="/dashboard/placements" className="text-[11px] font-semibold text-[var(--accent-blue-deep)] hover:underline">Pipeline</Link>}
          >
            <ul className="space-y-2.5">
              {APPLICATIONS.slice(0, 3).map((app) => {
                const idx = STAGES.indexOf(app.stage);
                return (
                  <li key={app.id}>
                    <Link to="/dashboard/placements" className="group block rounded-2xl border border-slate-100 px-3.5 py-3 transition-colors hover:border-[var(--accent-blue-deep)]/40">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold">{app.company}</p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">{app.role} · {app.lastUpdate}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-accent-blue/15 px-2 py-0.5 text-[10px] font-bold text-[var(--accent-blue-deep)]">{app.stage}</span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1">
                        {STAGES.map((s, i) => (
                          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= idx ? 'bg-[var(--accent-blue-deep)]' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Target className="h-3.5 w-3.5 text-[var(--accent-blue-deep)]" /> Placement readiness 72%
            </p>
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {nextClass && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#151238] via-[#1E1B4B] to-[#2D5FA8] p-6 text-white">
                <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#5BA4E8]/25 blur-3xl" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold backdrop-blur">
                      <Video className="h-3 w-3" /> Next live class
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold leading-tight">{nextClass.topic}</h3>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
                      <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" /> {formatDate(nextClass.date)}</span>
                      <span>· {nextClass.duration}</span>
                      <span>· with {nextClass.instructor}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => openAction({ kind: 'join-class', topic: nextClass.topic, instructor: nextClass.instructor, when: formatDate(nextClass.date), duration: nextClass.duration })}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#1E1B4B] transition-transform hover:scale-[1.03]"
                  >
                    Join class <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {upcoming.length > 1 && (
                  <div className="relative mt-5 grid gap-2 border-t border-white/15 pt-4 sm:grid-cols-2">
                    {upcoming.slice(1, 3).map((c) => (
                      <div key={c.id} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        <p className="text-[11px] font-semibold text-white/70">{c.module}</p>
                        <p className="mt-0.5 line-clamp-1 text-sm font-semibold">{c.topic}</p>
                        <p className="mt-0.5 text-[11px] text-white/60">{relativeDay(c.date)} · {c.duration}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Panel
              title="Assignments on your plate"
              action={<Link to="/dashboard/assignments" className="text-[11px] font-semibold text-[var(--accent-blue-deep)] hover:underline">View all</Link>}
            >
              <ul className="space-y-2.5">
                {dueSoon.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 transition-colors hover:border-[var(--accent-blue-deep)]/40">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-coral/25 text-coral-foreground">
                      <ClipboardList className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{a.module} · {a.submissionType}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{relativeDay(a.dueDate)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <aside className="space-y-4">
            <div className="dash-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Program progress</p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">{weekPct}%</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)] transition-[width] duration-700" style={{ width: `${weekPct}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{GAMIFICATION.xpForNext - GAMIFICATION.xp} XP to Level {GAMIFICATION.level + 1}</p>
            </div>

            <div className="dash-card bg-lavender/40 p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold"><Bell className="h-3 w-3" /> Announcement</span>
              <h3 className="mt-3 font-display text-base font-bold leading-snug">{ANNOUNCEMENT.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{ANNOUNCEMENT.body}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{ANNOUNCEMENT.date}</p>
            </div>

            {nextEvent && (
              <div className="dash-card p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Next on your calendar</p>
                <p className="mt-2 font-display text-base font-bold leading-snug">{nextEvent.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">{formatDate(nextEvent.date)} · {nextEvent.kind}</p>
              </div>
            )}
          </aside>
        </section>
      </div>
  );
}

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

function Chip({ icon: Icon, tone, children }) {
  const cls = {
    navy: 'bg-[#1E1B4B]/10 text-[#1E1B4B]',
    blue: 'bg-accent-blue/15 text-[var(--accent-blue-deep)]',
    coral: 'bg-[#F4A261]/20 text-[#B45613]',
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {children}
    </span>
  );
}

function Panel({ title, action, children }) {
  return (
    <div className="dash-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold">{title}</h3>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function StatTile({ icon: Icon, value, sub, label, accent }) {
  const tone = {
    navy: { chip: 'bg-[#1E1B4B]/10 text-[#1E1B4B]', bar: 'bg-[#1E1B4B]' },
    blue: { chip: 'bg-[#2D5FA8]/12 text-[#2D5FA8]', bar: 'bg-[#2D5FA8]' },
    coral: { chip: 'bg-[#E85D4C]/12 text-[#C24634]', bar: 'bg-[#E85D4C]' },
    lavender: { chip: 'bg-[#5B3FA0]/12 text-[#5B3FA0]', bar: 'bg-[#5B3FA0]' },
  }[accent];
  return (
    <div className="dash-card dash-card-hover relative overflow-hidden p-4 pl-5 md:p-5 md:pl-6">
      <span className={`absolute inset-y-3 left-0 w-[3px] rounded-r-full ${tone.bar}`} />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-[26px] font-bold leading-none tabular-nums text-slate-900">
            {value}
            {sub && <span className="ml-1 text-sm font-semibold text-slate-400">{sub}</span>}
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-500">{label}</p>
        </div>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone.chip}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

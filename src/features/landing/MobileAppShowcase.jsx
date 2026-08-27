import { useState } from 'react';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { Squiggle } from '../../components/ui/Doodles.jsx';
import {
  Home, GraduationCap, ListChecks, MessagesSquare, User,
  Play, Clock, Flame, Zap, ChevronRight, ChevronLeft, Bell, Radio, CheckCircle2,
  FileText, Apple, Star, Search,
} from 'lucide-react';
import { CLASSES, ASSIGNMENTS, relativeDay } from '../../lib/dashboardData.js';

export function MobileAppShowcase() {
  return (
    <section className="relative px-4 md:px-10 py-20 md:py-28 bg-muted/60 rounded-[2.5rem] my-6 overflow-hidden">
      <style>{`
        @keyframes tek-phone-float {
          0%,100% { transform: translateY(0) }
          50%     { transform: translateY(-8px) }
        }
        .tek-phone { animation: tek-phone-float 4s ease-in-out infinite; will-change: transform; }
        .tek-phone-2 { animation-delay: -1.3s; animation-duration: 3.6s; }
        .tek-phone-3 { animation-delay: -2.4s; animation-duration: 4.2s; }
        @media (prefers-reduced-motion: reduce) {
          .tek-phone { animation: none; }
        }
        @keyframes tek-phone-in {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tek-phone-in { animation: tek-phone-in 700ms cubic-bezier(.22,.9,.32,1) both; }
        @keyframes tek-live-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.5; transform: scale(0.85); }
        }
        .tek-live-dot { animation: tek-live-dot 1.4s ease-in-out infinite; }
      `}</style>

      <Squiggle className="pointer-events-none absolute left-6 top-8 h-16 w-40 opacity-40" color="var(--accent-blue)" />
      <Squiggle className="pointer-events-none absolute right-8 bottom-16 h-16 w-40 opacity-40 rotate-180" color="var(--accent-blue-deep)" />

      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <span className="pill-tag bg-white text-primary border border-border -rotate-1">
            <span className="h-1.5 w-1.5 rounded-full gradient-blue" /> Student app · iOS & Android
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 font-display text-5xl md:text-7xl font-bold leading-[0.98] tracking-tight">
            Your cohort, in your pocket.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every live class, assignment, and cohort-mate — one tap from your home screen.
            The same TekSchool dashboard, tuned for thumbs.
          </p>
        </Reveal>
      </div>

      <PhoneSlider />

      <Reveal delay={220}>
        <div className="relative mt-16 flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#" className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-primary-foreground hover:bg-primary/90 transition-colors">
              <Apple className="h-6 w-6" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-wider opacity-70">Download on the</span>
                <span className="block font-display font-bold text-base">App Store</span>
              </span>
            </a>
            <a href="#" className="inline-flex items-center gap-3 rounded-full border-2 border-primary bg-white px-6 py-3.5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <GooglePlayIcon className="h-6 w-6" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-wider opacity-70">Get it on</span>
                <span className="block font-display font-bold text-base">Google Play</span>
              </span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-primary font-semibold">
              <Star className="h-4 w-4 fill-current" /> 4.8
            </span>
            <span>· Used by 5,000+ learners across India</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const SLIDES = [
  {
    id: 'home', label: 'Home',
    title: 'Your day, the moment you open it.',
    body: 'Streak, weekly XP, the next live class and what\'s due tomorrow — everything a learner needs to decide what to do next, on one screen.',
    points: ['Streak & weekly XP at a glance', 'Next class with one-tap join', 'Assignment drafts auto-saved'],
    render: () => <ScreenHome />,
  },
  {
    id: 'classes', label: 'Classes',
    title: 'Live classes and recordings in one place.',
    body: 'Join the live session in a tap, see the week ahead, and catch up with recordings if you missed something — same schedule as your cohort dashboard.',
    points: ['Live now banner with countdown', 'Full week schedule with mentors', 'Recordings available right after class'],
    render: () => <ScreenClasses />,
  },
  {
    id: 'tasks', label: 'Tasks',
    title: 'Assignments, submissions and feedback.',
    body: 'Track what\'s due, what\'s submitted and what\'s graded, and read mentor feedback on your work without leaving your phone.',
    points: ['Due / submitted / graded filters', 'Upload code repos or files', 'Mentor feedback inline'],
    render: () => <ScreenAssignments />,
  },
];

function PhoneSlider() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const go = (n) => setI((p) => (p + n + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative mt-14 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
      <div className="flex justify-center">
        <div className="tek-phone">
          <div key={slide.id} className="tek-phone-in">
            <PhoneFrame>{slide.render()}</PhoneFrame>
          </div>
        </div>
      </div>

      <div className="text-center md:text-left">
        <span className="pill-tag bg-white text-primary border border-border -rotate-1">
          {slide.label}
        </span>
        <h3 className="mt-4 font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight">
          {slide.title}
        </h3>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">{slide.body}</p>
        <ul className="mt-5 space-y-2.5 text-left inline-block">
          {slide.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
          <button onClick={() => go(-1)} className="h-11 w-11 grid place-items-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(1)} className="h-11 w-11 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="relative w-[260px] md:w-[280px] aspect-[9/19] rounded-[2.75rem] bg-neutral-900 p-[6px]" style={{ boxShadow: '0 2px 4px rgba(30,27,75,0.1), 0 20px 40px -12px rgba(30,27,75,0.35), 0 60px 100px -30px rgba(30,27,75,0.45)' }}>
      <div className="absolute inset-0 rounded-[2.75rem] pointer-events-none ring-1 ring-black/40" />
      <div className="relative h-full w-full rounded-[2.4rem] bg-white overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-6 w-24 rounded-full bg-black" />
        <div className="relative z-10 flex items-center justify-between px-6 pt-2.5 text-[10px] font-semibold text-black">
          <span>9:41</span>
          <span className="opacity-0">•</span>
        </div>
        <div className="relative h-[calc(100%-24px)] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function AppHeader({ title, right }) {
  return (
    <div className="px-4 pt-3 pb-3 bg-primary text-primary-foreground">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1.5">
          {right ?? (
            <>
              <button className="h-7 w-7 grid place-items-center rounded-full bg-white/10"><Search className="h-3.5 w-3.5" /></button>
              <button className="relative h-7 w-7 grid place-items-center rounded-full bg-white/10">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[color:var(--coral)]" />
              </button>
            </>
          )}
        </div>
      </div>
      {title && <h1 className="mt-2 font-display font-bold text-[20px] leading-tight">{title}</h1>}
    </div>
  );
}

function BottomNav({ active }) {
  const items = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'classes', label: 'Classes', Icon: GraduationCap },
    { id: 'tasks', label: 'Tasks', Icon: ListChecks },
    { id: 'chat', label: 'Cohort', Icon: MessagesSquare },
    { id: 'you', label: 'You', Icon: User },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-2 pt-1.5 pb-2">
      <div className="flex items-end justify-between">
        {items.map(({ id, label, Icon }) => {
          const on = id === active;
          return (
            <div key={id} className="flex-1 flex flex-col items-center gap-0.5">
              <div className={`h-7 w-10 grid place-items-center rounded-full transition-colors ${on ? 'bg-primary text-primary-foreground' : 'text-neutral-500'}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className={`text-[8.5px] font-semibold ${on ? 'text-primary' : 'text-neutral-500'}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScreenHome() {
  const nextClass = CLASSES.find((c) => c.status === 'upcoming');
  const dueSoon = ASSIGNMENTS.find((a) => a.status === 'due');
  return (
    <div className="h-full flex flex-col text-black">
      <AppHeader />
      <div className="px-4 pt-2 pb-16 flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[color:var(--lavender)] grid place-items-center font-display font-bold text-[color:var(--lavender-foreground)] text-sm">MS</div>
          <div className="min-w-0">
            <p className="text-[10px] text-neutral-500">Good evening</p>
            <p className="font-display font-bold text-[13px] truncate">Meera Sharma</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-[color:var(--coral)]/25 p-2.5">
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-[color:var(--coral-foreground)]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--coral-foreground)]">Streak</span>
            </div>
            <p className="mt-1 font-display font-black text-[22px] leading-none">12<span className="text-[11px] font-bold ml-0.5">days</span></p>
          </div>
          <div className="rounded-2xl bg-[color:var(--accent-blue)]/20 p-2.5">
            <div className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-[color:var(--accent-blue-deep)]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--accent-blue-deep)]">XP · Week</span>
            </div>
            <p className="mt-1 font-display font-black text-[22px] leading-none">1,240</p>
          </div>
        </div>

        {nextClass && (
          <div className="mt-3 rounded-2xl bg-primary text-primary-foreground p-3 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full gradient-blue opacity-40" />
            <div className="relative">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--coral)] tek-live-dot" />
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Next class · {relativeDay(nextClass.date)}</span>
              </div>
              <p className="mt-1.5 font-display font-bold text-[13px] leading-tight line-clamp-2">{nextClass.topic}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] opacity-75">with {nextClass.instructor}</span>
                <span className="rounded-full bg-white text-primary px-2.5 py-1 text-[10px] font-bold inline-flex items-center gap-1">
                  Join <Play className="h-2.5 w-2.5 fill-current" />
                </span>
              </div>
            </div>
          </div>
        )}

        {dueSoon && (
          <div className="mt-3 rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-[color:var(--accent-blue-deep)]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Due {relativeDay(dueSoon.dueDate)}</span>
            </div>
            <p className="mt-1 font-display font-bold text-[12px] leading-tight line-clamp-2">{dueSoon.title}</p>
            <div className="mt-2 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full w-[45%] gradient-blue rounded-full" />
            </div>
            <p className="mt-1 text-[9px] text-neutral-500">Draft saved · 45% complete</p>
          </div>
        )}
      </div>
      <BottomNav active="home" />
    </div>
  );
}

function ScreenClasses() {
  const live = CLASSES[0];
  const upcoming = CLASSES.filter((c) => c.status === 'upcoming').slice(0, 3);
  return (
    <div className="h-full flex flex-col text-black">
      <AppHeader title="Classes" />
      <div className="px-4 pt-3 pb-16 flex-1 overflow-hidden">
        <div className="rounded-2xl bg-[color:var(--coral)]/30 p-3 relative overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--coral)] text-[color:var(--coral-foreground)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
              <Radio className="h-2.5 w-2.5" /> Live now
            </span>
            <span className="text-[10px] font-semibold text-neutral-600 ml-auto">02:14 in</span>
          </div>
          <p className="mt-2 font-display font-bold text-[13px] leading-tight line-clamp-2">{live.topic}</p>
          <p className="mt-1 text-[10px] text-neutral-600">{live.instructor} · {live.module}</p>
          <button className="mt-2.5 w-full rounded-full bg-primary text-primary-foreground py-1.5 text-[11px] font-bold inline-flex items-center justify-center gap-1">
            Join live class <Play className="h-3 w-3 fill-current" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-display font-bold text-[12px]">This week</p>
          <button className="text-[10px] font-semibold text-neutral-500 inline-flex items-center">
            All <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {upcoming.map((c, i) => (
            <li key={c.id} className="rounded-xl border border-neutral-200 p-2.5 flex items-center gap-2.5">
              <div className={`shrink-0 w-9 rounded-lg p-1.5 text-center ${i === 0 ? 'bg-[color:var(--lavender)]' : i === 1 ? 'bg-[color:var(--accent-blue)]/20' : 'bg-neutral-100'}`}>
                <p className="text-[8px] font-bold uppercase tracking-wider text-neutral-500 leading-none">{new Date(c.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                <p className="font-display font-black text-[14px] leading-none mt-0.5">{new Date(c.date).getDate()}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-[11px] leading-tight line-clamp-2">{c.topic}</p>
                <p className="mt-0.5 text-[9px] text-neutral-500 flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" /> {c.duration} · {c.instructor}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav active="classes" />
    </div>
  );
}

function ScreenAssignments() {
  const due = ASSIGNMENTS.filter((a) => a.status === 'due').slice(0, 2);
  const reviewed = ASSIGNMENTS.find((a) => a.status === 'reviewed');
  return (
    <div className="h-full flex flex-col text-black">
      <AppHeader title="Tasks" />
      <div className="px-4 pt-3 pb-16 flex-1 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[9px] font-bold">Due · 2</span>
          <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[9px] font-bold text-neutral-600">Submitted · 1</span>
          <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[9px] font-bold text-neutral-600">Graded · 2</span>
        </div>

        <div className="mt-3 space-y-2">
          {due.map((a, i) => (
            <div key={a.id} className={`rounded-2xl p-3 ${i === 0 ? 'bg-[color:var(--coral)]/30' : 'bg-neutral-50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{a.module}</span>
                <span className={`text-[9px] font-bold ${i === 0 ? 'text-[color:var(--coral-foreground)]' : 'text-neutral-600'}`}>{relativeDay(a.dueDate)}</span>
              </div>
              <p className="mt-1.5 font-display font-bold text-[12px] leading-tight line-clamp-2">{a.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold">{a.submissionType}</span>
                <button className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[9px] font-bold inline-flex items-center gap-0.5">
                  Open <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {reviewed && (
          <>
            <p className="mt-4 font-display font-bold text-[12px]">Just graded</p>
            <div className="mt-2 rounded-2xl border border-neutral-200 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{reviewed.module}</span>
                <span className="inline-flex items-center gap-1 rounded-full gradient-blue text-white px-2 py-0.5 text-[9px] font-black">
                  <CheckCircle2 className="h-2.5 w-2.5" /> {reviewed.grade}
                </span>
              </div>
              <p className="mt-1.5 font-display font-bold text-[12px] leading-tight line-clamp-1">{reviewed.title}</p>
              <p className="mt-1 text-[9px] text-neutral-500 line-clamp-2 italic">"{reviewed.feedback}"</p>
            </div>
          </>
        )}
      </div>
      <BottomNav active="tasks" />
    </div>
  );
}

function GooglePlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M3.6 2.3a1.6 1.6 0 0 0-.6 1.3v16.8c0 .5.2 1 .6 1.3l9.4-9.9L3.6 2.3zm10.6 11.1 2.6 2.7-11 6.3c-.5.3-1.1.2-1.6-.1l10-8.9zm4.7-4.3 3.3 1.9c1 .6 1 2 0 2.6l-3.3 1.9-2.9-3.1 2.9-3.3zM4.2 1.5c.5-.3 1.1-.3 1.6-.1l11 6.3-2.6 2.7L4.2 1.5z" />
    </svg>
  );
}

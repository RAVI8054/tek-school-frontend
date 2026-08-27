import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Brain, Cloud, Code2, Sparkles, Users, TrendingUp, Award } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { Asterisk, Flower } from '../../components/ui/Doodles.jsx';
import { WORKSHOPS } from '../../lib/workshopsData.js';

// Import hero image
import heroStudents from '../../assets/hero-students.jpg';

const trackStyle = {
  AI: { tagBg: 'bg-[color:var(--lavender)]', tagColor: 'text-[color:var(--lavender-foreground)]', titleColor: 'text-[color:var(--accent-blue-deep)]', dotColor: 'bg-[color:var(--accent-blue-deep)]', Icon: Brain },
  Cloud: { tagBg: 'gradient-blue', tagColor: 'text-white', titleColor: 'text-[color:var(--accent-blue-deep)]', dotColor: 'bg-[color:var(--accent-blue-deep)]', Icon: Cloud },
  Software: { tagBg: 'bg-[color:var(--coral)]', tagColor: 'text-[color:var(--coral-foreground)]', titleColor: 'text-[color:var(--accent-blue-deep)]', dotColor: 'bg-[color:var(--coral)]', Icon: Code2 },
  Career: { tagBg: 'bg-primary', tagColor: 'text-primary-foreground', titleColor: 'text-[color:var(--accent-blue-deep)]', dotColor: 'bg-primary', Icon: TrendingUp },
};

function CountUp({ to, suffix = '', className = '' }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setTimeout(() => setN(to), 0); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const start = performance.now();
          const dur = 1200;
          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
          break;
        }
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  const formatted = n >= 1000 ? n.toLocaleString() : String(n);
  return <span ref={ref} className={className}>{formatted}{suffix}</span>;
}

function AnimatedHeadline() {
  const words = ['Learn', 'to', 'build'];
  const tail = ["what's"];
  return (
    <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
      <style>{`
        @keyframes tek-word-in {
          0%   { clip-path: inset(0 100% 0 0); transform: translateY(0.4em); opacity: 0; }
          60%  { opacity: 1; }
          100% { clip-path: inset(0 0 0 0);   transform: translateY(0);      opacity: 1; }
        }
        .tek-word { display: inline-block; clip-path: inset(0 100% 0 0); opacity: 0; will-change: clip-path, transform, opacity; animation: tek-word-in 720ms cubic-bezier(.22,.9,.32,1) forwards; }
        .tek-gradient-word { background: linear-gradient(120deg, var(--accent-blue) 0%, var(--accent-blue-deep) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
      `}</style>
      {words.map((w, i) => (
        <span key={w} className="tek-word mr-3" style={{ animationDelay: `${i * 90}ms` }}>{w}</span>
      ))}
      <span className="inline-flex items-center gap-2 mx-1 align-middle">
        <Flower className="h-10 w-10 md:h-14 md:w-14" color="var(--coral)" />
        <Asterisk className="h-9 w-9 md:h-12 md:w-12" color="var(--accent-blue-deep)" />
      </span>
      <br />
      {tail.map((w, i) => (
        <span key={w} className="tek-word mr-3" style={{ animationDelay: `${(words.length + i) * 90 + 60}ms` }}>{w}</span>
      ))}
      <span className="tek-word tek-gradient-word" style={{ animationDelay: `${(words.length + tail.length) * 90 + 60}ms` }}>
        next.
      </span>
    </h1>
  );
}

function ProgramCardStack({ onApply }) {
  const items = WORKSHOPS.slice(0, 4);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  const w = items[idx];
  const s = trackStyle[w.track] ?? trackStyle.Career;
  const Icon = s.Icon;

  return (
    <div className="relative w-full">
      <div className="relative rounded-[1.5rem] border border-border bg-white p-5 md:p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-500 overflow-hidden" aria-live="polite">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[color:var(--accent-blue)] opacity-[0.08]" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex shrink-0 items-center rounded-full bg-[#F59E0B] px-3.5 py-1.5 text-xs font-semibold text-white">Workshop</span>
          <span key={`${w.id}-tag`} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-[color:var(--accent-blue-deep)]">
            <Icon className="h-3.5 w-3.5" /> {w.track} · {w.format}
          </span>
        </div>
        <h3 key={`${w.id}-title`} className={`font-display text-2xl md:text-[1.75rem] font-bold mt-4 leading-[1.15] ${s.titleColor}`}>{w.title}</h3>
        <p key={`${w.id}-meta`} className="mt-2 text-sm text-muted-foreground">{w.date} · {w.time} · {w.duration}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p key={`${w.id}-seats`} className="text-sm text-muted-foreground">{w.seatsLeft} seats left · {w.price}</p>
          <button type="button" onClick={onApply}
            className="tek-lift inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_rgba(30,27,75,0.75)]">
            Reserve <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Show workshop ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? `w-8 ${s.dotColor}` : 'w-2 bg-slate-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NoiseOverlay() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0 0.28  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}
    />
  );
}

function DrawSquiggle() {
  return (
    <svg aria-hidden className="pointer-events-none absolute -right-6 top-6 h-48 w-[420px] opacity-70" viewBox="0 0 420 200" fill="none">
      <style>{`
        @keyframes tek-squig-draw { 0% { stroke-dashoffset: 900; } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -900; } }
      `}</style>
      <path d="M8 120 C 60 40, 130 200, 200 100 S 340 20, 412 130" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" strokeDasharray="900"
        style={{ animation: 'tek-squig-draw 9s ease-in-out infinite' }} />
      <circle cx="8" cy="120" r="4" fill="var(--accent-blue-deep)" />
    </svg>
  );
}

export function Hero({ onApply, onAdmissions }) {
  const sceneRef = useRef(null);
  const [px, setPx] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / r.width));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / r.height));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPx({ x: nx, y: ny }));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const layer = (depth) => ({
    transform: `translate3d(${px.x * depth}px, ${px.y * depth}px, 0)`,
    transition: 'transform 220ms cubic-bezier(.22,.9,.32,1)',
    willChange: 'transform',
  });

  return (
    <section className="relative px-4 md:px-10 pt-4 pb-16 overflow-hidden">
      <NoiseOverlay />
      <DrawSquiggle />

      <div ref={sceneRef} className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 items-center relative">
        {/* LEFT — photo card with floating layers */}
        <div className="relative order-2 lg:order-1 min-h-[540px]">
          <div
            className="relative rounded-[2rem] bg-primary p-5 aspect-[4/5] max-w-[520px] mx-auto overflow-hidden"
            style={{ ...layer(6), clipPath: 'polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)', boxShadow: '0 2px 4px rgba(30,27,75,0.08), 0 12px 28px -8px rgba(30,27,75,0.25), 0 40px 80px -20px rgba(30,27,75,0.35)' }}
          >
            <img src={heroStudents} alt="TekSchool students collaborating on a project" className="h-full w-full rounded-[1.5rem] object-cover" width={1200} height={1200} />
            <div className="absolute inset-5 rounded-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(30,27,75,0.35) 100%)' }} />
          </div>

          {/* Sticker tag */}
          <div className="absolute left-2 md:-left-2 top-6 pill-tag bg-[color:var(--coral)] text-[color:var(--coral-foreground)] -rotate-6 shadow-[0_10px_24px_-8px_rgba(30,27,75,0.35)]" style={layer(14)}>
            <Sparkles className="h-3.5 w-3.5" /> Live Cohort · New Batch
          </div>

          {/* Floating stat: placement */}
          <div className="absolute -right-2 md:-right-4 top-16 rounded-2xl bg-white border border-border p-3.5 w-40 shadow-[0_18px_40px_-12px_rgba(30,27,75,0.28)]" style={layer(20)}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl gradient-blue text-white"><TrendingUp className="h-4 w-4" /></span>
              <div>
                <CountUp to={94} suffix="%" className="font-display text-xl font-bold leading-none" />
                <p className="text-[10px] text-muted-foreground mt-0.5">Placement rate</p>
              </div>
            </div>
          </div>

          {/* Floating stat: students */}
          <div className="absolute left-4 md:-left-6 bottom-8 rounded-2xl bg-white border border-border p-3 w-52 shadow-[0_18px_40px_-12px_rgba(30,27,75,0.28)] rotate-[-3deg]" style={layer(28)}>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--lavender)] text-[color:var(--lavender-foreground)]"><Users className="h-4 w-4" /></span>
              <div>
                <CountUp to={10000} suffix="+" className="font-display text-lg font-bold leading-none" />
                <p className="text-[10px] text-muted-foreground mt-0.5">Students trained</p>
              </div>
            </div>
          </div>

          {/* Award chip */}
          <div className="hidden md:flex absolute right-6 -top-2 items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-[11px] font-semibold rotate-3 shadow-[0_12px_24px_-8px_rgba(30,27,75,0.4)]" style={layer(22)}>
            <Award className="h-3.5 w-3.5" /> 10 yrs teaching
          </div>
        </div>

        {/* RIGHT — headline + CTA + card stack */}
        <div className="order-1 lg:order-2 relative">
          <Reveal>
            <span className="pill-tag bg-muted text-muted-foreground mb-5"># New Batch · Applications Open</span>
          </Reveal>

          <AnimatedHeadline />

          <Reveal delay={280}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              TekSchool is a modern academy where curious minds become makers. Live cohorts, mentors that care, projects that ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={onApply}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Book your demo <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={onAdmissions}
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                Talk to admissions
              </button>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-10">
              <ProgramCardStack onApply={onApply} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Shell } from "../../components/layout/Shell.jsx";
import { BookDemoModal } from "./BookDemoModal.jsx";
import { AdmissionsModal } from "./AdmissionsModal.jsx";
import { LeadModal } from "./LeadModal.jsx";
import { FLAGSHIP_TRACKS, findTrack } from "../../lib/flagship-programs.js";
import { Squiggle, Asterisk, Arrow } from "../../components/ui/Doodles.jsx";
import {
  ArrowUpRight,
  Users,
  ChevronDown,
  X,
  Terminal,
  Server,
  Code2,
  Quote,
} from "lucide-react";
import { coursesForTrack } from "../../lib/track-courses.js";
import { FutureEngineeringPage } from "./FutureEngineeringPage.jsx";

const toneClass = (c) =>
  c === "coral"
    ? "bg-[#FF6B6B] text-white"
    : c === "lavender"
    ? "bg-[#E6E6FA] text-[#0F2A52]"
    : c === "blue"
    ? "bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] text-white"
    : "bg-[#0F2A52] text-white";

const softToneClass = (c) =>
  c === "coral"
    ? "bg-[#FF6B6B]/15 text-[#FF6B6B]"
    : c === "lavender"
    ? "bg-[#E6E6FA]/40 text-[#0F2A52]"
    : c === "blue"
    ? "bg-[#2563EB]/15 text-[#1D4ED8]"
    : "bg-[#0F2A52]/10 text-[#0F2A52]";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "fit", label: "Is it for you" },
  { id: "courses", label: "Courses" },
  { id: "curriculum", label: "Curriculum" },
  { id: "projects", label: "Projects" },
  { id: "partners", label: "Partners" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

function CoursesSection({ track }) {
  const courses = coursesForTrack(track.slug);
  const [openCode, setOpenCode] = useState(null);
  const [level, setLevel] = useState("All");
  const [enquiryCourse, setEnquiryCourse] = useState(null);

  const levels = ["All", "Foundation", "Core", "Advanced", "Capstone"];
  const visible = level === "All" ? courses : courses.filter((c) => c.level === level);
  const totalHours = courses.reduce((n, c) => n + c.hours, 0);
  const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);

  if (!courses.length) return null;

  return (
    <Section id="courses">
      <LeadModal
        open={enquiryCourse !== null}
        onClose={() => setEnquiryCourse(null)}
        badge={track.title}
        title={`Ask about ${enquiryCourse ?? "this course"}`}
        subtitle="Share your details and we'll send the syllabus, schedule, and next cohort dates."
        interest={enquiryCourse ?? ""}
        institutionType={track.title}
        cta="Send enquiry"
      />
      <SectionHeading
        eyebrow="Courses"
        title={`Every course inside ${track.title}.`}
        intro="The full module list for this track only — expand any course to see its week-by-week lesson plan."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Courses", value: String(courses.length) },
          { label: "Lesson modules", value: `${totalLessons}+` },
          { label: "Guided hours", value: `${totalHours} hrs` },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{m.label}</p>
            <p className="font-display text-2xl font-bold leading-none mt-1.5 text-[#0F2A52]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => {
              setLevel(l);
              setOpenCode(null);
              scrollToSection("courses");
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              level === l ? "bg-[#0F2A52] text-white" : "border border-slate-200 bg-white text-slate-500 hover:text-[#0F2A52]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <ol className="grid gap-4">
        {visible.map((c, i) => {
          const open = openCode === c.code;
          return (
            <li
              key={c.code}
              id={`course-${c.code}`}
              className="scroll-mt-[142px] rounded-3xl border border-slate-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => {
                  const next = open ? null : c.code;
                  setOpenCode(next);
                  if (next) {
                    window.setTimeout(() => {
                      document
                        .getElementById(`course-${c.code}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 80);
                  }
                }}
                aria-expanded={open}
                className="w-full text-left p-6 flex flex-wrap items-start gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-bold ${toneClass(track.color)}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{c.code}</span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${softToneClass(track.color)}`}>{c.level}</span>
                    <span className="text-xs font-semibold text-slate-500">{c.duration} · {c.hours} hrs</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold mt-2 leading-snug text-[#0F2A52]">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-2xl">{c.summary}</p>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="border-t border-slate-200 px-6 pb-6 pt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#0F2A52]">Lesson plan</h4>
                    <ol className="mt-3 space-y-3">
                      {c.lessons.map((l) => (
                        <li key={l.week} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-[#0F2A52] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">{l.week}</span>
                            <p className="font-semibold text-sm text-[#0F2A52]">{l.title}</p>
                          </div>
                          <ul className="mt-2.5 grid sm:grid-cols-2 gap-2 text-sm">
                            {l.topics.map((t) => (
                              <li key={t} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1D4ED8] shrink-0" />
                                <span className="text-slate-600">{t}</span>
                              </li>
                            ))}
                          </ul>
                          {l.deliverable && (
                            <p className="mt-2.5 text-xs font-semibold text-[#1D4ED8]">
                              Deliverable · {l.deliverable}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="font-display text-base font-bold text-[#0F2A52]">What you walk away with</h4>
                      <ul className="mt-3 space-y-2.5">
                        {c.outcomes.map((o) => (
                          <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-[#0F2A52]">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] shrink-0" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-[#0F2A52]">Tools used</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.tools.map((t) => (
                          <span key={t} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${softToneClass(track.color)}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnquiryCourse(c.title)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0F2A52] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0F2A52]/90"
                    >
                      Ask about this course <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-[142px] border-t border-slate-200 px-4 md:px-10 py-10 md:py-14 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <header className="max-w-2xl mb-7 md:mb-9">
      <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># {eyebrow}</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0F2A52]">{title}</h2>
      {intro && <p className="mt-2.5 text-slate-600 leading-relaxed">{intro}</p>}
    </header>
  );
}

export const NAV_OFFSET = 142;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => {
      const probe = NAV_OFFSET + 24;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = s.id;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        const last = SECTIONS.filter((s) => document.getElementById(s.id)).pop();
        if (last) current = last.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sticky top-[88px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <nav aria-label="Program sections" className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 md:px-10 py-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              setActive(s.id);
              scrollToSection(s.id);
            }}
            aria-current={active === s.id ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              active === s.id
                ? "bg-[#0F2A52] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-[#0F2A52]"
            }`}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function StickyEnroll({ track, onBookDemo, onAdmissions }) {
  const [show, setShow] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-[#0F2A52] text-white shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-center gap-3 px-4 md:px-8 py-3">
          <span className="text-sm font-semibold">
            {track.title} · <span className="opacity-60 line-through">₹{track.price.original.toLocaleString("en-IN")}</span> ₹{track.price.total.toLocaleString("en-IN")}
          </span>
          <span className="rounded-full bg-white/12 px-3 py-1 text-xs">Pay in EMI</span>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs">
            <Users className="h-3.5 w-3.5" /> {track.seatsLeft} seats left · {track.nextCohort}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBookDemo}
              className="rounded-full bg-white text-[#0F2A52] px-5 py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-white/90"
            >
              Book demo
            </button>
            <button
              type="button"
              onClick={onAdmissions}
              className="hidden sm:inline-block rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-white/10"
            >
              Talk to admissions
            </button>
          </div>
          <LeadModal
            open={enrollOpen}
            onClose={() => setEnrollOpen(false)}
            badge={track.title}
            title="Reserve your seat"
            subtitle="Share your details and our admissions team will confirm your seat and payment options."
            interest={track.title}
            institutionType={track.title}
            cta="Reserve my seat"
          />
        </div>
      </div>
    </div>
  );
}

export function ProgramTrack() {
  const { track: trackSlug } = useParams();
  const track = findTrack(trackSlug);

  const [demoOpen, setDemoOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);

  if (!track) {
    return (
      <Shell>
        <div className="px-6 py-24 text-center">
          <Asterisk className="mx-auto h-16 w-16 text-[#FF6B6B]" />
          <h1 className="font-display text-4xl font-bold mt-6 text-[#0F2A52]">Track not found.</h1>
          <Link
            to="/courses"
            className="mt-6 inline-block rounded-full bg-[#0F2A52] px-5 py-2 text-white text-sm font-semibold"
          >
            Browse programs
          </Link>
        </div>
      </Shell>
    );
  }

  if (track.slug === "future-engineering") return <FutureEngineeringPage track={track} />;

  const others = FLAGSHIP_TRACKS.filter((t) => t.slug !== track.slug && t.slug !== "future-engineering");

  return (
    <Shell>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 md:px-10 pt-6 pb-10 md:pb-12 bg-[#F8FAFC]">
        <Squiggle className="pointer-events-none absolute right-8 top-4 h-20 w-48 opacity-40 text-slate-300" />

        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:gap-10 lg:grid-cols-[1.05fr_1fr] items-center">
          <div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${toneClass(track.color)} mb-4`}>
              # {track.eyebrow}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight text-[#0F2A52]">
              {track.title.split(" ").map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? (
                    <span className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {i < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl leading-relaxed">
              {track.tagline}
            </p>

            <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
              {[
                { label: "Duration", value: track.duration },
                { label: "Format", value: track.format },
                { label: "Next cohort", value: track.nextCohort },
              ].map((m) => (
                <div key={m.label} className="bg-white px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {m.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold leading-snug text-[#0F2A52]">{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#0F2A52] text-white px-6 py-3 text-sm font-semibold hover:bg-[#0F2A52]/90"
              >
                Register for free demo <ArrowUpRight className="h-4 w-4" />
              </button>
              <a
                href="#curriculum"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold hover:bg-slate-100 text-[#0F2A52]"
              >
                See curriculum <ChevronDown className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#FF6B6B] text-white">
                <Users className="h-3.5 w-3.5 mr-1" /> {track.seatsLeft} of {track.seatsTotal} seats left
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Join 5,000+ students who found their dream job · 100+ developer-trainers · 200+ industry mentors
            </p>
          </div>

          <SignatureMockup track={track} />
        </div>
      </section>

      <SectionNav />

      {/* ── OVERVIEW: promise + stats ────────────────────── */}
      <Section id="overview">
        <div className={`rounded-[2rem] px-6 md:px-8 py-6 md:py-7 flex flex-col md:flex-row items-start md:items-center gap-5 ${toneClass(track.color)}`}>
          <Quote className="h-8 w-8 shrink-0 opacity-70" />
          <p className="font-display text-2xl md:text-[1.7rem] font-bold leading-tight">
            {track.signaturePromise}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard label={track.statLabels?.placement ?? "Job placement"} value={track.stats.placement} tone="coral" />
          <StatCard label={track.statLabels?.salary ?? "Starting salary range"} value={track.stats.salary} tone="blue" />
          <StatCard label={track.statLabels?.partners ?? "Hiring partners / support"} value={track.stats.partners} tone="lavender" />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              title: "AI-powered learning platform",
              desc: "Self-paced modules blended with expert mentorship for a personalised, job-ready path.",
            },
            {
              title: "Industry-driven curriculum",
              desc: "Designed with working tech experts — live projects, hands-on labs, real case studies.",
            },
            {
              title: "Internship & placement support",
              desc: "Career coaching, profile reviews, and exclusive openings with hiring partners.",
            },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-display text-base font-bold leading-snug text-[#0F2A52]">{p.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="font-display text-xl font-bold text-[#0F2A52]">What's included</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {track.highlights.map((h) => (
              <div key={h} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] shrink-0" />
                <p className="text-sm leading-relaxed text-slate-600">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FIT + TRANSFORMATION ─────────────────────────── */}
      <Section id="fit">
        <SectionHeading
          eyebrow="Honest filter"
          title="Is this the right room for you?"
          intro="We'd rather you self-select out now than three months in."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${toneClass(track.color)}`}># Perfect if</span>
            <ul className="mt-5 space-y-3.5">
              {track.perfectFor.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-[#0F2A52]">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <span className="inline-flex items-center rounded-full bg-white text-slate-500 border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              # Not for you if
            </span>
            <ul className="mt-5 space-y-3.5">
              {track.notForYou.map((n) => (
                <li key={n} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <X className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── COURSES IN THIS TRACK ───────────────────────── */}
      <CoursesSection track={track} />

      {/* ── CURRICULUM ──────────────────────────────────── */}
      <Section id="curriculum">
        <SectionHeading
          eyebrow="Curriculum"
          title={`How the ${track.duration.split(" +")[0]} flows.`}
          intro="Four phases, each ending in something you can show."
        />

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] items-stretch">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 flex min-h-40 flex-col justify-between">
            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-3 py-1 text-xs font-semibold self-start">Start</span>
            <p className="font-display text-xl md:text-2xl font-bold leading-snug mt-4 text-[#0F2A52]">
              {track.weekTransformation.before}
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <Arrow className="h-20 w-20 text-slate-300" />
          </div>
          <div className={`rounded-[2rem] p-6 min-h-40 flex flex-col justify-between ${toneClass(track.color)}`}>
            <span className="inline-flex items-center rounded-full bg-white/25 text-current px-3 py-1 text-xs font-semibold self-start">Finish</span>
            <p className="font-display text-xl md:text-2xl font-bold leading-snug mt-4">
              {track.weekTransformation.after}
            </p>
          </div>
        </div>

        <ol className="grid gap-4">
          {track.curriculum.map((c, i) => (
            <li
              key={c.phase}
              className="rounded-3xl border border-slate-200 bg-white p-6 grid md:grid-cols-[minmax(0,1fr)_2fr] gap-6"
            >
              <div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${toneClass(track.color)}`}>Phase 0{i + 1}</span>
                <h3 className="font-display text-2xl font-bold mt-3 text-[#0F2A52]">{c.phase}</h3>
                <p className="text-sm text-slate-500 mt-1">{c.weeks}</p>
              </div>
              <ul className="grid sm:grid-cols-2 gap-2.5 text-sm self-center">
                {c.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1D4ED8] shrink-0" />
                    <span className="text-[#0F2A52]">{t}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <h3 className="font-display text-xl font-bold text-[#0F2A52]">Stack you'll master</h3>
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {track.tools.map((t) => (
              <span key={t} className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold justify-center ${softToneClass(track.color)}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PROJECTS + OUTCOMES ─────────────────────────── */}
      <Section id="projects">
        <SectionHeading
          eyebrow="What you'll ship"
          title="Real projects. Real users. Real receipts."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {track.sampleProjects.map((p, i) => (
            <article key={p.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 flex flex-col">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider self-start ${softToneClass(track.color)}`}>
                Project 0{i + 1}
              </span>
              <h3 className="font-display text-xl font-bold mt-4 leading-snug text-[#0F2A52]">{p.title}</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">{p.desc}</p>
              <p className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {p.stack}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── HIRING PARTNERS ─────────────────────────────── */}
      <Section id="partners">
        <div className="rounded-[2rem] bg-[#0F2A52] text-white p-7 md:p-9 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-40 blur-2xl" />
          <div className="relative">
            <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 mb-3">
              {track.partners?.eyebrow ?? "# Where graduates go"}
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold max-w-xl">
              {track.partners?.heading ?? "Cohort '25 placed into teams like these."}
            </h3>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {track.outcomeCompanies.map((co) => (
                <span
                  key={co}
                  className="inline-flex items-center rounded-full bg-white/12 text-white border border-white/15 text-sm px-4 py-2 font-medium"
                >
                  {co}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/60 mt-6">
              {track.partners?.note ??
                "Hiring partners on record. Exact placements vary by cohort and role fit."}
            </p>
          </div>
        </div>
      </Section>

      {/* ── PRICING ─────────────────────────────────────── */}
      <Section id="pricing">
        <SectionHeading eyebrow="Pricing" title="One fee. No surprises." />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Light card — original fee */}
          <div className="relative rounded-[2rem] bg-[#E6E6FA] text-[#0F2A52] p-7 overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-20" />
            <div className="relative">
              <p className="text-sm font-semibold opacity-70">Original program fee</p>
              <p className="font-display text-5xl md:text-6xl font-bold mt-2">
                ₹{track.price.original.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm opacity-80">
                Pay the full program fee upfront. No hidden charges.
              </p>
              <div className="mt-6 space-y-2 text-sm opacity-90">
                <p className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] shrink-0" />
                  Includes internship placement
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] shrink-0" />
                  12-month placement support
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] shrink-0" />
                  All exam vouchers and cloud credits
                </p>
              </div>
            </div>
          </div>

          {/* Dark card — offer fee */}
          <div className="relative rounded-[2rem] bg-[#0F2A52] text-white p-7 overflow-hidden">
            {/* price-tag discount badge */}
            <div className="absolute -top-3 -right-3 z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
              <svg width="110" height="145" viewBox="0 0 120 160" fill="none" aria-hidden="true" className="rotate-[24deg]">
                <path d="M60 4c5 0 9 2 12 6l38 50a8 8 0 0 1 1 7l-26 74a8 8 0 0 1-7 5H42a8 8 0 0 1-7-5L9 67a8 8 0 0 1 1-7l38-50c3-4 7-6 12-6Z" fill="#E8262D" />
                <path d="M60 4c5 0 9 2 12 6l38 50a8 8 0 0 1 1 7l-26 74a8 8 0 0 1-7 5H42a8 8 0 0 1-7-5L9 67a8 8 0 0 1 1-7l38-50c3-4 7-6 12-6Z" stroke="#C41E24" strokeWidth="1.5" />
                <circle cx="60" cy="22" r="7" fill="#1a1a2e" />
                <circle cx="60" cy="22" r="3.5" fill="#E8262D" />
                <path d="M60 15c0-8 6-13 10-13s8 5 8 11c0 5-3 9-6 10" stroke="#4a4a55" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M35 30c8-4 18-6 28-6s20 2 28 6l-8 22c-6-3-13-4-20-4s-14 1-20 4L35 30Z" fill="#fff" opacity="0.12" />
                <text x="60" y="90" fill="#fff" fontSize="34" fontWeight="900" textAnchor="middle" fontFamily="inherit">{track.price.discountPct}%</text>
                <text x="60" y="118" fill="#fff" fontSize="20" fontWeight="800" textAnchor="middle" fontFamily="inherit" letterSpacing="0.06em">OFF</text>
              </svg>
            </div>

            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-60" />
            <div className="relative">
              <p className="text-sm opacity-70">Limited offer fee</p>
              <p className="font-display text-5xl md:text-6xl font-bold mt-2">
                ₹{track.price.total.toLocaleString("en-IN")}
              </p>

              <p className="text-sm font-semibold text-[#FF6B6B] mt-1">
                You save ₹{(track.price.original - track.price.total).toLocaleString("en-IN")}
              </p>
              <p className="text-sm opacity-80 mt-1">Offer valid till {track.price.offerEnds}</p>
              <div className="mt-6 space-y-1 text-sm opacity-90">
                <p>✓ Includes internship placement</p>
                <p>✓ 12-month placement support</p>
                <p>✓ All exam vouchers and cloud credits</p>
              </div>
              <button
                type="button"
                onClick={() => setReserveOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[#0F2A52] px-6 py-3 text-sm font-semibold hover:bg-slate-100"
              >
                Reserve your seat <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Answers to the real questions." />
        <div className="max-w-3xl divide-y border-y border-slate-200">
          {track.faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </Section>

      {/* ── CROSS-LINK ──────────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow="Other flagship tracks" title="Compare the other paths." />
        <div className="grid gap-4 md:grid-cols-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              to={`/programs/${o.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-6 hover:border-[#0F2A52] transition-colors"
            >
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${toneClass(o.color)}`}>{o.eyebrow}</span>
              <h3 className="font-display text-2xl font-bold mt-3 text-[#0F2A52]">{o.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{o.tagline}</p>
              <p className="mt-4 text-sm font-semibold inline-flex items-center gap-1 text-[#0F2A52]">
                View program{" "}
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Sticky enroll */}
      <StickyEnroll track={track} onBookDemo={() => setDemoOpen(true)} onAdmissions={() => setAdmissionsOpen(true)} />

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} presetProgram={track.title} />

      <LeadModal
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        badge={track.title}
        title="Reserve your seat"
        subtitle="Share your details and our admissions team will confirm your seat and payment options."
        interest={track.title}
        institutionType={track.title}
        cta="Reserve my seat"
      />

      <AdmissionsModal open={admissionsOpen} onClose={() => setAdmissionsOpen(false)} />
    </Shell>
  );
}

function SignatureMockup({ track }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[2rem] bg-[#0F2A52]/20 translate-x-3 translate-y-4 blur-xl" aria-hidden />
      <div className="absolute inset-0 rounded-[2rem] bg-[#2563EB]/10 -translate-x-2 -translate-y-2" aria-hidden />
      <div
        className="relative rounded-[2rem] bg-[#0F2A52] text-white p-4 md:p-5 overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)" }}
      >
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E6E6FA]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
          <span className="ml-3 text-[11px] font-mono text-white/50 truncate">
            {track.slug === "ai-engineering"
              ? "~/tekschool/rag-legal-assistant"
              : track.slug === "cloud-engineering"
              ? "~/tekschool/prod-cluster · kubectl"
              : "~/tekschool/collab-editor · main"}
          </span>
        </div>
        <div className="mt-2 rounded-2xl bg-black/25 p-4 md:p-5 min-h-[22rem] backdrop-blur-sm">
          {track.slug === "ai-engineering" && <AIMock />}
          {track.slug === "cloud-engineering" && <CloudMock />}
          {track.slug === "software-engineering" && <SWEMock />}
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider absolute right-6 top-6 -rotate-6 bg-white text-[#0F2A52] shadow-lg`}>
          # {track.title}
        </span>
      </div>
      <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white border border-slate-200 p-3 shadow-lg -rotate-3" aria-hidden>
        <p className="text-[10px] font-semibold uppercase text-slate-500">
          {track.proofSticker?.label ?? "Cohort '25"}
        </p>
        <p className="font-display text-lg font-bold text-[#0F2A52]">
          {track.proofSticker?.value ?? `${track.stats.placement} placed`}
        </p>
      </div>
    </div>
  );
}

function AIMock() {
  return (
    <div className="space-y-3 font-mono text-[12px]">
      <div className="flex items-center gap-2 text-[#2563EB]">
        <Terminal className="h-3.5 w-3.5" />
        <span>chain.invoke("Summarise clause 4 of the MSA")</span>
      </div>
      <div className="rounded-xl bg-white/10 p-3 space-y-2">
        <p className="text-[11px] text-white/50">Retrieving from pinecone · 4 matches · avg score 0.87</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.94, 0.89, 0.83, 0.81].map((s, i) => (
            <div key={i} className="rounded-md bg-[#2563EB]/25 px-2 py-1.5 text-center">
              <p className="text-[9px] text-white/60">chunk_{i + 1}</p>
              <p className="text-white font-semibold">{s}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-white/10 p-3 text-white/90 leading-relaxed">
        <span className="text-[#FF6B6B]">assistant ›</span> Clause 4 caps liability at fees
        paid in the prior 12 months, excluding gross negligence. See §4.2 for carve-outs
        <span className="ml-1 inline-block w-1.5 h-3 bg-white/80 align-middle animate-pulse" />
      </div>
      <div className="flex gap-2 text-[10px] text-white/50">
        <span className="rounded-full bg-white/10 px-2 py-0.5">latency 412ms</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5">tokens 284</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5">cost $0.0021</span>
      </div>
    </div>
  );
}

function CloudMock() {
  return (
    <div className="space-y-3 font-mono text-[12px]">
      <div className="flex items-center gap-2 text-[#2563EB]">
        <Server className="h-3.5 w-3.5" />
        <span>kubectl get pods -n prod --watch</span>
      </div>
      <div className="rounded-xl bg-white/10 p-3 space-y-1.5">
        {[
          { name: "api-gw-7d9c", status: "Running", age: "3d", cpu: "42%" },
          { name: "worker-a1f2", status: "Running", age: "3d", cpu: "68%" },
          { name: "worker-b3e4", status: "Running", age: "3d", cpu: "71%" },
          { name: "cache-2d1c", status: "Running", age: "5d", cpu: "18%" },
          { name: "canary-8f0e", status: "Pending", age: "12s", cpu: "—" },
        ].map((p) => (
          <div key={p.name} className="grid grid-cols-4 gap-2 text-[11px] text-white/80">
            <span className="truncate">{p.name}</span>
            <span className={p.status === "Running" ? "text-[#2563EB]" : "text-[#FF6B6B]"}>{p.status}</span>
            <span className="text-white/50">{p.age}</span>
            <span className="text-white/70">{p.cpu}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white/10 p-3">
        <p className="text-[10px] text-white/50 mb-1.5">SLO burn (last 1h)</p>
        <div className="h-8 flex items-end gap-1">
          {[3, 5, 4, 7, 6, 4, 8, 12, 9, 6, 5, 4].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-[#2563EB]/70" style={{ height: `${h * 6}%` }} />
          ))}
        </div>
      </div>
      <p className="text-[10px] text-white/50">99.94% availability · error budget 68% remaining</p>
    </div>
  );
}

function SWEMock() {
  return (
    <div className="space-y-2 font-mono text-[12px]">
      <div className="flex items-center gap-2 text-[#2563EB]">
        <Code2 className="h-3.5 w-3.5" />
        <span>src/booking/create.ts</span>
      </div>
      <div className="rounded-xl bg-white/10 p-3 space-y-0.5 text-[11px] leading-relaxed">
        <p className="text-white/40">
          <span className="mr-3">1</span>
          <span className="text-[#E6E6FA]">export async function</span>{" "}
          <span className="text-[#2563EB]">createBooking</span>(input: BookingInput) &#123;
        </p>
        <p className="text-white/40">
          <span className="mr-3">2</span> <span className="text-white/70">const key = idempotencyKey(input);</span>
        </p>
        <p className="text-white/40">
          <span className="mr-3">3</span>{" "}
          <span className="text-white/70">
            const existing = <span className="text-[#FF6B6B]">await</span> db.bookings.byKey(key);
          </span>
        </p>
        <p className="bg-[#2563EB]/15 -mx-3 px-3 text-white">
          <span className="mr-3 text-white/40">4</span> if (existing) return existing; <span className="text-[#FF6B6B] ml-2">// dedupe retries</span>
        </p>
        <p className="text-white/40">
          <span className="mr-3">5</span>{" "}
          <span className="text-white/70">return db.transaction(() =&gt; charge(input) &amp;&amp; hold(input));</span>
        </p>
        <p className="text-white/40"><span className="mr-3">6</span>&#125;</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px] text-white/60">
        <div className="rounded-lg bg-white/10 px-2 py-1.5">
          <p className="text-white/40">tests</p>
          <p className="text-white font-semibold">42 / 42 ✓</p>
        </div>
        <div className="rounded-lg bg-white/10 px-2 py-1.5">
          <p className="text-white/40">coverage</p>
          <p className="text-white font-semibold">96%</p>
        </div>
        <div className="rounded-lg bg-white/10 px-2 py-1.5">
          <p className="text-white/40">CI</p>
          <p className="text-[#2563EB] font-semibold">deploy → prod</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const cls =
    tone === "coral"
      ? "bg-[#FF6B6B] text-white"
      : tone === "blue"
      ? "bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] text-white"
      : "bg-[#E6E6FA] text-[#0F2A52]";
  return (
    <div className={`rounded-3xl p-6 ${cls}`}>
      <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">{label}</p>
      <p className="font-display text-4xl md:text-5xl font-bold mt-2">{value}</p>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg font-bold text-[#0F2A52]">{q}</span>
        <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>}
    </div>
  );
}

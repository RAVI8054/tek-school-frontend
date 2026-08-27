import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  Bot,
  Blocks,
  Cpu,
  Rocket,
  Star,
  Trophy,
  HeartHandshake,
  ShieldCheck,
  Palette,
  Quote,
  ChevronDown,
} from "lucide-react";
import { Shell } from "../../components/layout/Shell.jsx";
import { BookDemoDrawer } from "./BookDemoDrawer.jsx";
import { AdmissionsModal } from "./AdmissionsModal.jsx";

const BANDS = [
  {
    band: "Band 1 · Spark",
    ages: "Ages 6–8",
    icon: Blocks,
    color: "from-[#F59E0B] to-[#F97316]",
    soft: "bg-[#FEF3C7] text-[#92400E]",
    line: "Unplugged thinking, ScratchJr and their very first game with a win screen.",
    wins: ["Story animations", "Catch-the-star game", "Loops & events"],
  },
  {
    band: "Band 2 · Build",
    ages: "Ages 8–12",
    icon: Cpu,
    color: "from-[#2563EB] to-[#1E3A8A]",
    soft: "bg-[#DBEAFE] text-[#1E3A8A]",
    line: "Blocks turn into typed code — real web pages, Python programs and charts.",
    wins: ["HTML & CSS site", "Python mini-apps", "Data & debugging"],
  },
  {
    band: "Band 3 · Invent",
    ages: "Ages 11–15",
    icon: Bot,
    color: "from-[#7C3AED] to-[#DB2777]",
    soft: "bg-[#EDE9FE] text-[#5B21B6]",
    line: "Robots, sensors, 3D printing and their first trained AI model — then a judged demo day.",
    wins: ["Line-following rover", "AI study buddy", "Judged capstone"],
  },
];

const PARENT_WINS = [
  { icon: ShieldCheck, title: "Safe, supervised, screen-balanced", body: "Half of every session is unplugged, hardware or paper design. Instructor-led, never an app left alone with your child." },
  { icon: HeartHandshake, title: "Batches of 12, never more", body: "A trained instructor plus a teaching assistant so quiet kids get heard and fast kids get stretched." },
  { icon: Trophy, title: "Something built every term", body: "Games, websites, robots and AI projects — with a portfolio link parents can actually open." },
  { icon: Palette, title: "Creative first, coding second", body: "Design thinking, storytelling and making come before syntax. That's why the children stay." },
];

export function FutureEngineeringPage({ track }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <Shell>
      <BookDemoDrawer
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        variant="modal"
        heading="Book a free kids' demo class"
        presetProgram="Future Engineering"
      />
      <AdmissionsModal open={talkOpen} onClose={() => setTalkOpen(false)} />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 md:px-10 pt-6 pb-14 bg-white">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#FDE68A] opacity-60 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-[#C7D2FE] opacity-60 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute left-1/3 bottom-[-6rem] h-72 w-72 rounded-full bg-[#FBCFE8] opacity-50 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_10px_24px_-14px_rgba(245,158,11,0.9)]">
              <Sparkles className="h-3.5 w-3.5" /> {track.eyebrow}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[0.98] tracking-tight md:text-6xl text-[#0F2A52]">
              Where kids stop{" "}
              <span className="relative inline-block">
                <span className="relative z-10">scrolling</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-[#FDE68A]" />
              </span>{" "}
              and start{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#DB2777] bg-clip-text text-transparent">
                building
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              {track.tagline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_35px_-18px_rgba(124,58,237,0.9)] transition-transform hover:-translate-y-0.5"
              >
                Book a free demo class <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTalkOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold hover:bg-slate-50 text-[#0F2A52]"
              >
                Talk to admissions
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                { k: "Ages 6–15", c: "bg-[#FEF3C7] text-[#92400E]" },
                { k: "Batches of 12", c: "bg-[#DBEAFE] text-[#1E3A8A]" },
                { k: "2 hrs / week", c: "bg-[#DCFCE7] text-[#166534]" },
                { k: "1,200+ young builders", c: "bg-[#EDE9FE] text-[#5B21B6]" },
              ].map((p) => (
                <span key={p.k} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${p.c}`}>
                  {p.k}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-[#FDE68A]/45 via-[#C7D2FE]/45 to-[#FBCFE8]/45"
            />
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src="/assets/future-kids-lab.jpg"
                alt="Indian school children coding at computers in a school lab"
                width={1280}
                height={912}
                className="col-span-2 h-52 w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(30,58,138,0.5)] md:h-64"
              />
              <img
                src="/assets/future-kids-coding.jpg"
                alt="A young student building her first game with block coding"
                loading="lazy"
                width={1008}
                height={1008}
                className="h-44 w-full rounded-[1.5rem] object-cover shadow-[0_24px_48px_-28px_rgba(219,39,119,0.55)] md:h-52"
              />
              <img
                src="/assets/future-kids-robotics.jpg"
                alt="Students assembling a robot at a robotics bootcamp"
                loading="lazy"
                width={1280}
                height={912}
                className="h-44 w-full rounded-[1.5rem] object-cover shadow-[0_24px_48px_-28px_rgba(124,58,237,0.55)] md:h-52"
              />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_20px_40px_-24px_rgba(15,42,82,0.6)]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Next batch</p>
              <p className="text-sm font-bold text-[#0F2A52]">{track.nextCohort} · {track.seatsLeft} seats left</p>
            </div>
          </div>
        </div>
      </section>

      {/* BANDS */}
      <section className="px-4 md:px-10 py-14 bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider"># The journey</span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-[#0F2A52]">
              Three bands. Nine years of building.
            </h2>
            <p className="mt-3 text-slate-600">
              Children join at their age band and move up as they build. Every band ends with something they demo out loud.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BANDS.map((b) => (
              <div
                key={b.band}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-md"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${b.color}`} />
                <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${b.color} text-white`}>
                  <b.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 font-display text-xl font-bold text-[#0F2A52]">{b.band}</p>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${b.soft}`}>{b.ages}</span>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{b.line}</p>
                <ul className="mt-5 space-y-2">
                  {b.wins.map((w) => (
                    <li key={w} className="flex items-center gap-2 text-sm font-medium text-[#0F2A52]">
                      <Star className="h-3.5 w-3.5 text-[#F59E0B]" /> {w}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARENT WINS + IMAGE */}
      <section className="px-4 md:px-10 py-14 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative">
            <img
              src="/assets/future-kids-demoday.jpg"
              alt="School children presenting their robotics project at demo day"
              loading="lazy"
              width={1280}
              height={912}
              className="h-full w-full rounded-[2.25rem] object-cover shadow-[0_36px_70px_-36px_rgba(30,58,138,0.6)]"
            />
            <div className="absolute -right-4 -top-4 rotate-3 rounded-2xl bg-[#F59E0B] px-4 py-3 text-white shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-90">Every term</p>
              <p className="font-display text-lg font-bold">Demo day on stage</p>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider"># For parents</span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-[#0F2A52]">
              What you get for the screen time.
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {PARENT_WINS.map((p) => (
                <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#DBEAFE] text-[#1E3A8A]">
                    <p.icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="mt-3 font-semibold text-[#0F2A52]">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-4 md:px-10 py-14 bg-white">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#7C3AED] p-8 text-white md:p-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold">
            <Rocket className="h-3.5 w-3.5" /> Things children actually finish
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold md:text-4xl">Real projects, built by kids.</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {track.sampleProjects.map((p) => (
              <div key={p.title} className="rounded-[1.5rem] bg-white/10 p-6 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <p className="font-display text-lg font-bold">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{p.desc}</p>
                <p className="mt-4 text-xs font-semibold text-white/70">{p.stack}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-2">
            {track.tools.map((t) => (
              <span key={t} className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white/90">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="px-4 md:px-10 py-14 bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider"># Curriculum</span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl text-[#0F2A52]">The full scope and sequence.</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {track.curriculum.map((c, i) => (
              <div key={c.phase} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-lg font-bold text-[#0F2A52]">{c.phase}</p>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {c.weeks}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2">
                  {c.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          ["bg-[#F59E0B]", "bg-[#2563EB]", "bg-[#7C3AED]", "bg-[#DB2777]"][i % 4]
                        }`}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARENT QUOTE + PRICING */}
      <section className="px-4 md:px-10 py-14 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[2rem] border border-[#FED7AA] bg-[#FFF7ED] p-8 md:p-10">
            <Quote className="h-8 w-8 text-[#F59E0B]" />
            <p className="mt-4 font-display text-xl leading-relaxed md:text-2xl text-[#0F2A52]">
              &ldquo;{track.signatureQuote.text}&rdquo;
            </p>
            <p className="mt-5 text-sm font-semibold text-[#0F2A52]">{track.signatureQuote.author}</p>
            <p className="text-sm text-slate-500">{track.signatureQuote.role}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <span className="inline-block rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#166534]">
              {track.price.discountPct}% off · till {track.price.offerEnds}
            </span>
            <div className="mt-5 flex items-end gap-3">
              <p className="font-display text-4xl font-bold text-[#0F2A52]">₹{track.price.total.toLocaleString("en-IN")}</p>
              <p className="pb-1.5 text-lg text-slate-400 line-through">
                ₹{track.price.original.toLocaleString("en-IN")}
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Full academic year · EMI up to {track.price.emiMonths} months · sibling discount available.
            </p>
            <ul className="mt-6 space-y-2.5">
              {track.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[#0F2A52]">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" /> {h}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Register for a free demo <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-10 py-14 bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl text-[#0F2A52]">Parent questions.</h2>
          <div className="mt-8 space-y-3">
            {track.faqs.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-[#0F2A52]"
                >
                  {f.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="px-4 md:px-10 pb-20 bg-white">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#0F2A52] p-10 text-white md:p-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h3 className="font-display text-3xl font-bold md:text-4xl">
                Let them try one class. That&apos;s usually enough.
              </h3>
              <p className="mt-3 text-sm text-white/75">
                A free 60-minute demo where your child builds something small and shows it to you at the end.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Book the free class <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link
                to="/campus/school"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                Bring it to our campus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

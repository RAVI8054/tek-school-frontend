import { useState } from "react";
import {
  Compass,
  Heart,
  Sparkles,
  Users as UsersIcon,
  ArrowUpRight,
} from "lucide-react";

import { Shell } from "../../components/layout/Shell.jsx";
import { CatalogModal } from "./CatalogModal.jsx";
import { AdmissionsModal } from "./AdmissionsModal.jsx";
import { Reveal } from "../../components/ui/Reveal.jsx";
import { Squiggle } from "../../components/ui/Doodles.jsx";
import { COURSES_DATA } from "../../lib/courses-data.js";

const VALUES = [
  {
    icon: Compass,
    tint: "bg-[#FF6B6B] text-[#FFFFFF]",
    title: "Ship, don't stall.",
    body: "Every course ends with something public and live. No sandbox exercises that die in a folder.",
  },
  {
    icon: Heart,
    tint: "bg-[#E6E6FA] text-[#0F2A52]",
    title: "Cohorts, not clicks.",
    body: "Small groups with a real mentor. You'll know your classmates' names by week two.",
  },
  {
    icon: Sparkles,
    tint: "bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] text-white",
    title: "Taste is a skill.",
    body: "We teach the details — the choices that separate a fine project from a memorable one.",
  },
  {
    icon: UsersIcon,
    tint: "bg-[#2563EB] text-white",
    title: "Alumni for life.",
    body: "Once you're in, you're in. Slack, mentor hours, job leads, forever — not a 12-week transaction.",
  },
];

const PARTNERS = [
  "State DOE Approved",
  "NASBA Accredited",
  "AWS Academy",
  "GitHub Education",
  "Figma Partner",
  "MongoDB University",
  "Stripe Partners",
  "Vercel Community",
];

const METHOD = [
  { step: "01", title: "Learn the idea", body: "Short, focused sessions. No three-hour lectures — concepts land in under 40 minutes." },
  { step: "02", title: "Build it same day", body: "Every concept is followed by a lab where you write the code yourself, with a mentor in the room." },
  { step: "03", title: "Ship in public", body: "Projects go live with a URL you can share. Feedback comes from real users, not a rubric." },
  { step: "04", title: "Review and repeat", body: "Weekly code reviews, retros and interview drills until the habits stick." },
];

const FAQS = [
  { q: "Do I need prior coding experience?", a: "For the school and foundation tracks, no. For the flagship engineering programs, basic programming comfort helps — we assess it in the admissions call." },
  { q: "Are classes online or on campus?", a: "Both. Cohorts run live online, and our Rajarajeshwarinagar campus is open for labs, mentor hours and demo days." },
  { q: "What happens if I fall behind?", a: "Sessions are recorded, mentor hours are weekly, and you can repeat any module with the next cohort at no extra cost." },
  { q: "Do you help with placements?", a: "Yes — portfolio reviews, interview drills and introductions to hiring partners, with support continuing for 12 months after you finish." },
];

export function AboutPage() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  
  return (
    <Shell>
      <CatalogModal open={catalogOpen} onClose={() => setCatalogOpen(false)} />
      <AdmissionsModal open={admissionsOpen} onClose={() => setAdmissionsOpen(false)} />

      {/* HERO */}
      <section className="relative px-4 md:px-10 pt-6 pb-10">
        <Reveal>
          <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] bg-[#0F2A52] text-white px-6 py-12 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-40" />
            <div className="pointer-events-none absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-[#FF6B6B] opacity-25" />
            <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full border border-white/20" />
            <Squiggle className="pointer-events-none absolute right-6 bottom-6 h-20 w-48 opacity-30" />

            <div className="relative">
              <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-5"># About TekSchool</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.02] max-w-3xl">
                Built for people who actually{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">finish</span>
                  <span className="absolute inset-x-0 bottom-1 h-3 md:h-4 rounded-full bg-[#FF6B6B] opacity-80" />
                </span>{" "}
                what they start.
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
                TekSchool is a mentor-led technology school in Bengaluru. Small cohorts in AI,
                software, cloud and future engineering — taught by people who build for a living,
                not by pre-recorded slides.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-4xl">
                {[
                  { k: "Small cohorts", v: "Mentor-led, never more than a room full." },
                  { k: "Real projects", v: "Every track ends with something live." },
                  { k: "Bengaluru rooted", v: "Campus in Rajarajeshwarinagar." },
                ].map((i) => (
                  <div
                    key={i.k}
                    className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                  >
                    <p className="font-display text-base font-bold">{i.k}</p>
                    <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{i.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ORIGIN STORY */}
      <section className="relative px-4 md:px-10 py-12">
        <Squiggle className="pointer-events-none absolute left-6 top-6 h-24 w-56 opacity-50 text-slate-300" />
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-stretch max-w-6xl mx-auto">
          <Reveal className="h-full">
            <div className="flex flex-col h-full">
              <p className="inline-flex items-center self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># Why TekSchool exists</p>
              <div className="space-y-4 text-[15px] leading-relaxed text-slate-600 max-w-xl border-l-2 border-[#FF6B6B] pl-5">
                <p className="[&::first-letter]:font-display [&::first-letter]:text-5xl [&::first-letter]:font-bold [&::first-letter]:text-[#0F2A52] [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:leading-[0.85]">
                  I founded Tek School with a clear mission—to bridge the growing gap between
                  traditional education and the rapidly evolving technology industry. As the
                  Founder & CEO of a software company, I witnessed firsthand that many talented
                  candidates lacked the practical, industry-ready skills required for modern
                  technology roles, particularly in Artificial Intelligence.
                </p>
                <p>
                  This realization led to the creation of Tek School, an AI-first education
                  platform dedicated to preparing learners for the future of work. Today, Tek
                  School empowers students and professionals across the globe with hands-on,
                  industry-relevant training in AI, software development, and emerging technologies.
                </p>
                <p>
                  Our focus extends beyond teaching concepts—we equip learners with real-world
                  projects, practical experience, and the skills needed to thrive in an AI-driven
                  world. By combining industry expertise with innovative learning methodologies,
                  Tek School is committed to developing the next generation of technology
                  professionals who are ready to make an immediate impact.
                </p>
              </div>
              <p className="mt-4 max-w-xl pl-5 text-sm font-semibold text-slate-600">
                — Arunjith Nambiar (Founder)
              </p>
              <div className="mt-8 max-w-xl rounded-[1.75rem] bg-slate-100 p-6 md:p-7">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0F2A52] leading-tight">
                  “We got tired of watching sharp people quit halfway.”
                </h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={140} className="h-full min-h-[280px]">
            <div className="relative h-full rounded-[2rem] overflow-hidden bg-[#0F2A52] p-3 md:p-4 flex flex-col">
              <div className="relative flex-1 w-full min-h-0 overflow-hidden rounded-[1.25rem] bg-black/10">
                <img
                  src="/assets/raj-cohort-session.jpg"
                  alt="TekSchool cohort in session at Rajarajeshwarinagar campus"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="mt-3 shrink-0 text-center lg:text-left px-2">
                <p className="font-display text-base md:text-lg font-bold text-white">Cohort in session</p>
                <p className="text-sm font-semibold text-white/70">Rajarajeshwarinagar campus</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="relative px-4 md:px-10 py-14">
        <Reveal>
          <div className="mb-10 max-w-6xl mx-auto">
            <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># What we stand for</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold max-w-2xl text-[#0F2A52]">
              Four beliefs, held loosely but seriously.
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className={`rounded-[2rem] p-6 ${v.tint} min-h-[240px] flex flex-col`}>
                <v.icon className="h-8 w-8" />
                <h3 className="font-display text-xl font-bold mt-6">{v.title}</h3>
                <p className="mt-2 text-sm opacity-90">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="px-4 md:px-10 py-14">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-8">
              <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># By the numbers</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold max-w-2xl text-[#0F2A52]">
                Who we are, in figures.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[2.5rem] bg-[#0F2A52] text-white p-6 md:p-10 relative overflow-hidden">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-40" />
              <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#FF6B6B] opacity-20" />
              <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { n: "10", l: "Years running", s: "Since spring 2016" },
                  { n: "10,000+", l: "Students taught", s: "Across India and online" },
                  { n: "24", l: "Courses offered", s: "Industry-grade tracks" },
                  { n: "94%", l: "Placement rate", s: "Within 6 months of graduation" },
                ].map((s) => (
                  <div key={s.l} className="min-w-0">
                    <p className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-none">{s.n}</p>
                    <p className="mt-2 text-sm font-semibold opacity-90 leading-snug">{s.l}</p>
                    <p className="mt-1 text-xs opacity-60">{s.s}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW WE TEACH */}
      <section className="px-4 md:px-10 py-14">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-10">
              <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># How we teach</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold max-w-2xl text-[#0F2A52]">
                A loop that actually finishes.
              </h2>
              <p className="mt-3 text-slate-600 max-w-xl">
                Same four steps in every cohort, from a Class 6 robotics band to a year-long AI track.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((m, i) => (
              <Reveal key={m.step} delay={i * 80}>
                <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-6 flex flex-col">
                  <span className="font-display text-3xl font-bold text-[#FF6B6B]">{m.step}</span>
                  <h3 className="font-display text-xl font-bold mt-4 text-[#0F2A52]">{m.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="relative px-4 md:px-10 py-14">
        <div className="max-w-6xl mx-auto relative">
          <Squiggle className="pointer-events-none absolute right-10 top-2 h-24 w-56 opacity-60 text-slate-300" />
          <Reveal>
            <div className="mb-10">
              <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># Leadership</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold max-w-xl text-[#0F2A52]">
                People running the place.
              </h2>
              <p className="mt-3 text-slate-600 max-w-xl">
                The founders who run the place — and the students who make it worth running.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.3fr]">
            <Reveal delay={80}>
              <div className="group text-left w-full h-full rounded-[2rem] border border-slate-200 overflow-hidden bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E6E6FA]">
                  <img
                    src="/assets/arunjith-nambiar.png"
                    alt="Arunjith Nambiar — Founder & CEO of TekSchool"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-slate-500">Founder & CEO</p>
                  <p className="font-display text-lg font-bold mt-1 text-[#0F2A52]">Arunjith Nambiar</p>
                  <p className="mt-1 text-xs text-slate-500">Ex-Google, founded Kods and Anormos</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="group text-left w-full h-full rounded-[2rem] border border-slate-200 overflow-hidden bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E6E6FA]">
                  <img
                    src="/assets/vinutha-nagaraj.png"
                    alt="Vinutha Nagaraj — Co-Founder & Chief Business Officer of TekSchool"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold text-slate-500">Co-Founder &amp; CBO</p>
                  <p className="font-display text-lg font-bold mt-1 text-[#0F2A52]">Vinutha Nagaraj</p>
                  <p className="mt-1 text-xs text-slate-500">Ex-WhiteHat Jr. / BYJU’S, co-founded Anormos</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="relative h-full min-h-[360px] lg:min-h-0 rounded-[2rem] overflow-hidden bg-[#0F2A52]">
                <img
                  src="/assets/tekschool-student-app.jpg"
                  alt="TekSchool student holding a phone showing the TekSchool learning app."
                  className="absolute inset-0 h-full w-full object-cover object-[32%_center]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A52]/85 via-[#0F2A52]/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                  <span className="inline-flex items-center rounded-full bg-[#FF6B6B] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] -rotate-2 mb-3">
                    # Our students
                  </span>
                  <p className="font-display text-xl md:text-2xl font-bold text-white">
                    The energy that keeps TekSchool running.
                  </p>
                  <p className="mt-2 text-sm text-white/80 max-w-sm">
                    Small cohorts, real mentors, and students who finish what they start.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ACCREDITATION / PARTNERS */}
      <section className="px-4 md:px-10 py-14">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-6">
              <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># Accreditation & partners</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold max-w-2xl text-[#0F2A52]">
                Vouched for — and audited — by the people who should.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50/50 p-8">
              <div className="flex flex-wrap gap-3 items-center justify-center">
                {PARTNERS.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center rounded-full bg-white text-slate-500 border border-slate-200 px-3 py-1.5 text-xs md:text-sm font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-slate-500 max-w-xl mx-auto">
                TekSchool is a state-approved private career school. Curriculum is reviewed annually
                by an independent industry advisory board and refreshed every cohort.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-10 py-14">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-8">
              <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># Questions we get a lot</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold max-w-2xl text-[#0F2A52]">
                Before you ask us.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-6">
                  <h3 className="font-display text-lg md:text-xl font-bold text-[#0F2A52]">{f.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-4 md:px-10 pb-16 pt-4">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="rounded-[2.5rem] bg-[#0F2A52] text-white p-10 md:p-16 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-50" />
              <div className="absolute left-8 bottom-8 opacity-70 text-white">
                <Squiggle className="h-16 w-40" />
              </div>
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center rounded-full bg-[#FF6B6B] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white -rotate-2 mb-4">
                    # Come say hi
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                    Come see what we&apos;re building.
                  </h3>
                  <p className="mt-3 text-sm opacity-80 max-w-lg">
                    Browse the {COURSES_DATA.length} cohorts running this year, or just drop a note —
                    we read every one.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setCatalogOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-[#0F2A52] px-6 py-3 font-semibold transition-colors hover:bg-slate-100"
                  >
                    Explore courses <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdmissionsOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
                  >
                    Get in touch
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}

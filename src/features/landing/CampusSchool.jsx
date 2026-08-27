import { Link } from "react-router-dom";
import { useState } from "react";
import { Shell } from "../../components/layout/Shell.jsx";
import {
  ArrowUpRight, ArrowLeft, School, Blocks, Bot, Palette,
  ShieldCheck, Clock, Users, CheckCircle2, Quote, Sparkles,
} from "lucide-react";
import { CampusEnquiryDrawer } from "./CampusEnquiryDrawer.jsx";
import { LeadModal } from "./LeadModal.jsx";
import { CatalogModal } from "./CatalogModal.jsx";

const STAGES = [
  {
    grades: "Grades 1–3",
    age: "Ages 6–8",
    title: "Play & logic",
    body: "Block-based coding, sequencing and pattern games. Kids build their first animated story in week two.",
    icon: Blocks,
    tone: "coral",
  },
  {
    grades: "Grades 4–6",
    age: "Ages 9–11",
    title: "Build & create",
    body: "Scratch games, simple web pages and beginner robotics. Every term ends with a showcase the class presents.",
    icon: Palette,
    tone: "lavender",
  },
  {
    grades: "Grades 7–9",
    age: "Ages 12–14",
    title: "Code & automate",
    body: "Python foundations, micro:bit and Arduino projects, and an intro to how AI models actually work.",
    icon: Bot,
    tone: "blue",
  },
  {
    grades: "Grade 10+",
    age: "Ages 15+",
    title: "Ship & compete",
    body: "Full projects, hackathons, portfolio building and guidance for engineering entrance pathways.",
    icon: Sparkles,
    tone: "coral",
  },
];

const OUTCOMES = [
  "Every child ships a project each term — a game, a site or a working robot.",
  "Computational thinking taught alongside the school syllabus, not against it.",
  "Teachers get lesson plans, rubrics and progress reports they can use in reviews.",
  "Safe, structured screen time with zero unsupervised internet exposure.",
];

const HOW = [
  { step: "01", title: "Curriculum mapping", body: "We audit your existing computer-science hours and map our modules onto the grades you want covered." },
  { step: "02", title: "Lab & teacher setup", body: "Hardware checklist, kits and a two-day teacher orientation so your staff can co-teach from day one." },
  { step: "03", title: "Weekly sessions", body: "Tek mentors run sessions inside your timetable — in your lab, hybrid or fully online." },
  { step: "04", title: "Showcase & reporting", body: "Termly parent showcase plus grade-wise progress reports for the school leadership." },
];

const toneBg = (t) =>
  t === "blue"
    ? "bg-[#E0F2FE] text-[#1D4ED8]"
    : t === "coral"
    ? "bg-[#FF6B6B] text-white"
    : "bg-[#E6E6FA] text-[#0F2A52]";

export function CampusSchool() {
  const [enquiry, setEnquiry] = useState(false);
  const [proposal, setProposal] = useState(false);
  const [catalog, setCatalog] = useState(false);
  const [collegeLead, setCollegeLead] = useState(false);

  return (
    <Shell>
      {/* Hero */}
      <section className="px-4 md:px-10 pt-10 pb-12 bg-white">
        <div className="mx-auto max-w-6xl">
          <Link to="/campus" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0F2A52]">
            <ArrowLeft className="h-4 w-4" /> Back to Tek Campus
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/15 px-3 py-1 text-xs font-semibold text-[#FF6B6B]">
                <School className="h-3.5 w-3.5" /> Tek Campus at School
              </span>
              <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-[#0F2A52]">
                Future-ready skills, taught inside your <span className="text-[#FF6B6B]">school</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-slate-600">
                A grade-wise coding, robotics and AI-literacy programme for ages 6–15 — delivered in your
                classrooms, on your timetable, by mentors who build software for a living.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setEnquiry(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F2A52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90 transition-colors"
                >
                  Bring Tek Campus to our school <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCatalog(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 text-[#0F2A52]"
                >
                  See the curriculum
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Users className="h-4 w-4" /> Ages 6–15</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> 1–2 sessions / week</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Vetted mentors</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#FF6B6B] to-[#e8876b] p-4 shadow-2xl shadow-[#FF6B6B]/20">
              <img
                src="/assets/real-kid-laptop.jpg"
                alt="School children learning to code with a teacher"
                loading="lazy"
                className="h-full max-h-[420px] w-full rounded-[2.2rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="px-4 md:px-10 py-10 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3"># Grade-wise pathway</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-[#0F2A52]">
              One continuous track, from blocks to real code.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s, i) => (
              <div
                key={s.title}
                className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1.5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${toneBg(s.tone)}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">{s.grades} · {s.age}</p>
                <p className="mt-1.5 font-display text-lg font-bold text-[#0F2A52]">{s.title}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes + how it runs */}
      <section className="px-4 md:px-10 py-10 bg-white">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="rounded-[2.5rem] bg-[#E6E6FA] p-8 md:p-10 text-[#0F2A52]">
            <p className="font-display text-2xl font-bold">What your students walk away with</p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed">
              {OUTCOMES.map((o) => (
                <li key={o} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
            <p className="font-display text-2xl font-bold text-[#0F2A52]">How it runs on your campus</p>
            <ol className="mt-6 space-y-5">
              {HOW.map((h) => (
                <li key={h.step} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-[#0F2A52]">{h.step}</span>
                  <span>
                    <span className="block font-display font-bold text-[#0F2A52]">{h.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{h.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Gallery + voice */}
      <section className="px-4 md:px-10 py-10 bg-slate-50">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-3">
          {["/assets/real-kids-class.jpg", "/assets/real-kids-classroom2.jpg"].map((src) => (
            <div key={src} className="rounded-[2rem] border border-slate-200 bg-white p-4">
              <img src={src} alt="Students building projects in a Tek Campus session" loading="lazy" className="mx-auto aspect-[4/3] w-full rounded-2xl object-cover" />
            </div>
          ))}
          <figure className="flex flex-col justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <Quote className="h-6 w-6 text-[#FF6B6B]" />
            <blockquote className="mt-4 text-sm leading-relaxed text-slate-600">
              "We made a game in the first month. I didn't know I could do that. Now I teach my younger brother."
            </blockquote>
            <figcaption className="mt-5">
              <p className="font-display font-bold text-[#0F2A52]">Meera S.</p>
              <p className="text-xs text-slate-500">Grade 9, partner school</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-10 py-14">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-[#0F2A52] p-10 md:p-14 text-center text-white shadow-lg">
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            Bring Tek Campus to your school this term.
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-sm md:text-base opacity-90">
            Share your grades and timetable — we'll come back with a term plan, kit list and pricing for the whole cohort.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => setProposal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6B6B] px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Request a school proposal
            </button>
            <button
              type="button"
              onClick={() => setCollegeLead(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20"
            >
              Looking for college? →
            </button>
          </div>
        </div>
      </section>

      <CampusEnquiryDrawer open={enquiry} onClose={() => setEnquiry(false)} />

      <LeadModal
        open={proposal}
        onClose={() => setProposal(false)}
        badge="School partnerships"
        title="Request a school proposal"
        subtitle="Share your details and we'll send a term plan, kit list and pricing for your school."
        interest="Tek Campus at school"
        institutionType="School"
        cta="Send my proposal request"
      />

      <LeadModal
        open={collegeLead}
        onClose={() => setCollegeLead(false)}
        badge="College partnerships"
        title="Looking for a college programme?"
        subtitle="Tell us where you are — our campus team will share the Tek Campus at College plan."
        interest="Tek Campus at college"
        institutionType="College / University"
        cta="Request college details"
      />
      <CatalogModal open={catalog} onClose={() => setCatalog(false)} />
    </Shell>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import { Shell } from "../../components/layout/Shell.jsx";
import {
  ArrowUpRight, ArrowLeft, GraduationCap, Briefcase, Cpu, Rocket,
  LineChart, Users, Clock, CheckCircle2, Quote, Building2,
} from "lucide-react";
import { CampusEnquiryDrawer } from "./CampusEnquiryDrawer.jsx";
import { LeadModal } from "./LeadModal.jsx";
import { CatalogModal } from "./CatalogModal.jsx";

const TRACKS = [
  {
    title: "AI & applied ML",
    body: "RAG systems, model fine-tuning and agentic workflows — students ship a working AI product, not a notebook.",
    icon: Cpu,
    tone: "blue",
  },
  {
    title: "Cloud & DevOps",
    body: "AWS, Docker, Kubernetes and CI/CD, with certification prep folded into the semester plan.",
    icon: Rocket,
    tone: "lavender",
  },
  {
    title: "Full-stack engineering",
    body: "Modern web stack, code review discipline and a deployed portfolio project per student.",
    icon: Briefcase,
    tone: "coral",
  },
  {
    title: "Placement readiness",
    body: "DSA sprints, mock interviews, resume and portfolio reviews, plus intros to hiring partners.",
    icon: LineChart,
    tone: "blue",
  },
];

const OUTCOMES = [
  "Students graduate with a deployed portfolio, not just a transcript.",
  "Campus internships on real client briefs, supervised by working engineers.",
  "Placement metrics your department can report with confidence.",
  "Faculty upskilling sessions included with every partner cohort.",
];

const HOW = [
  { step: "01", title: "Department alignment", body: "We map modules to your semester calendar and credit structure with the HOD and placement cell." },
  { step: "02", title: "Cohort onboarding", body: "Diagnostic assessment, cohort split by level, and lab setup inside your existing infrastructure." },
  { step: "03", title: "Build semester", body: "Weekly mentor-led builds, code reviews and sprint demos — hybrid or on campus." },
  { step: "04", title: "Placement bridge", body: "Mock rounds, portfolio audits and direct introductions to our hiring partner network." },
];

const STATS = [
  { v: "40+", l: "Partner campuses" },
  { v: "400+", l: "Students placed" },
  { v: "94%", l: "Completion rate" },
  { v: "6 mo", l: "Typical cohort" },
];

const toneBg = (t) =>
  t === "blue"
    ? "bg-[#E0F2FE] text-[#1D4ED8]"
    : t === "coral"
    ? "bg-[#FF6B6B] text-white"
    : "bg-[#E6E6FA] text-[#0F2A52]";

export function CampusCollege() {
  const [enquiry, setEnquiry] = useState(false);
  const [proposal, setProposal] = useState(false);
  const [catalog, setCatalog] = useState(false);
  const [schoolLead, setSchoolLead] = useState(false);

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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
                <GraduationCap className="h-3.5 w-3.5" /> Tek Campus at College
              </span>
              <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-[#0F2A52]">
                From syllabus to <span className="text-[#1D4ED8]">shipped software</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-slate-600">
                Industry cohorts in AI, cloud and full-stack engineering — run inside your college, mapped to your
                semester calendar, with internships and placement support built in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setEnquiry(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F2A52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90 transition-colors"
                >
                  Partner with Tek Campus <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCatalog(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 text-[#0F2A52]"
                >
                  Browse programmes
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Users className="h-4 w-4" /> 2nd year to final year</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Semester-aligned</span>
                <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> On campus or hybrid</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#0F2A52] to-[#1D4ED8] p-4 shadow-2xl shadow-[#0F2A52]/20">
              <img
                src="/assets/real-college-coding.jpg"
                alt="College students collaborating on a Tek Campus project"
                loading="lazy"
                className="h-full max-h-[420px] w-full rounded-[2.2rem] object-cover"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="font-display text-3xl font-bold text-[#0F2A52]">{s.v}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="px-4 md:px-10 py-10 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3"># What we run</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-[#0F2A52]">
              Four tracks, one placement outcome.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRACKS.map((t, i) => (
              <div
                key={t.title}
                className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1.5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${toneBg(t.tone)}`}>
                  <t.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 font-display text-lg font-bold text-[#0F2A52]">{t.title}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internships */}
      <section className="px-4 md:px-10 py-10 bg-white">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
            <span className="inline-flex items-center rounded-full bg-[#E6E6FA] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0F2A52] mb-4 w-fit"># Internships on campus</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-[#0F2A52]">
              Real client briefs, shipped from your own labs.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Selected students join live internship sprints inside their campus. They work on real products under working engineers, build shipped portfolio pieces, and earn internship certificates that hiring partners recognise.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1D4ED8]" />
                <span>Real projects sourced from Tek School's partner network.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1D4ED8]" />
                <span>Dedicated mentors review code, run standups and set deadlines.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1D4ED8]" />
                <span>Internship certificates + LinkedIn portfolio support.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#1D4ED8]" />
                <span>Direct pathway to placement interviews with partner companies.</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setEnquiry(true)}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#E6E6FA] px-6 py-3 text-sm font-semibold text-[#0F2A52] hover:bg-[#E6E6FA]/90"
            >
              Request internship details <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden bg-[#E6E6FA]/50 p-4 md:p-6">
            <img
              src="/assets/real-college-team.jpg"
              alt="Students collaborating on a Tek Campus internship sprint"
              loading="lazy"
              className="h-full w-full rounded-[2rem] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Outcomes + how it runs */}
      <section className="px-4 md:px-10 py-10 bg-slate-50">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="rounded-[2.5rem] bg-[#E6E6FA] p-8 md:p-10 text-[#0F2A52]">
            <p className="font-display text-2xl font-bold">What your department gets</p>
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
            <p className="font-display text-2xl font-bold text-[#0F2A52]">How a semester runs</p>
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
      <section className="px-4 md:px-10 py-10 bg-white">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-3">
          {["/assets/real-college-team.jpg", "/assets/real-college-lab.jpg"].map((src) => (
            <div key={src} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4">
              <img src={src} alt="Work shipped from a Tek Campus college cohort" loading="lazy" className="mx-auto aspect-[4/3] w-full rounded-2xl object-cover" />
            </div>
          ))}
          <figure className="flex flex-col justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <Quote className="h-6 w-6 text-[#1D4ED8]" />
            <blockquote className="mt-4 text-sm leading-relaxed text-slate-600">
              "Placement conversations changed completely. Our students now talk about what they built instead of what they studied."
            </blockquote>
            <figcaption className="mt-5">
              <p className="font-display font-bold text-[#0F2A52]">Prof. K. Srinivas</p>
              <p className="text-xs text-slate-500">HOD, Computer Science</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-10 py-14">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-[#0F2A52] p-10 md:p-14 text-center text-white shadow-lg">
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            Run the next cohort on your campus.
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-sm md:text-base opacity-90">
            Send us your semester calendar and student count — we'll design the cohort, pricing and internship plan around it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => setProposal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6B6B] px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Request a college proposal
            </button>
            <button
              type="button"
              onClick={() => setSchoolLead(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20"
            >
              Looking for school? →
            </button>
          </div>
        </div>
      </section>

      <CampusEnquiryDrawer open={enquiry} onClose={() => setEnquiry(false)} />

      <LeadModal
        open={proposal}
        onClose={() => setProposal(false)}
        badge="College partnerships"
        title="Request a college proposal"
        subtitle="Share your details and we'll send a cohort, pricing and internship plan for your campus."
        interest="Tek Campus at college"
        institutionType="College / University"
        cta="Send my proposal request"
      />

      <LeadModal
        open={schoolLead}
        onClose={() => setSchoolLead(false)}
        badge="School programmes"
        title="Looking for a school programme?"
        subtitle="Tell us where you are — our school team will share the Tek Campus at School plan."
        interest="Tek Campus at school"
        institutionType="School"
        cta="Request school details"
      />
      <CatalogModal open={catalog} onClose={() => setCatalog(false)} />
    </Shell>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import { Shell } from "../../components/layout/Shell.jsx";
import {
  ArrowUpRight, ArrowLeft, Cpu, Bot, BookOpen, Users, Headphones, Award,
  Building2, School, GraduationCap,
} from "lucide-react";
import { LeadModal } from "./LeadModal.jsx";

const FEATURES = [
  { icon: Cpu, title: "AI workstations & maker kits", desc: "GPU-enabled desktops, micro:bits, Arduino and robotics hardware shipped to your lab." },
  { icon: BookOpen, title: "Age-banded curriculum", desc: "Ready lesson plans mapped to CBSE / NEP outcomes for grades 3 through 12." },
  { icon: Users, title: "Teacher upskilling", desc: "Hands-on certification program so your faculty can run the lab confidently." },
  { icon: Bot, title: "AI & robotics projects", desc: "Chatbots, image classifiers, line-following rovers and capstone demos every term." },
  { icon: Headphones, title: "Ongoing support", desc: "Technical maintenance, content updates and a dedicated campus success manager." },
  { icon: Award, title: "Student certification", desc: "Portfolio reports and completion certificates for every learner." },
];

const INCLUSIONS = [
  "Hardware audit, procurement and lab layout design.",
  "Curriculum aligned to your board and grade structure.",
  "Faculty training + refresher workshops every term.",
  "Annual content updates and new project kits.",
  "Student portfolio reports and parent showcase events.",
];

const STATS = [
  { v: "K-12", l: "Grade coverage" },
  { v: "200+", l: "Lab projects" },
  { v: "30+", l: "Partner schools" },
  { v: "1 yr", l: "Full warranty" },
];

export function CampusAILab() {
  const [leadOpen, setLeadOpen] = useState(false);

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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6E6FA]/50 px-3 py-1 text-xs font-semibold text-[#0F2A52]">
                <Cpu className="h-3.5 w-3.5" /> AI Lab Set up
              </span>
              <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-[#0F2A52]">
                A ready-to-run <span className="text-[#1D4ED8]">AI + robotics lab</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-slate-600">
                End-to-end lab infrastructure, hardware kits, curriculum and trainer enablement for schools and colleges — so students build real AI and robotics projects from day one.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setLeadOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E6E6FA] px-6 py-3 text-sm font-semibold text-[#0F2A52] hover:bg-[#E6E6FA]/90 transition-colors"
                >
                  Request AI lab setup <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href="https://wa.me/918080187187"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 text-[#0F2A52]"
                >
                  Chat on WhatsApp
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Schools & colleges</span>
                <span className="flex items-center gap-2"><School className="h-4 w-4" /> Grades 3 to 12</span>
                <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> UG labs</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#E6E6FA] to-[#1D4ED8] p-4 shadow-2xl shadow-[#1D4ED8]/20">
              <img
                src="/assets/real-college-lab.jpg"
                alt="Students working in an AI and robotics lab"
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

      {/* Features */}
      <section className="px-4 md:px-10 py-10 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3"># What you get</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-[#0F2A52]">
              Hardware, curriculum, training and support — all in one.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1.5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E6E6FA] text-[#0F2A52]">
                  <f.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 font-display text-lg font-bold text-[#0F2A52]">{f.title}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions + assessment */}
      <section className="px-4 md:px-10 py-10 bg-white">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="rounded-[2.5rem] bg-[#E6E6FA] p-8 md:p-10 text-[#0F2A52]">
            <p className="font-display text-2xl font-bold">Everything included</p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed">
              {INCLUSIONS.map((o) => (
                <li key={o} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-current shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
            <p className="font-display text-2xl font-bold text-[#0F2A52]">Start with a free campus assessment</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Our team visits your institution, audits the available space, power and internet, and recommends the right lab configuration — from a single classroom maker corner to a full GPU lab.
            </p>
            <ol className="mt-6 space-y-5">
              {[
                { step: "01", title: "Space audit", body: "We measure your room, check power and network, and suggest the best layout." },
                { step: "02", title: "Custom quote", body: "You receive a hardware, curriculum and training proposal tailored to your budget." },
                { step: "03", title: "Setup & handover", body: "We install, configure and train your faculty before the first student walks in." },
              ].map((h) => (
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

      {/* CTA */}
      <section className="px-4 md:px-10 py-14">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-[#0F2A52] p-10 md:p-14 text-center text-white shadow-lg">
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            Build an AI lab your students will actually use.
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-sm md:text-base opacity-90">
            Tell us about your institution and we'll share a tailored lab proposal, hardware list and curriculum plan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => setLeadOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6B6B] px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Request AI lab setup
            </button>
            <a
              href="https://wa.me/918080187187"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        badge="AI Lab Set up"
        title="Request an AI Lab"
        subtitle="Tell us about your institution and we'll share a tailored lab proposal."
        interest="AI Lab Set up"
        institutionType="AI Lab enquiry"
        cta="Send request"
        inquiryType="ai lab"
      />
    </Shell>
  );
}

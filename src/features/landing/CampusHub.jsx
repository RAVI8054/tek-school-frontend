import { Link } from "react-router-dom";
import { Shell } from "../../components/layout/Shell.jsx";
import { ArrowUpRight, GraduationCap, School, Cpu } from "lucide-react";

const ENTRY_POINTS = [
  {
    icon: GraduationCap,
    title: "Tek Campus at college",
    body: "Industry-aligned cohorts in AI, Cloud, Full-stack and internships — delivered on your campus.",
    tone: "blue",
    to: "/campus/college",
    cta: "Explore college",
  },
  {
    icon: School,
    title: "Tek Campus at school",
    body: "Foundational coding, robotics and AI for young learners — taught inside your school.",
    tone: "coral",
    to: "/campus/school",
    cta: "Explore school",
  },
  {
    icon: Cpu,
    title: "AI Lab Set up",
    body: "End-to-end AI lab infrastructure, hardware kits, curriculum and trainer enablement for your institution.",
    tone: "lavender",
    to: "/campus/ai-lab",
    cta: "View details",
  },
];

const toneIconBg = (t) => {
  if (t === "blue") return "bg-[#E0F2FE] text-[#1D4ED8]"; // sky, accent-blue-deep
  if (t === "coral") return "bg-[#FF6B6B] text-white";
  return "bg-[#E6E6FA] text-[#0F2A52]";
};

const toneCorner = (t) => {
  if (t === "blue") return "bg-[#E0F2FE]/20";
  if (t === "coral") return "bg-[#FF6B6B]/20";
  return "bg-[#E6E6FA]/20";
};

const toneButton = (t) => {
  if (t === "blue") return "bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]/90";
  if (t === "coral") return "bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/90";
  return "bg-[#E6E6FA] text-[#0F2A52] hover:bg-[#E6E6FA]/90";
};

export function CampusHub() {
  const cardClasses =
    "group relative flex flex-col overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-8 md:p-10 text-left shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-md";

  return (
    <Shell>
      <section className="relative px-4 md:px-10 pt-16 pb-24 md:pb-28 overflow-hidden bg-slate-50">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#E0F2FE] opacity-[0.16] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-[-6rem] bottom-[-8rem] h-[22rem] w-[22rem] rounded-full bg-[#FF6B6B] opacity-[0.12] blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500"># Tek Campus</span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mt-6 text-[#0F2A52]">
            Empowering the <span className="text-[#FF6B6B]">future</span> of academic excellence.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
            Tek Campus provides a seamless ecosystem for schools and colleges to bridge foundational learning with real-world tech skills.
          </p>
        </div>

        <div className="relative mt-14 md:mt-16 mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
          {ENTRY_POINTS.map((e, i) => (
            <Link
              key={e.title}
              to={e.to}
              className={cardClasses}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div
                className={`absolute -right-16 -top-16 h-40 w-40 rounded-bl-full transition-transform duration-700 group-hover:scale-150 ${toneCorner(e.tone)}`}
              />
              <span className={`relative grid h-14 w-14 place-items-center rounded-2xl shadow-inner ${toneIconBg(e.tone)}`}>
                <e.icon className="h-6 w-6" />
              </span>
              <p className="relative mt-6 font-display text-xl md:text-2xl font-bold text-[#0F2A52]">{e.title}</p>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-500">{e.body}</p>
              <span className={`relative mt-8 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform ${toneButton(e.tone)}`}>
                {e.cta} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}

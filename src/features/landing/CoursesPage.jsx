import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Shell } from "../../components/layout/Shell.jsx";
import { Squiggle, Asterisk } from "../../components/ui/Doodles.jsx";
import { Reveal } from "../../components/ui/Reveal.jsx";
import { Search, ArrowUpRight, Clock, Users } from "lucide-react";
import { COURSES_DATA } from "../../lib/courses-data.js";

const CATEGORIES = ["All", "Web Dev", "Design", "Data & AI", "Product", "Mobile"];
const LEVELS = ["Any level", "Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["Any length", "≤ 8 weeks", "9–12 weeks", "13+ weeks"];

export function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("Any level");
  const [dur, setDur] = useState("Any length");

  const filtered = COURSES_DATA.filter((c) => {
    if (cat !== "All" && c.category !== cat) return false;
    if (lvl !== "Any level" && c.level !== lvl) return false;
    if (dur === "≤ 8 weeks" && c.weeks > 8) return false;
    if (dur === "9–12 weeks" && (c.weeks < 9 || c.weeks > 12)) return false;
    if (dur === "13+ weeks" && c.weeks < 13) return false;
    if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <Shell>
      <section className="relative px-4 md:px-10 pt-6 pb-10">
        <Squiggle className="pointer-events-none absolute right-10 top-4 h-24 w-56 opacity-60 text-slate-300" />
        <div className="flex items-center gap-3 mb-4">
          <Asterisk className="h-8 w-8 text-[#FF6B6B]" />
          <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500"># Catalog</p>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight max-w-2xl leading-[0.95] text-[#0F2A52]">
          Find your path.
        </h1>
        <p className="mt-4 text-slate-500 max-w-lg">
          Nine live cohorts. Real projects. Mentors who've done it.
        </p>

        {/* Search */}
        <div className="mt-8 flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-5 pr-2 py-2 max-w-xl shadow-sm focus-within:ring-2 focus-within:ring-[#0F2A52]/30 focus-within:border-[#0F2A52]">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="flex-1 bg-transparent py-2 text-sm outline-none min-w-0 text-[#0F2A52]"
            maxLength={80}
          />
        </div>

        <div className="mt-6 space-y-3">
          <FilterRow label="Category" value={cat} options={CATEGORIES} onChange={setCat} accent="navy" />
          <FilterRow label="Level" value={lvl} options={LEVELS} onChange={setLvl} accent="coral" />
          <FilterRow label="Duration" value={dur} options={DURATIONS} onChange={setDur} accent="lavender" />
        </div>
      </section>

      <section className="px-4 md:px-10 pb-16">
        <p className="text-sm text-slate-500 mb-6 font-semibold">{filtered.length} {filtered.length === 1 ? "course" : "courses"}</p>
        {filtered.length === 0 ? (
          <EmptyResults />
        ) : (
          <div key={`${cat}|${lvl}|${dur}|${q}`} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <Reveal key={c.slug} index={i} y={16}><CourseCard course={c} /></Reveal>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}

function FilterRow({
  label, value, options, onChange, accent,
}) {
  const activeBg =
    accent === "navy" ? "#0F2A52" :
    accent === "coral" ? "#FF6B6B" :
    "#E6E6FA";
  const activeFg =
    accent === "navy" ? "#ffffff" :
    accent === "coral" ? "#ffffff" :
    "#0F2A52";

  const rowRef = useRef(null);
  const [rect, setRect] = useState(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const active = row.querySelector(`[data-opt="${value}"]`);
    if (!active) return;
    const rr = row.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setRect({ left: ar.left - rr.left, top: ar.top - rr.top, width: ar.width, height: ar.height });
  }, [value, options]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 w-20 shrink-0">{label}</span>
      <div ref={rowRef} className="relative flex flex-wrap items-center gap-2">
        {rect && (
          <span
            aria-hidden
            className="absolute rounded-full pointer-events-none z-0"
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              background: activeBg,
              transition: "left 320ms cubic-bezier(0.2, 0.9, 0.3, 1), top 320ms cubic-bezier(0.2, 0.9, 0.3, 1), width 320ms cubic-bezier(0.2, 0.9, 0.3, 1)",
            }}
          />
        )}
        {options.map((o) => (
          <button
            key={o}
            data-opt={o}
            onClick={() => onChange(o)}
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-transparent relative z-10 transition-colors"
            style={value === o
              ? { color: activeFg, background: "transparent" }
              : { background: "white", color: "#0F2A52", border: "1px solid #E2E8F0" }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CourseCard({ course }) {
  const bg =
    course.color === "coral" ? "bg-[#FF6B6B] text-white"
      : course.color === "lavender" ? "bg-[#E6E6FA] text-[#0F2A52]"
      : course.color === "blue" ? "bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] text-white"
      : "bg-[#0F2A52] text-white";
  const soldOut = course.seatsLeft === 0;
  return (
    <Link
      to={`/programs/${course.slug}`}
      className={`group rounded-[2rem] p-6 ${bg} flex flex-col min-h-[300px] hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-white/40 backdrop-blur-sm text-current px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rotate-[-3deg]">
          # {course.category}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0F2A52] group-hover:rotate-45 transition-transform">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold mt-6 leading-tight">{course.title}</h3>
      <p className="mt-2 text-sm opacity-85">{course.blurb}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold">₹{course.price.toLocaleString("en-IN")}</span>
        <span className="text-xs opacity-75">or ₹{course.priceMonthly}/mo</span>
      </div>
      <div className="mt-auto pt-4 flex items-center gap-3 text-xs font-medium flex-wrap">
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
        <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{course.students}</span>
        <span className="inline-flex items-center rounded-full bg-white/25 text-current text-[10px] py-0.5 px-2">{course.level}</span>
        <span className={`ml-auto inline-flex items-center rounded-full text-[10px] font-semibold uppercase tracking-wider py-0.5 px-2 ${soldOut ? "bg-black/70 text-white" : "bg-white text-[#0F2A52]"}`}>
          {soldOut ? "Waitlist" : `${course.seatsLeft} seats`}
        </span>
      </div>
    </Link>
  );
}

function EmptyResults() {
  return (
    <div className="rounded-[2rem] border border-slate-200 p-12 text-center bg-white">
      <Asterisk className="mx-auto h-16 w-16 mb-4 text-[#1D4ED8]" />
      <h3 className="font-display text-2xl font-bold text-[#0F2A52]">Nothing matches — yet.</h3>
      <p className="mt-2 text-slate-500 text-sm">Try a broader filter or clear your search.</p>
    </div>
  );
}

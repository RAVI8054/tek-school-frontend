import { useState } from "react";
import { CLASSES } from "../../../lib/dashboard-data";
import { ClassVideoModal } from "../../../components/dashboard/ClassVideoModal";
import { PlayCircle, CheckCircle2, Circle, BookOpen } from "lucide-react";


export default ClassesPage;

const TONES = [
{ bar: "from-[#6D4AFF] to-[#9B7BFF]", chip: "bg-[#EFE9FF] text-[#4B2FBF]" },
{ bar: "from-[#2D5FA8] to-[#5B9BE0]", chip: "bg-[#E6F0FB] text-[#1D4A85]" },
{ bar: "from-[#E85D4C] to-[#FF9182]", chip: "bg-[#FFE8E5] text-[#A5372A]" },
{ bar: "from-[#1B5E44] to-[#3FA07A]", chip: "bg-[#D9F2E7] text-[#14513B]" }];


export function ClassesPage() {
  const [module, setModule] = useState("all");
  const [demo, setDemo] = useState(null);

  const modules = Array.from(new Set(CLASSES.map((c) => c.module.split(" · ")[0])));
  const filtered = module === "all" ? CLASSES : CLASSES.filter((c) => c.module.startsWith(module));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">My Classes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every class in your track, with the mentor who teaches it.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterPill active={module === "all"} onClick={() => setModule("all")} label="All modules" />
        {modules.map((m) =>
        <FilterPill key={m} active={module === m} onClick={() => setModule(m)} label={m} />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c, i) =>
        <ClassCard key={c.id} c={c} tone={TONES[i % TONES.length]} onDemo={() => setDemo(c)} />
        )}
      </div>

      <ClassVideoModal
        open={!!demo}
        title={demo?.topic ?? ""}
        instructor={demo?.instructor ?? ""}
        onClose={() => setDemo(null)} />
      
    </div>);

}

function FilterPill({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
      active ? "bg-primary text-primary-foreground" : "border border-border bg-white text-muted-foreground hover:text-foreground"}`
      }>
      
      {label}
    </button>);

}

function ClassCard({ c, tone, onDemo }) {
  const done = c.status === "completed";
  return (
    <article className="group flex overflow-hidden rounded-3xl border border-border bg-white transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)]">
      <div className={`w-1.5 shrink-0 bg-gradient-to-b ${tone.bar}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone.chip}`}>
            <BookOpen className="mr-1 inline h-3 w-3" />
            {c.module.split(" · ")[0]}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            {done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Circle className="h-3.5 w-3.5" />}
            {done ? "Completed" : "Available"}
          </span>
        </div>

        <h3 className="font-display text-base font-bold leading-snug">{c.topic}</h3>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-sm text-muted-foreground">
            Instructor · <span className="font-semibold text-foreground">{c.instructor}</span>
          </p>
          <button
            onClick={onDemo}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.03]">
            
            <PlayCircle className="h-4 w-4" /> Watch demo
          </button>
        </div>
      </div>
    </article>);

}
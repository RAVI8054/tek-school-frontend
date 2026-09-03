import { Target, CheckCircle2, Circle } from "lucide-react";

export function ReadinessSection({ readinessScore, readinessList, _profile }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="pill-tag -rotate-2 bg-lavender/50"><Target className="h-3 w-3" /> Readiness tracker</span>
          <h2 className="mt-2 font-display text-xl font-bold">You're {readinessScore}% placement-ready</h2>
          <p className="text-xs text-muted-foreground">Complete the checklist below before the March recruiter meet.</p>
        </div>
        <div className="relative grid h-24 w-24 place-items-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-muted)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-accent-blue-deep)" strokeWidth="3" strokeDasharray={`${readinessScore}, 100`} strokeLinecap="round" />
          </svg>
          <span className="font-display text-xl font-bold">{readinessScore}%</span>
        </div>
      </div>
      <ul className="mt-5 grid gap-2 md:grid-cols-2">
        {readinessList.map((r, i) => (
          <li key={i} className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm">
            {r.done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-blue-deep" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
            <span className={r.done ? "line-through opacity-60" : ""}>{r.label}</span>
            {r.progress && <span className="ml-auto text-xs font-semibold text-muted-foreground">{r.progress}</span>}
          </li>
        ))}
      </ul>


    </section>
  );
}

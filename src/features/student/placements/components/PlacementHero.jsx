import { Briefcase } from "lucide-react";

export function PlacementHero({ readinessScore, jobsCount, applicationsCount }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#2B4FC7] to-[#4338CA] p-8 md:p-10 text-white">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#F4A261]/20 blur-3xl" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <span className="pill-tag -rotate-2 bg-white/15 text-white backdrop-blur"><Briefcase className="h-3 w-3" /> Placement cell</span>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight">Get hired, not just certified.</h1>
          <p className="mt-2 max-w-lg text-sm text-white/80">Your placement readiness, roles matched to your track, and every application in one place.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { k: "Readiness", v: `${readinessScore}%` },
              { k: "Open roles", v: String(jobsCount) },
              { k: "Active applications", v: String(applicationsCount) }
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="font-display text-xl font-bold leading-none">{s.v}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-white/70">{s.k}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative grid h-28 w-28 place-items-center justify-self-start md:justify-self-end">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray={`${readinessScore}, 100`} strokeLinecap="round" />
          </svg>
          <span className="font-display text-xl font-bold">{readinessScore}%</span>
        </div>
      </div>
    </section>
  );
}

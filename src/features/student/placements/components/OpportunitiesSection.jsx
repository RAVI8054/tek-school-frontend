import { MapPin } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { useStudentPlacementsStore } from "../../../../store/useStudentPlacementsStore.js";

export function OpportunitiesSection({ jobs, onSelectJob }) {
  const { applyForJob } = useStudentPlacementsStore();
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-bold">Opportunities for you</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((j) => (
          <div key={j.id} className="group relative rounded-3xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start gap-4">
              <CompanyLogo domain={j.logoDomain} name={j.company} />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center rounded-full bg-accent-blue/12 px-3 py-1 text-[11px] font-bold text-[var(--accent-blue-deep)] ring-1 ring-[var(--accent-blue-deep)]/15">Matches {j.matchTrack}</span>
                <h3 className="mt-1.5 font-display text-lg font-bold leading-snug">{j.role}</h3>
                <p className="text-sm font-semibold">{j.company}</p>
                {j.skills && j.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {j.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">{skill}</span>
                    ))}
                    {j.skills.length > 3 && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">+{j.skills.length - 3}</span>}
                  </div>
                )}
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {j.location}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="text-xs text-muted-foreground">{j.salary} · {j.postedDays}d ago</div>
              <div className="flex items-center gap-2">
                <button onClick={() => onSelectJob(j)} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-slate-50">View</button>
                <button 
                  onClick={() => applyForJob(j._id, j.company)}
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                  Apply now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

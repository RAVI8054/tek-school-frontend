import { openAction } from "../../../../lib/action-bus";

export function PipelineSection({ stages, applications }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-bold">Your pipeline</h2>
      <div className="grid gap-3 md:grid-cols-4">
        {stages.map((stage) => {
          const apps = applications.filter((a) => a.stage === stage);
          const tone = stage === "Offer" ? "bg-lavender/50" : stage === "Interview" ? "bg-accent-blue/20" : "bg-muted";
          return (
            <div key={stage} className={`rounded-3xl p-4 ${tone}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">{stage}</span>
                <span className="text-xs font-bold">{apps.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {apps.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
                {apps.map((a) => (
                  <button key={a.id} onClick={() => openAction({ kind: "view-application", role: a.role, company: a.company, stage: a.stage })} className="w-full rounded-2xl bg-white p-3 text-left text-xs hover:ring-2 hover:ring-[var(--accent-blue-deep)]/40">
                    <p className="font-semibold">{a.company}</p>
                    <p className="text-muted-foreground">{a.role}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{a.lastUpdate}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

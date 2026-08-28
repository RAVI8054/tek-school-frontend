import { RESOURCES } from "../../../lib/dashboard-data";
import { openAction } from "../../../lib/action-bus";
import { FileText, PlayCircle, Wrench, HelpCircle, Download } from "lucide-react";


export default ResourcesPage;

export function ResourcesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">Curriculum, recordings, tool access, and the shortcuts you'll wish you knew earlier.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {RESOURCES.map((r) => {
          const Icon = r.kind === "PDF" ? FileText : r.kind === "Recording" ? PlayCircle : r.kind === "Tool" ? Wrench : HelpCircle;
          const tone = r.kind === "PDF" ? "bg-coral/40" : r.kind === "Recording" ? "bg-accent-blue/20" : r.kind === "Tool" ? "bg-lavender/50" : "bg-muted";
          return (
            <button key={r.title} onClick={() => openAction({ kind: "open-resource", title: r.title, kind_: r.kind, desc: r.desc })} className="flex items-start gap-4 rounded-3xl border border-border bg-white p-5 text-left hover:border-primary">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <span className="pill-tag -rotate-2 bg-muted/60 text-[10px]">{r.kind}</span>
                <h3 className="mt-1.5 font-display text-base font-bold leading-snug">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>);

        })}
      </div>
    </div>);

}
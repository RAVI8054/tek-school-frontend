import { Video, Briefcase, FileCheck, Calendar } from "lucide-react";
import { openAction } from "../../../../lib/action-bus";

export function EventsSection({ events, formatDate }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-bold">Upcoming placement events</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {events.map((e) => {
          const Icon = e.kind === "Mock interview" ? Video : e.kind === "Recruiter meet" ? Briefcase : e.kind === "Resume clinic" ? FileCheck : Calendar;
          return (
            <div key={e.id} className="flex items-center gap-4 rounded-3xl border border-border bg-white p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lavender/50"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{e.kind}</p>
                <p className="font-semibold leading-tight">{e.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
              </div>
              <button onClick={() => openAction({ kind: "rsvp-event", title: e.title, kind_: e.kind, when: formatDate(e.date) })} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold">RSVP</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

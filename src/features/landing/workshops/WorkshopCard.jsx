import { memo } from "react";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

export const WorkshopCard = memo(function WorkshopCard({
  workshop,
  onDetails,
  onEnquiry,
  onReserve,
}) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_8px_30px_-16px_rgba(15,42,82,0.18)] transition-transform duration-300 hover:-translate-y-1">
      <div className="grid md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="relative h-44 md:h-full overflow-hidden bg-muted">
          <img
            src={workshop.image}
            alt={workshop.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent md:bg-gradient-to-r" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="pill-tag bg-white/95 text-primary text-[10px] font-semibold">{workshop.track}</span>
            <span className="pill-tag bg-white/85 text-foreground text-[10px]">{workshop.format}</span>
          </div>
        </div>

        <div className="flex flex-col p-5 md:p-6">
          <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">{workshop.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{workshop.blurb}</p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{workshop.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{workshop.time}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{workshop.seatsLeft} seats left</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <img src={workshop.hostPhoto} alt={workshop.host} className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{workshop.host}</p>
              <p className="truncate text-[11px] text-muted-foreground">{workshop.hostRole}</p>
            </div>
            <p className="font-display text-lg font-bold text-primary md:ml-4">{workshop.price}</p>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => onReserve(workshop)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Reserve seat <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onEnquiry(workshop)}
                className="rounded-full border border-border bg-white px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-muted"
              >
                Enquiry
              </button>
              <button
                onClick={() => onDetails(workshop)}
                className="rounded-full border border-border bg-white px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-muted"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

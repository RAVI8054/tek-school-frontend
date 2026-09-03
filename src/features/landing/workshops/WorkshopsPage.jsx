import { useState, useCallback } from "react";
import { Shell } from "../../../components/layout/Shell.jsx";
import { Squiggle, Asterisk } from "../../../components/ui/Doodles.jsx";
import { WORKSHOPS } from "../../../lib/workshopsData.js";
import { WorkshopDrawer } from "./WorkshopDrawer.jsx";
import { LeadModal } from "../LeadModal.jsx";
import { WorkshopCard } from "./WorkshopCard.jsx";

export function WorkshopsPage() {
  const [active, setActive] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reserve, setReserve] = useState(null);

  const closeModal = useCallback(() => {
    setActive(null);
    setShowForm(false);
  }, []);

  const handleDetails = useCallback((workshop) => {
    setActive(workshop);
    setShowForm(false);
  }, []);

  const totalSeatsLeft = WORKSHOPS.reduce((a, w) => a + w.seatsLeft, 0);
  const freeCount = WORKSHOPS.filter((w) => w.price.toLowerCase() === "free").length;

  return (
    <Shell>
      <section className="relative px-4 md:px-10 pt-10 pb-8">
        <Squiggle className="pointer-events-none absolute right-8 top-6 h-24 w-56 opacity-60" />
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Asterisk className="h-8 w-8" color="var(--coral)" />
              <p className="pill-tag bg-muted text-muted-foreground"># Workshops</p>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight max-w-2xl leading-[0.95]">
              Short sessions. Real output.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg">
              One afternoon, one working thing. Taught by the same faculty and mentors who run our flagship programs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { k: `${WORKSHOPS.length}`, v: "Sessions live" },
              { k: `${totalSeatsLeft}`, v: "Seats left" },
              { k: `${freeCount}`, v: "Free sessions" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-border bg-white p-4">
                <p className="font-display text-2xl font-bold">{s.k}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 pb-16">
        <div className="mx-auto max-w-7xl space-y-6">
          {WORKSHOPS.map((w) => (
            <WorkshopCard
              key={w.id}
              workshop={w}
              onDetails={handleDetails}
              onReserve={setReserve}
            />
          ))}
        </div>
      </section>

      <WorkshopDrawer workshop={active} showForm={showForm} onShowForm={setShowForm} onClose={closeModal} />

      <LeadModal
        open={!!reserve}
        onClose={() => setReserve(null)}
        badge={reserve ? `${reserve.seatsLeft} seats left` : undefined}
        title="Reserve your seat"
        subtitle={reserve ? `${reserve.title} · ${reserve.date}, ${reserve.time}` : undefined}
        interest={reserve ? `Workshop — ${reserve.title}` : "Workshop"}
        institutionType="Workshop booking"
        cta="Confirm my seat"
      />
    </Shell>
  );
}

export default WorkshopsPage;

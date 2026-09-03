import { useState, useCallback, useEffect } from "react";
import { Shell } from "../../../components/layout/Shell.jsx";
import { Squiggle, Asterisk } from "../../../components/ui/Doodles.jsx";
import { WorkshopDrawer } from "./WorkshopDrawer.jsx";
import { LeadModal } from "../LeadModal.jsx";
import { WorkshopCard } from "./WorkshopCard.jsx";
import { getWorkshops } from "../../../lib/api.js";

export function WorkshopsPage() {
  const [active, setActive] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reserve, setReserve] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const res = await getWorkshops();
      // Map backend model to the format expected by WorkshopCard/Drawer
      const mapped = (res.data?.workshops || []).map(w => ({
        id: w._id,
        title: w.title,
        blurb: w.blurb,
        track: w.track,
        format: w.format,
        date: new Date(w.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        time: new Date(w.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        duration: w.durationText || 'N/A',
        seats: w.totalSeats,
        seatsLeft: w.availableSeats,
        price: w.isFree ? 'Free' : `₹${w.price?.amount || 0}`,
        host: w.host?.userId?.name || 'Instructor',
        hostRole: w.host?.role || 'Faculty',
        image: w.imageUrl,
        featured: w.featured,
        takeaways: w.takeaways,
        about: w.about,
        agenda: w.agenda,
        forWho: w.forWho,
        prereqs: w.prerequisites,
        hostPhoto: w.host?.photoUrl || '', // Fallback or imported image
        hostBio: w.host?.bio || '',
        hostCreds: w.host?.credentials || [],
      }));
      setWorkshops(mapped);
    } catch (err) {
      console.error("Failed to load workshops", err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = useCallback(() => {
    setActive(null);
    setShowForm(false);
  }, []);

  const handleDetails = useCallback((workshop) => {
    setActive(workshop);
    setShowForm(false);
  }, []);

  const totalSeatsLeft = workshops.reduce((a, w) => a + w.seatsLeft, 0);
  const freeCount = workshops.filter((w) => w.price === "Free" || w.price === "₹0").length;

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
              { k: loading ? '-' : `${workshops.length}`, v: "Sessions live" },
              { k: loading ? '-' : `${totalSeatsLeft}`, v: "Seats left" },
              { k: loading ? '-' : `${freeCount}`, v: "Free sessions" },
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
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading workshops...</div>
          ) : workshops.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No workshops scheduled right now.</div>
          ) : (
            workshops.map((w) => (
              <WorkshopCard
                key={w.id}
                workshop={w}
                onDetails={handleDetails}
                onReserve={setReserve}
              />
            ))
          )}
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

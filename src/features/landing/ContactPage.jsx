import { useState, useEffect } from "react";
import { Shell } from "../../components/layout/Shell.jsx";
import { Asterisk } from "../../components/ui/Doodles.jsx";
import {
  Mail, MapPin, Phone, Globe, MessageCircle, Share2, Heart, ArrowUpRight,
  CheckCircle2, AlertCircle, Clock, Navigation, Bus, TramFront,
} from "lucide-react";

const ADDRESS = "46, 3rd Floor, BEML Layout 3rd Stage, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098";
const ADDRESS_COORDS = "12.9137763,77.5279366";
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_COORDS)}&z=17&output=embed`;
const MAPS_LOCATION = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_COORDS} (${ADDRESS})`)}`;
const MAPS_DIRECTIONS = (origin, mode = "driving") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(ADDRESS_COORDS)}&travelmode=${mode}`;

const INTERESTS = ["AI Engineering", "Software Engineering", "Cloud Engineering", "Future Engineering"];

const TRANSIT = [
  {
    icon: TramFront,
    kind: "Metro",
    label: "Rajarajeshwari Nagar Metro",
    route: "Purple Line — alight at RR Nagar (towards Challaghatta)",
    dist: "2.9 km",
    time: "9–12 min by auto",
    tone: "lavender",
    origin: "12.936693,77.519556",
  },
  {
    icon: Bus,
    kind: "Bus",
    label: "BEML Layout 3rd Stage stop",
    route: "BMTC 401K, 222, 226E — get off at BEML 3rd Stage",
    dist: "0.4 km",
    time: "5 min walk",
    tone: "coral",
    origin: "12.914500,77.525500",
  },
];

const TIME_SLOTS = ["10:00 am", "11:30 am", "1:00 pm", "3:00 pm", "4:30 pm", "6:00 pm"];

function toneClasses(tone) {
  switch (tone) {
    case "coral":    return "bg-[#FF6B6B] text-white";
    case "blue":     return "bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] text-white";
    case "lavender": return "bg-[#E6E6FA] text-[#0F2A52]";
    case "navy":     return "bg-[#0F2A52] text-white";
    default:         return "bg-[#0F2A52] text-white";
  }
}

export function ContactPage() {
  const [interest, setInterest] = useState(INTERESTS[0] ?? "Not sure yet");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [errorTick, setErrorTick] = useState(0);
  const [status, setStatus] = useState("idle");
  const [prefilledFromAssistant, setPrefilledFromAssistant] = useState(false);
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("visit");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduleError, setScheduleError] = useState(null);
  const todayISO = new Date().toISOString().slice(0, 10);
  const [activeKind, setActiveKind] = useState("Bus");
  const activeRoute = TRANSIT.find((t) => t.kind === activeKind) ?? null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("tek-contact-prefill");
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.name) setTimeout(() => setName(p.name), 0);
      if (p.email) setTimeout(() => setEmail(p.email), 0);
      if (p.interest) setTimeout(() => setInterest(p.interest), 0);
      if (p.message) setTimeout(() => setMessage(p.message), 0);
      setTimeout(() => setPrefilledFromAssistant(true), 0);
      sessionStorage.removeItem("tek-contact-prefill");
    } catch { /* ignore */ }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const schedMissing = !date || !time;
    setScheduleError(schedMissing ? "Pick a date and a time slot" : null);

    const errs = {};
    if (!name || name.trim().length < 2) errs.name = "Please enter your full name";
    if (!email || !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim())) errs.email = "That doesn't look like a valid email";
    if (!interest || interest.trim().length < 2) errs.interest = "Please select an interest";

    const hasErrors = Object.keys(errs).length > 0;
    
    if (hasErrors || schedMissing) {
      setErrors(errs);
      setErrorTick((n) => n + 1);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Shell>
      <section className="relative px-4 md:px-10 pt-6 pb-6">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4"># Contact · Bengaluru</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-[#0F2A52] max-w-2xl leading-[0.95]">
              Say hi — or apply.
            </h1>
            <p className="mt-5 text-slate-600 max-w-lg">
              Drop by the studio in RR Nagar, call, or send a note. The whole team reads every message.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="tel:+918080187187"
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#0F2A52]/40"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#0F2A52]"><Phone className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-semibold text-[#0F2A52]">Call admissions</p>
              <p className="text-xs text-slate-500">+91 80801 87187</p>
            </a>

            <a
              href="mailto:hello@tek.school"
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#0F2A52]/40"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#0F2A52]"><Mail className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-semibold text-[#0F2A52]">Email the team</p>
              <p className="text-xs text-slate-500">hello@tek.school</p>
            </a>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#0F2A52]"><Clock className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-semibold text-[#0F2A52]">Reply time</p>
              <p className="text-xs text-slate-500">Under 4 working hours</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#0F2A52]"><MapPin className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-semibold text-[#0F2A52]">Walk in</p>
              <p className="text-xs text-slate-500">BEML Layout 3rd Stage, RR Nagar</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP + ADDRESS */}
      <section className="relative px-4 md:px-10 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(30,27,75,0.25)]">
            <div className="relative">
              <iframe
                key={activeRoute?.label ?? "base"}
                title={activeRoute ? `Route from ${activeRoute.label} to TekSchool` : "TekSchool campus — BEML Layout, RR Nagar"}
                src={
                  activeRoute
                    ? `https://www.google.com/maps?saddr=${encodeURIComponent(activeRoute.origin)}&daddr=${encodeURIComponent(ADDRESS_COORDS)}&dirflg=${activeRoute.kind === "Bus" ? "w" : "d"}&output=embed`
                    : MAPS_EMBED
                }
                className="w-full h-[300px] md:h-[360px] block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: "saturate(0.85) contrast(0.98)" }}
              />
              <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#0F2A52] shadow-sm uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5 mr-1" />{" "}
                {activeRoute ? `${activeRoute.label} → studio · ${activeRoute.dist}` : "BEML Layout 3rd Stage · RR Nagar"}
              </span>
              {activeRoute && (
                <button
                  type="button"
                  onClick={() => setActiveKind(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#0F2A52] shadow-sm hover:bg-white"
                >
                  Reset map
                </button>
              )}
            </div>

            <div className="border-t border-slate-200 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
                <p className="font-display text-lg font-bold text-[#0F2A52]">Distance to the studio</p>
                <p className="text-[11px] text-slate-500">Tap a block to see the route on the map</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {TRANSIT.map((t) => {
                  const active = activeKind === t.kind;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveKind(active ? null : t.kind)}
                      className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-24px_rgba(30,27,75,0.5)] ${
                        active
                          ? "border-[#1D4ED8] bg-slate-50 shadow-[0_16px_36px_-26px_rgba(30,27,75,0.55)]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClasses(t.tone)}`}>
                        <t.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.kind}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-[#0F2A52]">{t.dist}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold leading-snug text-[#0F2A52]">{t.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500 leading-snug">{t.route}</p>
                        <p className="mt-1 text-[11px] font-medium text-[#1D4ED8]">{t.time}</p>
                        <a
                          href={MAPS_DIRECTIONS(t.origin, t.kind === "Bus" ? "walking" : "driving")}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F2A52] hover:underline"
                        >
                          Open route on Google Maps <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="rounded-[2rem] bg-[#0F2A52] text-white p-8 md:p-9 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] opacity-70" />
            <div className="relative">
              <Asterisk className="h-9 w-9 text-white" />
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-5 leading-tight">
                TekSchool<br />@ Rajarajeshwarinagar
              </h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-white/90">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>46, 3rd Floor, BEML Layout 3rd Stage,<br />Rajarajeshwari Nagar, Bengaluru,<br />Karnataka 560098</span>
                </li>
                <li className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5" /> +91 80801 87187</li>
                <li className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5" /> hello@tek.school</li>
                <li className="flex items-start gap-3"><Clock className="h-4 w-4 mt-0.5" /> Mon–Sat · 9:00 am – 8:00 pm IST</li>
              </ul>

              <a
                href={MAPS_LOCATION}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white text-[#0F2A52] px-5 py-2.5 text-sm font-semibold hover:bg-white/90"
              >
                <Navigation className="h-4 w-4" /> View on Google Maps
              </a>

              <div className="mt-7 pt-6 border-t border-white/15">
                <p className="text-[10px] uppercase tracking-wider opacity-70 mb-3">Follow along</p>
                <div className="flex gap-2">
                  {[Globe, MessageCircle, Share2, Heart].map((Icon, i) => (
                    <a href="#" key={i} aria-label="social" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-[#0F2A52] transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM + COHORTS */}
      <section className="relative px-4 md:px-10 py-10">
        <form onSubmit={onSubmit} noValidate>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-9 relative shadow-[0_24px_70px_-40px_rgba(30,27,75,0.35)]">
              {status === "success" ? (
                <div className="text-center py-16">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FF6B6B] text-white mb-5">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-[#0F2A52]">Got it — thanks, {name.split(" ")[0]}!</h3>
                  <p className="mt-3 text-slate-500 max-w-md mx-auto">
                    We'll confirm your <span className="font-semibold text-[#0F2A52]">{mode === "visit" ? "studio visit" : mode === "call" ? "phone call" : "online session"}</span> on{" "}
                    <span className="font-semibold text-[#0F2A52]">{date} at {time}</span> by email at{" "}
                    <span className="font-semibold text-[#0F2A52]">{email}</span> — about <span className="font-semibold text-[#0F2A52]">{interest}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStatus("idle"); setName(""); setEmail(""); setMessage(""); setPhone(""); setDate(""); setTime(""); }}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0F2A52] text-white px-5 py-2.5 text-sm font-semibold"
                  >
                    Book another
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># Talk to admissions</p>
                    <h2 className="font-display text-3xl font-bold leading-tight text-[#0F2A52]">Book a slot with us.</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Tell us a bit about you and pick a time — we'll confirm within a few hours.
                    </p>
                  </div>

                  <div className="grid gap-7 md:grid-cols-[1.05fr_.95fr]">
                    {/* LEFT: details */}
                    <div className="space-y-5">
                      {prefilledFromAssistant && (
                        <div className="rounded-2xl bg-[#E6E6FA] text-[#0F2A52] px-4 py-3 text-sm flex items-start gap-2">
                          <Asterisk className="h-4 w-4 mt-0.5 text-current" />
                          <span>We carried over your chat with the assistant. Review and send.</span>
                        </div>
                      )}
                      <Field label="Your name" error={errors.name} errorTick={errorTick}>
                        <input
                          value={name} onChange={(e) => setName(e.target.value)}
                          maxLength={100}
                          className={`w-full rounded-[10px] bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30 transition-colors ${errors.name ? "border border-red-500 bg-red-50" : ""}`}
                          placeholder="Aarav Sharma" autoComplete="name"
                        />
                      </Field>
                      <Field label="Email" error={errors.email} errorTick={errorTick}>
                        <input
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          type="email" maxLength={255}
                          className={`w-full rounded-[10px] bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30 transition-colors ${errors.email ? "border border-red-500 bg-red-50" : ""}`}
                          placeholder="aarav@example.com" autoComplete="email"
                        />
                      </Field>
                      <Field label="Phone (optional)">
                        <input
                          value={phone} onChange={(e) => setPhone(e.target.value)}
                          type="tel" maxLength={20}
                          className="w-full rounded-[10px] bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30" placeholder="+91 98765 43210" autoComplete="tel"
                        />
                      </Field>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2">Course of interest</label>
                        <div className="flex flex-wrap gap-2">
                          {[...INTERESTS, "Not sure yet"].map((i) => (
                            <button
                              type="button" key={i} onClick={() => setInterest(i)}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border ${interest === i ? "bg-[#0F2A52] text-white border-[#0F2A52]" : "bg-white text-[#0F2A52] border-slate-200 hover:bg-slate-50"}`}
                            >
                              {i}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: schedule */}
                    <div className="rounded-[1.5rem] bg-slate-50 p-5 md:p-6 h-fit border border-slate-100">
                      <p className="font-display text-lg font-bold text-[#0F2A52]">Pick date &amp; time</p>
                      <p className="mt-1 text-xs text-slate-500">All times IST · Mon–Sat</p>

                      <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-full bg-slate-200 p-1">
                        {([["visit", "Visit"], ["call", "Call"], ["online", "Online"]]).map(([k, l]) => (
                          <button
                            key={k} type="button" onClick={() => setMode(k)}
                            className={`rounded-full px-2 py-1.5 text-xs font-semibold transition-colors ${mode === k ? "bg-white text-[#0F2A52] shadow-sm" : "text-slate-500 hover:text-[#0F2A52]"}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>

                      <label className="mt-5 block">
                        <span className="block text-xs font-semibold text-slate-500 mb-2">Date</span>
                        <input
                          type="date" value={date} min={todayISO}
                          onChange={(e) => { setDate(e.target.value); setScheduleError(null); }}
                          className="w-full rounded-[10px] bg-white p-3 text-sm text-[#0F2A52] outline-none border border-slate-200 focus:ring-2 focus:ring-[#0F2A52]/30"
                        />
                      </label>

                      <p className="mt-5 mb-2 text-xs font-semibold text-slate-500">Time slot</p>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((t) => (
                          <button
                            key={t} type="button"
                            onClick={() => { setTime(t); setScheduleError(null); }}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${time === t ? "border-[#0F2A52] bg-[#0F2A52] text-white" : "border-slate-200 bg-white hover:bg-slate-50 text-[#0F2A52]"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {scheduleError && (
                        <p className="mt-3 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{scheduleError}
                        </p>
                      )}

                      <div className="mt-5 rounded-2xl bg-white p-3.5 text-xs border border-slate-100">
                        <p className="font-semibold text-[#0F2A52] flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {date && time ? `${date} · ${time}` : "No slot picked yet"}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {mode === "visit" ? "At the RR Nagar studio, 3rd floor." : mode === "call" ? "We'll call the number you shared." : "Google Meet link sent by email."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-slate-200 pt-6">
                    <Field label="Message (optional)" error={errors.message} errorTick={errorTick}>
                      <textarea
                        value={message} onChange={(e) => setMessage(e.target.value)}
                        rows={4} maxLength={1000}
                        className={`w-full rounded-[10px] bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30 resize-none transition-colors ${errors.message ? "border border-red-500 bg-red-50" : ""}`}
                        placeholder="Tell us a little about your goals…"
                      />
                      <p className="mt-1 text-[11px] text-slate-400 text-right">{message.length}/1000</p>
                    </Field>

                    {status === "error" && (Object.keys(errors).length > 0 || scheduleError) && (
                      <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Please fix the highlighted fields above.</span>
                      </div>
                    )}

                    <button
                      disabled={status === "loading"}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] text-white px-6 py-3.5 font-semibold disabled:opacity-60"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>Confirm my slot <ArrowUpRight className="h-4 w-4" /></>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(30,27,75,0.3)]">
                <p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"># Opening hours</p>
                <p className="font-display text-xl font-bold text-[#0F2A52]">We're open Monday to Saturday</p>
                <ul className="mt-4 divide-none">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                    <li key={d} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="font-medium text-[#0F2A52]">{d}</span>
                      <span className="text-slate-500 tabular-nums">9:00 am – 8:00 pm</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="font-medium text-slate-400">Sunday</span>
                    <span className="text-slate-400">Closed</span>
                  </li>
                </ul>
                <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 shrink-0" /> All times IST · Bengaluru studio
                </p>
              </div>

              <div className="rounded-[2rem] bg-[#E6E6FA] text-[#0F2A52] p-6">
                <p className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider"># Prefer to walk in?</p>
                <p className="font-display text-2xl font-bold leading-snug">
                  Tek School hours: Mon–Sat, 9:00 am – 8:00 pm.
                </p>
                <p className="text-sm mt-2 opacity-85">
                  Free campus tours every Saturday, 11am. No appointment needed — just ring the 3rd-floor bell.
                </p>
              </div>
            </div>

          </div>
        </form>
      </section>
    </Shell>
  );
}

function Field({ label, error, errorTick, children }) {
  return (
    <label className="block w-full">
      <span className="block text-xs font-semibold text-slate-500 mb-2">{label}</span>
      <div key={error ? `err-${errorTick ?? 0}` : "ok"} className={error ? "animate-[shake_0.4s_ease-in-out]" : ""}>{children}</div>
      {error && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
    </label>
  );
}

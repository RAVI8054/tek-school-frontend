import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Loader2, CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { FormModalShell } from "./FormModalShell.jsx";
import { createEnquiry, getAvailableSlots } from "../../lib/api.js";

const NAVY = "#0F2A52";
const PROGRAMS = ["AI Engineering", "Software Engineering", "Cloud Engineering", "Future Engineering"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+971", "+65"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const fieldCls = "w-full rounded-[10px] bg-[#F3F4F6] p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30";
const labelCls = "mb-1.5 block text-xs font-medium text-[#6B7280]";

function Req() {
  return <span className="text-red-500"> *</span>;
}

/* ─── Mini Calendar ────────────────────────────────────────────────────────── */
function MiniCalendar({ slotDates, onSelect, onClose }) {
  const [month, setMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const todayStart = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  function toKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  return (
    <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-xs font-bold text-slate-800">
          {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const past = d < todayStart;
          const key = toKey(d);
          const hasSlot = slotDates.has(key);

          return (
            <button
              key={i}
              type="button"
              disabled={past || !hasSlot}
              onClick={() => { onSelect(key, d); onClose(); }}
              className={`relative h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-all flex items-center justify-center ${hasSlot && !past
                  ? "bg-[#0F2A52] text-white hover:bg-[#0F2A52]/80 shadow-sm"
                  : past
                    ? "text-slate-200 cursor-not-allowed"
                    : "text-slate-300 cursor-not-allowed"
                }`}
              title={hasSlot && !past ? "Slot available" : "No slot available"}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
        <span className="inline-block w-3 h-3 rounded-full bg-[#0F2A52]" />
        Available slot dates
      </div>
    </div>
  );
}

/* ─── Main export ──────────────────────────────────────────────────────────── */
export function BookDemoModal({ open, onClose, workshopTitle, presetProgram, heading, variant = "modal" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const isModal = variant === "modal";

  if (isModal) {
    return (
      <FormModalShell
        open={open}
        onClose={onClose}
        badge="New cohort open"
        title={heading ?? (workshopTitle ? "Reserve your seat" : "Book a Demo")}
        subtitle={workshopTitle ?? "Be part of India's most hands-on engineering school."}
      >
        <BookDemoForm onClose={onClose} workshopTitle={workshopTitle} presetProgram={presetProgram} heading={heading} hideHeader />
      </FormModalShell>
    );
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Book a Demo" className="fixed inset-0 z-[110]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl motion-safe:animate-[slide-in-right_.25s_ease-out]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-[#0F2A52]"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1 overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-14">
          <BookDemoForm onClose={onClose} workshopTitle={workshopTitle} presetProgram={presetProgram} heading={heading} />
        </div>
      </aside>
    </div>,
    document.body
  );
}

/* ─── Form ─────────────────────────────────────────────────────────────────── */
function BookDemoForm({ onClose, workshopTitle, presetProgram, heading, hideHeader = false }) {
  const [program, setProgram] = useState(presetProgram ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");

  // Slot selection
  const [selectedDateKey, setSelectedDateKey] = useState(""); // 'YYYY-MM-DD'
  const [selectedDateLabel, setSelectedDateLabel] = useState(""); // human-readable
  const [selectedTime, setSelectedTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Admin slots fetched from API
  const [adminSlots, setAdminSlots] = useState([]); // array of { date, times[], label }
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [touchedEmail, setTouchedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [formError, setFormError] = useState(null);

  // Fetch admin-defined slots on mount
  useEffect(() => {
    getAvailableSlots()
      .then((res) => setAdminSlots(res.data?.slots ?? []))
      .catch(() => setAdminSlots([]))
      .finally(() => setLoadingSlots(false));
  }, []);

  // Close calendar on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showCalendar]);

  // slotDates: Set of date keys that have admin slots
  const slotDates = useMemo(() => new Set(adminSlots.map((s) => s.date)), [adminSlots]);

  // Times available for the selected date
  const timesForDate = useMemo(() => {
    if (!selectedDateKey) return [];
    const found = adminSlots.find((s) => s.date === selectedDateKey);
    return found?.times ?? [];
  }, [selectedDateKey, adminSlots]);

  // When date changes, reset time
  const handleDateSelect = (key, dateObj) => {
    setSelectedDateKey(key);
    setSelectedTime("");
    const label = dateObj.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
    setSelectedDateLabel(label);
  };

  const slot = selectedDateKey && selectedTime ? `${selectedDateLabel} · ${selectedTime}` : "";
  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email.trim());
  const complete = useMemo(
    () => !!program && name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 6 && !!slot,
    [program, name, email, phone, slot]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setTouchedEmail(true);
    setFormError(null);
    if (!complete) {
      setFormError("Please complete every required field and pick a demo slot.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone: `${code} ${phone}`.trim(),
        program,
        education: education.trim() || undefined,
        inquiry_type: "book demo",
        slot: {
          type: "scheduled",
          dateString: selectedDateKey,
          timePreference: selectedTime,
        },
      };
      await createEnquiry(payload);
      setDone(slot);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0F2A52] text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-[#0F2A52]">You're booked</h2>
        <p className="mt-2 text-sm text-[#6B7280]">Confirmation sent for {done}.</p>
        {onClose && (
          <button type="button" onClick={onClose} className="mt-8 w-full rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90">
            Done
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {!hideHeader && (
        <div className="text-center">
          <h2 className="font-display text-2xl font-medium" style={{ color: NAVY }}>
            {heading ?? (workshopTitle ? "Reserve your seat" : "Book a Demo")}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">{workshopTitle ?? "Code, Create, Innovate!"}</p>
        </div>
      )}

      {/* Program */}
      <div>
        <label htmlFor="bd-program" className={labelCls}>Program<Req /></label>
        <select id="bd-program" required value={program} onChange={(e) => setProgram(e.target.value)} className={fieldCls}>
          <option value="">Select a program</option>
          {(presetProgram && !PROGRAMS.includes(presetProgram) ? [presetProgram, ...PROGRAMS] : PROGRAMS).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="bd-name" className={labelCls}>Name<Req /></label>
        <input id="bd-name" required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} placeholder="Aarav Sharma" />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="bd-email" className={labelCls}>Email<Req /></label>
        <input
          id="bd-email" type="email" required maxLength={255} autoComplete="email"
          value={email} onBlur={() => setTouchedEmail(true)} onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailInvalid} className={fieldCls} placeholder="aarav@example.com"
        />
        {(emailInvalid || (touchedEmail && !email)) && (
          <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="bd-phone" className={labelCls}>Phone number<Req /></label>
        <div className="grid grid-cols-[6rem_1fr] gap-2">
          <select aria-label="Country code" value={code} onChange={(e) => setCode(e.target.value)} className={fieldCls}>
            {COUNTRY_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            id="bd-phone" required inputMode="tel" maxLength={20} autoComplete="tel"
            value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))}
            className={`${fieldCls} min-w-0`} placeholder="98765 43210"
          />
        </div>
      </div>

      {/* Education */}
      <div>
        <label htmlFor="bd-education" className={labelCls}>Education</label>
        <input id="bd-education" maxLength={100} value={education} onChange={(e) => setEducation(e.target.value)} className={fieldCls} placeholder="e.g. Bachelors in Computer Science" />
      </div>

      {/* ── Slot picker ── */}
      <fieldset>
        <legend className={labelCls}>Pick a demo slot<Req /></legend>

        {loadingSlots ? (
          <div className="flex items-center justify-center gap-2 rounded-[12px] bg-[#F3F4F6] p-4 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots…
          </div>
        ) : adminSlots.length === 0 ? (
          <div className="rounded-[12px] bg-amber-50 border border-amber-100 p-4 text-xs text-amber-700 text-center font-medium">
            No demo slots available right now. Please check back later.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Date picker trigger */}
            <div className="relative" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setShowCalendar((v) => !v)}
                className={`w-full flex items-center justify-between gap-3 rounded-[12px] px-4 py-3 text-sm font-medium transition-all border ${selectedDateKey
                    ? "bg-[#0F2A52] text-white border-[#0F2A52]"
                    : "bg-[#F3F4F6] text-[#6B7280] border-transparent hover:border-[#0F2A52]/30"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  {selectedDateKey ? selectedDateLabel : "Click to choose a date"}
                </span>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${showCalendar ? "rotate-90" : ""}`} />
              </button>

              {/* Calendar popup */}
              {showCalendar && (
                <MiniCalendar
                  slotDates={slotDates}
                  onSelect={handleDateSelect}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>

            {/* Time slots for selected date */}
            {selectedDateKey && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Available times for {selectedDateLabel}
                </p>
                {timesForDate.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No time slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {timesForDate.map((t) => {
                      const active = selectedTime === t;
                      // Format 24h to 12h AM/PM
                      const [h, m] = t.split(":");
                      const hour = parseInt(h, 10);
                      const ampm = hour >= 12 ? "pm" : "am";
                      const display = `${hour % 12 || 12}:${m} ${ampm}`;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`rounded-full px-2 py-2 text-xs font-semibold transition-colors ${active ? "bg-[#0F2A52] text-white" : "bg-[#F3F4F6] text-[#0F2A52] hover:bg-[#E5E7EB]"
                            }`}
                        >
                          {display}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Selected slot summary */}
            {slot && (
              <div className="flex items-center gap-2 rounded-[10px] bg-[#0F2A52]/5 border border-[#0F2A52]/10 px-3 py-2 text-xs font-semibold text-[#0F2A52]">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                Slot: {slot}
              </div>
            )}
          </div>
        )}
      </fieldset>



      {formError && <p role="alert" className="text-xs text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={!complete || submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}

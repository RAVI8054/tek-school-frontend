import { useEffect, useMemo, useState, useRef } from "react";
import { CheckCircle2, Loader2, CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { createEnquiry, getAvailableSlots } from "../../lib/api.js";

const NAVY = "#0F2A52";
const PROGRAMS = ["AI Engineering", "Software Engineering", "Cloud Engineering", "Future Engineering"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+971", "+65"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const fieldCls =
  "w-full rounded-[10px] bg-slate-100 p-3 text-sm text-[#0F2A52] outline-none border-0 focus:ring-2 focus:ring-[#0F2A52]/30";
const labelCls = "mb-1.5 block text-xs font-medium text-slate-500";

function Req() {
  return <span className="text-[#FF6B6B]"> *</span>;
}

/* ─── Mini Calendar (popup) ────────────────────────────────────────────────── */
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
    <div className="absolute z-50 mt-2 left-0 right-0 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4">
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
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`b${i}`} />
        ))}
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
              className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-all flex items-center justify-center ${
                hasSlot && !past
                  ? "bg-[#0F2A52] text-white hover:opacity-80 shadow-sm"
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
        Dates with available slots
      </div>
    </div>
  );
}

/* ─── Form ─────────────────────────────────────────────────────────────────── */
export function BookDemoForm({ onClose, workshopTitle, presetProgram, heading, hideHeader = false }) {
  const [program, setProgram] = useState(presetProgram ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");

  // Slot state
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Admin slots
  const [adminSlots, setAdminSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [touchedEmail, setTouchedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [formError, setFormError] = useState(null);

  const isWorkshop = !!workshopTitle;

  // Fetch admin slots
  useEffect(() => {
    if (isWorkshop) {
      // eslint-disable-next-line react/set-state-in-effect
      setLoadingSlots(false);
      return;
    }
    getAvailableSlots()
      .then((res) => setAdminSlots(res.data?.slots ?? []))
      .catch(() => setAdminSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [isWorkshop]);

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

  const slotDates = useMemo(() => new Set(adminSlots.map((s) => s.date)), [adminSlots]);

  const timesForDate = useMemo(() => {
    if (!selectedDateKey) return [];
    return adminSlots.find((s) => s.date === selectedDateKey)?.times ?? [];
  }, [selectedDateKey, adminSlots]);

  const handleDateSelect = (key, dateObj) => {
    setSelectedDateKey(key);
    setSelectedTime("");
    setSelectedDateLabel(
      dateObj.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
    );
  };

  const slot = selectedDateKey && selectedTime ? `${selectedDateLabel} · ${selectedTime}` : "";
  const emailInvalid = email.length > 0 && !EMAIL_RE.test(email.trim());
  const complete = useMemo(() => {
    const baseValid = name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 6;
    if (isWorkshop) return baseValid;
    return baseValid && !!program && !!slot;
  }, [isWorkshop, program, name, email, phone, slot]);

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
      let payload;
      if (isWorkshop) {
        payload = {
          name,
          email,
          phone: `${code} ${phone}`.trim(),
          education: education.trim() || undefined,
          workshop_name: workshopTitle,
          inquiry_type: "workshop",
        };
      } else {
        payload = {
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
      }
      await createEnquiry(payload);
      setDone(slot || "your slot");
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
        <p className="mt-2 text-sm text-slate-500">Confirmation sent for {done}.</p>
        {onClose && (
          <button type="button" onClick={onClose} className="mt-8 w-full rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white">
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
          <p className="mt-1 text-sm text-slate-500">{workshopTitle ?? "Code, Create, Innovate!"}</p>
        </div>
      )}

      {!isWorkshop && (
        <div>
          <label htmlFor="bd-program" className={labelCls}>Program<Req /></label>
          <select id="bd-program" required value={program} onChange={(e) => setProgram(e.target.value)} className={fieldCls}>
            <option value="">Select a program</option>
            {(presetProgram && !PROGRAMS.includes(presetProgram) ? [presetProgram, ...PROGRAMS] : PROGRAMS).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="bd-name" className={labelCls}>Name<Req /></label>
        <input id="bd-name" required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} placeholder="Aarav Sharma" />
      </div>

      <div>
        <label htmlFor="bd-email" className={labelCls}>Email<Req /></label>
        <input
          id="bd-email" type="email" required maxLength={255} autoComplete="email"
          value={email} onBlur={() => setTouchedEmail(true)} onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailInvalid} aria-describedby={emailInvalid ? "bd-email-err" : undefined}
          className={fieldCls} placeholder="aarav@example.com"
        />
        {(emailInvalid || (touchedEmail && !email)) && (
          <p id="bd-email-err" className="mt-1 text-xs text-[#FF6B6B]">Enter a valid email address.</p>
        )}
      </div>

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

      <div>
        <label htmlFor="bd-education" className={labelCls}>Education</label>
        <input id="bd-education" maxLength={100} value={education} onChange={(e) => setEducation(e.target.value)} className={fieldCls} placeholder="e.g. Bachelors in Computer Science" />
      </div>

      {/* ── Demo slot picker (not for workshops) ── */}
      {!isWorkshop && (
        <>
          <fieldset>
            <legend className={labelCls}>Pick a demo slot<Req /></legend>

            {loadingSlots ? (
              <div className="flex items-center justify-center gap-2 rounded-[12px] bg-slate-100 p-4 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots…
              </div>
            ) : adminSlots.length === 0 ? (
              <div className="rounded-[12px] bg-amber-50 border border-amber-200 p-4 text-xs text-amber-700 text-center font-medium">
                No demo slots available right now. Please check back soon.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Date picker trigger button */}
                <div className="relative" ref={calendarRef}>
                  <button
                    type="button"
                    onClick={() => setShowCalendar((v) => !v)}
                    className={`w-full flex items-center justify-between gap-3 rounded-[12px] px-4 py-3 text-sm font-medium transition-all border-2 ${
                      selectedDateKey
                        ? "bg-[#0F2A52] text-white border-[#0F2A52]"
                        : "bg-slate-100 text-slate-500 border-transparent hover:border-[#0F2A52]/20"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      {selectedDateKey ? selectedDateLabel : "Click to choose a date"}
                    </span>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${showCalendar ? "rotate-90" : ""}`} />
                  </button>

                  {showCalendar && (
                    <MiniCalendar
                      slotDates={slotDates}
                      onSelect={handleDateSelect}
                      onClose={() => setShowCalendar(false)}
                    />
                  )}
                </div>

                {/* Times for selected date */}
                {selectedDateKey && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Available times for {selectedDateLabel}
                    </p>
                    {timesForDate.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No time slots for this date.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {timesForDate.map((t) => {
                          const active = selectedTime === t;
                          const [h, min] = t.split(":");
                          const hour = parseInt(h, 10);
                          const display = `${hour % 12 || 12}:${min} ${hour >= 12 ? "pm" : "am"}`;
                          return (
                            <button
                              key={t}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setSelectedTime(t)}
                              className={`rounded-full px-2 py-2 text-xs font-semibold transition-colors ${
                                active ? "bg-[#0F2A52] text-white" : "bg-slate-100 text-[#0F2A52] hover:bg-slate-200"
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

                {/* Slot summary pill */}
                {slot && (
                  <div className="flex items-center gap-2 rounded-[10px] bg-green-50 border border-green-100 px-3 py-2 text-xs font-semibold text-green-800">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Slot: {slot}
                  </div>
                )}
              </div>
            )}
          </fieldset>


        </>
      )}

      {formError && <p role="alert" className="text-xs text-[#FF6B6B]">{formError}</p>}

      <button
        type="submit"
        disabled={!complete || submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}

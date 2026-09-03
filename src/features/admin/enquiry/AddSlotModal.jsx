import { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Trash2, CalendarPlus, Clock, CheckCircle2,
  Loader2, CalendarDays, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { createSlot, getAllSlotsAdmin, deleteSlot } from '../../../lib/api.js';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
}

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ─── Inline popup calendar ───────────────────────────────────────────────── */
function PopupCalendar({ value, onSelect, onClose }) {
  const today = new Date();
  const todayKey = toKey(today);
  const [month, setMonth] = useState(() =>
    value
      ? (() => { const [y, m] = value.split('-'); return new Date(y, m - 1, 1); })()
      : new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return (
    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-indigo-200 rounded-2xl shadow-2xl p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-slate-800">
          {month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstWeekday }).map((_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const key = toKey(d);
          const isPast = key < todayKey;
          const isSelected = key === value;
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => { onSelect(key); onClose(); }}
              className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-all flex items-center justify-center ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isPast
                  ? 'text-slate-200 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
        <button
          type="button"
          onClick={() => { onSelect(toKey(today)); onClose(); }}
          className="text-xs text-indigo-600 font-semibold hover:underline"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ─── Main modal ──────────────────────────────────────────────────────────── */
export function AddSlotModal({ onClose, onSaved }) {
  const [date, setDate]             = useState('');
  const [times, setTimes]           = useState([]);
  const [customTime, setCustomTime] = useState('');
  const [label, setLabel]           = useState('');
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');
  const [showCal, setShowCal]       = useState(false);
  const calRef                       = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  // All slots keyed by date
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [deletingId, setDeletingId]    = useState(null);

  const loadSlots = () => {
    setLoadingSlots(true);
    getAllSlotsAdmin()
      .then((res) => {
        const byDate = {};
        (res.data?.slots ?? []).forEach((s) => { byDate[s.date] = s; });
        setSlotsByDate(byDate);
      })
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  };

  // eslint-disable-next-line
  useEffect(() => { loadSlots(); }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    if (!showCal) return;
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setShowCal(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCal]);

  // Pre-fill times when selecting an existing date
  useEffect(() => {
    if (date && slotsByDate[date]) {
      // eslint-disable-next-line react/set-state-in-effect
      setTimes(slotsByDate[date].times ?? []);
      // eslint-disable-next-line react/set-state-in-effect
      setLabel(slotsByDate[date].label ?? '');
    } else {
      // eslint-disable-next-line react/set-state-in-effect
      setTimes([]);
      // eslint-disable-next-line react/set-state-in-effect
      setLabel('');
    }
    setError('');
  }, [date, slotsByDate]);

  const addCustomTime = () => {
    const t = customTime.trim();
    if (!t) return setError('Please enter a time.');
    if (times.includes(t)) return setError('That time is already added.');
    setTimes((prev) => [...prev, t].sort());
    setCustomTime('');
    setError('');
  };

  const removeTime = (t) => setTimes((prev) => prev.filter((x) => x !== t));

  const handleSave = async () => {
    setError('');
    if (!date) return setError('Please select a date.');
    if (times.length === 0) return setError('Add at least one time slot.');
    setSaving(true);
    try {
      await createSlot({ date, times, label: label.trim() || undefined });
      setSuccess(true);
      loadSlots();
      onSaved?.();
      setTimeout(() => {
        setSuccess(false);
        setDate(''); setTimes([]); setLabel('');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to save slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, slotDate) => {
    setDeletingId(id);
    try {
      await deleteSlot(id);
      setSlotsByDate((prev) => { const next = { ...prev }; delete next[slotDate]; return next; });
      if (date === slotDate) { setTimes([]); setLabel(''); }
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const allSlots = Object.values(slotsByDate).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <CalendarPlus className="w-5 h-5" />
            <h2 className="font-bold text-base">Manage Demo Slots</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── Add / Update form ── */}
          <div className="p-5 space-y-5 border-b border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Add / Update Slot</p>

            {/* Date picker — custom popup calendar */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Select Date</label>
              <div className="relative" ref={calRef}>
                {/* Trigger button */}
                <button
                  type="button"
                  onClick={() => setShowCal((v) => !v)}
                  className={`w-full flex items-center justify-between gap-3 border rounded-xl px-4 py-3 transition-all text-sm font-medium ${
                    date
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-400 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    {date ? formatDate(date) : 'Click to pick a date…'}
                  </span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${showCal ? 'rotate-90' : ''}`} />
                </button>

                {/* Popup calendar — renders instantly */}
                {showCal && (
                  <PopupCalendar
                    value={date}
                    onSelect={(key) => setDate(key)}
                    onClose={() => setShowCal(false)}
                  />
                )}
              </div>
            </div>

            {/* Optional label */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Label <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Morning batch, Weekend session…"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              />
            </div>

            {/* Custom time input only */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">
                Add Time Slots
                {times.length > 0 && (
                  <span className="ml-2 text-indigo-600 font-bold">({times.length} added)</span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                />
                <button
                  type="button"
                  onClick={addCustomTime}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Time chips */}
              {times.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  {times.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <Clock className="w-3 h-3" /> {t}
                      <button onClick={() => removeTime(t)} className="ml-0.5 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 font-medium">
                {error}
              </p>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || success}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
                success ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
              } disabled:opacity-70`}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : success ? (
                <><CheckCircle2 className="w-4 h-4" /> Slots Saved!</>
              ) : (
                <><CalendarPlus className="w-4 h-4" />
                  {date ? `Save Slots for ${formatDate(date)}` : 'Save Slots'}
                </>
              )}
            </button>
          </div>

          {/* ── Scheduled slots list ── */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">All Scheduled Slots</p>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              </div>
            ) : allSlots.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No slots added yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allSlots.map((s) => {
                  const isPast = s.date < today;
                  const isActive = s.date === date;
                  return (
                    <div
                      key={s._id}
                      onClick={() => setDate(s.date)}
                      className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300'
                          : isPast
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-800">{formatDate(s.date)}</span>
                          {isPast && (
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">Past</span>
                          )}
                          {s.label && (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded">{s.label}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {s.times.map((t) => (
                            <span key={t} className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              <Clock className="w-2.5 h-2.5" /> {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isActive && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(s._id, s.date); }}
                          disabled={deletingId === s._id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          {deletingId === s._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

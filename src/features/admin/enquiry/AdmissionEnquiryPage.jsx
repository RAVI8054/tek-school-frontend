import { useState, useEffect, useCallback } from 'react';
import { CalendarPlus } from 'lucide-react';
import { PipelineBoard } from '../../../components/admin/PipelineBoard.jsx';
import { EnquiryDetail } from './EnquiryDetail.jsx';
import { AddSlotModal } from './AddSlotModal.jsx';
import { getEnquiries, updateEnquiryStatus } from '../../../lib/api.js';

// ── New pipeline stages ──────────────────────────────────────────────────────
const STAGES = ['New', 'Qualified', 'Demo', 'Follow-ups', 'Won', 'Lost'];

const TINT = {
  'New':       '#F4A261',
  'Qualified': '#5BA4E8',
  'Demo':      '#8B5CF6',
  'Follow-ups':'#F59E0B',
  'Won':       '#10B981',
  'Lost':      '#EF4444',
};

// backend key → display label
const STATUS_MAP = {
  'new':        'New',
  'qualified':  'Qualified',
  'demo':       'Demo',
  'follow_ups': 'Follow-ups',
  'won':        'Won',
  'lost':       'Lost',
};

// display label → backend key
const REVERSE_STATUS = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
);

const TABS = [
  { key: 'all',            label: 'All' },
  { key: 'book_demo',      label: 'Book Demo' },
  { key: 'talk_counselor', label: 'Talk to Counselor' },
  { key: 'workshop',       label: 'Workshop' },
];

export function AdmissionEnquiryPage() {
  const [items, setItems]         = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showSlotModal, setShowSlotModal] = useState(false);

  /* ---------- data fetch ---------- */
  const fetchLeads = useCallback(() => {
    const params = { category: 'admission', limit: 200 };
    if (activeTab !== 'all') params.inquiry_type = activeTab;
    getEnquiries(params)
      .then((res) => {
        const mapped = (res.data?.enquiries ?? []).map((eq) => ({
          id:               eq._id,
          name:             eq.name,
          phone:            eq.phone,
          email:            eq.email,
          education:        eq.education,
          program:          eq.program,
          inquiry_type:     eq.inquiry_type,
          workshop_name:    eq.workshop_name,
          // slot requested by student
          slotType:         eq.slot?.type,
          slotDate:         eq.slot?.dateString,
          slotTime:         eq.slot?.timePreference,
          // slot confirmed by admin
          confirmedDate:    eq.confirmed_slot?.date
                              ? new Date(eq.confirmed_slot.date).toLocaleDateString('en-IN')
                              : null,
          confirmedTime:    eq.confirmed_slot?.time,
          rejection_reason: eq.rejection_reason,
          stage:            STATUS_MAP[eq.status] ?? 'New',
          backendStatus:    eq.status,
          counselor:        eq.assigned_to?.name ?? 'Unassigned',
          createdAt:        new Date(eq.createdAt).toLocaleDateString('en-IN'),
          notes:            eq.admin_notes?.[0]?.note ?? '',
          raw:              eq,
        }));
        setItems(mapped);
      })
      .catch((err) => console.error('Failed to load admission enquiries:', err))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  /* ---------- move card (drag-and-drop) ---------- */
  const handleMove = useCallback(async (id, displayStage) => {
    const backendStatus = REVERSE_STATUS[displayStage];
    if (!backendStatus) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, stage: displayStage, backendStatus } : item)
    );

    try {
      await updateEnquiryStatus(id, { status: backendStatus });
    } catch (err) {
      console.error('Failed to move card:', err);
      fetchLeads(); // revert on failure
    }
  }, [fetchLeads]);

  /* ---------- full update (from detail modal) ---------- */
  const handleUpdate = useCallback(async (id, data) => {
    try {
      await updateEnquiryStatus(id, data);
      fetchLeads();
      setSelected(null);
    } catch (err) {
      console.error('Failed to update enquiry:', err);
      alert('Failed to update: ' + err.message);
    }
  }, [fetchLeads]);

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top bar: hint text + Add Slot button + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <p className="text-xs text-slate-500 hidden sm:block">
          Drag cards across columns to update status instantly.
        </p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* ── Add Slot button ── */}
          <button
            onClick={() => setShowSlotModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all duration-150 shrink-0"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            Add Slot
          </button>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1 rounded-lg shadow-inner flex-1 sm:flex-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setLoading(true); }}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex-1 flex gap-3 h-full px-2 pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col p-2 gap-2">
              <div className="h-8 animate-pulse bg-slate-200 rounded-lg shrink-0 mb-1 w-2/3" />
              {[...Array(2)].map((_, j) => (
                <div key={j} className="h-28 animate-pulse bg-white border border-slate-200 rounded-lg shrink-0 shadow-sm" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <PipelineBoard
            stages={STAGES}
            items={items}
            tint={TINT}
            onMove={handleMove}
            renderCard={(item) => {
              const isSlotType = item.inquiry_type === 'book demo' || item.inquiry_type === 'talk to counselor';
              return (
                <div onClick={() => setSelected(item)} className="cursor-pointer space-y-1.5">
                  {/* Name + type badge */}
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded shrink-0">
                      {item.inquiry_type}
                    </span>
                  </div>

                  {/* Contact */}
                  <p className="text-[11px] text-slate-500 truncate">{item.email}</p>
                  <p className="text-[11px] text-slate-400">{item.phone}</p>

                  {/* Program */}
                  {isSlotType && item.program && (
                    <p className="text-[11px] text-blue-700 font-medium truncate">📚 {item.program}</p>
                  )}

                  {/* Requested slot */}
                  {isSlotType && item.slotDate && (
                    <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded px-2 py-1">
                      <span className="text-[10px] font-bold text-orange-700">🕐 Slot:</span>
                      <span className="text-[10px] text-orange-800 font-semibold">
                        {item.slotDate} · {item.slotTime ?? 'Anytime'}
                      </span>
                    </div>
                  )}

                  {/* Workshop name */}
                  {item.inquiry_type === 'workshop' && item.workshop_name && (
                    <p className="text-[11px] text-purple-700 font-medium truncate">🎓 {item.workshop_name}</p>
                  )}

                  {/* Last admin note */}
                  {item.notes && (
                    <p className="text-[11px] text-slate-600 italic line-clamp-2 border-t border-slate-100 pt-1.5">
                      {item.notes}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.counselor}
                    </span>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <EnquiryDetail
          item={selected}
          onBack={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Add Slot modal */}
      {showSlotModal && (
        <AddSlotModal
          onClose={() => setShowSlotModal(false)}
          onSaved={fetchLeads}
        />
      )}
    </div>
  );
}

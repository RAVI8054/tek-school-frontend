import { useState, useEffect, useCallback } from 'react';
import { PipelineBoard } from '../../../components/admin/PipelineBoard.jsx';
import { EnquiryDetail } from './EnquiryDetail.jsx';
import { getEnquiries, updateEnquiryStatus } from '../../../lib/api.js';

// Statuses from the backend model
const STAGES = ['New', 'In Progress', 'Scheduled', 'Rejected', 'Completed'];

const TINT = {
  'New':         '#F4A261',
  'In Progress': '#5BA4E8',
  'Scheduled':   '#8B5CF6',
  'Rejected':    '#EF4444',
  'Completed':   '#10B981',
};

const STATUS_MAP = {
  'new':         'New',
  'in_progress': 'In Progress',
  'scheduled':   'Scheduled',
  'rejected':    'Rejected',
  'completed':   'Completed',
};

// reverse: display label → backend key
const REVERSE_STATUS = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k])
);

const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'school',   label: 'School' },
  { key: 'college',  label: 'College' },
  { key: 'ai_lab',   label: 'AI Lab' },
];

export function TekCampusEnquiryPage() {
  const [items, setItems]         = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);

  /* ---------- data fetch ---------- */
  const fetchLeads = useCallback(() => {
    const params = { category: 'tekschool', limit: 200 };
    if (activeTab !== 'all') params.inquiry_type = activeTab;
    getEnquiries(params)
      .then((res) => {
        const mapped = (res.data?.enquiries ?? []).map((eq) => ({
          id:               eq._id,
          name:             eq.name,
          phone:            eq.phone,
          email:            eq.email,
          education:        eq.education,
          inquiry_type:     eq.inquiry_type,
          // school → school_name, college / ai lab → institution_name
          institution_name: eq.institution_name ?? eq.school_name,
          stage:            STATUS_MAP[eq.status] ?? 'New',
          backendStatus:    eq.status,
          counselor:        eq.assigned_to?.name ?? 'Unassigned',
          createdAt:        new Date(eq.createdAt).toLocaleDateString('en-IN'),
          notes:            eq.admin_notes?.[0]?.note ?? '',
          rejection_reason: eq.rejection_reason,
          confirmedDate:    eq.confirmed_slot?.date
                              ? new Date(eq.confirmed_slot.date).toLocaleDateString('en-IN')
                              : null,
          confirmedTime:    eq.confirmed_slot?.time,
          raw:              eq,
        }));
        setItems(mapped);
      })
      .catch((err) => console.error('Failed to load TekCampus enquiries:', err))
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
      {/* Tab bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <p className="text-xs text-slate-500 hidden sm:block">
          Every TekCampus B2B lead (Schools, Colleges, AI Labs). Drag to update status.
        </p>
        <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1 rounded-lg shadow-inner w-full sm:w-auto">
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

      {/* Board */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          Loading enquiries…
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <PipelineBoard
            stages={STAGES}
            items={items}
            tint={TINT}
            onMove={handleMove}
            renderCard={(item) => (
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

                {/* Institution / School name */}
                {item.institution_name && (
                  <p className="text-[11px] text-indigo-700 font-medium truncate">🏫 {item.institution_name}</p>
                )}

                {/* Education */}
                {item.education && (
                  <p className="text-[11px] text-slate-500 truncate">🎓 {item.education}</p>
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
            )}
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
    </div>
  );
}

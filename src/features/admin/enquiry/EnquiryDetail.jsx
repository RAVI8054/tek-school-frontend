import { useState } from 'react';
import {
  Mail, Phone, GraduationCap, BookOpen, Building2, CalendarDays, Clock,
  ClipboardList, CheckCircle2, XCircle, X, MessageSquare, Tag,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────────────────────── */

const STATUS_COLORS = {
  new:         'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100   text-blue-800   border-blue-200',
  scheduled:   'bg-purple-100 text-purple-800 border-purple-200',
  completed:   'bg-green-100  text-green-800  border-green-200',
  rejected:    'bg-red-100    text-red-800    border-red-200',
};
const statusColor = (s) => STATUS_COLORS[s] ?? 'bg-gray-100 text-gray-800 border-gray-200';

const TYPE_COLORS = {
  'book demo':         'bg-blue-50   text-blue-700',
  'talk to counselor': 'bg-teal-50   text-teal-700',
  'workshop':          'bg-purple-50 text-purple-700',
  'school':            'bg-indigo-50 text-indigo-700',
  'college':           'bg-sky-50    text-sky-700',
  'ai lab':            'bg-orange-50 text-orange-700',
};
const typeColor = (t) => TYPE_COLORS[t] ?? 'bg-gray-50 text-gray-600';

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function SlotCard({ label, date, time, accent = 'orange' }) {
  const cls = {
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    green:  'bg-green-50  border-green-200  text-green-800',
  };
  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-0.5 ${cls[accent]}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
      <div className="flex items-center gap-3 mt-0.5">
        <span className="flex items-center gap-1 text-sm font-bold">
          <CalendarDays className="w-4 h-4 opacity-70" /> {date}
        </span>
        {time && (
          <span className="flex items-center gap-1 text-sm font-bold">
            <Clock className="w-4 h-4 opacity-70" /> {time}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── type-specific info block ────────────────────────────────────────── */
function EnquiryTypeDetails({ item }) {
  const raw = item.raw ?? {};
  const type = item.inquiry_type ?? raw.inquiry_type;

  if (type === 'book demo' || type === 'talk to counselor') {
    return (
      <div className="space-y-3">
        <InfoRow icon={BookOpen}   label="Program Interested In" value={item.program ?? raw.program} />
        <InfoRow icon={GraduationCap} label="Education"           value={item.education ?? raw.education} />

        {/* Student-requested slot */}
        {(item.slotDate ?? raw.slot?.dateString) && (
          <SlotCard
            label="Student Requested Slot"
            date={item.slotDate ?? raw.slot?.dateString}
            time={item.slotTime ?? raw.slot?.timePreference}
            accent="orange"
          />
        )}

        {/* Admin-confirmed slot */}
        {(item.confirmedDate ?? raw.confirmed_slot?.date) && (
          <SlotCard
            label="Admin Confirmed Slot"
            date={item.confirmedDate ?? new Date(raw.confirmed_slot.date).toLocaleDateString('en-IN')}
            time={item.confirmedTime ?? raw.confirmed_slot?.time}
            accent="green"
          />
        )}
      </div>
    );
  }

  if (type === 'workshop') {
    return (
      <div className="space-y-3">
        <InfoRow icon={ClipboardList} label="Workshop Name" value={raw.workshop_name} />
        <InfoRow icon={GraduationCap}  label="Education"     value={item.education ?? raw.education} />
      </div>
    );
  }

  if (type === 'school') {
    return (
      <div className="space-y-3">
        <InfoRow icon={Building2}     label="School Name" value={raw.school_name ?? item.institution_name} />
        <InfoRow icon={GraduationCap} label="Education"   value={item.education ?? raw.education} />
      </div>
    );
  }

  if (type === 'college' || type === 'ai lab') {
    return (
      <div className="space-y-3">
        <InfoRow icon={Building2}     label="Institution Name" value={raw.institution_name ?? item.institution_name} />
        <InfoRow icon={GraduationCap} label="Education"        value={item.education ?? raw.education} />
      </div>
    );
  }

  return null;
}

/* ─── main component ──────────────────────────────────────────────────── */
export function EnquiryDetail({ item, onBack, onUpdate }) {
  const raw = item.raw ?? {};
  const inquiryType = item.inquiry_type ?? raw.inquiry_type;
  const isSlotType  = inquiryType === 'book demo' || inquiryType === 'talk to counselor';

  const [status,          setStatus]          = useState(item.backendStatus ?? 'new');
  const [note,            setNote]            = useState('');
  const [rejectionReason, setRejectionReason] = useState(item.rejection_reason ?? raw.rejection_reason ?? '');
  const [slotDate, setSlotDate] = useState(() => {
    // Priority 1: admin already confirmed a slot previously
    if (raw.confirmed_slot?.date) {
      return new Date(raw.confirmed_slot.date).toISOString().split('T')[0];
    }
    // Priority 2: student's requested slot — auto-use as default
    return raw.slot?.dateString ?? '';
  });
  const [slotTime, setSlotTime] = useState(
    raw.confirmed_slot?.time ?? raw.slot?.timePreference ?? ''
  );

  const handleSave = () => {
    const payload = { status };
    if (note.trim())            payload.note             = note.trim();
    if (status === 'rejected')  payload.rejection_reason = rejectionReason;
    // Only send confirmed_slot when the admin has actually filled BOTH fields
    if (status === 'scheduled' && isSlotType && slotDate && slotTime) {
      payload.confirmed_slot = { date: slotDate, time: slotTime };
    }
    onUpdate(item.id, payload);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onBack} />

      {/* modal — full screen on mobile, card on sm+ */}
      <div className="relative bg-gray-50 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[92vh] overflow-hidden flex flex-col">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shrink-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {item.name}
            </h3>
            {/* Enquiry type badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${typeColor(inquiryType)}`}>
              {inquiryType}
            </span>
            {/* Status badge */}
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded-full shrink-0 ${statusColor(item.backendStatus)}`}>
              {item.stage}
            </span>
          </div>
          <button
            onClick={onBack}
            className="ml-4 text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

            {/* ── LEFT: Lead info ── */}
            <div className="lg:col-span-7 space-y-4">

              {/* Contact block */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  Contact Details
                </h4>
                <InfoRow icon={Mail}  label="Email" value={item.email} />
                <InfoRow icon={Phone} label="Phone" value={item.phone} />
                <InfoRow icon={Tag}   label="Counselor Assigned" value={item.counselor !== 'Unassigned' ? item.counselor : null} />
              </div>

              {/* Enquiry-type-specific details */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  Enquiry Details
                </h4>
                <EnquiryTypeDetails item={item} />

                {/* Rejection reason (if any) */}
                {(item.rejection_reason ?? raw.rejection_reason) && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">Rejection Reason</p>
                      <p className="text-sm text-red-700 font-medium">{item.rejection_reason ?? raw.rejection_reason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity timeline */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Activity Timeline
                </h4>
                <div className="space-y-4 pl-2 border-l-2 border-gray-100 ml-2">
                  {(raw.admin_notes ?? []).map((n, i) => {
                    const actor = n.addedBy;
                    const ROLE_LABEL = {
                      admin:      'Admin',
                      admissions: 'Admissions',
                      instructor: 'Instructor',
                      finance:    'Finance',
                      student:    'Student',
                    };
                    const actorDisplay = actor
                      ? `${actor.name} (${ROLE_LABEL[actor.role] ?? actor.role})`
                      : 'System';
                    return (
                      <div key={i} className="relative pl-6">
                        <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                        <p className="text-sm text-gray-800 font-medium italic">"{n.note}"</p>
                        <p className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleString('en-IN')} · {actorDisplay}
                        </p>
                      </div>
                    );
                  })}
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                    <p className="text-sm text-gray-800 font-medium">Enquiry Submitted</p>
                    <p className="text-xs text-gray-500">{item.createdAt} · System</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Admin actions ── */}
            <div className="lg:col-span-5">
              <div className="bg-gray-900 rounded-xl p-4 sm:p-5 shadow-xl text-white">
                <h3 className="font-bold text-base mb-4">Admin Workspace</h3>

                <div className="bg-white text-gray-900 rounded-lg p-5 space-y-5">

                  {/* Update status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Update Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Confirm slot — only for slot-type enquiries when status = scheduled */}
                  {status === 'scheduled' && isSlotType && (
                    <div className="space-y-3 animate-pulse-once">
                      <p className="text-xs font-bold text-gray-600">Confirm Appointment Slot</p>
                      {/* Show what student requested */}
                      {(item.slotDate ?? raw.slot?.dateString) && (
                        <div className="text-[11px] text-orange-700 bg-orange-50 border border-orange-100 rounded px-3 py-2">
                          Student requested: <strong>{item.slotDate ?? raw.slot?.dateString}</strong>
                          {(item.slotTime ?? raw.slot?.timePreference) && (
                            <> at <strong>{item.slotTime ?? raw.slot?.timePreference}</strong></>
                          )}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Confirm Date</label>
                          <input
                            type="date"
                            value={slotDate}
                            onChange={(e) => setSlotDate(e.target.value)}
                            className="w-full bg-blue-50 border border-blue-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Confirm Time</label>
                          <input
                            type="time"
                            value={slotTime}
                            onChange={(e) => setSlotTime(e.target.value)}
                            className="w-full bg-blue-50 border border-blue-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rejection reason */}
                  {status === 'rejected' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Rejection Reason</label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g., Fake number, Not interested…"
                        className="w-full bg-red-50 border border-red-200 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Completed confirmation */}
                  {status === 'completed' && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg p-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <p className="text-xs text-green-800 font-medium">
                        Marking as completed. Add a note below if needed.
                      </p>
                    </div>
                  )}

                  {/* Log note */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Log Note / Activity <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="e.g. Called student, discussed program fees…"
                    />
                  </div>

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm transition-colors text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

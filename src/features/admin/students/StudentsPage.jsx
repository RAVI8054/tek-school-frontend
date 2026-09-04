import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { AdminTable } from '../../../components/admin/AdminTable.jsx';
import { TRACKS, COHORTS } from '../../../lib/adminData.js';
import { AlertTriangle, Pencil, Trash2, UserPlus, Eye } from 'lucide-react';
import { pushToast } from '../../../lib/actionBus.js';
import { ActionModals } from '../../../components/ActionModals.jsx';
import { Modal, PrimaryBtn, GhostBtn } from '../../../components/ui/Modal.jsx';
import { registerStudent, getStudents,  updateStudentAdmin, deleteStudentAdmin, 
  getWorkshopBookingsAdmin, updateWorkshopBookingAdmin, deleteWorkshopBookingAdmin 
} from '../../../lib/api.js';

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [track, setTrack] = useState('all');
  const [risk, setRisk] = useState(false);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('students');
  const [workshopBookings, setWorkshopBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    getStudents()
      .then((res) => {
        if (res.data?.students) {
          setStudents(res.data.students);
        }
      })
      .catch((err) => {
        pushToast('Failed to fetch students: ' + err.message);
      });
      
    getWorkshopBookingsAdmin()
      .then((res) => {
        if (res.data?.bookings) {
          setWorkshopBookings(res.data.bookings);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch workshop bookings', err);
      });
  }, []);

  const rows = viewMode === 'students' 
    ? students.filter((s) => (track === 'all' || s.track === track) && (!risk || s.atRisk))
    : workshopBookings.map(b => ({
        id: b._id,
        userId: b.user?._id,
        name: b.user?.name || 'Unknown',
        email: b.user?.email || 'No email',
        workshopTitle: b.workshop?.title || 'Unknown Workshop',
        paymentStatus: b.paymentStatus,
        createdAt: new Date(b.createdAt).toLocaleDateString(),
      }));

  const removeStudent = async (id) => {
    try {
      if (viewMode === 'workshops') {
        await deleteWorkshopBookingAdmin(id);
        setWorkshopBookings((arr) => arr.filter((b) => b._id !== id));
        pushToast('Booking removed successfully');
      } else {
        await deleteStudentAdmin(id);
        setStudents((arr) => arr.filter((s) => s.id !== id));
        pushToast('Student removed successfully');
      }
    } catch (err) {
      pushToast(`Failed to remove ${viewMode === 'workshops' ? 'booking' : 'student'}: ` + err.message, 'error');
    }
  };
  const bulkDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => deleteStudentAdmin(id)));
      setStudents((arr) => arr.filter((s) => !ids.includes(s.id)));
      pushToast(`Deleted ${ids.length} students successfully`);
    } catch (err) {
      pushToast('Failed to delete some students: ' + err.message, 'error');
    }
  };

  const saveEdit = async (patch) => {
    if (!editing) return;
    try {
      if (viewMode === 'workshops') {
        await updateWorkshopBookingAdmin(editing.id, patch);
        setWorkshopBookings((arr) => arr.map((b) => b._id === editing.id ? { ...b, ...patch } : b));
        pushToast(`Updated booking`);
      } else {
        await updateStudentAdmin(editing.id, patch);
        setStudents((arr) => arr.map((s) => s.id === editing.id ? { ...s, ...patch } : s));
        pushToast(`Updated ${patch.name}`);
      }
      setEditing(null);
    } catch (err) {
      pushToast('Failed to update: ' + err.message);
    }
  };

  const createStudent = async (form) => {
    
      const res = await registerStudent({
        name: form.name,
        email: form.email,
        track: form.track,
        cohort: form.cohort,
        city: form.city,
      });
      const user = res.data?.user || {};
      const s = {
        id: user.id || 'stu_' + Date.now(),
        name: user.name || form.name, 
        email: user.email || form.email, 
        track: form.track, 
        cohort: form.cohort,
        enrolledAt: (user.createdAt ? new Date(user.createdAt) : new Date()).toISOString().slice(0, 10),
        attendance: 100, completion: 0, placement: 'Not started', atRisk: false,
        phone: '+91 90000 00000', city: form.city || 'Bengaluru',
      };
      setStudents((arr) => [s, ...arr]);
      setShowNew(false);
      pushToast(`Added ${s.name}. Check email for credentials.`);
  };

  return (
    <AdminShell title="Students" actions={
      <button onClick={() => setShowNew(true)} className="hidden items-center gap-1.5 rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_#1E1B4B] md:inline-flex">
        <UserPlus className="h-3.5 w-3.5" /> Add student
      </button>
    }>
      <AdminTable
        rows={rows}
        filename="students.csv"
        onRowClick={(r) => navigate(`/admin/students/${r.userId || r.id}`)}
        onBulkDelete={bulkDelete}
        empty={{ title: 'No students match those filters', hint: 'Try clearing the track filter or the at-risk toggle.' }}
        filters={
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip label="Students" active={viewMode === 'students'} onClick={() => setViewMode('students')} />
            <FilterChip label="Workshop Bookings" active={viewMode === 'workshops'} onClick={() => setViewMode('workshops')} />
            
            <div className="ml-2 border-l border-slate-200 pl-2 flex flex-wrap items-center gap-1.5">
              {viewMode === 'students' && (
                <>
                  <FilterChip label="All tracks" active={track === 'all'} onClick={() => setTrack('all')} />
                  {TRACKS.map((t) => <FilterChip key={t} label={t.split(' ')[0]} active={track === t} onClick={() => setTrack(t)} />)}
                  <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold">
                    <input type="checkbox" checked={risk} onChange={(e) => setRisk(e.target.checked)} className="h-3 w-3" />
                    At-risk only
                  </label>
                </>
              )}
            </div>
          </div>
        }
        rowActions={viewMode === 'students' ? [
          { label: 'View Profile', icon: Eye, onClick: (r) => navigate(`/admin/students/${r.id}`) },
          { label: 'Edit', icon: Pencil, onClick: (r) => setEditing(r) },
          { label: 'Delete', icon: Trash2, destructive: true, onClick: (r) => removeStudent(r.id), confirm: { title: 'Delete student?', message: (r) => <>Removing <b>{r.name}</b> from <b>{r.cohort}</b>. This cannot be undone.</> } },
        ] : [
          { label: 'View Profile', icon: Eye, onClick: (r) => navigate(`/admin/students/${r.userId}`) },
          { label: 'Edit Booking', icon: Pencil, onClick: (r) => setEditing(r) },
          { label: 'Delete Booking', icon: Trash2, destructive: true, onClick: (r) => removeStudent(r.id), confirm: { title: 'Delete booking?', message: (r) => <>Removing booking for <b>{r.name}</b>. This cannot be undone.</> } },
        ]}
        columns={viewMode === 'students' ? [
          { key: 'name', label: 'Student', render: (r) => (
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-[10px] font-bold text-white">
                {r.profile_img ? <img src={r.profile_img} alt="Avatar" className="h-full w-full object-cover" /> : r.name.split(' ').map((n) => n[0]).slice(0,2).join('')}
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{r.name} {r.atRisk && <AlertTriangle className="ml-0.5 inline h-3 w-3 text-coral" />}</p>
                <p className="text-[10px] text-slate-400">{r.email}</p>
              </div>
            </div>
          ) },
          { key: 'track', label: 'Track' },
          { key: 'cohort', label: 'Cohort' },
          { key: 'attendance', label: 'Attendance', render: (r) => <Bar pct={r.attendance} /> },
          { key: 'completion', label: 'Completion', render: (r) => <Bar pct={r.completion} /> },
          { key: 'placement', label: 'Placement', render: (r) => <PlacementPill s={r.placement} /> },
          { key: 'city', label: 'City' },
        ] : [
          { key: 'name', label: 'Student', render: (r) => (
            <div className="min-w-0">
              <p className="font-semibold">{r.name}</p>
              <p className="text-[10px] text-slate-400">{r.email}</p>
            </div>
          ) },
          { key: 'workshopTitle', label: 'Workshop' },
          { key: 'paymentStatus', label: 'Payment', render: (r) => <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${r.paymentStatus === 'Completed' || r.paymentStatus === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-coral/10 text-coral'}`}>{r.paymentStatus}</span> },
          { key: 'createdAt', label: 'Booked On' },
        ]}
      />

      <StudentEditModal open={!!editing} student={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      <StudentCreateModal open={showNew} onClose={() => setShowNew(false)} onCreate={createStudent} />
      <ActionModals />
    </AdminShell>
  );
}

function StudentEditModal({ open, student, onClose, onSave }) {
  return (
    <Modal open={open} onClose={onClose} title={student ? `Edit ${student.name}` : ''}>
      {student && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            if (student.paymentStatus !== undefined) {
              const paymentStatus = String(fd.get('paymentStatus'));
              onSave({ paymentStatus });
            } else {
              const name = String(fd.get('name') ?? '').trim();
              const email = String(fd.get('email') ?? '').trim();
              const track = String(fd.get('track') ?? TRACKS[0]);
              const cohort = String(fd.get('cohort') ?? COHORTS[0].name);
              const attendance = Math.max(0, Math.min(100, Number(fd.get('attendance') ?? 0)));
              const completion = Math.max(0, Math.min(100, Number(fd.get('completion') ?? 0)));
              if (name.length < 2) return pushToast('Name is too short');
              if (!/^\S+@\S+\.\S+$/.test(email)) return pushToast('Enter a valid email');
              onSave({ name, email, track, cohort, attendance, completion });
            }
          }}
          className="space-y-3 p-4"
        >
          {student.paymentStatus !== undefined ? (
            <>
              <FormField name="name" label="Full name" defaultValue={student.name} disabled />
              <FormField name="email" label="Email" type="email" defaultValue={student.email} disabled />
              <SelectField name="paymentStatus" label="Payment Status" options={[{value: 'Pending', label: 'Pending'}, {value: 'Completed', label: 'Completed'}, {value: 'Free', label: 'Free'}, {value: 'Failed', label: 'Failed'}]} defaultValue={student.paymentStatus} />
            </>
          ) : (
            <>
              <FormField name="name" label="Full name" defaultValue={student.name} />
              <FormField name="email" label="Email" type="email" defaultValue={student.email} />
              <div className="grid grid-cols-2 gap-2">
                <SelectField name="track" label="Track" options={TRACKS.map((t) => ({ value: t, label: t }))} defaultValue={student.track} />
                <SelectField name="cohort" label="Cohort" options={COHORTS.map((c) => ({ value: c.name, label: c.name }))} defaultValue={student.cohort} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormField name="attendance" label="Attendance %" type="number" defaultValue={String(student.attendance)} />
                <FormField name="completion" label="Completion %" type="number" defaultValue={String(student.completion)} />
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <PrimaryBtn type="submit">Save changes</PrimaryBtn>
          </div>
        </form>
      )}
    </Modal>
  );
}

function StudentCreateModal({ open, onClose, onCreate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react/set-state-in-effect
      setError(null);
      // eslint-disable-next-line react/set-state-in-effect
      setLoading(false);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Add a new student">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get('name') ?? '').trim();
          const email = String(fd.get('email') ?? '').trim();
          const track = String(fd.get('track') ?? TRACKS[0]);
          const cohort = String(fd.get('cohort') ?? COHORTS[0].name);
          const city = String(fd.get('city') ?? '').trim();
          if (name.length < 2) return setError('Name is required');
          if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Valid email is required');
          
          setError(null);
          setLoading(true);
          try {
            await onCreate({ name, email, track, cohort, city });
          } catch (err) {
            setError(err.message || 'Failed to add student');
          } finally {
            setLoading(false);
          }
        }}
        className="space-y-3 p-4"
      >
        {error && <div className="rounded-lg bg-coral/10 p-3 text-sm font-medium text-coral">{error}</div>}
        <FormField name="name" label="Full name" placeholder="e.g. Aarav Sharma" />
        <FormField name="email" label="Email" type="email" placeholder="name@student.tek.school" />
        <div className="grid grid-cols-2 gap-2">
          <SelectField name="track" label="Track" options={TRACKS.map((t) => ({ value: t, label: t }))} />
          <SelectField name="cohort" label="Cohort" options={COHORTS.map((c) => ({ value: c.name, label: c.name }))} />
        </div>
        <FormField name="city" label="City" placeholder="e.g. Bengaluru" />
        <div className="flex justify-end gap-2 pt-2">
          <GhostBtn disabled={loading} onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn type="submit" loading={loading}>Add student</PrimaryBtn>
        </div>
      </form>
    </Modal>
  );
}

function FormField({ name, label, type = 'text', defaultValue, placeholder }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}
      <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm font-normal normal-case text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
    </label>
  );
}
function SelectField({ name, label, options, defaultValue }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}
      <select name={name} defaultValue={defaultValue} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm font-normal normal-case text-foreground outline-none focus:bg-white">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function FilterChip({ label, active, onClick }) {
  return <button onClick={onClick} className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${active ? 'bg-[#1E1B4B] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{label}</button>;
}
function Bar({ pct }) {
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-[var(--accent-blue-deep)]' : 'bg-coral';
  return <div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div><span className="tabular-nums text-[11px] font-bold">{pct}%</span></div>;
}
function PlacementPill({ s }) {
  const tone = s === 'Placed' ? 'bg-emerald-100 text-emerald-700' : s === 'Offer' ? 'bg-lavender/70' : s === 'Interviewing' ? 'bg-accent-blue/20 text-accent-blue-deep' : s === 'Preparing' ? 'bg-slate-100' : 'bg-slate-50 text-slate-400';
  return <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${tone}`}>{s}</span>;
}


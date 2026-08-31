import { useState, useEffect } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { AdminTable } from '../../../components/admin/AdminTable.jsx';
import { Drawer } from '../../../components/admin/Drawer.jsx';
import { TRACKS, COHORTS } from '../../../lib/adminData.js';
import { AlertTriangle, MessageCircle, Flag, Pencil, Trash2, UserPlus } from 'lucide-react';
import { pushToast } from '../../../lib/actionBus.js';
import { ActionModals } from '../../../components/ActionModals.jsx';
import { Modal, PrimaryBtn, GhostBtn } from '../../../components/ui/Modal.jsx';
import { registerStudent, getStudents } from '../../../lib/api.js';

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [track, setTrack] = useState('all');
  const [risk, setRisk] = useState(false);
  const [active, setActive] = useState(null);
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
  }, []);

  const rows = students.filter((s) => (track === 'all' || s.track === track) && (!risk || s.atRisk));

  const removeStudent = (id) => {
    setStudents((arr) => arr.filter((s) => s.id !== id));
    pushToast('Student removed');
  };
  const bulkDelete = (ids) => setStudents((arr) => arr.filter((s) => !ids.includes(s.id)));

  const saveEdit = (patch) => {
    if (!editing) return;
    setStudents((arr) => arr.map((s) => s.id === editing.id ? { ...s, ...patch } : s));
    pushToast(`Updated ${editing.name}`);
    setEditing(null);
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
        onRowClick={setActive}
        onBulkDelete={bulkDelete}
        empty={{ title: 'No students match those filters', hint: 'Try clearing the track filter or the at-risk toggle.' }}
        filters={
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip label="All tracks" active={track === 'all'} onClick={() => setTrack('all')} />
            {TRACKS.map((t) => <FilterChip key={t} label={t.split(' ')[0]} active={track === t} onClick={() => setTrack(t)} />)}
            <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold">
              <input type="checkbox" checked={risk} onChange={(e) => setRisk(e.target.checked)} className="h-3 w-3" />
              At-risk only
            </label>
          </div>
        }
        rowActions={[
          { label: 'Edit', icon: Pencil, onClick: (r) => setEditing(r) },
          { label: 'Delete', icon: Trash2, destructive: true, onClick: (r) => removeStudent(r.id), confirm: { title: 'Delete student?', message: (r) => <>Removing <b>{r.name}</b> from <b>{r.cohort}</b>. This cannot be undone.</> } },
        ]}
        columns={[
          { key: 'name', label: 'Student', render: (r) => (
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-deep)] text-[10px] font-bold text-white">{r.name.split(' ').map((n) => n[0]).slice(0,2).join('')}</div>
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
        ]}
      />

      <Drawer open={!!active} onClose={() => setActive(null)} title={active?.name ?? ''}
        footer={active && <div className="flex gap-2">
          <button className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#1E1B4B] px-3 py-2 text-xs font-semibold text-white"><MessageCircle className="h-3.5 w-3.5" /> Message</button>
          <button
            onClick={() => {
              setStudents((arr) => arr.map((s) => s.id === active.id ? { ...s, atRisk: !s.atRisk } : s));
              pushToast(`${active.name} ${active.atRisk ? 'cleared' : 'flagged'} at-risk`);
              setActive({ ...active, atRisk: !active.atRisk });
            }}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-coral/15 px-3 py-2 text-xs font-semibold text-coral hover:bg-coral/25"
          ><Flag className="h-3.5 w-3.5" /> {active.atRisk ? 'Clear flag' : 'Flag at-risk'}</button>
        </div>}
      >
        {active && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Cohort</p>
              <p className="text-sm font-semibold">{active.cohort} · {active.track}</p>
              <p className="text-xs text-slate-500">Enrolled {active.enrolledAt} · {active.city} · {active.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Attendance" value={`${active.attendance}%`} />
              <Metric label="Completion" value={`${active.completion}%`} />
              <Metric label="Placement" value={active.placement} />
              <Metric label="At risk" value={active.atRisk ? 'Yes' : 'No'} tone={active.atRisk ? 'coral' : 'default'} />
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Recent activity</p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-baseline gap-2"><span className="w-16 shrink-0 text-slate-400">2d ago</span>Submitted RAG Week 5 assignment</li>
                <li className="flex items-baseline gap-2"><span className="w-16 shrink-0 text-slate-400">4d ago</span>Attended Attention math live class</li>
                <li className="flex items-baseline gap-2"><span className="w-16 shrink-0 text-slate-400">1w ago</span>Passed Week 4 quiz — 82%</li>
              </ul>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Admin notes</p>
              <textarea placeholder="Add a note visible to admissions and mentors…" className="h-24 w-full rounded-lg bg-slate-50 p-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" onBlur={(e) => e.target.value && pushToast('Note saved')} />
            </div>
          </div>
        )}
      </Drawer>

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
            const name = String(fd.get('name') ?? '').trim();
            const email = String(fd.get('email') ?? '').trim();
            const attendance = Math.max(0, Math.min(100, Number(fd.get('attendance') ?? 0)));
            const completion = Math.max(0, Math.min(100, Number(fd.get('completion') ?? 0)));
            if (name.length < 2) return pushToast('Name is too short');
            if (!/^\S+@\S+\.\S+$/.test(email)) return pushToast('Enter a valid email');
            onSave({ name, email, attendance, completion });
          }}
          className="space-y-3 p-4"
        >
          <FormField name="name" label="Full name" defaultValue={student.name} />
          <FormField name="email" label="Email" type="email" defaultValue={student.email} />
          <div className="grid grid-cols-2 gap-2">
            <FormField name="attendance" label="Attendance %" type="number" defaultValue={String(student.attendance)} />
            <FormField name="completion" label="Completion %" type="number" defaultValue={String(student.completion)} />
          </div>
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
function SelectField({ name, label, options }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}
      <select name={name} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm font-normal normal-case text-foreground outline-none focus:bg-white">
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
function Metric({ label, value, tone = 'default' }) {
  return <div className={`rounded-lg p-3 ${tone === 'coral' ? 'bg-coral/10 ring-1 ring-coral/30' : 'bg-slate-50'}`}><p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p><p className="mt-0.5 text-sm font-bold">{value}</p></div>;
}

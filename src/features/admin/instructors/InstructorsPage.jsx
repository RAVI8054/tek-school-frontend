import { useState, useEffect } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { AdminTable } from '../../../components/admin/AdminTable.jsx';

import { Star, Pencil, Trash2, Mail, Plus } from 'lucide-react';
import { pushToast } from '../../../lib/actionBus.js';
import { Modal, PrimaryBtn, GhostBtn } from '../../../components/ui/Modal.jsx';
import { getInstructors, registerInstructor, deleteInstructorAdmin } from '../../../lib/api.js';

export function InstructorsPage() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [newError, setNewError] = useState(null);

  useEffect(() => {
    if (showNew) {
      // eslint-disable-next-line react/set-state-in-effect
      setNewError(null);
      // eslint-disable-next-line react/set-state-in-effect
      setNewLoading(false);
    }
  }, [showNew]);

  useEffect(() => {
    getInstructors()
      .then((res) => {
        if (res.data?.instructors) {
          setRows(res.data.instructors);
        }
      })
      .catch((err) => pushToast('Failed to fetch instructors: ' + err.message));
  }, []);

  return (
    <AdminShell title="Instructors" actions={
      <button onClick={() => setShowNew(true)} className="hidden items-center gap-1.5 rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-xs font-semibold text-white md:inline-flex">
        <Plus className="h-3.5 w-3.5" /> Add instructor
      </button>
    }>
      <AdminTable
        rows={rows}
        filename="instructors.csv"
        empty={{ title: "No instructors yet", hint: "Add your first mentor to assign them to a cohort." }}
        onBulkDelete={(ids) => setRows((arr) => arr.filter((r) => !ids.includes(r.id)))}
        rowActions={[
          { label: "Message", icon: Mail, onClick: (r) => pushToast(`Opening message to ${r.name}`) },
          { label: "Edit", icon: Pencil, onClick: setEditing },
          { label: "Remove", icon: Trash2, destructive: true,
            onClick: async (r) => {
              try {
                await deleteInstructorAdmin(r.id);
                setRows((arr) => arr.filter((x) => x.id !== r.id));
                pushToast(`Removed ${r.name}`);
              } catch (err) {
                pushToast('Failed to remove: ' + err.message, 'error');
              }
            },
            confirm: { title: "Remove instructor?", message: (r) => <>Removing <b>{r.name}</b> from all assigned cohorts.</> } },
        ]}
        columns={[
          { key: "name", label: "Name", render: (r) => (
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#1E1B4B] to-[#2D5FA8] text-[10px] font-bold text-white">{r.name.split(' ').map((n) => n[0]).slice(0,2).join('').toUpperCase()}</div>
              <div className="min-w-0">
                <p className="font-semibold">{r.name}</p>
                <p className="text-[10px] text-slate-400">{r.email || 'no-email@tekschool.in'}</p>
              </div>
            </div>
          ) },
          { key: "track", label: "Track" },
          { key: "cohorts", label: "Cohorts", render: (r) => r.cohorts.join(", ") },
          { key: "upcomingSessions", label: "Upcoming" },
          { key: "rating", label: "Rating", render: (r) => (
            <span className="inline-flex items-center gap-1 text-xs font-bold">
              <Star className="h-3 w-3 fill-[#F4A261] text-[#F4A261]" /> {r.rating.toFixed(1)}
            </span>
          ) },
          { key: "bio", label: "Bio" },
        ]}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name}` : ""}>
        {editing && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get("name") ?? "").trim();
            const bio = String(fd.get("bio") ?? "").trim();
            if (name.length < 2) return pushToast("Name is too short");
            setRows((arr) => arr.map((x) => x.id === editing.id ? { ...x, name, bio } : x));
            pushToast(`Updated ${name}`); setEditing(null);
          }} className="space-y-3">
            <label className="block text-[10px] font-semibold uppercase text-slate-500">Name
              <input name="name" defaultValue={editing.name} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
            </label>
            <label className="block text-[10px] font-semibold uppercase text-slate-500">Public bio
              <textarea name="bio" defaultValue={editing.bio} rows={3} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
            </label>
            <div className="flex justify-end gap-2"><GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn><PrimaryBtn type="submit">Save</PrimaryBtn></div>
          </form>
        )}
      </Modal>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Add an instructor">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") ?? "").trim();
          const email = String(fd.get("email") ?? "").trim();
          const bio = String(fd.get("bio") ?? "").trim();
          if (name.length < 2) return setNewError("Name is required");
          if (!/^\S+@\S+\.\S+$/.test(email)) return setNewError("Valid email is required");

          setNewError(null);
          setNewLoading(true);
          try {
            const res = await registerInstructor({ name, email, bio });
            const user = res.data?.user || {};
            const inst = {
              id: user.id || "ins_" + Date.now(),
              name: user.name || name,
              email: user.email || email,
              track: "Unassigned",
              cohorts: [],
              upcomingSessions: 0,
              rating: 5,
              bio
            };
            setRows((arr) => [inst, ...arr]);
            setShowNew(false);
            pushToast(`Added ${name}. Password sent to email.`);
          } catch (err) {
            setNewError(err.message || 'Failed to add instructor');
          } finally {
            setNewLoading(false);
          }
        }} className="space-y-3">
          {newError && <div className="rounded-lg bg-coral/10 p-3 text-sm font-medium text-coral">{newError}</div>}
          <label className="block text-[10px] font-semibold uppercase text-slate-500">Name
            <input name="name" required className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
          </label>
          <label className="block text-[10px] font-semibold uppercase text-slate-500">Email
            <input name="email" type="email" required className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
          </label>
          <label className="block text-[10px] font-semibold uppercase text-slate-500">Short bio
            <textarea name="bio" rows={3} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
          </label>
          <div className="flex justify-end gap-2"><GhostBtn disabled={newLoading} type="button" onClick={() => setShowNew(false)}>Cancel</GhostBtn><PrimaryBtn type="submit" loading={newLoading}>Add instructor</PrimaryBtn></div>
        </form>
      </Modal>
    </AdminShell>
  );
}

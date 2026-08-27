import { useState } from 'react';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { AdminTable } from '../../components/admin/AdminTable.jsx';
import { INSTRUCTORS } from '../../lib/adminData.js';
import { Star, Pencil, Trash2, Mail, Plus } from 'lucide-react';
import { pushToast } from '../../lib/actionBus.js';
import { Modal, PrimaryBtn, GhostBtn } from '../../components/ui/Modal.jsx';

export function InstructorsPage() {
  const [rows, setRows] = useState(INSTRUCTORS);
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);

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
            onClick: (r) => { setRows((arr) => arr.filter((x) => x.id !== r.id)); pushToast(`Removed ${r.name}`); },
            confirm: { title: "Remove instructor?", message: (r) => <>Removing <b>{r.name}</b> from all assigned cohorts.</> } },
        ]}
        columns={[
          { key: "name", label: "Name", render: (r) => <b>{r.name}</b> },
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
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") ?? "").trim();
          const bio = String(fd.get("bio") ?? "").trim();
          if (name.length < 2) return pushToast("Name is required");
          const inst = { id: "ins_" + Date.now(), name, track: "AI Engineering", cohorts: [], upcomingSessions: 0, rating: 5, bio };
          setRows((arr) => [inst, ...arr]);
          setShowNew(false); pushToast(`Added ${name}`);
        }} className="space-y-3">
          <label className="block text-[10px] font-semibold uppercase text-slate-500">Name
            <input name="name" required className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
          </label>
          <label className="block text-[10px] font-semibold uppercase text-slate-500">Short bio
            <textarea name="bio" rows={3} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
          </label>
          <div className="flex justify-end gap-2"><GhostBtn onClick={() => setShowNew(false)}>Cancel</GhostBtn><PrimaryBtn type="submit">Add instructor</PrimaryBtn></div>
        </form>
      </Modal>
    </AdminShell>
  );
}

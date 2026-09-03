import { useState, useEffect } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { AdminTable } from '../../../components/admin/AdminTable.jsx';

import { Pencil, Trash2, Mail, Plus } from 'lucide-react';
import { pushToast } from '../../../lib/actionBus.js';
import { Modal, PrimaryBtn, GhostBtn } from '../../../components/ui/Modal.jsx';
import { getSalesTeam, registerSalesTeam, updateSalesTeamAdmin, deleteSalesTeamAdmin } from '../../../lib/api.js';

export function SalesTeamPage() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [newError, setNewError] = useState(null);

  useEffect(() => {
    getSalesTeam()
      .then((res) => {
        if (res.data?.salesTeam) {
          setRows(res.data.salesTeam);
        }
      })
      .catch((err) => pushToast('Failed to fetch sales team: ' + err.message));
  }, []);

  return (
    <AdminShell title="Sales Team" actions={
      <button onClick={() => {
        setShowNew(true);
        setNewError(null);
        setNewLoading(false);
      }} className="hidden items-center gap-1.5 rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-xs font-semibold text-white md:inline-flex">
        <Plus className="h-3.5 w-3.5" /> Add member
      </button>
    }>
      <AdminTable
        rows={rows}
        filename="salesteam.csv"
        empty={{ title: "No sales team members", hint: "Add your first sales member." }}
        onBulkDelete={(ids) => setRows((arr) => arr.filter((r) => !ids.includes(r.id)))}
        rowActions={[
          { label: "Message", icon: Mail, onClick: (r) => pushToast(`Opening message to ${r.name}`) },
          { label: "Edit", icon: Pencil, onClick: setEditing },
          { label: "Remove", icon: Trash2, destructive: true,
            onClick: async (r) => {
              try {
                await deleteSalesTeamAdmin(r.id);
                setRows((arr) => arr.filter((x) => x.id !== r.id));
                pushToast(`Removed ${r.name}`);
              } catch (err) {
                pushToast('Failed to remove: ' + err.message, 'error');
              }
            },
            confirm: { title: "Remove member?", message: (r) => <>Removing <b>{r.name}</b> from the sales team.</> } },
        ]}
        columns={[
          { key: "name", label: "Name", render: (r) => (
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#1E1B4B] to-[#2D5FA8] text-[10px] font-bold text-white">{r.name.split(' ').map((n) => n[0]).slice(0,2).join('').toUpperCase()}</div>
              <div className="min-w-0">
                <p className="font-semibold">{r.name}</p>
                <p className="text-[10px] text-slate-400">{r.email}</p>
              </div>
            </div>
          ) },
          { key: "bio", label: "Bio" },
          { key: "joined", label: "Joined", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A' },
          { key: "lastLogin", label: "Last Login", render: (r) => r.lastLoginAt ? new Date(r.lastLoginAt).toLocaleDateString() : 'Never' },
        ]}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? `Edit ${editing.name}` : ""}>
        {editing && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get("name") ?? "").trim();
            const email = String(fd.get("email") ?? "").trim();
            const bio = String(fd.get("bio") ?? "").trim();
            if (name.length < 2) return pushToast("Name is too short");
            
            try {
              await updateSalesTeamAdmin(editing.id, { name, email, bio });
              setRows((arr) => arr.map((x) => x.id === editing.id ? { ...x, name, email, bio } : x));
              pushToast(`Updated ${name}`);
              setEditing(null);
            } catch (err) {
              pushToast('Failed to update: ' + err.message, 'error');
            }
          }} className="space-y-3">
            <label className="block text-[10px] font-semibold uppercase text-slate-500">Name
              <input name="name" defaultValue={editing.name} required className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
            </label>
            <label className="block text-[10px] font-semibold uppercase text-slate-500">Email
              <input name="email" type="email" defaultValue={editing.email} required className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
            </label>
            <label className="block text-[10px] font-semibold uppercase text-slate-500">Bio
              <textarea name="bio" defaultValue={editing.bio} rows={3} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
            </label>
            <div className="flex justify-end gap-2"><GhostBtn type="button" onClick={() => setEditing(null)}>Cancel</GhostBtn><PrimaryBtn type="submit">Save</PrimaryBtn></div>
          </form>
        )}
      </Modal>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Add sales member">
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
            const res = await registerSalesTeam({ name, email, bio });
            const user = res.data?.user || {};
            const member = {
              id: user.id || "sal_" + Date.now(),
              name: user.name || name,
              email: user.email || email,
              bio,
              createdAt: user.createdAt || new Date().toISOString(),
              lastLoginAt: user.lastLoginAt
            };
            setRows((arr) => [member, ...arr]);
            setShowNew(false);
            pushToast(`Added ${name}. Password sent to email.`);
          } catch (err) {
            setNewError(err.message || 'Failed to add member');
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
          <label className="block text-[10px] font-semibold uppercase text-slate-500">Bio
            <textarea name="bio" rows={3} className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
          </label>
          <div className="flex justify-end gap-2"><GhostBtn disabled={newLoading} type="button" onClick={() => setShowNew(false)}>Cancel</GhostBtn><PrimaryBtn type="submit" loading={newLoading}>Add member</PrimaryBtn></div>
        </form>
      </Modal>
    </AdminShell>
  );
}

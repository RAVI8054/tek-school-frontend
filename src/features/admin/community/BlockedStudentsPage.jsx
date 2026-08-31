import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldOff,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import {
  getBlockedStudents,
  unblockAdminCommunityUser,
} from '../../../lib/api.js';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────
// Confirmation modal
// ─────────────────────────────────────────
function UnblockModal({ user, onCancel, onConfirm, loading }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-emerald-500" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Restore community access?
          </h3>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{user.name}</span>{' '}
            will be unblocked and can participate in community channels again.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            Yes, Unblock
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export function BlockedStudentsPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockTarget, setUnblockTarget] = useState(null);
  const [unblocking, setUnblocking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    const fetchBlocked = async () => {
      try {
        const res = await getBlockedStudents();
        if (res.status === 'success') {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load blocked students');
      } finally {
        setLoading(false);
      }
    };
    fetchBlocked();
  }, []);

  const handleUnblock = async () => {
    if (!unblockTarget) return;
    setUnblocking(true);
    try {
      const res = await unblockAdminCommunityUser(unblockTarget._id);
      if (res.status === 'success') {
        toast.success(`${unblockTarget.name} has been unblocked`);
        setUsers((prev) => prev.filter((u) => u._id !== unblockTarget._id));
        setUnblockTarget(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to unblock student');
    } finally {
      setUnblocking(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminShell
        title="Blocked Students"
        hideDefaultSearch
        actions={
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full hidden sm:block">
              <input
                type="text"
                placeholder="Search blocked students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>
        }
      >
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-slate-800">
                Blocked Students ({users.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/community')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Community
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="h-8 w-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <p className="text-sm text-slate-400">Loading data…</p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    No blocked students
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Great news — no students are currently blocked from the
                    community.
                  </p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Reason</th>
                    <th className="px-6 py-4 font-semibold">Blocked At</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const initials = user.name
                      ?.split(' ')
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    const blockedDate = user.blockedAt || user.updatedAt || user.createdAt;
                    
                    const dateFormatted = new Date(blockedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    
                    const timeFormatted = new Date(blockedDate).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {initials || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize border border-slate-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-[250px]">
                          {user.blockReason ? (
                            <p className="truncate text-amber-700 font-medium text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100 inline-block w-full" title={user.blockReason}>
                              {user.blockReason}
                            </p>
                          ) : (
                            <span className="text-xs italic text-slate-400">None provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{dateFormatted}</span>
                            <span className="text-[11px] text-slate-400">{timeFormatted}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setUnblockTarget(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Unblock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </AdminShell>

      <UnblockModal
        user={unblockTarget}
        onCancel={() => setUnblockTarget(null)}
        onConfirm={handleUnblock}
        loading={unblocking}
      />
    </>
  );
}

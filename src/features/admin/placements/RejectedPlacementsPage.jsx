import { useEffect } from 'react';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { useAdminPlacementsStore } from '../../../store/useAdminPlacementsStore.js';
import { Loader2, ArrowLeft, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RejectedPlacementsPage() {
  const { items, loading, fetchData } = useAdminPlacementsStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rejectedItems = items.filter(item => item.stage === 'Rejected');

  return (
    <AdminShell 
      title="Rejected Candidates" 
      actions={
        <Link 
          to="/admin/placements" 
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Pipeline
        </Link>
      }
    >
      <div className="mb-4 text-sm text-slate-500">
        Review candidates who have been rejected from placement pipelines.
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {rejectedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <Ban className="mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No rejected candidates</p>
              <p className="mt-1 text-xs">There are currently no candidates in the rejected stage.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Student Name</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold">Company</th>
                    <th className="px-6 py-3 font-semibold">Days Since Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rejectedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.student}</td>
                      <td className="px-6 py-4">{item.role}</td>
                      <td className="px-6 py-4">{item.company}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {item.updatedDays}d ago
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

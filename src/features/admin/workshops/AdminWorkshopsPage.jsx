import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminShell.jsx';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';
import { getWorkshops } from '../../../lib/api.js';
import { pushToast } from '../../../lib/actionBus.js';

export function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    getWorkshops()
      .then((res) => {
        if (isMounted) setWorkshops(res.data?.workshops || []);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) pushToast("Failed to fetch workshops", "error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminShell title="Workshops">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage all public workshops</p>
        <button 
          onClick={() => navigate('/admin/workshops/new')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E1B4B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2d2870]"
        >
          <Plus className="h-4 w-4" /> Create Workshop
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-xs font-semibold">{workshops.length} total workshops</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading workshops...</div>
        ) : workshops.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No workshops found. Create one!</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {workshops.map((w) => (
              <li key={w._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      w.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {w.status}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{w.track}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{w.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{w.blurb}</p>
                </div>
                
                <div className="flex shrink-0 items-center gap-6 text-xs text-slate-500">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(w.startTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {w.format}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-[var(--accent-blue-deep)] font-semibold"><Users className="h-3.5 w-3.5" /> {w.totalSeats - w.availableSeats} / {w.totalSeats} Booked</span>
                    <span className="font-semibold">{w.isFree ? 'Free' : `${w.price?.currency || '₹'} ${w.price?.amount || 0}`}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}

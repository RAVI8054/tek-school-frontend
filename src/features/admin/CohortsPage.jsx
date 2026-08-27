import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { COHORTS, STUDENTS } from '../../lib/adminData.js';
import { CalendarPlus, Users } from 'lucide-react';

export function CohortsPage() {
  return (
    <AdminShell title="Cohorts & Classes">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">Active cohorts and this week's live sessions.</p>
        <button onClick={() => alert("Class scheduler opened")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-xs font-semibold text-white">
          <CalendarPlus className="h-3.5 w-3.5" /> Schedule class
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {COHORTS.map((c) => {
          const enrolled = STUDENTS.filter((s) => s.cohort === c.name).length;
          const pct = Math.round((enrolled / c.capacity) * 100);
          return (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold">{c.id}</span>
                <span className="text-[10px] font-semibold text-slate-500">{c.track}</span>
              </div>
              <h3 className="mt-2 font-display text-base font-bold">{c.name}</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">{c.start} → {c.end}</p>
              <p className="mt-2 text-xs">Mentor · <b>{c.mentor}</b></p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px]"><span className="text-slate-500 inline-flex items-center gap-1"><Users className="h-3 w-3" /> Enrollment</span><b>{enrolled}/{c.capacity}</b></div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${pct}%` }} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-display text-sm font-bold">This week — live sessions</h3>
        <div className="mt-3 grid grid-cols-7 gap-2 text-xs">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
            <div key={d} className="rounded-lg border border-slate-100 bg-slate-50/50 p-2 min-h-[120px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{d}</p>
              {i % 2 === 0 && <div className="mt-1.5 rounded bg-indigo-600 px-1.5 py-1 text-[10px] text-white">7 PM · AI-02 · RAG</div>}
              {i % 3 === 0 && <div className="mt-1 rounded bg-indigo-100 px-1.5 py-1 text-[10px]">6 PM · CE-01 · K8s</div>}
              {i === 4 && <div className="mt-1 rounded bg-red-100 px-1.5 py-1 text-[10px]">CONFLICT: SE-01 vs SE-02</div>}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

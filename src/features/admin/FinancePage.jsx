import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { AdminTable } from '../../components/admin/AdminTable.jsx';
import { FINANCE, TRACK_POPULARITY } from '../../lib/adminData.js';

export function FinancePage() {
  const totalRevenue = FINANCE.reduce((a, r) => a + r.paid, 0);
  const totalDues = FINANCE.reduce((a, r) => a + (r.total - r.paid), 0);
  const refundQueue = 2;

  return (
    <AdminShell title="Finance">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Revenue collected" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} />
        <Stat label="Outstanding dues" value={`₹${(totalDues / 100000).toFixed(1)}L`} tone="coral" />
        <Stat label="Refund requests" value={String(refundQueue)} />
        <Stat label="Avg. programme value" value="₹2.4L" />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-display text-sm font-bold">Revenue by track</h3>
        <ul className="mt-2 space-y-1.5 text-xs">
          {TRACK_POPULARITY.map((t) => (
            <li key={t.track} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"><span className="font-semibold">{t.track}</span><span className="tabular-nums font-bold">₹{(t.count * 2.4).toFixed(1)}L</span></li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <AdminTable
          rows={FINANCE}
          filename="finance.csv"
          columns={[
            { key: "student", label: "Student" },
            { key: "track", label: "Track" },
            { key: "plan", label: "Plan" },
            { key: "total", label: "Total", render: (r) => `₹${(r.total / 100000).toFixed(2)}L` },
            { key: "paid", label: "Paid", render: (r) => `₹${(r.paid / 100000).toFixed(2)}L` },
            { key: "dueIn", label: "Next EMI", render: (r) => r.paid >= r.total ? <span className="text-emerald-600 font-bold">Cleared</span> : `${r.dueIn}d` },
          ]}
        />
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, tone = "default" }) {
  return <div className={`rounded-xl border p-4 ${tone === "coral" ? "border-coral/40 bg-coral/10" : "border-slate-200 bg-white"}`}><p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p><p className="mt-1 font-display text-2xl font-bold tabular-nums">{value}</p></div>;
}

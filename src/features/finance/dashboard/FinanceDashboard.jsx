import { Link } from 'react-router-dom';
import { FinanceShell } from '../../../components/finance/FinanceShell.jsx';
import { KPIS, FINANCE } from '../../../lib/adminData.js';
import { LineCompare, CHART_COLORS } from '../../../components/admin/Charts.jsx';
import { TrendingUp, TrendingDown, ArrowUpRight, AlertTriangle } from 'lucide-react';

export function FinanceDashboard() {
  const totalRevenue = FINANCE.reduce((a, r) => a + r.paid, 0);
  const totalDues = FINANCE.reduce((a, r) => a + (r.total - r.paid), 0);
  const refundQueue = 2;

  const ATTENTION = [
    { label: `${refundQueue} refund requests pending`, to: '/finance/management', cta: 'Review' },
    { label: '3 students missed EMI deadline', to: '/finance/management', cta: 'Follow up' },
  ];

  return (
    <FinanceShell title="Finance Overview">
      <div className="grid gap-3 md:grid-cols-4">
        <Kpi label="Revenue collected" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} delta={KPIS.revenueMonth.delta} />
        <Kpi label="Outstanding dues" value={`₹${(totalDues / 100000).toFixed(1)}L`} delta={-2} />
        <Kpi label="Conversion rate" value={`${KPIS.conversionRate.value}%`} delta={KPIS.conversionRate.delta} />
        <Kpi label="New enquiries" value={KPIS.newEnquiriesMonth.value.toString()} delta={KPIS.newEnquiriesMonth.delta} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        <ChartCard title="Revenue vs Expenses" subtitle="Last 6 months" pill="6 mo">
          <LineCompare
            labels={['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']}
            series={[
              { name: 'Revenue', data: [120, 140, 160, 145, 180, 210], color: CHART_COLORS.emerald },
              { name: 'Expenses', data: [90, 95, 110, 105, 120, 130], color: CHART_COLORS.red },
            ]}
          />
        </ChartCard>
        
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Needs attention</p>
            <h3 className="font-display text-base font-bold">{ATTENTION.length} items to review</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {ATTENTION.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium">{a.label}</p>
                  <Link to={a.to} className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-blue-deep)] hover:underline">
                    {a.cta} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FinanceShell>
  );
}

function Kpi({ label, value, delta }) {
  const up = delta >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold tabular-nums">{value}</p>
      <p className={`mt-1 inline-flex items-center gap-1 text-[11px] font-bold ${up ? 'text-emerald-600' : 'text-coral'}`}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {up ? '+' : ''}{delta}% vs last month
      </p>
    </div>
  );
}

function ChartCard({ title, subtitle, pill, wide, children }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${wide ? 'lg:col-span-2' : ''}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[13px] font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>}
        </div>
        {pill && <span className="shrink-0 rounded-lg border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{pill}</span>}
      </div>
      {children}
    </div>
  );
}

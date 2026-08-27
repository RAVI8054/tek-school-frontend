import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { KPIS, ATTENTION, ENROLLMENT_TREND, TRACK_POPULARITY, ENQUIRY_FUNNEL, COHORTS, STUDENTS } from '../../lib/adminData.js';
import { LineTrend, BarCompare, Funnel, BarWeek, LineCompare, Gauge, CHART_COLORS } from '../../components/admin/Charts.jsx';
import { ArrowUpRight, TrendingUp, TrendingDown, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

export function AdminDashboard() {
  return (
    <AdminShell title="Overview">
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        <Kpi label="Active students" value={KPIS.activeStudents.value.toString()} delta={KPIS.activeStudents.delta} />
        <Kpi label="New enquiries · month" value={KPIS.newEnquiriesMonth.value.toString()} delta={KPIS.newEnquiriesMonth.delta} />
        <Kpi label="Conversion rate" value={`${KPIS.conversionRate.value}%`} delta={KPIS.conversionRate.delta} />
        <Kpi label="Placement rate" value={`${KPIS.placementRate.value}%`} delta={KPIS.placementRate.delta} />
        <Kpi label="Revenue · month" value={`₹${(KPIS.revenueMonth.value / 100000).toFixed(1)}L`} delta={KPIS.revenueMonth.delta} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ChartCard title="Attendance Tracker" pill="Today">
          <AttendanceTracker />
        </ChartCard>
        <ChartCard title="Weekly Enrollments" pill="This week">
          <BarWeek data={[42, 58, 71, 63, 88, 54, 39]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} />
        </ChartCard>
        <ChartCard title="Revenue vs Expenses" pill="Jan 21–25">
          <LineCompare
            labels={['Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25']}
            series={[
              { name: 'Revenue', data: [42, 48, 46, 55, 52], color: CHART_COLORS.indigo },
              { name: 'Expenses', data: [22, 26, 24, 28, 25], color: CHART_COLORS.red },
            ]}
          />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Enrollment trend" subtitle="Last 12 months" pill="12 mo">
            <LineTrend data={ENROLLMENT_TREND} />
            <p className="mt-3 text-[11px] font-semibold text-emerald-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +38% YoY</p>
          </ChartCard>
          <ChartCard title="Track popularity" subtitle="Active per track" pill="Now">
            <BarCompare data={TRACK_POPULARITY.map((t) => ({ label: t.track, value: t.count }))} />
          </ChartCard>
          <ChartCard title="Enquiry funnel" subtitle="This quarter" pill="Q1" wide>
            <Funnel data={ENQUIRY_FUNNEL} />
          </ChartCard>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Needs attention</p>
            <h3 className="font-display text-base font-bold">4 items to review</h3>
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
    </AdminShell>
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

function AttendanceTracker() {
  const scopes = useMemo(() => [{ id: '__all', name: 'All cohorts' }, ...COHORTS.map((c) => ({ id: c.id, name: c.name }))], []);
  const [idx, setIdx] = useState(0);
  const scope = scopes[idx];
  const { pct, present, total } = useMemo(() => {
    const pool = scope.id === '__all' ? STUDENTS : STUDENTS.filter((s) => s.cohort === scope.name);
    if (!pool.length) return { pct: 0, present: 0, total: 0 };
    const presentCount = pool.filter((s) => s.attendance >= 75).length;
    return { pct: Math.round((presentCount / pool.length) * 100), present: presentCount, total: pool.length };
  }, [scope]);
  const move = (d) => setIdx((i) => (i + d + scopes.length) % scopes.length);
  return (
    <div>
      <Gauge value={pct} label={`${present} of ${total} present`} sublabel={scope.name} />
      <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">
        <button aria-label="Previous cohort" onClick={() => move(-1)} className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-900"><ChevronLeft className="h-3.5 w-3.5" /></button>
        <span className="truncate">{scope.name}</span>
        <button aria-label="Next cohort" onClick={() => move(1)} className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-900"><ChevronRight className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

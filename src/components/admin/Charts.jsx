import { Calendar } from 'lucide-react';

const INDIGO = '#4F46E5';
const INDIGO_SOFT = '#C7D2FE';
const RED = '#EF4444';
const GRID = '#EEF0F5';
const AXIS = '#94A3B8';

export function ChartCard({
  title,
  subtitle,
  pill = 'Today',
  children,
  className = '',
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-slate-800">{title}</p>
          {subtitle && <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
          {pill} <Calendar className="h-3 w-3" />
        </span>
      </div>
      {children}
    </div>
  );
}

export function LineTrend({
  data,
  height = 120,
  color = INDIGO,
  labels,
}) {
  const w = 320, h = height, padX = 8, padT = 10, padB = labels ? 22 : 10;
  const max = Math.max(...data), min = Math.min(...data);
  const range = Math.max(1, max - min);
  const norm = (v) => h - padB - ((v - min) / range) * (h - padT - padB);
  const step = (w - padX * 2) / (data.length - 1);
  const pts = data.map((v, i) => [padX + i * step, norm(v)]);

  const path = pts.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const p0 = arr[i - 1];
    const p2 = arr[i + 1] ?? p;
    const p_1 = arr[i - 2] ?? p0;
    const c1x = p0[0] + (p[0] - p_1[0]) / 6;
    const c1y = p0[1] + (p[1] - p_1[1]) / 6;
    const c2x = p[0] - (p2[0] - p0[0]) / 6;
    const c2y = p[1] - (p2[1] - p0[1]) / 6;
    return `${acc} C ${c1x} ${c1y} ${c2x} ${c2y} ${p[0]} ${p[1]}`;
  }, '');
  const area = `${path} L ${pts[pts.length - 1][0]} ${h - padB} L ${pts[0][0]} ${h - padB} Z`;

  const gridY = 4;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {Array.from({ length: gridY }).map((_, i) => {
        const y = padT + (i * (h - padT - padB)) / (gridY - 1);
        return <line key={i} x1={padX} x2={w - padX} y1={y} y2={y} stroke={GRID} strokeWidth={1} />;
      })}
      <defs>
        <linearGradient id={`ln-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#ln-${color.slice(1)})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.5} fill="white" stroke={color} strokeWidth={2} />
      {labels && labels.map((l, i) => (
        <text key={i} x={padX + i * step} y={h - 6} textAnchor="middle" fontSize="9" fill={AXIS}>{l}</text>
      ))}
    </svg>
  );
}

export function LineCompare({
  series,
  labels,
  height = 140,
}) {
  const w = 320, h = height, padX = 12, padT = 14, padB = 22;
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all), min = Math.min(...all);
  const range = Math.max(1, max - min);
  const norm = (v) => h - padB - ((v - min) / range) * (h - padT - padB);
  const step = (w - padX * 2) / (labels.length - 1);
  const gridY = 4;

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-[10px] font-semibold text-slate-500">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded" style={{ background: s.color ?? INDIGO }} /> {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {Array.from({ length: gridY }).map((_, i) => {
          const y = padT + (i * (h - padT - padB)) / (gridY - 1);
          const val = Math.round(max - (i * range) / (gridY - 1));
          return (
            <g key={i}>
              <line x1={padX} x2={w - padX} y1={y} y2={y} stroke={GRID} strokeWidth={1} />
              <text x={2} y={y + 3} fontSize="8" fill={AXIS}>{val}</text>
            </g>
          );
        })}
        {series.map((s) => {
          const color = s.color ?? INDIGO;
          const d = s.data.map((v, i) => {
            const x = padX + i * step, y = norm(v);
            if (i === 0) return `M ${x} ${y}`;
            const px = padX + (i - 1) * step;
            const midX = (px + x) / 2;
            return `H ${midX} V ${y} H ${x}`;
          }).join(' ');
          return <path key={s.name} d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />;
        })}
        {labels.map((l, i) => (
          <text key={i} x={padX + i * step} y={h - 6} textAnchor="middle" fontSize="9" fill={AXIS}>{l}</text>
        ))}
      </svg>
    </div>
  );
}

export function BarWeek({
  data,
  labels,
  height = 140,
  color = INDIGO,
  softColor = INDIGO_SOFT,
}) {
  const w = 320, h = height, padX = 14, padT = 12, padB = 22;
  const max = Math.max(...data);
  const bw = Math.min(22, (w - padX * 2) / data.length - 8);
  const slot = (w - padX * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {data.map((v, i) => {
        const total = (v / max) * (h - padT - padB);
        const x = padX + i * slot + (slot - bw) / 2;
        const y = h - padB - total;
        const headH = Math.min(total, Math.max(10, total * 0.55));
        const softH = total - headH;
        return (
          <g key={i}>
            {softH > 0 && (
              <rect x={x} y={y} width={bw} height={softH} rx={bw / 2} fill={softColor} />
            )}
            <rect x={x} y={y + softH - (softH > 0 ? bw / 2 : 0)} width={bw} height={headH + (softH > 0 ? bw / 2 : 0)} rx={bw / 2} fill={color} />
            <text x={x + bw / 2} y={h - 6} textAnchor="middle" fontSize="9" fill={AXIS}>{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function BarCompare({ data, color = INDIGO }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
          <span className="truncate text-xs font-medium text-slate-600">{d.label}</span>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
          <span className="tabular-nums text-xs font-bold text-slate-700">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Gauge({
  value,
  label,
  sublabel,
  color = INDIGO,
}) {
  const w = 240, h = 170, cx = w / 2, cy = 120, r = 88, stroke = 16;
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const start = Math.PI, end = 2 * Math.PI;
  const angle = start + (end - start) * (pct / 100);
  const pointOnArc = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const arc = (a0, a1) => {
    const [x0, y0] = pointOnArc(a0);
    const [x1, y1] = pointOnArc(a1);
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <path d={arc(start, end)} fill="none" stroke={GRID} strokeWidth={stroke} strokeLinecap="round" />
      {pct > 0 && <path d={arc(start, angle)} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="32" fontWeight="800" fill="#0F172A">{pct}%</text>
      {label && <text x={cx} y={cy + 22} textAnchor="middle" fontSize="10" fontWeight="600" fill={AXIS}>{label}</text>}
      {sublabel && <text x={cx} y={cy + 38} textAnchor="middle" fontSize="9" fill={AXIS}>{sublabel}</text>}
    </svg>
  );
}

export function Funnel({ data, color = INDIGO }) {
  const max = (data[0]?.count ?? data[0]?.value) ?? 1;
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const c = d.count ?? d.value ?? 0;
        const s = d.stage ?? d.label ?? 'Stage';
        const pct = (c / max) * 100;
        const prevC = i === 0 ? null : (data[i - 1].count ?? data[i - 1].value ?? 1);
        const conv = i === 0 ? null : Math.round((c / prevC) * 100);
        return (
          <div key={s}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">{s}</span>
              <span className="tabular-nums font-bold text-slate-800">
                {c.toLocaleString()}
                {conv !== null && <span className="ml-1.5 text-[10px] font-semibold text-slate-400">→ {conv}%</span>}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export const CHART_COLORS = { indigo: INDIGO, indigoSoft: INDIGO_SOFT, red: RED };

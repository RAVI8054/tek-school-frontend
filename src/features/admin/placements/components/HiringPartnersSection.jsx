import { Building2 } from 'lucide-react';

export function HiringPartnersSection({ partners }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 font-display text-sm font-bold flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Hiring partners</h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-display text-sm font-bold">{p.company}</p>
            <p className="text-[11px] text-slate-500">{p.track}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-400">Active roles</p><p className="text-sm font-bold">{p.activeRoles}</p></div>
              <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-400">Total hires</p><p className="text-sm font-bold">{p.hires}</p></div>
            </div>
            <p className="mt-2 text-[11px]">{p.contact} · <a className="text-[var(--accent-blue-deep)] hover:underline" href={`mailto:${p.email}`}>{p.email}</a></p>
          </div>
        ))}
      </div>
    </div>
  );
}

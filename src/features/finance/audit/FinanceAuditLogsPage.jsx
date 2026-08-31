import { FinanceShell } from "../../../components/finance/FinanceShell.jsx";
import { AUDIT } from "../../../lib/adminData.js";

export function FinanceAuditLogsPage() {
  return (
    <FinanceShell title="Audit Logs">
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold">System Audit Logs</h3>
            <p className="text-[11px] text-slate-500">A detailed ledger of all privileged changes across the system.</p>
          </div>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Export CSV</button>
        </div>
        <ul className="divide-y divide-slate-100 text-sm">
          {AUDIT.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50">
              <div className="shrink-0 text-right w-24">
                <p className="font-semibold text-slate-700">{a.when.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400">{a.when.split(' ').slice(1).join(' ')}</p>
              </div>
              <div className="h-full w-px bg-slate-100" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{a.action}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs text-slate-500">Performed by <b>{a.who}</b></p>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">{a.role || 'Admin'}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </FinanceShell>
  );
}

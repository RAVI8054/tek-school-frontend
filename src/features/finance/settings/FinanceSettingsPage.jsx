import { FinanceShell } from "../../../components/finance/FinanceShell.jsx";
import { ROLE_ACCESS } from "../../../lib/adminData.js";
import { Check } from "lucide-react";

const AREAS = ["overview","students","cohorts","assignments","placements","content","enquiries","instructors","finance","marketing","settings"];
const ROLE_LABEL = { admin: "Super admin", admissions: "Admissions counselor", instructor: "Instructor", finance: "Finance" };

export function FinanceSettingsPage() {
  return (
    <FinanceShell title="System Settings & Roles">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="font-display text-sm font-bold">Role access matrix</h3>
            <p className="text-[11px] text-slate-500">Which sidebar sections each role can see.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2">Area</th>
                  {Object.keys(ROLE_LABEL).map((r) => <th key={r} className="px-3 py-2 text-center">{ROLE_LABEL[r]}</th>)}
                </tr>
              </thead>
              <tbody>
                {AREAS.map((a) => (
                  <tr key={a} className="border-b border-slate-50">
                    <td className="px-3 py-2 font-semibold capitalize">{a}</td>
                    {Object.keys(ROLE_LABEL).map((r) => (
                      <td key={r} className="px-3 py-2 text-center">
                        {ROLE_ACCESS[r]?.includes(a) ? <Check className="mx-auto h-3.5 w-3.5 text-emerald-600" /> : <span className="text-slate-300">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FinanceShell>
  );
}

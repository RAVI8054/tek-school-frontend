import { useState } from 'react';
import { InstructorShell } from '../../../components/instructor/InstructorShell.jsx';
import { ADMIN_ASSIGNMENTS } from '../../../lib/adminData.js';
import { CheckSquare, FileText, ClipboardList } from 'lucide-react';
import { pushToast } from '../../../lib/actionBus.js';

const TEMPLATES = [
  "Solid direction. Tighten the eval — add a validation curve.",
  "Working solution, missing test coverage on edge cases.",
  "Great write-up. Deploy artifact next iteration.",
];

export function InstructorAssignmentsPage() {
  const [tab, setTab] = useState("grading");
  const [selected, setSelected] = useState([]);

  return (
    <InstructorShell title="Assignments & Exams">
      <div className="mb-4 flex items-center gap-2">
        <TabBtn active={tab === "grading"} onClick={() => setTab("grading")} icon={ClipboardList}>Grading queue</TabBtn>
        <TabBtn active={tab === "exams"} onClick={() => setTab("exams")} icon={FileText}>Exams</TabBtn>
      </div>

      {tab === "grading" ? (
        <>
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-semibold">{selected.length} selected · {ADMIN_ASSIGNMENTS.reduce((a, x) => a + x.pending, 0)} submissions pending</p>
              <div className="flex gap-2">
                <button onClick={() => { pushToast("Assigned to mentor pool"); setSelected([]); }} disabled={!selected.length} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold disabled:opacity-40">Bulk assign</button>
                <button onClick={() => { pushToast("Feedback template applied"); setSelected([]); }} disabled={!selected.length} className="rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-40">Apply template</button>
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {ADMIN_ASSIGNMENTS.map((a) => {
                const checked = selected.includes(a.id);
                return (
                  <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                    <input type="checkbox" checked={checked} onChange={(e) => setSelected((s) => e.target.checked ? [...s, a.id] : s.filter((x) => x !== a.id))} className="h-3.5 w-3.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-[11px] text-slate-500">{a.module} · {a.cohort} · Due {a.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span><b className="text-[var(--accent-blue-deep)]">{a.submitted}</b> submitted</span>
                      <span><b className="text-coral">{a.pending}</b> pending</span>
                      <span><b className="text-emerald-600">{a.graded}</b> graded</span>
                      <button onClick={() => pushToast(`Opened grading for ${a.title}`)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50">
                        <CheckSquare className="mr-1 inline h-3 w-3" /> Grade
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Feedback templates</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button key={t} onClick={() => pushToast("Template copied")} className="rounded-lg border border-slate-200 p-3 text-left text-xs hover:border-[var(--accent-blue-deep)]">{t}</button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Upcoming exams</p>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            <li className="flex items-center justify-between py-3">
              <div><p className="font-semibold">AI-02 Mid-term · Applied AI</p><p className="text-[11px] text-slate-500">Aug 12 · Proctored · 25 auto-grade + 5 manual</p></div>
              <button onClick={() => pushToast("Proctoring configured")} className="rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-[11px] font-semibold text-white">Configure proctoring</button>
            </li>
            <li className="flex items-center justify-between py-3">
              <div><p className="font-semibold">CE-01 Kubernetes checkpoint</p><p className="text-[11px] text-slate-500">Aug 5 · Open-book · 15 questions</p></div>
              <button onClick={() => pushToast("Question bank opened")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold">Question bank</button>
            </li>
          </ul>
        </div>
      )}
    </InstructorShell>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }) {
  return <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${active ? "bg-[#1E1B4B] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}><Icon className="h-3.5 w-3.5" /> {children}</button>;
}

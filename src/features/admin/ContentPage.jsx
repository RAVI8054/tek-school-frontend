import { useState } from 'react';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { INSTRUCTORS, TRACKS } from '../../lib/adminData.js';
import { GripVertical, FileUp } from 'lucide-react';
import { pushToast } from '../../lib/actionBus.js';

const SYLLABUS = {
  "AI Engineering": [
    "Python + math foundations",
    "Data engineering with pandas",
    "Deep learning fundamentals",
    "Transformers & attention",
    "RAG pipelines",
    "Fine-tuning with LoRA",
    "MLOps: training → serving",
    "Capstone: production LLM system",
  ],
  "Cloud Engineering": [
    "Linux + networking",
    "AWS core services",
    "Docker fundamentals",
    "Kubernetes essentials",
    "Terraform + IaC",
    "CI/CD pipelines",
    "Observability + SRE",
    "Capstone: multi-region deploy",
  ],
  "Software Engineering": [
    "Modern JS/TS",
    "Data structures + patterns",
    "System design fundamentals",
    "Databases + query optimization",
    "Distributed systems",
    "Backend services at scale",
    "Frontend architecture",
    "Capstone: full-stack product",
  ],
};

export function ContentPage() {
  const [track, setTrack] = useState("AI Engineering");
  const [modules, setModules] = useState(SYLLABUS[track]);

  const swap = (i, j) => {
    if (j < 0 || j >= modules.length) return;
    const arr = [...modules]; [arr[i], arr[j]] = [arr[j], arr[i]]; setModules(arr);
  };

  return (
    <AdminShell title="Content / Curriculum">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {TRACKS.map((t) => (
                <button key={t} onClick={() => { setTrack(t); setModules(SYLLABUS[t]); }} className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${track === t ? "bg-[#1E1B4B] text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{t.split(" ")[0]}</button>
              ))}
            </div>
            <button onClick={() => pushToast("Curriculum saved")} className="rounded-lg bg-[#1E1B4B] px-3 py-1.5 text-[11px] font-semibold text-white">Save curriculum</button>
          </div>
          <ul className="mt-4 space-y-2">
            {modules.map((m, i) => (
              <li key={m} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <GripVertical className="h-3.5 w-3.5 text-slate-300" />
                <span className="w-6 text-[11px] font-bold text-slate-400">M{i + 1}</span>
                <input defaultValue={m} className="flex-1 bg-transparent outline-none" />
                <button onClick={() => swap(i, i - 1)} className="text-[11px] text-slate-400 hover:text-foreground">↑</button>
                <button onClick={() => swap(i, i + 1)} className="text-[11px] text-slate-400 hover:text-foreground">↓</button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-400">This is the single source of truth. Public program pages read from here.</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Brochures</p>
            <div className="mt-2 space-y-1.5 text-xs">
              <p className="flex items-center justify-between"><span>ai-engineering-brochure.pdf</span><button onClick={() => pushToast("Uploaded new version")} className="text-[var(--accent-blue-deep)] font-semibold hover:underline">Replace</button></p>
              <p className="flex items-center justify-between"><span>cloud-brochure.pdf</span><button onClick={() => pushToast("Uploaded new version")} className="text-[var(--accent-blue-deep)] font-semibold hover:underline">Replace</button></p>
              <p className="flex items-center justify-between"><span>swe-brochure.pdf</span><button onClick={() => pushToast("Uploaded new version")} className="text-[var(--accent-blue-deep)] font-semibold hover:underline">Replace</button></p>
            </div>
            <button onClick={() => pushToast("Brochure uploaded")} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-500"><FileUp className="h-3.5 w-3.5" /> Upload new brochure</button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Mentor bios (public)</p>
            <ul className="mt-2 divide-y divide-slate-100 text-xs">
              {INSTRUCTORS.map((i) => (
                <li key={i.id} className="flex items-center justify-between py-2">
                  <div><p className="font-semibold">{i.name}</p><p className="text-[11px] text-slate-500">{i.track}</p></div>
                  <button onClick={() => pushToast(`Edit ${i.name}'s bio`)} className="text-[var(--accent-blue-deep)] font-semibold hover:underline">Edit</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

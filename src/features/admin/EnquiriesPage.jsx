import { useState } from 'react';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { PipelineBoard } from '../../components/admin/PipelineBoard.jsx';
import { ENQUIRIES } from '../../lib/adminData.js';

const STAGES = ["New","Contacted","Demo Booked","Enrolled","Lost"];
const TINT = { "New": "#F4A261", "Contacted": "#5BA4E8", "Demo Booked": "#2D5FA8", "Enrolled": "#10B981", "Lost": "#94A3B8" };

export function EnquiriesPage() {
  const [items, setItems] = useState(ENQUIRIES);
  return (
    <AdminShell title="Enquiries">
      <p className="mb-3 text-xs text-slate-500">Every lead — from Contact form, WhatsApp, Instagram — lands here. Drag to update stage.</p>
      <PipelineBoard
        stages={STAGES}
        items={items}
        tint={TINT}
        onMove={(id, to) => setItems((arr) => arr.map((x) => x.id === id ? { ...x, stage: to } : x))}
        renderCard={(i) => (
          <div>
            <p className="font-semibold">{i.name}</p>
            <p className="text-[11px] text-slate-500">{i.track} · via {i.source}</p>
            <p className="mt-1 text-[11px]">{i.notes}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{i.createdAt} · {i.counselor}</p>
          </div>
        )}
      />
    </AdminShell>
  );
}

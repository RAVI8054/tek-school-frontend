import { useState } from 'react';

export function PipelineBoard({
  stages, items, renderCard, onMove, tint,
}) {
  const [dragId, setDragId] = useState(null);
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(200px, 1fr))` }}>
      {stages.map((s) => {
        const col = items.filter((i) => i.stage === s);
        return (
          <div key={s}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragId && onMove) onMove(dragId, s); setDragId(null); }}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: tint?.[s] ?? "#2D5FA8" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{col.length}</span>
            </div>
            <div className="space-y-2">
              {col.map((it) => (
                <div key={it.id}
                  draggable={!!onMove}
                  onDragStart={() => setDragId(it.id)}
                  className={`rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-sm ${onMove ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {renderCard(it)}
                </div>
              ))}
              {col.length === 0 && <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-[11px] text-slate-400">Drop here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

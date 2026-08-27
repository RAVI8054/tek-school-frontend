import { useState, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * PipelineBoard — Responsive Kanban board.
 * • Mobile  : horizontal scroll, fixed-width columns, tap "Move →" to change stage
 * • Desktop : columns fill available width, full drag-and-drop
 */
export function PipelineBoard({ stages, items, tint = {}, onMove, renderCard }) {
  const [dragId, setDragId]     = useState(null);
  const [overStage, setOverStage] = useState(null);
  const [moveMenu, setMoveMenu]   = useState(null); // { itemId, currentStage }
  const dragItem = useRef(null);

  /* ─── drag handlers ───────────────────────────────────────── */
  const handleDragStart = useCallback((e, item) => {
    dragItem.current = item;
    setDragId(item.id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setOverStage(null);
    dragItem.current = null;
  }, []);

  const handleDragOver = useCallback((e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverStage(stage);
  }, []);

  const handleDrop = useCallback((e, stage) => {
    e.preventDefault();
    if (dragItem.current && dragItem.current.stage !== stage && onMove) {
      onMove(dragItem.current.id, stage);
    }
    setDragId(null);
    setOverStage(null);
    dragItem.current = null;
  }, [onMove]);

  /* ─── mobile move handler ─────────────────────────────────── */
  const handleMobileMove = useCallback((itemId, targetStage) => {
    if (onMove) onMove(itemId, targetStage);
    setMoveMenu(null);
  }, [onMove]);

  return (
    /* Outer wrapper:
       - mobile  → horizontal scroll, fixed column widths
       - desktop → no scroll, flex-1 fills width             */
    <div className="flex gap-2 md:gap-3 h-full min-h-0 overflow-x-auto md:overflow-x-hidden">
      {stages.map((stage) => {
        const col    = items.filter((i) => i.stage === stage);
        const accent = tint[stage] ?? '#2D5FA8';
        const isOver = overStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDrop={(e) => handleDrop(e, stage)}
            onDragLeave={() => setOverStage(null)}
            className={`
              flex flex-col rounded-xl border transition-all duration-150
              w-[200px] shrink-0
              sm:w-[220px]
              md:flex-1 md:w-auto md:min-w-0
              ${isOver
                ? 'border-blue-400 bg-blue-50/60 shadow-md'
                : 'border-slate-200 bg-slate-50/60'
              }
            `}
          >
            {/* Column header */}
            <div className="shrink-0 px-3 pt-2.5 pb-2 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: accent }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 truncate">
                    {stage}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white shrink-0"
                  style={{ background: accent }}
                >
                  {col.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
              {col.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  className={`
                    rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-sm
                    transition-all duration-150 select-none
                    md:cursor-grab md:active:cursor-grabbing
                    ${dragId === item.id ? 'opacity-40 scale-95 shadow-xl' : 'hover:shadow-md'}
                  `}
                >
                  {renderCard(item)}

                  {/* Mobile-only "Move" button */}
                  {onMove && (
                    <div className="md:hidden mt-2 pt-1.5 border-t border-slate-100">
                      <button
                        onClick={() =>
                          setMoveMenu(
                            moveMenu?.itemId === item.id ? null : { itemId: item.id, currentStage: stage }
                          )
                        }
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                      >
                        <ChevronRight className="w-3 h-3" /> Move to…
                      </button>

                      {moveMenu?.itemId === item.id && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {stages
                            .filter((s) => s !== stage)
                            .map((s) => (
                              <button
                                key={s}
                                onClick={() => handleMobileMove(item.id, s)}
                                className="text-[10px] font-semibold px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                              >
                                {s}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {col.length === 0 && (
                <div
                  className={`rounded-lg border-2 border-dashed p-3 text-center text-[11px] transition-colors ${
                    isOver ? 'border-blue-300 text-blue-400' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {isOver ? '⬇ Drop here' : 'No leads'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

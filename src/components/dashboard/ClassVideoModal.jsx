import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

const DEMO_SRC = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export function ClassVideoModal({
  open,
  title,
  instructor,
  onClose





}) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setPlaying(false);
      setProgress(0);
    });
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-start gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-blue-deep)]">Class demo</p>
            <h3 className="truncate font-display text-lg font-bold">{title}</h3>
            <p className="text-xs text-muted-foreground">{instructor}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative bg-black">
          <video
            ref={ref}
            src={DEMO_SRC}
            className="aspect-video w-full"
            playsInline
            controls={false}
            onClick={toggle}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setProgress(v.duration ? v.currentTime / v.duration * 100 : 0);
            }}
            onEnded={() => setPlaying(false)} />
          
          {!playing &&
          <button
            onClick={toggle}
            aria-label="Play demo"
            className="absolute inset-0 grid place-items-center bg-black/30 transition-colors hover:bg-black/40">
            
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-slate-900 shadow-xl">
                <Play className="h-7 w-7 translate-x-0.5 fill-current" />
              </span>
            </button>
          }
        </div>

        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent-blue-deep)] text-white">
            {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 translate-x-0.5 fill-current" />}
          </button>
          <button
            onClick={() => {
              if (ref.current) ref.current.currentTime = 0;
            }}
            aria-label="Restart"
            className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-slate-50">
            
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[var(--accent-blue-deep)] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <button
            onClick={() => {
              const v = ref.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
            className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-slate-50">
            
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>);

}
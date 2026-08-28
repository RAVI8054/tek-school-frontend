import { useEffect, useRef, useState } from "react";
import { Send, RotateCcw, Sparkles } from "lucide-react";
import { AssistantMark } from "./AssistantMark.jsx";

const STARTERS = [
  "What should I focus on this week?",
  "I'm behind on my assignment",
  "How do I prep for placements?",
];

export function TekGuru({ studentName, className }) {
  const scrollRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const send = (t) => {
    const v = t.trim();
    if (!v || isLoading) return;
    
    // eslint-disable-next-line react/purity
    const userMsg = { id: Math.random().toString(), role: "user", text: v };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setIsLoading(true);

    // Mock response
    setTimeout(() => {
      const guruMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: `Here's what I found for "${v}": I'm currently running in demo mode, but I'm here to help you stay on track with your learning journey.`
      };
      setMessages((prev) => [...prev, guruMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`flex h-full min-h-[540px] flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ${className ?? ""}`}>
      {messages.length > 0 && (
        <div className="flex justify-end px-4 pt-3">
          <button
            onClick={() => setMessages([])}
            aria-label="Reset conversation"
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      )}


      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="rounded-2xl rounded-tl-md bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Hi{studentName ? ` ${studentName}` : ""} 👋 I'm Tek Guru. Tell me what's on your mind — a stuck assignment,
              a concept that won't click, or how your week is going. I'll help you solve it right here.
            </div>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-[var(--accent-blue)]/15 px-3.5 py-1.5 text-xs font-semibold text-[var(--accent-blue-deep)] transition-transform hover:scale-[1.03]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-2">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100">
                  <AssistantMark className="h-4 w-4" />
                </span>
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-md bg-slate-50 px-3.5 py-2 text-sm text-slate-700">
                  {m.text || "…"}
                </div>
              </div>
            ),
          )
        )}
        {isLoading && (
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-[var(--accent-blue-deep)]" /> Tek Guru is thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="flex items-center gap-2 border-t border-slate-100 p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Tek Guru anything…"
          aria-label="Message Tek Guru"
          className="h-11 min-w-0 flex-1 rounded-full bg-slate-100 px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30"
        />
        <button
          type="submit"
          disabled={!draft.trim() || isLoading}
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

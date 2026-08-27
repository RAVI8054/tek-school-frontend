import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const QUICK = [
  'Show KPIs for this month',
  'Find at-risk students in AI-02',
  'Draft a warm email to Bengaluru principals inviting them to a demo day',
  'Find HR contacts for Cloud Engineering',
  'Which assignments have the biggest grading backlog?',
  'Snapshot placements pipeline',
];

export function AdminAI({ open, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  const send = (text) => {
    const t = text.trim();
    if (!t || busy) return;
    
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: t }]);
    setInput('');
    setBusy(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: `Here is the requested information for: "${t}". This is a mocked admin copilot response.` }
      ]);
      setBusy(false);
    }, 1500);
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
      >
        <header className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-4 py-3 text-white">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Admin copilot</p>
            <h2 className="font-display text-sm font-bold">Ask AI</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div>
              <p className="text-xs text-slate-500">Hi — I can pull live data, draft outreach, and summarize what needs attention. Try:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[var(--accent-blue-deep)] hover:text-[var(--accent-blue-deep)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {messages.map((m) => {
              const mine = m.role === 'user';
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                      mine
                        ? 'bg-[#1E1B4B] text-white'
                        : 'bg-slate-50 text-slate-800 ring-1 ring-slate-100'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about students, pipeline, drafts…"
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[var(--accent-blue-deep)]"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] text-white disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </aside>
    </>
  );
}

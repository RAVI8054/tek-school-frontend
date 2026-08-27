import { useMemo, useState } from 'react';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { AUTHORITIES, OUTREACH_RUNS, draftMessage } from '../../lib/outreachData.js';
import { Modal, PrimaryBtn, GhostBtn } from '../../components/ui/Modal.jsx';
import { pushToast } from '../../lib/actionBus.js';
import { Mail, MessageSquare, Send, Sparkles, Users, Filter, Check, AtSign, Phone, Loader2 } from 'lucide-react';

const SEGMENTS = ["All","Principal","Dean","Placement Cell","HoD","Career Counselor"];

export function OutreachPage() {
  const [channel, setChannel] = useState("Email");
  const [segment, setSegment] = useState("Placement Cell");
  const [goal, setGoal] = useState("Hiring drive — 168 job-ready engineers");
  const [tone, setTone] = useState("Warm");
  const [selected, setSelected] = useState(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const audience = useMemo(
    () => AUTHORITIES.filter((a) => segment === "All" ? true : a.segment === segment),
    [segment],
  );

  const toggle = (id) => setSelected((s) => {
    const n = new Set(s);
    if (n.has(id)) { n.delete(id); } else { n.add(id); }
    return n;
  });
  const selectAll = () => setSelected(new Set(audience.map((a) => a.id)));
  const clearAll = () => setSelected(new Set());

  const runAiDraft = () => {
    setDrafting(true);
    setTimeout(() => {
      const { subject: s, body: b } = draftMessage({ channel, segment: segment === "All" ? "school authorities" : segment, goal, tone });
      setSubject(s);
      setBody(b);
      setDrafting(false);
      pushToast("AI drafted the message — review, then send");
    }, 900);
  };

  const startSend = () => {
    if (selected.size === 0) { pushToast("Select at least one recipient"); return; }
    if (!body.trim()) { pushToast("Draft the message first"); return; }
    setShowConfirm(true);
  };
  const confirmSend = () => {
    setShowConfirm(false);
    setSending(true);
    setProgress(0);
    const total = selected.size;
    let sent = 0;
    const timer = setInterval(() => {
      sent = Math.min(total, sent + Math.max(1, Math.floor(total / 20)));
      setProgress(Math.round((sent / total) * 100));
      if (sent >= total) {
        clearInterval(timer);
        setSending(false);
        pushToast(`✓ ${channel} sent to ${total} recipients`);
        setSelected(new Set());
      }
    }, 120);
  };

  const ChannelIcon = channel === "Email" ? Mail : MessageSquare;

  return (
    <AdminShell title="Bulk Outreach">
      <p className="mb-3 text-xs text-slate-500">
        Send email, SMS, and WhatsApp to school authorities across Karnataka. The AI copilot fetches contacts, drafts messages, and personalizes each send.
      </p>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Users className="h-3 w-3" /> Audience ({audience.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {SEGMENTS.map((s) => (
                <button key={s} onClick={() => { setSegment(s); setSelected(new Set()); }}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${segment === s ? "bg-[#1E1B4B] text-white" : "bg-slate-100 text-slate-600"}`}>{s}</button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold">
              <button onClick={selectAll} className="text-[var(--accent-blue-deep)] hover:underline">Select all</button>
              <span className="text-slate-300">·</span>
              <button onClick={clearAll} className="text-slate-500 hover:underline">Clear</button>
              <span className="ml-auto rounded-md bg-coral/15 px-1.5 py-0.5 text-coral">{selected.size} selected</span>
            </div>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {audience.map((a) => (
              <button key={a.id} onClick={() => toggle(a.id)} className="flex w-full items-start gap-2 border-b border-slate-50 px-3 py-2 text-left hover:bg-slate-50/70">
                <span className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded border ${selected.has(a.id) ? "border-[#1E1B4B] bg-[#1E1B4B] text-white" : "border-slate-300"}`}>
                  {selected.has(a.id) && <Check className="h-2.5 w-2.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">{a.name}</span>
                  <span className="block truncate text-[10px] text-slate-500">{a.role} · {a.institution}</span>
                  <span className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                    <AtSign className="h-2.5 w-2.5" /> {a.email}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
            {(["Email","SMS","WhatsApp"]).map((c) => (
              <button key={c} onClick={() => setChannel(c)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${channel === c ? "bg-[#1E1B4B] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {c === "Email" ? <Mail className="h-3 w-3" /> : c === "SMS" ? <MessageSquare className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                {c}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold">
                <option>Warm</option><option>Direct</option><option>Formal</option>
              </select>
              <button disabled={drafting} onClick={runAiDraft}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lavender/40 px-3 py-1.5 text-xs font-semibold text-[#1E1B4B] hover:bg-lavender/60 disabled:opacity-60">
                {drafting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {drafting ? "Drafting…" : "AI draft"}
              </button>
            </div>
          </div>

          <div className="grid gap-3 p-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Campaign goal
              <input value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal normal-case text-foreground" />
            </label>

            {channel === "Email" && (
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Subject
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line — click AI draft to auto-fill" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal normal-case text-foreground" />
              </label>
            )}

            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Message body
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={channel === "SMS" ? 4 : 10}
                placeholder={`${channel} body — use {{name}} and {{institution}} for personalization`}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal normal-case text-foreground"
              />
              {channel === "SMS" && (
                <span className="mt-1 block text-[10px] text-slate-400">{body.length}/160 characters · SMS truncates beyond 160</span>
              )}
            </label>

            {sending && (
              <div className="rounded-xl border border-[#1E1B4B]/20 bg-[#1E1B4B]/5 p-3">
                <p className="text-xs font-semibold text-[#1E1B4B]">Sending {channel} to {selected.size} recipients…</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">{progress}%</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500">
                <ChannelIcon className="mr-1 inline h-3 w-3" />
                Sending as {channel} · {selected.size} recipient{selected.size === 1 ? "" : "s"}
              </span>
              <button onClick={() => { setSubject(""); setBody(""); pushToast("Draft cleared"); }} className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">Clear</button>
              <button onClick={() => pushToast("Test sent to your inbox (mock)")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Send test</button>
              <button onClick={startSend} disabled={sending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_#1E1B4B] disabled:opacity-60">
                <Send className="h-3 w-3" /> Send to {selected.size || audience.length}
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 font-display text-sm font-bold flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Recent runs</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="p-2 text-left">When</th><th className="p-2 text-left">Channel</th><th className="p-2 text-left">Audience</th><th className="p-2 text-left">Subject</th><th className="p-2 text-right">Sent</th><th className="p-2 text-right">Replies</th></tr>
            </thead>
            <tbody>
              {OUTREACH_RUNS.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="p-2 text-slate-500">{r.when}</td>
                  <td className="p-2 font-semibold">{r.channel}</td>
                  <td className="p-2">{r.audience}</td>
                  <td className="p-2 truncate">{r.subject}</td>
                  <td className="p-2 text-right font-semibold">{r.delivered}/{r.recipients}</td>
                  <td className="p-2 text-right"><span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-emerald-700">{r.replies}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} tone="navy"
        eyebrow={<span className="pill-tag -rotate-2 bg-coral/20 text-coral"><Send className="h-3 w-3" /> Confirm send</span>}
        title={`Send ${channel} to ${selected.size} recipients?`}
        footer={<><GhostBtn onClick={() => setShowConfirm(false)}>Not yet</GhostBtn><PrimaryBtn onClick={confirmSend}>Send now</PrimaryBtn></>}>
        <p>This will personalize each message with the recipient's name and institution, then dispatch through the {channel} gateway.</p>
        <ul className="mt-3 space-y-1 text-xs">
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-600" /> Opt-outs and unsubscribed contacts will be skipped.</li>
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-600" /> Delivery events are logged for reply-rate tracking.</li>
          <li className="flex items-center gap-2"><Phone className="h-3 w-3 text-[var(--accent-blue-deep)]" /> Replies land in the Inbox and can be routed to a counselor.</li>
        </ul>
      </Modal>
    </AdminShell>
  );
}

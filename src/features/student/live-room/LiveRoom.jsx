import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CLASSES, MENTORS, COHORT, formatDate } from "../../../lib/dashboard-data";
import { pushToast } from "../../../lib/action-bus";
import { Avatar } from "../../../components/Avatar";
import { LiveTranscript } from "../../../components/dashboard/LiveTranscript";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, ScreenShare, Hand, Send, Users, MessageCircle, Circle, Sparkles, Settings, Captions } from "lucide-react";

function LiveRoomRouteWrapper() {
  const search = Route.useSearch();
  return <LiveRoomPage initialTopic={search.topic} initialInstructor={search.instructor} />;
}


export default LiveRoomRouteWrapper;



export function LiveRoomPage({ initialTopic, initialInstructor }) {
  const nextLive = CLASSES.filter((c) => c.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date))[0];
  const topic = initialTopic ?? nextLive?.topic ?? "AI Engineering — Live Session";
  const instructor = initialInstructor ?? nextLive?.instructor ?? "Ananya Rao";
  const when = nextLive ? formatDate(nextLive.date) : "Live now";

  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [hand, setHand] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [tab, setTab] = useState("chat");
  const [elapsed, setElapsed] = useState(0);
  const [messages, setMessages] = useState([
  { id: 1, from: instructor, initials: "AR", photo: "https://randomuser.me/api/portraits/women/65.jpg", text: "Welcome in — we'll start with the attention head walkthrough.", mentor: true },
  { id: 2, from: "Meera S.", initials: "MS", photo: "https://randomuser.me/api/portraits/women/44.jpg", text: "Recording started? 🙋‍♀️" },
  { id: 3, from: "Karan V.", initials: "KV", photo: "https://randomuser.me/api/portraits/men/32.jpg", text: "Yes, top-right." },
  { id: 4, from: instructor, initials: "AR", photo: "https://randomuser.me/api/portraits/women/65.jpg", text: "Drop questions in chat as we go — I'll answer in the last 10 min.", mentor: true }]
  );
  const [draft, setDraft] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {const t = setInterval(() => setElapsed((e) => e + 1), 1000);return () => clearInterval(t);}, []);
  useEffect(() => {chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });}, [messages]);

  const send = () => {
    const t = draft.trim();if (!t) return;
    setMessages((m) => [...m, { id: Date.now(), from: "You", initials: "YU", photo: "https://randomuser.me/api/portraits/men/85.jpg", text: t, you: true }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: instructor, initials: "AR", photo: "https://randomuser.me/api/portraits/women/65.jpg", text: "Good question — parking it for the Q&A block at the end.", mentor: true }]);
    }, 1400);
  };

  const attendees = [
  ...MENTORS.slice(0, 2).map((m) => ({ ...m, isMentor: true })),
  { name: "You", role: "Student", initials: "YU", online: true, isMentor: false, photo: "https://randomuser.me/api/portraits/men/85.jpg" },
  ...COHORT.map((c) => ({ ...c, isMentor: false }))];


  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="pill-tag -rotate-2 bg-coral text-coral-foreground"><Circle className="h-2 w-2 fill-current animate-pulse" /> Live</span>
            <span className="text-xs font-semibold tabular-nums text-slate-500">{mm}:{ss}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold leading-tight">{topic}</h1>
          <p className="text-sm text-muted-foreground">{instructor} · {when}</p>
        </div>
        <Link to="/dashboard" className="rounded-full border border-border px-4 py-2 text-xs font-semibold">← Back to dashboard</Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Video stage */}
        <div className="space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1030] via-[#1E1B4B] to-[#2D5FA8]">
            {/* Speaker tile */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center text-white">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full shadow-2xl ring-4 ring-white/20">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt={instructor} className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 font-display text-lg font-bold">{instructor}</p>
                <p className="text-xs opacity-70">Speaking · {sharing ? "sharing screen" : "camera on"}</p>
              </div>
            </div>
            {/* HUD */}
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Circle className="h-2 w-2 fill-red-500 text-red-500 animate-pulse" /> REC
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {attendees.length} in call
            </div>
            {/* Self tile */}
            <div className="absolute bottom-4 right-4 h-24 w-32 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-800 grid place-items-center">
              {cam ?
              <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="You" className="h-full w-full object-cover" /> :

              <div className="text-center">
                  <VideoOff className="mx-auto h-5 w-5 text-white/60" />
                  <p className="mt-1 text-[10px] text-white/60">Camera off</p>
                </div>
              }
              <span className="absolute bottom-1 left-1.5 text-[10px] font-semibold text-white">You</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-white p-3">
            <ControlBtn active={mic} on={<Mic className="h-4 w-4" />} off={<MicOff className="h-4 w-4" />} label={mic ? "Mute" : "Unmute"} onClick={() => setMic((v) => !v)} />
            <ControlBtn active={cam} on={<VideoIcon className="h-4 w-4" />} off={<VideoOff className="h-4 w-4" />} label={cam ? "Stop video" : "Start video"} onClick={() => setCam((v) => !v)} />
            <ControlBtn active={sharing} on={<ScreenShare className="h-4 w-4" />} off={<ScreenShare className="h-4 w-4" />} label={sharing ? "Stop share" : "Share"} onClick={() => {setSharing((v) => !v);pushToast(sharing ? "Stopped sharing" : "Sharing your screen");}} tone="blue" />
            <ControlBtn active={hand} on={<Hand className="h-4 w-4" />} off={<Hand className="h-4 w-4" />} label={hand ? "Lower hand" : "Raise hand"} onClick={() => {setHand((v) => !v);pushToast(hand ? "Hand lowered" : `Ananya sees your hand 🙋`);}} tone="lavender" />
            <button aria-label="Settings" className="grid h-11 w-11 place-items-center rounded-full border border-border hover:bg-slate-50"><Settings className="h-4 w-4" /></button>
            <Link to="/dashboard" className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground">
              <PhoneOff className="h-4 w-4" /> Leave
            </Link>
          </div>

          {/* Session outline */}
          <div className="rounded-3xl border border-border bg-white p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent-blue-deep)]" />
              <h3 className="font-display font-bold">Session outline</h3>
            </div>
            <ol className="mt-3 space-y-2 text-sm">
              {["Warm-up — recap self-attention from last week", "Walk through a single attention head, dim-by-dim", "Live-code Q, K, V matrices in PyTorch", "Batched multi-head attention", "Q&A · assignment brief"].map((t, i) =>
              <li key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${i < 2 ? "bg-[var(--accent-blue-deep)] text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                  <span className={i < 2 ? "font-semibold" : ""}>{t}</span>
                </li>
              )}
            </ol>
          </div>
        </div>

        {/* Side panel */}
        <aside className="rounded-3xl border border-border bg-white overflow-hidden flex flex-col h-[640px]">
          <div className="flex border-b border-border">
            <TabBtn active={tab === "chat"} onClick={() => setTab("chat")}>
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Chat</span>
              <span className="grid h-4 min-w-4 shrink-0 place-items-center rounded-full bg-coral px-1 text-[9px] font-bold text-coral-foreground">{messages.length}</span>
            </TabBtn>
            <TabBtn active={tab === "transcript"} onClick={() => setTab("transcript")}>
              <Captions className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">AI Translate</span>
            </TabBtn>
            <TabBtn active={tab === "people"} onClick={() => setTab("people")}>
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">People</span>
              <span className="shrink-0 text-[10px] text-slate-400">{attendees.length}</span>
            </TabBtn>
          </div>

          {tab === "transcript" ?
          <LiveTranscript instructor={instructor} /> :
          tab === "chat" ?
          <>
              <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) =>
              <div key={m.id} className={`flex gap-2 ${m.you ? "flex-row-reverse" : ""}`}>
                    <Avatar name={m.from} initials={m.initials} photo={m.photo} size={32} />
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.you ? "bg-[var(--accent-blue-deep)] text-white" : "bg-slate-50"}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${m.you ? "text-white/70" : "text-slate-400"}`}>{m.from}{m.mentor && " · mentor"}</p>
                      <p className="mt-0.5 leading-snug">{m.text}</p>
                    </div>
                  </div>
              )}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message the room…" className="flex-1 bg-transparent text-sm outline-none" />
                  <button onClick={send} aria-label="Send" className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent-blue-deep)] text-white"><Send className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </> :

          <div className="flex-1 space-y-1 overflow-y-auto p-3">
              {attendees.map((p) =>
            <div key={p.name} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
                  <div className="relative">
                    <Avatar name={p.name} initials={p.initials} photo={p.photo} size={36} />
                    {p.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}{p.isMentor && <span className="ml-2 rounded-full bg-lavender/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">Mentor</span>}</p>
                    <p className="truncate text-xs text-slate-500">{p.role}</p>
                  </div>
                </div>
            )}
            </div>
          }
        </aside>
      </div>
    </div>);

}

function ControlBtn({ active, on, off, label, onClick, tone }) {
  const activeClass = tone === "blue" ? "bg-[var(--accent-blue-deep)] text-white" : tone === "lavender" ? "bg-lavender/70" : "bg-[var(--accent-blue-deep)] text-white";
  return (
    <button onClick={onClick} title={label} aria-label={label} className={`grid h-11 w-11 place-items-center rounded-full border border-border transition-all ${active ? activeClass : "hover:bg-slate-50"}`}>
      {active ? on : off}
    </button>);

}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`min-w-0 flex-1 inline-flex items-center justify-center gap-1 px-2 py-3 text-xs font-semibold ${active ? "border-b-2 border-[var(--accent-blue-deep)] text-foreground" : "text-slate-500 hover:text-slate-700"}`}>{children}</button>);

}
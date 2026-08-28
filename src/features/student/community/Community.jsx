import { useState } from "react";
import { COHORT, MENTORS } from "../../../lib/dashboard-data";
import { openAction, pushToast } from "../../../lib/action-bus";
import { Avatar } from "../../../components/Avatar";
import { MessageCircle, Hash, ExternalLink, Users, Sparkles, TrendingUp, Award, Send, Search } from "lucide-react";


export default CommunityPage;

const DISCORD_URL = "https://discord.gg/tekschool";

const CHANNELS = [
{ name: "cohort-mar26", desc: "Your cohort's main channel", unread: 12, members: 48, tone: "bg-accent-blue/15 text-accent-blue-deep" },
{ name: "help-ai-engineering", desc: "Ask mentors, share blockers", unread: 3, members: 214, tone: "bg-lavender/50" },
{ name: "career-and-placements", desc: "Job leads, referrals, prep", unread: 0, members: 386, tone: "bg-coral/30 text-coral-foreground" },
{ name: "show-and-tell", desc: "Share what you shipped this week", unread: 5, members: 172, tone: "bg-slate-100" },
{ name: "study-buddies", desc: "Find a partner for pair-work", unread: 0, members: 89, tone: "bg-accent-blue/15 text-accent-blue-deep" },
{ name: "wins", desc: "Every offer, every ship, every streak", unread: 8, members: 421, tone: "bg-lavender/50" }];


const RECENT_ACTIVITY = [
{ who: "Meera S.", initials: "MS", photo: "https://randomuser.me/api/portraits/women/44.jpg", text: "shipped a mini-RAG over the arXiv dataset", when: "2h", tag: "show-and-tell" },
{ who: "Karan V.", initials: "KV", photo: "https://randomuser.me/api/portraits/men/32.jpg", text: "got an interview at Razorpay", when: "5h", tag: "wins" },
{ who: "Ananya (mentor)", initials: "AR", photo: "https://randomuser.me/api/portraits/women/65.jpg", text: "pinned the transformer cheat-sheet", when: "1d", tag: "help-ai-engineering" }];


function CommunityPage() {
  const [q, setQ] = useState("");
  const filtered = CHANNELS.filter((c) => (c.name + c.desc).toLowerCase().includes(q.toLowerCase()));

  const openDiscord = () => {pushToast("Opening Discord in a new tab…");window.open(DISCORD_URL, "_blank", "noopener,noreferrer");};

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5865F2] via-[#4752C4] to-[#3B458A] p-8 md:p-10 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#F4A261]/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="pill-tag -rotate-2 bg-white/15 text-white backdrop-blur"><Sparkles className="h-3 w-3" /> Your cohort · Mar 2026</span>
            <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight">The room where it happens.</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">1,240 builders online right now. Ping mentors, share what you shipped, find a study partner.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button onClick={openDiscord} className="inline-flex items-center gap-2 rounded-full bg-white text-[#5865F2] px-5 py-2.5 text-sm font-bold hover:bg-white/90">
                Open in Discord <ExternalLink className="h-4 w-4" />
              </button>
              <div className="flex -space-x-2">
                {COHORT.slice(0, 5).map((m) =>
                <div key={m.name} className="rounded-full ring-2 ring-[#4752C4]">
                    <Avatar name={m.name} initials={m.initials} photo={m.photo} size={36} />
                  </div>
                )}
                <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#4752C4] bg-white text-[10px] font-bold text-[#4752C4]">+42</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-2">
              <MiniPill icon={Users} value="1,240" label="Online now" />
              <MiniPill icon={MessageCircle} value="86" label="Threads today" />
              <MiniPill icon={TrendingUp} value="+18" label="Wins this week" />
              <MiniPill icon={Award} value="12" label="Mentors on-call" />
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search channels…" className="h-11 w-full rounded-full border border-border bg-white pl-11 pr-4 text-sm outline-none focus:border-[var(--accent-blue-deep)]" />
      </div>

      {/* Channels */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Channels</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) =>
          <button key={c.name} onClick={() => openAction({ kind: "open-channel", name: c.name, desc: c.desc })} className="group relative flex flex-col rounded-3xl border border-border bg-white p-5 text-left hover:-translate-y-1 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${c.tone}`}><Hash className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold">#{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{c.desc}</p>
                </div>
                {c.unread > 0 && <span className="shrink-0 rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold text-coral-foreground">{c.unread}</span>}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.members} members</span>
                <span className="font-semibold text-[var(--accent-blue-deep)]">Open →</span>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Recent activity</h2>
        <div className="rounded-3xl border border-border bg-white divide-y divide-border">
          {RECENT_ACTIVITY.map((a, i) =>
          <div key={i} className="flex items-center gap-3 p-4">
              <Avatar name={a.who} initials={a.initials} photo={a.photo} size={36} />
              <p className="min-w-0 flex-1 text-sm"><span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">{a.text}</span></p>
              <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">#{a.tag}</span>
              <span className="shrink-0 text-xs text-slate-400">{a.when}</span>
            </div>
          )}
        </div>
      </section>

      {/* Mentors */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Your mentors</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {MENTORS.map((m) => <PersonCard key={m.name} name={m.name} role={m.role} initials={m.initials} photo={m.photo} online={m.online} tone="mentor" />)}
        </div>
      </section>

      {/* Cohort */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold">Cohort directory</h2>
          <span className="text-xs text-muted-foreground">{COHORT.length} builders</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {COHORT.map((m) => <PersonCard key={m.name} name={m.name} role={m.role} initials={m.initials} photo={m.photo} online={m.online} />)}
        </div>
      </section>
    </div>);

}

function MiniPill({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur min-w-[120px]">
      <div className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 opacity-80" /> <p className="font-display text-lg font-bold">{value}</p></div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</p>
    </div>);

}

function PersonCard({ name, role, initials, photo, online, tone }) {
  return (
    <div className={`flex items-center gap-3 rounded-3xl border p-4 ${tone === "mentor" ? "border-lavender/60 bg-lavender/10" : "border-border bg-white"}`}>
      <div className="relative">
        <Avatar name={name} initials={initials} photo={photo} size={44} />
        {online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold flex items-center gap-1.5">{name}{tone === "mentor" && <Award className="h-3 w-3 text-[var(--lavender-foreground)]" />}</p>
        <p className="truncate text-xs text-muted-foreground">{role}</p>
      </div>
      <button onClick={() => openAction({ kind: "message-person", name, role })} aria-label={`Message ${name}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white"><Send className="h-4 w-4" /></button>
    </div>);

}
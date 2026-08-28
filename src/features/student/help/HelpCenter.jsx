import { useMemo, useState } from "react";
import { pushToast } from "../../../lib/action-bus";
import {
  Search, ChevronDown, LifeBuoy, BookOpen, CreditCard, Video, Send, Mail,
  MessageCircle, Sparkles, Zap, Phone, Clock, CheckCircle2, AlertCircle, FileText,
  PlayCircle, ArrowRight, Bot, ShieldCheck, Briefcase } from
"lucide-react";


export default HelpPage;



const CATEGORIES = [
{ key: "Classes", icon: Video, desc: "Live rooms, replays, attendance", tone: "from-[#EAF2FF] to-[#F5F0FF]" },
{ key: "Assignments", icon: BookOpen, desc: "Submissions, deadlines, feedback", tone: "from-[#F5F0FF] to-[#FDECEC]" },
{ key: "Billing", icon: CreditCard, desc: "Invoices, installments, refunds", tone: "from-[#FDF3E7] to-[#FDECEC]" },
{ key: "Placements", icon: Briefcase, desc: "Eligibility, referrals, interviews", tone: "from-[#E9F7EF] to-[#EAF2FF]" },
{ key: "Account", icon: ShieldCheck, desc: "Login, security, data & privacy", tone: "from-[#F1F5F9] to-[#EAF2FF]" }];


const ARTICLES = [
{ cat: "Classes", read: "2 min", q: "How do I join a live class?", a: "Open Course → Live Class and hit Join on the session banner. The in-app room gives you video, chat, screen share, live transcript and AI translation into Hindi, Kannada, Tamil, Telugu or Marathi." },
{ cat: "Classes", read: "1 min", q: "What happens if I miss a session?", a: "Every class is recorded and published to Course → Classes within 30 minutes. Watching the replay within 72 hours still counts toward your attendance." },
{ cat: "Classes", read: "2 min", q: "How does AI translation work in the live room?", a: "In the live room side panel, open AI Translate and pick your language. The transcript is translated in real time and can be played back as audio while the instructor keeps speaking in English." },
{ cat: "Assignments", read: "2 min", q: "How is my assignment graded?", a: "Your mentor reviews within 48 working hours. You get a score, written feedback and an in-thread reply option from the View feedback panel." },
{ cat: "Assignments", read: "1 min", q: "Can I resubmit after feedback?", a: "Yes — one resubmission per assignment within 7 days of feedback. The higher of the two scores is kept." },
{ cat: "Billing", read: "2 min", q: "Where do I find my invoices?", a: "Settings → Billing & Cohort lists every invoice with a GST-ready PDF download. Installment dates are shown on the same screen." },
{ cat: "Billing", read: "2 min", q: "Can I move to a different cohort?", a: "One free cohort transfer per programme. Raise a ticket below and the team processes it within 3 working days." },
{ cat: "Placements", read: "3 min", q: "How do placements work?", a: "Once your Placements tab shows interview-ready, matched roles appear under Opportunities. Apply from the dashboard and the placements team is notified instantly." },
{ cat: "Placements", read: "2 min", q: "What if I fall behind schedule?", a: "Book a 1:1 with your mentor from Community. We'd rather adjust your pace than lose you — most students recover within a week." },
{ cat: "Account", read: "1 min", q: "How do I change my password or enable 2FA?", a: "Settings → Security. You can rotate your password, turn on an authenticator app and sign out other devices." },
{ cat: "Account", read: "1 min", q: "How do I edit my public profile?", a: "Open Profile from your avatar menu and click Edit profile. Name, bio, phone, location and cohort are all editable." }];


const GUIDES = [
{ title: "Your first week at TekSchool", desc: "Setup, tooling and how the week is structured.", icon: Sparkles, mins: "6 min" },
{ title: "Getting the most from the code lab", desc: "Run tests, debug and submit from Practice.", icon: Zap, mins: "4 min" },
{ title: "Assessment rules explained", desc: "Timers, per-question limits and retakes.", icon: Clock, mins: "3 min" },
{ title: "Placement readiness checklist", desc: "What unlocks referrals and mock interviews.", icon: CheckCircle2, mins: "5 min" }];


const TICKETS = [
{ id: "TKT-2041", subject: "Invoice GST details incorrect", status: "Open", when: "2h ago" },
{ id: "TKT-2016", subject: "Missing replay for Module 6", status: "Resolved", when: "4 days ago" }];


function HelpPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [openIdx, setOpenIdx] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("Normal");

  const filtered = useMemo(
    () => ARTICLES.filter((f) => (cat === "All" || f.cat === cat) && (f.q + f.a).toLowerCase().includes(query.toLowerCase())),
    [query, cat]
  );

  return (
    <div className="space-y-8">
      {/* Hero + search */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#4C3BCF] to-[#5BA4E8] p-7 text-white md:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            <LifeBuoy className="h-3.5 w-3.5" /> Help center
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">How can we help you today?</h1>
          <p className="mt-2 text-sm text-white/80">Search 40+ articles, browse guides, or talk to a human. Average first reply: 22 minutes.</p>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
            <Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: replay, invoice, resubmission, 2FA…"
              className="w-full bg-transparent py-2 text-sm text-foreground outline-none" />
            
            {query && <button onClick={() => setQuery("")} className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">Clear</button>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["Join a live class", "Download invoice", "Resubmit assignment", "AI translation"].map((s) =>
            <button key={s} onClick={() => setQuery(s.split(" ")[0])} className="rounded-full bg-white/15 px-3 py-1.5 font-medium backdrop-blur hover:bg-white/25">{s}</button>
            )}
          </div>
        </div>
      </section>

      {/* Instant channels */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Channel icon={Bot} title="Ask Tek Guru" desc="AI answers, instantly" meta="Always on" onClick={() => pushToast("Tek Guru is available in Learning")} tone="bg-gradient-to-br from-[#F5F0FF] to-white" />
        <Channel icon={MessageCircle} title="Live chat" desc="Support team" meta="Mon–Sat · 9am–8pm" onClick={() => pushToast("Live chat requested — an agent will join shortly")} tone="bg-gradient-to-br from-[#EAF2FF] to-white" />
        <Channel icon={Phone} title="Call us" desc="+91 80801 87187" meta="Mon–Sat · 9am–8pm" onClick={() => {window.location.href = "tel:+918080187187";}} tone="bg-gradient-to-br from-[#E9F7EF] to-white" />
        <Channel icon={Mail} title="Email" desc="support@tek.school" meta="Reply within 4h" onClick={() => {window.location.href = "mailto:support@tek.school";}} tone="bg-gradient-to-br from-[#FDF3E7] to-white" />
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-display text-xl font-bold">Browse by topic</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCat(active ? "All" : c.key)}
                className={`rounded-3xl border p-5 text-left transition-all bg-gradient-to-br ${c.tone} ${active ? "border-[var(--accent-blue-deep)] ring-2 ring-[var(--accent-blue-deep)]/25" : "border-slate-200 hover:-translate-y-0.5"}`}>
                
                <Icon className="h-5 w-5 text-[var(--accent-blue-deep)]" />
                <p className="mt-3 font-display font-bold leading-snug">{c.key}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-600">{c.desc}</p>
              </button>);

          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] items-start">
        {/* Articles */}
        <section className="dash-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold">{cat === "All" ? "Popular articles" : `${cat} articles`}</h2>
            <span className="text-xs text-muted-foreground">{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {filtered.map((f, i) => {
              const open = openIdx === i;
              return (
                <div key={f.q} className="py-1">
                  <button onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center gap-3 py-3 text-left">
                    <FileText className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className="min-w-0 flex-1 text-sm font-semibold">{f.q}</span>
                    <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline">{f.cat} · {f.read}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open &&
                  <div className="pb-4 pl-7 pr-2">
                      <p className="text-sm leading-relaxed text-slate-600">{f.a}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Was this helpful?</span>
                        <button onClick={() => pushToast("Thanks for the feedback")} className="rounded-full border border-slate-200 px-3 py-1 font-semibold hover:bg-slate-50">Yes</button>
                        <button onClick={() => pushToast("Noted — we'll improve this article")} className="rounded-full border border-slate-200 px-3 py-1 font-semibold hover:bg-slate-50">No</button>
                      </div>
                    </div>
                  }
                </div>);

            })}
            {filtered.length === 0 &&
            <div className="py-10 text-center">
                <AlertCircle className="mx-auto h-6 w-6 text-slate-300" />
                <p className="mt-2 text-sm text-muted-foreground">No article matches “{query}”. Raise a ticket below and we'll answer directly.</p>
              </div>
            }
          </div>
        </section>

        {/* Side rail */}
        <div className="space-y-6">
          <section className="dash-card p-6">
            <h2 className="font-display text-lg font-bold">Guides</h2>
            <div className="mt-3 space-y-2">
              {GUIDES.map((g) => {
                const Icon = g.icon;
                return (
                  <button key={g.title} onClick={() => pushToast(`Opening “${g.title}”`)} className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 p-3 text-left hover:bg-slate-50">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lavender/40 text-[var(--lavender-foreground)]"><Icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug">{g.title}</p>
                      <p className="text-[11px] text-muted-foreground">{g.desc}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"><PlayCircle className="h-3 w-3" /> {g.mins}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>);

              })}
            </div>
          </section>

          <section className="dash-card p-6">
            <h2 className="font-display text-lg font-bold">Your tickets</h2>
            <div className="mt-3 space-y-2">
              {TICKETS.map((t) =>
              <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${t.status === "Open" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {t.status === "Open" ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{t.id} · {t.when}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider ${t.status === "Open" ? "text-amber-600" : "text-emerald-600"}`}>{t.status}</span>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#F5F0FF] to-white p-6">
            <h2 className="font-display text-lg font-bold">Service status</h2>
            <div className="mt-3 space-y-2 text-sm">
              {[["Live classrooms", true], ["Code lab", true], ["Assessments", true], ["Payments", true]].map(([n, ok]) =>
              <div key={n} className="flex items-center justify-between">
                  <span className="text-slate-600">{n}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> {ok ? "Operational" : "Degraded"}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Ticket form */}
      <section className="dash-card p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">Raise a ticket</h2>
            <p className="text-sm text-muted-foreground">Still stuck? Tell us what happened — we reply on email and in-app.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><Clock className="h-3.5 w-3.5" /> Avg. reply 22 min</span>
        </div>
        <form
          onSubmit={(e) => {e.preventDefault();if (!subject.trim()) return;pushToast("Ticket raised — we'll email you shortly");setSubject("");setBody("");}}
          className="mt-5 grid gap-4 md:grid-cols-2">
          
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" className="mt-1 h-11 w-full rounded-2xl border border-input px-4 text-sm outline-none focus:border-[var(--accent-blue-deep)]" />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-input bg-white px-4 text-sm outline-none focus:border-[var(--accent-blue-deep)]">
              {["Low", "Normal", "High — blocking my class"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Describe the issue</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="What did you try, and what happened?" className="mt-1 w-full rounded-2xl border border-input p-4 text-sm outline-none focus:border-[var(--accent-blue-deep)]" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)] px-6 py-3 text-sm font-semibold text-white">
              <Send className="h-4 w-4" /> Submit ticket
            </button>
          </div>
        </form>
      </section>
    </div>);

}

function Channel({ icon: Icon, title, desc, meta, onClick, tone }) {
  return (
    <button onClick={onClick} className={`rounded-3xl border border-slate-200 p-5 text-left transition-transform hover:-translate-y-0.5 ${tone}`}>
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--accent-blue-deep)] shadow-sm"><Icon className="h-5 w-5" /></div>
      <p className="mt-3 font-display font-bold">{title}</p>
      <p className="text-xs text-slate-600">{desc}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{meta}</p>
    </button>);

}
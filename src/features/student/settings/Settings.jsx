import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useStudentAuth } from "../../../context/StudentAuthContext.jsx";
import { openAction, pushToast } from "../../../lib/action-bus";
import { LogOut, SlidersHorizontal, Bell, Lock, CreditCard, Palette, ShieldCheck, Download, Trash2, Check, Settings as SettingsIcon, ChevronRight, UserRound } from "lucide-react";


export default SettingsPage;



const TABS = [
{ key: "account", label: "Account", icon: SlidersHorizontal },
{ key: "notifications", label: "Notifications", icon: Bell },
{ key: "security", label: "Security", icon: Lock },
{ key: "billing", label: "Billing & Cohort", icon: CreditCard },
{ key: "appearance", label: "Appearance", icon: Palette },
{ key: "privacy", label: "Privacy & Data", icon: ShieldCheck }];


const TAB_DESC = {
  account: "Identity, language, region and learning pace.",
  notifications: "Choose exactly which pings reach you.",
  security: "Password, two-factor and active devices.",
  billing: "Plan, installments and invoices.",
  appearance: "Theme and layout density.",
  privacy: "Visibility, data export and account removal."
};


function SettingsPage() {
  const { user: session, logout: signOut } = useStudentAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("account");
  const [prefs, setPrefs] = useState({ classReminders: true, weeklyDigest: true, placementAlerts: true, communityPings: false, marketingEmails: false, smsReminders: true, autoplay: true, captions: false });
  const [theme, setTheme] = useState("light");
  const [density, setDensity] = useState("cozy");
  const [lang, setLang] = useState("English");
  const [tz, setTz] = useState("IST (GMT+5:30)");
  const [saved, setSaved] = useState(false);

  if (!session) return null;

  const active = TABS.find((t) => t.key === tab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#3B2E8F] to-[#4C3BCF] p-6 text-white md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <SettingsIcon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">Preferences</p>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-white/70">Manage your account, notifications, security, billing, appearance and data — all in one place.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <HeadStat label="Plan" value="Full cohort" />
            <HeadStat label="2FA" value="Off" />
            <HeadStat label="Region" value="IST" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Left tabs */}
        <aside className="self-start rounded-3xl border border-border bg-white p-3 lg:sticky lg:top-6">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Sections</p>
          <nav className="space-y-1">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition ${isActive ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-foreground"}`}>
                  
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{t.label}</span>
                  <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? "text-white/70" : "text-slate-300"}`} />
                </button>);

            })}
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <Link to="/dashboard/profile" className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-foreground">
              <UserRound className="h-4 w-4" /> Profile
            </Link>
            <button onClick={async () => { await signOut(); navigate("/"); }} className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-coral-foreground hover:bg-coral/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>


        {/* Panel */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-3xl border border-border bg-white px-6 py-4">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-blue/10 text-[var(--accent-blue-deep)]">
              <active.icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold">{active.label}</h2>
              <p className="text-xs text-muted-foreground">{TAB_DESC[active.key]}</p>
            </div>
          </div>

          {tab === "account" &&
          <>
              <Card title="Account" desc="Sign-in identity and account status. Edit your public profile from the Profile page.">
                <div className="grid gap-4 md:grid-cols-2">
                  <ReadField label="Signed in as" value={session.email} />
                  <ReadField label="Member since" value={session.createdAt ? new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently"} />
                </div>
                <Link to="/dashboard/profile" className="mt-4 inline-block rounded-full border border-border px-4 py-2 text-xs font-semibold">Go to profile</Link>
              </Card>
              <Card title="Language & region" desc="Used for captions, AI translation and reminders.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Select label="Interface language" value={lang} onChange={setLang} options={["English", "हिन्दी", "ಕನ್ನಡ", "தமிழ்", "తెలుగు"]} />
                  <Select label="Time zone" value={tz} onChange={setTz} options={["IST (GMT+5:30)", "GST (GMT+4)", "SGT (GMT+8)", "GMT"]} />
                </div>
                <SaveBtn saved={saved} onClick={() => {setSaved(true);setTimeout(() => setSaved(false), 1500);pushToast("Preferences saved");}} />
              </Card>
              <Card title="Learning preferences" desc="How the dashboard paces you.">
                <div className="space-y-3">
                  <Toggle label="Auto-play next lesson" desc="Continue straight into the next module." on={prefs.autoplay} onChange={(v) => setPrefs({ ...prefs, autoplay: v })} />
                  <Toggle label="Show live captions by default" desc="Turn on captions in every live room." on={prefs.captions} onChange={(v) => setPrefs({ ...prefs, captions: v })} />
                </div>
              </Card>
              <Card title="Cohort" desc="Your track, cohort, and mentor pairing.">
                <div className="grid gap-4 md:grid-cols-3">
                  <ReadField label="Track" value={session.track} />
                  <ReadField label="Cohort" value={session.cohort} />
                  <ReadField label="Lead mentor" value="Ananya Rao" />
                </div>
                <button onClick={() => pushToast("Cohort transfer request opened with placements")} className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-semibold">Request cohort transfer</button>
              </Card>
            </>
          }


          {tab === "notifications" &&
          <Card title="Notification preferences" desc="You'll only get pings you actually asked for.">
              <div className="space-y-3">
                <Toggle label="Class reminders" desc="15 min before every live class." on={prefs.classReminders} onChange={(v) => setPrefs({ ...prefs, classReminders: v })} />
                <Toggle label="Weekly digest" desc="Every Sunday — what you missed, what's due." on={prefs.weeklyDigest} onChange={(v) => setPrefs({ ...prefs, weeklyDigest: v })} />
                <Toggle label="Placement alerts" desc="New matched roles and pipeline updates." on={prefs.placementAlerts} onChange={(v) => setPrefs({ ...prefs, placementAlerts: v })} />
                <Toggle label="Community pings" desc="Mentions and DMs in your cohort channels." on={prefs.communityPings} onChange={(v) => setPrefs({ ...prefs, communityPings: v })} />
                <Toggle label="SMS reminders" desc="Text nudges for classes and interviews." on={prefs.smsReminders} onChange={(v) => setPrefs({ ...prefs, smsReminders: v })} />
                <Toggle label="Marketing emails" desc="Product updates and event invites." on={prefs.marketingEmails} onChange={(v) => setPrefs({ ...prefs, marketingEmails: v })} />
              </div>
              <SaveBtn saved={saved} onClick={() => {setSaved(true);setTimeout(() => setSaved(false), 1500);openAction({ kind: "save-settings" });}} />
            </Card>
          }

          {tab === "security" &&
          <>
              <Card title="Password" desc="Update how you sign in.">
                <button onClick={() => openAction({ kind: "change-password" })} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Change password</button>
              </Card>
              <Card title="Two-factor authentication" desc="Add an extra layer of security.">
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4">
                  <div>
                    <p className="text-sm font-semibold">Authenticator app</p>
                    <p className="text-xs text-muted-foreground">Not enabled</p>
                  </div>
                  <button onClick={() => pushToast("2FA setup opened")} className="rounded-full border border-border px-4 py-2 text-xs font-semibold">Enable</button>
                </div>
              </Card>
              <Card title="Active sessions" desc="Devices signed in to your account.">
                <div className="space-y-2">
                  {[{ d: "MacBook Pro · Bengaluru", now: true }, { d: "iPhone · Bengaluru", now: false }].map((s) =>
                <div key={s.d} className="flex items-center justify-between rounded-2xl border border-border p-3">
                      <div>
                        <p className="text-sm font-semibold">{s.d}</p>
                        <p className="text-xs text-muted-foreground">{s.now ? "This device" : "Last active 2h ago"}</p>
                      </div>
                      {!s.now && <button onClick={() => pushToast("Signed out that device")} className="text-xs font-semibold text-coral-foreground">Sign out</button>}
                    </div>
                )}
                </div>
              </Card>
            </>
          }

          {tab === "billing" &&
          <>
              <Card title="Current plan" desc="Applied AI Engineering — full cohort access.">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-[#EAF2FF] p-5">
                  <div>
                    <p className="font-display text-lg font-bold">AI Engineering · Spring 2026</p>
                    <p className="text-xs text-muted-foreground">Next installment: ₹42,000 · due Mar 15</p>
                  </div>
                  <button onClick={() => pushToast("Payment portal opened")} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Pay next installment</button>
                </div>
              </Card>
              <Card title="Invoices" desc="Download past invoices for GST filing.">
                <div className="space-y-2">
                  {["INV-2026-001 · ₹42,000", "INV-2025-014 · ₹42,000", "INV-2025-006 · ₹42,000"].map((i) =>
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm">
                      <span>{i}</span>
                      <button onClick={() => pushToast("Invoice downloaded")} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-blue-deep)]"><Download className="h-3.5 w-3.5" /> Download</button>
                    </div>
                )}
                </div>
              </Card>
            </>
          }

          {tab === "appearance" &&
          <Card title="Appearance" desc="Make the dashboard yours.">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Theme</p>
                <div className="grid grid-cols-3 gap-2">
                  {["light", "dark", "system"].map((t) =>
                <button key={t} onClick={() => {setTheme(t);pushToast(`Theme: ${t}`);}} className={`rounded-2xl border p-4 text-left text-sm capitalize ${theme === t ? "border-[var(--accent-blue-deep)] bg-accent-blue/10" : "border-border"}`}>
                      <div className={`mb-2 h-12 rounded-lg ${t === "light" ? "bg-slate-100" : t === "dark" ? "bg-slate-800" : "bg-gradient-to-br from-slate-100 to-slate-800"}`} />
                      <div className="flex items-center justify-between">{t} {theme === t && <Check className="h-4 w-4 text-[var(--accent-blue-deep)]" />}</div>
                    </button>
                )}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Density</p>
                <div className="flex gap-2">
                  {["cozy", "compact"].map((d) =>
                <button key={d} onClick={() => setDensity(d)} className={`rounded-full px-4 py-2 text-sm capitalize ${density === d ? "bg-[var(--accent-blue-deep)] text-white" : "border border-border"}`}>{d}</button>
                )}
                </div>
              </div>
            </Card>
          }

          {tab === "privacy" &&
          <>
              <Card title="Data & privacy" desc="Control your data across TekSchool.">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                    <div><p className="text-sm font-semibold">Show me on cohort directory</p><p className="text-xs text-muted-foreground">Cohortmates can find you and DM you.</p></div>
                    <Toggle label="" desc="" on={true} onChange={() => pushToast("Visibility updated")} />
                  </div>
                  <button onClick={() => pushToast("Data export requested — email in ~24h")} className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold"><Download className="h-4 w-4" /> Export my data</button>
                </div>
              </Card>
              <Card title="Danger zone" desc="These actions are irreversible.">
                <button onClick={() => pushToast("Contact placements to close your account")} className="inline-flex items-center gap-1.5 rounded-full border border-coral bg-coral/10 px-5 py-2.5 text-sm font-semibold text-coral-foreground"><Trash2 className="h-4 w-4" /> Delete account</button>
              </Card>
            </>
          }
        </div>
      </div>
    </div>);

}

function Card({ title, desc, children }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 transition-shadow hover:shadow-[0_10px_40px_-24px_rgba(30,27,75,0.45)]">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {desc && <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </section>);


}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-input bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent-blue-deep)]">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>);

}


function ReadField({ label, value }) {
  return (
    <div className="rounded-2xl bg-muted/50 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>);

}

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
      on ? "bg-primary" : "bg-muted-foreground/30"}`
      }>
      
      <span
        className={`pointer-events-none h-5 w-5 rounded-full bg-background shadow-md ring-1 ring-black/5 transition-transform duration-200 ease-out ${
        on ? "translate-x-5" : "translate-x-0"}`
        } />
      
    </button>);

}

function Toggle({ label, desc, on, onChange }) {
  if (!label) return <ToggleSwitch on={on} onChange={onChange} />;
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-muted/50 px-4 py-3 transition-colors hover:bg-muted/70">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ToggleSwitch on={on} onChange={onChange} />
    </label>);

}


function SaveBtn({ saved, onClick }) {
  return (
    <button onClick={onClick} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
      {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save changes"}
    </button>);

}

function HeadStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2 backdrop-blur">
      <p className="font-display text-sm font-bold">{value}</p>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-white/60">{label}</p>
    </div>);

}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { PipelineBoard } from '../../components/admin/PipelineBoard.jsx';
import { AdminTable } from '../../components/admin/AdminTable.jsx';
import { PLACEMENTS, JOB_POSTS, HIRING_PARTNERS } from '../../lib/adminData.js';
import { HR_CONTACTS } from '../../lib/outreachData.js';
import { Modal, PrimaryBtn, GhostBtn } from '../../components/ui/Modal.jsx';
import { pushToast } from '../../lib/actionBus.js';
import { Briefcase, Building2, Sparkles, Loader2, Link as LinkIcon, Mail, Phone, Send } from 'lucide-react';

const STAGES = ["Applied","Screening","Interview","Offer","Placed"];
const TINT = { Applied: "#94A3B8", Screening: "#5BA4E8", Interview: "#2D5FA8", Offer: "#F4A261", Placed: "#10B981" };

// Mocking Apollo HR Contacts API
const findHRContacts = async ({ target }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        contacts: HR_CONTACTS.slice(0, 4),
        note: `Found matching contacts for ${target}`
      });
    }, 1500);
  });
};

export function PlacementsPage() {
  const [items, setItems] = useState(PLACEMENTS);
  const [aiOpen, setAiOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const runAiFetch = async (target) => {
    setFetching(true);
    setContacts([]);
    setNote(null);
    setError(null);
    try {
      const res = await findHRContacts({ target });
      setContacts(res.contacts);
      setNote(res.note ?? null);
      pushToast(`Apollo: sourced ${res.contacts.length} live HR contacts`);
    } catch (e) {
      const msg = String(e?.message || e);
      setError(msg);
      pushToast("Apollo request failed — see panel for details");
    } finally {
      setFetching(false);
    }
  };

  return (
    <AdminShell title="Placements" actions={
      <button onClick={() => setAiOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-lavender/40 px-3 py-1.5 text-xs font-semibold text-[#1E1B4B] hover:bg-lavender/60">
        <Sparkles className="h-3.5 w-3.5" /> AI: find HR contacts
      </button>
    }>

      <p className="mb-3 text-xs text-slate-500">Drag cards between stages to update. Use the AI copilot to source verified HR contacts and open new placement channels.</p>

      <PipelineBoard
        stages={STAGES}
        items={items}
        tint={TINT}
        onMove={(id, to) => setItems((arr) => arr.map((x) => x.id === id ? { ...x, stage: to } : x))}
        renderCard={(i) => (
          <div>
            <p className="font-semibold">{i.student}</p>
            <p className="text-[11px] text-slate-500">{i.role} · {i.company}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{i.updatedDays}d ago</p>
          </div>
        )}
      />

      {/* Apollo-sourced HR contacts */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <p className="font-bold">Apollo request failed</p>
          <p className="mt-1 break-words">{error}</p>
          <p className="mt-2 text-red-600">If the error mentions <code>API_INACCESSIBLE</code>, your Apollo API key needs the People Search endpoint enabled (Apollo → Settings → Integrations → API), or upgrade to a master key.</p>
        </div>
      )}
      {(fetching || contacts.length > 0) && (

        <div className="mt-6 rounded-xl border border-[#1E1B4B]/20 bg-gradient-to-br from-white to-lavender/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E1B4B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" /> Apollo · live
            </span>
            <p className="text-xs font-semibold">Real HR contacts from Apollo.io</p>

            {fetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
            <button onClick={() => { setContacts([]); }} className="ml-auto text-[10px] font-semibold text-slate-500 hover:underline">Clear</button>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{c.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{c.title} · {c.company}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">{c.confidence}%</span>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">Hiring: {c.hiringFor.join(", ")}</p>
                <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 hover:bg-slate-200"><Mail className="h-2.5 w-2.5" /> Email</a>
                  <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 hover:bg-slate-200"><Phone className="h-2.5 w-2.5" /> Call</a>
                  <a href={`https://${c.linkedin}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 hover:bg-slate-200"><LinkIcon className="h-2.5 w-2.5" /> LI</a>
                  <button onClick={() => setSelectedContact(c)} className="ml-auto inline-flex items-center gap-1 rounded-md bg-[#1E1B4B] px-2 py-0.5 text-white"><Send className="h-2.5 w-2.5" /> Reach out</button>
                </div>
                <p className="mt-1.5 text-[9px] text-slate-400">via {c.source}</p>
              </div>
            ))}
          </div>
          {note && <p className="mt-3 rounded-md bg-amber-50 p-2 text-[10px] text-amber-800">{note}</p>}
          <p className="mt-2 text-[10px] text-slate-400">
            Tip: send bulk outreach to all sourced HRs in <Link to="/admin/outreach" className="font-semibold text-[var(--accent-blue-deep)] hover:underline">Outreach</Link>.
          </p>

        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-2 font-display text-sm font-bold flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Open roles</h3>
        <AdminTable
          rows={JOB_POSTS}
          filename="job-posts.csv"
          empty={{ title: "No open roles", hint: "Add a job posting to start collecting applicants." }}
          rowActions={[
            { label: "Edit", onClick: (r) => pushToast(`Editing ${r.role} at ${r.company}`) },
            { label: "Toggle status", onClick: (r) => pushToast(`${r.role} — ${r.status === "Open" ? "closed" : "reopened"}`),
              confirm: { title: "Change role status?", message: (r) => <>Toggling <b>{r.role}</b> at <b>{r.company}</b> to <b>{r.status === "Open" ? "Closed" : "Open"}</b>.</> } },
          ]}

          columns={[
            { key: "role", label: "Role" },
            { key: "company", label: "Company" },
            { key: "track", label: "Track" },
            { key: "location", label: "Location" },
            { key: "salary", label: "Salary" },
            { key: "applicants", label: "Applicants" },
            { key: "postedDays", label: "Posted", render: (r) => `${r.postedDays}d ago` },
            { key: "status", label: "Status", render: (r) => <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${r.status === "Open" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{r.status}</span> },
          ]}
        />
      </div>


      <div className="mt-6">
        <h3 className="mb-2 font-display text-sm font-bold flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Hiring partners</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {HIRING_PARTNERS.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-display text-sm font-bold">{p.company}</p>
              <p className="text-[11px] text-slate-500">{p.track}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-400">Active roles</p><p className="text-sm font-bold">{p.activeRoles}</p></div>
                <div className="rounded-md bg-slate-50 p-2"><p className="text-slate-400">Total hires</p><p className="text-sm font-bold">{p.hires}</p></div>
              </div>
              <p className="mt-2 text-[11px]">{p.contact} · <a className="text-[var(--accent-blue-deep)] hover:underline" href={`mailto:${p.email}`}>{p.email}</a></p>
            </div>
          ))}
        </div>
      </div>

      <Modal open={aiOpen} onClose={() => setAiOpen(false)} tone="navy"
        eyebrow={<span className="pill-tag -rotate-2 bg-lavender/50"><Sparkles className="h-3 w-3" /> Agentic AI</span>}
        title="Source verified HR contacts"
        footer={<GhostBtn onClick={() => setAiOpen(false)}>Cancel</GhostBtn>}>
        <p>Pick a hiring vertical. The AI cross-references LinkedIn, company careers, and past placement partners to surface verified HRs — with email, phone, and confidence score.</p>
        <div className="mt-3 grid gap-2">
          {[
            "AI / ML Engineering roles in Bengaluru",
            "Cloud & DevOps roles at Indian unicorns",
            "Backend / Full-stack roles (2-5 yrs)",
          ].map((t) => (
            <button key={t} onClick={() => { setAiOpen(false); runAiFetch(t); }} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50">
              <span>{t}</span>
              <Sparkles className="h-3.5 w-3.5 text-coral" />
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={!!selectedContact} onClose={() => setSelectedContact(null)}
        title={selectedContact ? `Reach out to ${selectedContact.name}` : ""}
        footer={<>
          <GhostBtn onClick={() => setSelectedContact(null)}>Close</GhostBtn>
          <PrimaryBtn onClick={() => {
            pushToast(`Intro email sent to ${selectedContact?.name}`);
            setSelectedContact(null);
          }}>Send intro email</PrimaryBtn>
        </>}>
        {selectedContact && (
          <div className="space-y-2 text-sm">
            <p><b>{selectedContact.title}</b> · {selectedContact.company}</p>
            <p className="text-xs text-slate-500">Currently hiring for: {selectedContact.hiringFor.join(", ")}</p>
            <div className="rounded-lg bg-slate-50 p-3 text-xs">
              <p><b>Subject:</b> Introducing TekSchool — job-ready {selectedContact.hiringFor[0]}s</p>
              <p className="mt-2">Hi {selectedContact.name.split(" ")[0]}, I run partnerships at TekSchool. We've got a cohort graduating this month with hands-on experience shipping {selectedContact.hiringFor[0]} projects. Open to a 15-min intro this week?</p>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}

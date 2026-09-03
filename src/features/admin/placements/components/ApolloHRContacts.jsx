import { Link } from 'react-router-dom';
import { Loader2, Sparkles, Mail, Phone, Link as LinkIcon, Send } from 'lucide-react';

export function ApolloHRContacts({ error, fetching, contacts, note, onClear, onSelectContact }) {
  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
        <p className="font-bold">Apollo request failed</p>
        <p className="mt-1 break-words">{error}</p>
        <p className="mt-2 text-red-600">If the error mentions <code>API_INACCESSIBLE</code>, your Apollo API key needs the People Search endpoint enabled (Apollo → Settings → Integrations → API), or upgrade to a master key.</p>
      </div>
    );
  }

  if (!fetching && contacts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border border-[#1E1B4B]/20 bg-gradient-to-br from-white to-lavender/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E1B4B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          <Sparkles className="h-3 w-3" /> Apollo · live
        </span>
        <p className="text-xs font-semibold">Real HR contacts from Apollo.io</p>

        {fetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
        <button onClick={onClear} className="ml-auto text-[10px] font-semibold text-slate-500 hover:underline">Clear</button>
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
              <button onClick={() => onSelectContact(c)} className="ml-auto inline-flex items-center gap-1 rounded-md bg-[#1E1B4B] px-2 py-0.5 text-white"><Send className="h-2.5 w-2.5" /> Reach out</button>
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
  );
}

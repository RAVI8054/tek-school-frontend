import { useState } from 'react';
import { AdminShell } from '../../components/admin/AdminShell.jsx';
import { SITE_PAGES } from '../../lib/outreachData.js';
import { Modal, PrimaryBtn, GhostBtn } from '../../components/ui/Modal.jsx';
import { pushToast } from '../../lib/actionBus.js';
import { FileEdit, Plus, Trash2, GripVertical, Eye, Type, LayoutGrid, Sparkles, Globe } from 'lucide-react';

export function PagesPage() {
  const [pages, setPages] = useState(SITE_PAGES);
  const [selected, setSelected] = useState(pages[0]?.slug ?? "");
  const [showNew, setShowNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const current = pages.find((p) => p.slug === selected);

  const updateBlock = (id, patch) => {
    if (!current) return;
    setPages((all) => all.map((p) => p.slug !== selected ? p : {
      ...p,
      blocks: p.blocks.map((b) => b.id === id ? ({ ...b, ...patch }) : b),
      updatedAt: "just now",
    }));
  };
  const removeBlock = (id) => {
    setPages((all) => all.map((p) => p.slug !== selected ? p : { ...p, blocks: p.blocks.filter((b) => b.id !== id), updatedAt: "just now" }));
    pushToast("Block removed");
  };
  const addBlock = (kind) => {
    /* eslint-disable-next-line react/purity */
    const id = "b" + Math.random().toString(36).slice(2);
    const b =
      kind === "hero" ? { id, kind, heading: "New hero heading", subheading: "Short supporting line here.", ctaLabel: "Learn more", ctaHref: "/" }
      : kind === "text" ? { id, kind, heading: "Section heading", body: "Body copy goes here. Keep it real, keep it short." }
      : kind === "stat" ? { id, kind, label: "Metric", value: "00%", note: "Context" }
      : { id, kind, heading: "Ready to start?", body: "One call. One clear next step.", ctaLabel: "Book a call", ctaHref: "/contact" };
    setPages((all) => all.map((p) => p.slug !== selected ? p : { ...p, blocks: [...p.blocks, b], updatedAt: "just now" }));
    pushToast(`${kind} block added`);
  };
  const publish = () => {
    setPages((all) => all.map((p) => p.slug !== selected ? p : { ...p, status: "Live", updatedAt: "just now" }));
    pushToast("Page published to /");
  };
  const createPage = (title, path) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setPages((all) => [...all, { slug, title, path, status: "Draft", updatedAt: "just now", editor: "You", blocks: [] }]);
    setSelected(slug);
    setShowNew(false);
    pushToast(`Created "${title}" as draft`);
  };

  return (
    <AdminShell title="Build Pages" actions={
      <button onClick={() => setShowNew(true)} className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 md:inline-flex">
        <Plus className="h-3.5 w-3.5" /> New page
      </button>
    }>
      <p className="mb-3 text-xs text-slate-500">Edit any live page on tekschool.in. Changes are local to this session — publish to push.</p>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-2">
          {pages.map((p) => (
            <button key={p.slug} onClick={() => setSelected(p.slug)}
              className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs ${selected === p.slug ? "bg-[#1E1B4B] text-white" : "hover:bg-slate-50"}`}>
              <FileEdit className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">
                <span className="block font-semibold">{p.title}</span>
                <span className={`block text-[10px] ${selected === p.slug ? "text-white/70" : "text-slate-400"}`}>{p.path}</span>
              </span>
              <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${p.status === "Live" ? "bg-emerald-100 text-emerald-700" : p.status === "Draft" ? "bg-slate-100 text-slate-500" : "bg-coral/15 text-coral"}`}>{p.status}</span>
            </button>
          ))}
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white">
          {current ? (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Editing</p>
                  <p className="font-display text-sm font-bold">{current.title} <span className="text-slate-400 font-normal">· {current.path}</span></p>
                </div>
                <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Eye className="h-3 w-3" /> Preview
                </button>
                <button onClick={() => pushToast("AI: rewrote hero for clarity ✓")} className="inline-flex items-center gap-1.5 rounded-lg bg-lavender/40 px-3 py-1.5 text-xs font-semibold text-[#1E1B4B] hover:bg-lavender/60">
                  <Sparkles className="h-3 w-3" /> AI improve
                </button>
                <button onClick={publish} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-3 py-1.5 text-xs font-semibold text-white">
                  <Globe className="h-3 w-3" /> Publish
                </button>
              </div>

              <div className="space-y-3 p-4">
                {current.blocks.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                    No blocks yet. Add one below.
                  </div>
                )}
                {current.blocks.map((b) => (
                  <BlockEditor key={b.id} block={b} onChange={(patch) => updateBlock(b.id, patch)} onRemove={() => removeBlock(b.id)} />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Add block:</span>
                {(["hero","text","stat","cta"]).map((k) => (
                  <button key={k} onClick={() => addBlock(k)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    <Plus className="h-3 w-3" /> {k}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="p-6 text-center text-sm text-slate-500">Pick a page to edit.</p>
          )}
        </section>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Create a new page"
        footer={<><GhostBtn onClick={() => setShowNew(false)}>Cancel</GhostBtn></>}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createPage(String(fd.get("title") ?? "New Page"), String(fd.get("path") ?? "/new-page"));
        }} className="space-y-3">
          <label className="block text-xs font-semibold">Title
            <input name="title" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="e.g. Scholarships" />
          </label>
          <label className="block text-xs font-semibold">Path
            <input name="path" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="/scholarships" defaultValue="/" />
          </label>
          <div className="flex justify-end pt-2"><PrimaryBtn type="submit">Create draft</PrimaryBtn></div>
        </form>
      </Modal>

      <Modal open={showPreview} onClose={() => setShowPreview(false)} size="lg" title={current ? `Preview · ${current.title}` : "Preview"}>
        <div className="rounded-xl border border-slate-200 bg-[#F0F0F0] p-4">
          {current?.blocks.map((b) => <BlockPreview key={b.id} block={b} />)}
        </div>
      </Modal>
    </AdminShell>
  );
}

function BlockEditor({ block, onChange, onRemove }) {
  const icon = block.kind === "hero" ? LayoutGrid : block.kind === "stat" ? Sparkles : Type;
  const Icon = icon;
  return (
    <div className="group rounded-xl border border-slate-200 bg-slate-50/40 p-3">
      <div className="mb-2 flex items-center gap-2">
        <GripVertical className="h-3.5 w-3.5 text-slate-300" />
        <Icon className="h-3.5 w-3.5 text-[var(--accent-blue-deep)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{block.kind}</span>
        <button onClick={onRemove} className="ml-auto rounded-md p-1 text-slate-400 opacity-0 hover:bg-white hover:text-coral group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {block.kind === "hero" && (
          <>
            <Field label="Heading" value={block.heading} onChange={(v) => onChange({ heading: v })} />
            <Field label="Subheading" value={block.subheading} onChange={(v) => onChange({ subheading: v })} />
            <Field label="CTA label" value={block.ctaLabel} onChange={(v) => onChange({ ctaLabel: v })} />
            <Field label="CTA href" value={block.ctaHref} onChange={(v) => onChange({ ctaHref: v })} />
          </>
        )}
        {block.kind === "text" && (
          <>
            <Field label="Heading" value={block.heading} onChange={(v) => onChange({ heading: v })} />
            <Field label="Body" value={block.body} onChange={(v) => onChange({ body: v })} multiline />
          </>
        )}
        {block.kind === "stat" && (
          <>
            <Field label="Label" value={block.label} onChange={(v) => onChange({ label: v })} />
            <Field label="Value" value={block.value} onChange={(v) => onChange({ value: v })} />
            <Field label="Note" value={block.note} onChange={(v) => onChange({ note: v })} />
          </>
        )}
        {block.kind === "cta" && (
          <>
            <Field label="Heading" value={block.heading} onChange={(v) => onChange({ heading: v })} />
            <Field label="Body" value={block.body} onChange={(v) => onChange({ body: v })} />
            <Field label="CTA label" value={block.ctaLabel} onChange={(v) => onChange({ ctaLabel: v })} />
            <Field label="CTA href" value={block.ctaHref} onChange={(v) => onChange({ ctaHref: v })} />
          </>
        )}
      </div>
    </div>
  );
}
function Field({ label, value, onChange, multiline }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {label}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-normal normal-case text-foreground outline-none focus:border-[var(--accent-blue-deep)]" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-normal normal-case text-foreground outline-none focus:border-[var(--accent-blue-deep)]" />
      )}
    </label>
  );
}
function BlockPreview({ block }) {
  if (block.kind === "hero") return (
    <div className="mb-3 rounded-2xl bg-white p-5">
      <h2 className="font-display text-2xl font-bold">{block.heading}</h2>
      <p className="mt-1 text-sm text-slate-600">{block.subheading}</p>
      <button className="mt-3 rounded-full bg-[#1E1B4B] px-4 py-1.5 text-xs font-semibold text-white">{block.ctaLabel}</button>
    </div>
  );
  if (block.kind === "text") return <div className="mb-3 rounded-2xl bg-white p-5"><h3 className="font-display text-lg font-bold">{block.heading}</h3><p className="mt-1 text-sm text-slate-600">{block.body}</p></div>;
  if (block.kind === "stat") return <div className="mb-3 inline-block rounded-2xl bg-white p-5"><p className="font-display text-3xl font-bold">{block.value}</p><p className="text-[11px] uppercase tracking-wider text-slate-400">{block.label}</p><p className="text-[10px] text-slate-500">{block.note}</p></div>;
  return <div className="mb-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] p-5 text-white"><h3 className="font-display text-lg font-bold">{block.heading}</h3><p className="mt-1 text-sm text-white/80">{block.body}</p><button className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#1E1B4B]">{block.ctaLabel}</button></div>;
}

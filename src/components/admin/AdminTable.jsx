import { useMemo, useState } from 'react';
import { Search, Download, ArrowUpDown, Trash2, Pencil, ChevronLeft, ChevronRight, InboxIcon } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import { pushToast } from '../../lib/actionBus.js';

export function AdminTable({
  rows, columns, filename = 'export.csv', filters, onRowClick, empty, rowActions, onBulkDelete, pageSize = 25,
}) {
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(0);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = rows;
    if (needle) {
      out = out.filter((r) => Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(needle)));
    }
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av == null) return 1; if (bv == null) return -1;
        if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return out;
  }, [rows, q, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const exportCSV = () => {
    // Mock export
    pushToast(`Exported ${filtered.length} rows to ${filename}`);
  };

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('asc'); }
  };

  const allChecked = pageRows.length > 0 && pageRows.every((r) => r.id && selected.has(r.id));
  const toggleAll = () => {
    setSelected((s) => {
      const n = new Set(s);
      if (allChecked) pageRows.forEach((r) => r.id && n.delete(r.id));
      else pageRows.forEach((r) => r.id && n.add(r.id));
      return n;
    });
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_10px_30px_-20px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search…" className="h-9 w-full rounded-xl bg-slate-50 pl-8 pr-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/20" />
        </div>
        {filters}
        {selected.size > 0 && onBulkDelete && (
          <button onClick={() => setConfirmBulk(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-coral/15 px-3 py-1.5 text-xs font-semibold text-coral hover:bg-coral/25">
            <Trash2 className="h-3 w-3" /> Delete {selected.size}
          </button>
        )}
        <button onClick={exportCSV} className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
          <Download className="h-3 w-3" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50/70 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {onBulkDelete && (
                <th className="w-8 px-3 py-2.5">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-3.5 w-3.5" />
                </th>
              )}
              {columns.map((c) => (
                <th key={String(c.key)} className={`px-3 py-2.5 ${c.className ?? ''}`}>
                  {c.sortable !== false ? (
                    <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-foreground">
                      {c.label} <ArrowUpDown className={`h-3 w-3 ${sortKey === c.key ? 'text-foreground opacity-100' : 'opacity-40'}`} />
                    </button>
                  ) : c.label}
                </th>
              ))}
              {rowActions && rowActions.length > 0 && <th className="px-3 py-2.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onBulkDelete ? 1 : 0) + (rowActions ? 1 : 0)} className="px-3 py-16">
                  <div className="mx-auto max-w-sm text-center">
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                      <InboxIcon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold">{empty?.title ?? (q ? 'No matching results' : 'Nothing here yet')}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{empty?.hint ?? (q ? 'Try clearing your search or filters.' : 'New records will appear here.')}</p>
                    {empty?.cta && <div className="mt-4">{empty.cta}</div>}
                  </div>
                </td>
              </tr>
            )}
            {pageRows.map((r, i) => (
              <tr
                key={r.id ?? i}
                onClick={(e) => {
                  const target = e.target;
                  if (target.closest('[data-row-stop]')) return;
                  onRowClick?.(r);
                }}
                className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} ${onRowClick ? 'cursor-pointer hover:bg-[var(--accent-blue-deep)]/5' : ''} transition-colors`}
              >
                {onBulkDelete && (
                  <td className="px-3 py-3" data-row-stop>
                    <input
                      type="checkbox"
                      checked={!!r.id && selected.has(r.id)}
                      onChange={(e) => setSelected((s) => {
                        const n = new Set(s);
                        if (r.id) {
                          if (e.target.checked) n.add(r.id);
                          else n.delete(r.id);
                        }
                        return n;
                      })}
                      className="h-3.5 w-3.5"
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={String(c.key)} className={`px-3 py-3 ${c.className ?? ''}`}>
                    {c.render ? c.render(r) : String(r[c.key] ?? '')}
                  </td>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <td className="px-3 py-3 text-right" data-row-stop>
                    <div className="inline-flex gap-1">
                      {rowActions.map((a) => {
                        const Icon = a.icon ?? Pencil;
                        return (
                          <button
                            key={a.label}
                            onClick={() => a.confirm ? setPendingAction({ row: r, action: a }) : a.onClick(r)}
                            title={a.label}
                            className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${a.destructive ? 'text-slate-400 hover:bg-coral/15 hover:text-coral' : 'text-slate-400 hover:bg-slate-100 hover:text-foreground'}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {filtered.length} of {rows.length} rows
        </span>
        {pageCount > 1 && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50 disabled:opacity-30 hover:bg-slate-100"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <span className="tabular-nums">Page {page + 1} / {pageCount}</span>
            <button disabled={page + 1 >= pageCount} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50 disabled:opacity-30 hover:bg-slate-100"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={() => pendingAction && pendingAction.action.onClick(pendingAction.row)}
        title={pendingAction?.action.confirm?.title ?? 'Are you sure?'}
        message={pendingAction && pendingAction.action.confirm ? pendingAction.action.confirm.message(pendingAction.row) : ''}
        confirmLabel={pendingAction?.action.label ?? 'Confirm'}
        destructive={pendingAction?.action.destructive}
      />
      <ConfirmDialog
        open={confirmBulk}
        onClose={() => setConfirmBulk(false)}
        onConfirm={() => {
          onBulkDelete?.([...selected]);
          pushToast(`Deleted ${selected.size} row${selected.size === 1 ? '' : 's'}`);
          setSelected(new Set());
        }}
        title={`Delete ${selected.size} row${selected.size === 1 ? '' : 's'}?`}
        message="This cannot be undone. The records will be permanently removed."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

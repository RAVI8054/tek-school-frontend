import { X, Bell } from 'lucide-react';

/* eslint-disable-next-line react-refresh/only-export-components */
export const SEED_NOTIFICATIONS = [
  { id: '1', title: 'New assignment posted', body: 'Week 5 project is now available.', read: false },
  { id: '2', title: 'Class starts in 10 mins', body: 'Join the live room for your next class.', read: false },
];

export function NotificationDrawer({ open, onClose, items, onMarkAllRead, onRead }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-bold flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <button onClick={onMarkAllRead} className="text-xs text-primary font-bold">Mark all as read</button>
          {items.map(n => (
            <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'bg-white opacity-60' : 'bg-primary/5 border-primary/20'}`} onClick={() => onRead(n.id)}>
              <p className="font-bold text-sm">{n.title}</p>
              <p className="text-xs text-slate-500 mt-1">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

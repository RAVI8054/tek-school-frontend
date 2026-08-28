// Global CTA action bus for the dashboard. Any button can fire an action and
// a single <ActionModals /> mounted in the layout renders the right modal.
import { useEffect, useState } from "react";




















const EVT = "tek-action";

export function openAction(a) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVT, { detail: a }));
}

export function useAction() {
  const [action, setAction] = useState(null);
  useEffect(() => {
    const handler = (e) => setAction(e.detail);
    window.addEventListener(EVT, handler);
    return () => window.removeEventListener(EVT, handler);
  }, []);
  return { action, close: () => setAction(null) };
}

// Simple toast queue

const listeners = new Set();
let toasts = [];
let seq = 0;
export function pushToast(message) {
  const t = { id: ++seq, message };
  toasts = [...toasts, t];
  listeners.forEach((l) => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    listeners.forEach((l) => l(toasts));
  }, 3200);
}
export function useToasts() {
  const [list, setList] = useState(toasts);
  useEffect(() => {
    listeners.add(setList);
    return () => {listeners.delete(setList);};
  }, []);
  return list;
}
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

import toast from 'react-hot-toast';

export function pushToast(message, type = "success") {
  if (type === "success") {
    toast.success(message, { position: "top-center" });
  } else if (type === "error") {
    toast.error(message, { position: "top-center" });
  } else {
    toast(message, { position: "top-center" });
  }
}

// Keeping a dummy hook so components using it don't break if they were left unmodified
export function useToasts() {
  return [];
}
// Simple event bus for toasts and actions
export const listeners = new Set();

export function pushToast(message) {
  for (const listener of listeners) {
    listener(message);
  }
}

export function subscribeToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openAction(payload) {
  pushToast(typeof payload === 'string' ? payload : JSON.stringify(payload));
}

import { useEffect, useState } from "react";

const KEY = "tek-session";

const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

let cachedRaw = null;
let cachedSession = null;
function read() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedSession;
    cachedRaw = raw;
    cachedSession = raw ? JSON.parse(raw) : null;
    return cachedSession;
  } catch {
    return null;
  }
}

export function signInDemo(email) {
  const rawName = email.split("@")[0] || "student";
  const name = rawName
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ") || "Student";
  const existing = read();
  const session = existing?.email === email
    ? { ...existing, isFirstTime: false }
    : {
        name,
        email,
        track: "AI Engineering",
        cohort: "March '26",
        isFirstTime: true,
        avatarInitials: name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase(),
        weekCurrent: 5,
        weekTotal: 12,
        streak: 4,
      };
  localStorage.setItem(KEY, JSON.stringify(session));
  emit();
  return session;
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  emit();
}

export function markReturning() {
  const s = read();
  if (!s) return;
  localStorage.setItem(KEY, JSON.stringify({ ...s, isFirstTime: false }));
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSession() {
  const [session, setSession] = useState(() => read());
  useEffect(() => {
    const cb = () => setSession(read());
    return subscribe(cb);
  }, []);
  return session;
}

export const OPEN_SIGNIN_EVENT = "tek-open-signin";
export function openSignIn() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(OPEN_SIGNIN_EVENT));
}

export function useOpenSignInListener(cb) {
  useEffect(() => {
    const handler = () => cb();
    window.addEventListener(OPEN_SIGNIN_EVENT, handler);
    return () => window.removeEventListener(OPEN_SIGNIN_EVENT, handler);
  }, [cb]);
}

export function useHydrated() {
  const [h, setH] = useState(false);
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => setH(true), []);
  return h;
}

import { useEffect, useRef, useState } from "react";
import { X, Sparkles, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useOpenSignInListener } from "../../lib/auth.js";
import { useStudentAuth } from "../../context/StudentAuthContext.jsx";
import { LogoLockup } from "../ui/Logo.jsx";

export function SignInPanel() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const firstFieldRef = useRef(null);

  const { login } = useStudentAuth();

  useOpenSignInListener(() => {
    setOpen(true);
    setMode("signin");
    setError(null);
  });

  useEffect(() => {
    if (!open && !showJoin) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showJoin) setShowJoin(false);
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (open && mode === "signin") setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, showJoin, mode]);

  async function submitSignIn(e) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      setEmail("");
      setPassword("");
      // The user stays on the landing page; the header will now show "Dashboard"
    } else {
      setError(result.error || "Invalid credentials. Please check your email and password.");
    }
  }

  async function submitForgot(e) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(resetEmail)) return setError("Enter a valid email.");
    
    setLoading(true);
    try {
      const { forgotPassword } = await import("../../lib/api.js");
      await forgotPassword(resetEmail);
      setMode("forgot-sent");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className={`fixed right-0 top-0 z-[80] h-full w-full max-w-[400px] bg-white shadow-[-24px_0_60px_-20px_rgba(30,27,75,0.35)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-7">
          <div className="flex items-center justify-between">
            <LogoLockup className="h-8" />
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {mode === "signin" && (
            <>
              <div className="mt-8">
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F2A52]">Sign in</h2>
                <p className="mt-2 text-sm text-slate-500">Welcome back. Pick up where you left off.</p>
              </div>

              <form onSubmit={submitSignIn} className="mt-6 space-y-4" noValidate>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
                  <input
                    ref={firstFieldRef}
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F2A52] focus:ring-2 focus:ring-[#0F2A52]/20"
                    placeholder="you@domain.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F2A52] focus:ring-2 focus:ring-[#0F2A52]/20"
                    placeholder="••••••••"
                  />
                </label>

                {error && <p className="rounded-xl bg-[#FF6B6B]/10 px-3 py-2 text-xs font-medium text-[#FF6B6B]">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0F2A52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F2A52]/90 disabled:opacity-60"
                >
                  {loading ? "Signing you in…" : "Sign In"}
                </button>

                <button
                  type="button"
                  className="block w-full text-center text-sm font-medium text-[#1D4ED8] hover:underline"
                  onClick={() => { setMode("forgot"); setError(null); setResetEmail(email); }}
                >
                  Forgot password?
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
                <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setShowJoin(true)}
                  className="font-semibold text-[#0F2A52] underline underline-offset-2"
                >
                  Create an account
                </button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <div className="mt-8">
                <span className="inline-block rounded-full px-3 py-1 -rotate-2 bg-[#E6E6FA] text-[10px] font-semibold text-[#0F2A52] uppercase tracking-wider">Reset password</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F2A52]">Forgot it? No sweat.</h2>
                <p className="mt-2 text-sm text-slate-500">Enter your email and we'll send a reset link.</p>
              </div>

              <form onSubmit={submitForgot} className="mt-6 space-y-4" noValidate>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F2A52] focus:ring-2 focus:ring-[#0F2A52]/20"
                    placeholder="you@domain.com"
                    autoFocus
                  />
                </label>

                {error && <p className="rounded-xl bg-[#FF6B6B]/10 px-3 py-2 text-xs font-medium text-[#FF6B6B]">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0F2A52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F2A52]/90 disabled:opacity-60"
                >
                  {loading ? "Sending link…" : "Send reset link"}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); }}
                  className="block w-full text-center text-sm font-medium text-slate-500 hover:underline"
                >
                  ← Back to sign in
                </button>
              </form>
            </>
          )}

          {mode === "forgot-sent" && (
            <div className="mt-8 flex flex-1 flex-col">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1D4ED8]/10">
                <Mail className="h-7 w-7 text-[#1D4ED8]" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[#0F2A52]">Check your inbox</h2>
              <p className="mt-2 text-sm text-slate-500">
                We sent a reset link to <span className="font-semibold text-slate-900">{resetEmail}</span>. It expires in 30 minutes.
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1D4ED8]" />
                <p className="text-xs text-slate-500">
                  Not there in 2 minutes? Check spam, or ping us on WhatsApp from the Contact page and we'll reset it manually.
                </p>
              </div>

              <button
                onClick={() => { setMode("signin"); setError(null); }}
                className="mt-6 w-full rounded-full bg-[#0F2A52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F2A52]/90"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Join TekSchool modal */}
      <div
        aria-hidden={!showJoin}
        className={`fixed inset-0 z-[90] grid place-items-center p-4 transition-opacity duration-300 ${
          showJoin ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          onClick={() => setShowJoin(false)}
          className="absolute inset-0 bg-[#0F2A52]/60 backdrop-blur-sm"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Join TekSchool"
          className={`relative w-full max-w-[520px] overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_-20px_rgba(30,27,75,0.5)] transition-all duration-300 ${
            showJoin ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          }`}
        >
          {/* Gradient header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#0F2A52] px-8 pb-10 pt-8 text-white">
            <button
              aria-label="Close"
              onClick={() => setShowJoin(false)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            {/* Doodles */}
            <svg className="absolute -right-6 -top-6 h-40 w-40 text-white/20" viewBox="0 0 100 100" fill="none">
              <path d="M10 50 Q30 10 50 50 T90 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="80" cy="20" r="4" fill="currentColor" />
              <circle cx="20" cy="80" r="3" fill="currentColor" />
            </svg>
            <span className="inline-flex items-center rounded-full px-3 py-1 -rotate-3 bg-[#FF6B6B] text-[11px] font-semibold text-white uppercase tracking-wider">
              <Sparkles className="mr-1 inline h-3 w-3" /> New cohort open
            </span>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight">
              Join TekSchool
            </h3>
            <p className="mt-2 text-sm text-white/90">
              Be part of India's most hands-on engineering school.
            </p>
          </div>

          <div className="px-8 py-7">
            <p className="text-[15px] leading-relaxed text-slate-800">
              Admissions aren't a form on a website — they're a conversation. Tell us where you are, what you want to build, and we'll pair you with the right track, cohort, and scholarship. Small batches. Real mentors. Ship-day accountability.
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
              {[
                "20-minute chat with an admissions mentor",
                "Track fit + cohort schedule that works for you",
                "Scholarships up to 40% for early applicants",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setShowJoin(false)}
                className="text-sm font-medium text-slate-500 hover:underline"
              >
                Maybe later
              </button>
              <Link
                to="/contact"
                onClick={() => { setShowJoin(false); setOpen(false); }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0F2A52] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(30,27,75,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#0F2A52]/90"
              >
                Start my application
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

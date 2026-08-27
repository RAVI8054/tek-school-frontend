import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PhoneFrame } from "../../components/mobile/PhoneFrame.jsx";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { LogoLockup } from "../../components/ui/Logo.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@tek.school");
  const [password, setPassword] = useState("tek@26");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (email.trim().toLowerCase() !== "demo@tek.school" || password !== "tek@26") {
      setError("Invalid credentials. Please check your email and password.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      // Mock login successful, redirect to dashboard or home
      navigate("/app");
    }, 550);
  }

  return (
    <PhoneFrame>
      <div className="relative flex min-h-full flex-col">
        {/* Hero header */}
        <div
          className="relative overflow-hidden px-6 pb-16 pt-16 text-white"
          style={{ background: "linear-gradient(160deg,#0F0D2E 0%,#1E1B4B 50%,#2D5FA8 100%)" }}
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#5BA4E8]/25 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#F4A261]/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center rounded-2xl bg-white px-3 py-2 shadow-lg">
              <LogoLockup className="h-7 w-auto" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-black leading-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-white/70">Sign in to continue your AI Engineering journey.</p>
          </div>
        </div>

        {/* Card */}
        <div className="-mt-8 flex-1 rounded-t-[32px] bg-white px-6 pb-8 pt-8 shadow-[0_-10px_30px_-15px_rgba(15,23,42,0.15)]">
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Email</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1E1B4B]/20">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  placeholder="you@tekschool.in"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Password</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1E1B4B]/20">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="text-slate-400" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[#1E1B4B]" />
                Remember me
              </label>
              <button type="button" className="font-semibold text-[#1E1B4B]">Forgot?</button>
            </div>

            {error && (
              <p className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1E1B4B] py-4 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(30,27,75,0.6)] active:scale-[0.98] disabled:opacity-70"
            >
              {busy ? "Signing in…" : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> or continue with <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-2xl border border-slate-200 py-3 text-xs font-semibold text-slate-700">Google</button>
            <button className="rounded-2xl border border-slate-200 py-3 text-xs font-semibold text-slate-700">Apple</button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            New here? <button className="font-semibold text-[#1E1B4B]">Request cohort access</button>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

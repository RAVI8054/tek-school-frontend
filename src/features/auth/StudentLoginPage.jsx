import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { LogoLockup } from "../../components/ui/Logo.jsx";
import { useStudentAuthStore } from "../../store/useStudentAuthStore.js";

export function StudentLoginPage() {
  const navigate = useNavigate();
  const { login } = useStudentAuthStore();
  
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmitSignIn(e) {
    e.preventDefault();
    setError(null);
    
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
    if (!password) return setError("Please enter your password.");
    
    setBusy(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Invalid credentials. Please check your email and password.");
      setBusy(false);
    }
  }

  async function onSubmitForgot(e) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(resetEmail)) return setError("Enter a valid email.");
    
    setBusy(true);
    try {
      const { forgotPassword } = await import("../../lib/api.js");
      await forgotPassword(resetEmail);
      setMode("forgot-sent");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Blurred Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="inline-flex items-center rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 px-4 py-3 shadow-sm">
            <LogoLockup className="h-8 w-auto" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-white/50">
          
          {mode === "signin" && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-[#0F2A52]">
                  Student Login
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Welcome back. Pick up where you left off.
                </p>
              </div>

              <form onSubmit={onSubmitSignIn} className="space-y-5">
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Email Address
                  </span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#0F2A52]/20">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      placeholder="you@domain.com"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Password
                  </span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#0F2A52]/20">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label="Toggle password"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                {error && (
                  <p className="rounded-2xl bg-[#FF6B6B]/10 px-3 py-2 text-xs font-medium text-[#FF6B6B]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-70 transition-all hover:bg-[#0F2A52]/90"
                >
                  {busy ? "Signing in..." : (
                    <>
                      Sign In <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="block w-full text-center text-sm font-medium text-[#1D4ED8] hover:underline mt-4"
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
                <Link
                  to="/contact"
                  className="font-semibold text-[#0F2A52] underline underline-offset-2"
                >
                  Contact Admissions
                </Link>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <div className="mb-8 text-center">
                <span className="inline-block rounded-full px-3 py-1 -rotate-2 bg-[#E6E6FA] text-[10px] font-semibold text-[#0F2A52] uppercase tracking-wider">Reset password</span>
                <h2 className="mt-3 text-3xl font-extrabold text-[#0F2A52]">Forgot it? No sweat.</h2>
                <p className="mt-2 text-sm text-gray-600">Enter your email and we'll send a reset link.</p>
              </div>

              <form onSubmit={onSubmitForgot} className="space-y-5">
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Email Address
                  </span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#0F2A52]/20">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      placeholder="you@domain.com"
                      autoFocus
                      required
                    />
                  </div>
                </label>

                {error && <p className="rounded-2xl bg-[#FF6B6B]/10 px-3 py-2 text-xs font-medium text-[#FF6B6B]">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F2A52] py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-70 transition-all hover:bg-[#0F2A52]/90"
                >
                  {busy ? "Sending link..." : "Send reset link"}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); }}
                  className="block w-full text-center text-sm font-medium text-slate-500 hover:underline mt-4"
                >
                  ← Back to sign in
                </button>
              </form>
            </>
          )}

          {mode === "forgot-sent" && (
            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] mb-6">
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#0F2A52]">Check your inbox</h2>
              <p className="mt-2 text-sm text-slate-500">
                We sent a reset link to <span className="font-semibold text-slate-900">{resetEmail}</span>. It expires in 30 minutes.
              </p>
              
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1D4ED8]" />
                <p className="text-xs text-slate-500">
                  Not there in 2 minutes? Check spam, or ping us on WhatsApp from the Contact page and we'll reset it manually.
                </p>
              </div>

              <button
                onClick={() => { setMode("signin"); setError(null); }}
                className="mt-6 w-full rounded-full bg-[#0F2A52] px-5 py-4 text-sm font-bold text-white hover:bg-[#0F2A52]/90 shadow-lg active:scale-[0.98] transition-all"
              >
                Back to sign in
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

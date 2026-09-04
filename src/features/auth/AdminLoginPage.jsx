import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { LogoLockup } from "../../components/ui/Logo.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState("tekadmin@gmail.com");
  const [password, setPassword] = useState("tekadmin");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setBusy(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      const role = result.user?.role;
      if (role === 'instructor') {
        navigate("/instructor");
      } else if (role === 'finance') {
        navigate("/finance");
      } else if (role === 'admissions') {
        navigate("/admin/enquiries");
      } else {
        navigate("/admin");
      }
    } else {
      setError(result.error);
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
          <div className="inline-flex items-center rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 px-4 py-3 shadow-sm">
            <LogoLockup className="h-8 w-auto" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-white/50">
          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Email Address
              </span>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1E1B4B]/20">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  placeholder="admin@tekschool.in"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Password
              </span>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1E1B4B]/20">
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
              <p className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1E1B4B] py-4 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(30,27,75,0.6)] active:scale-[0.98] disabled:opacity-70 transition-all"
            >
              {busy ? "Authenticating..." : (
                <>
                  Sign in securely <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { LogoLockup } from "../../components/ui/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      navigate("/admin");
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-2xl bg-[#1E1B4B] px-4 py-3 shadow-lg">
            {/* Using a bright/white version of the logo if possible, or just the default. 
                LogoLockup usually adapts if it's an SVG. */}
            <LogoLockup className="h-8 w-auto text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage Tek School operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-slate-100">
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

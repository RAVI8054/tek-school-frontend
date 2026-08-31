import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../lib/api.js";
import { LogoLockup } from "../../components/ui/Logo.jsx";

export function ResetPasswordPage() {
  const { token } = useParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    setLoading(true);
    try {
      await resetPassword(token, password, confirmPassword);
      setSuccess(true);
      // Optional: automatically redirect to dashboard or login
      setTimeout(() => {
        // We'll redirect to home so they can login. Or if the token is set as httpOnly cookie, 
        // we can just redirect to dashboard directly.
        // In `auth.service.js` `resetPassword` sets the tokens, so the user is logged in.
        // We can force a reload to let StudentAuthContext fetch the user.
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link might be expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_40px_80px_-20px_rgba(30,27,75,0.1)]">
        <div className="mb-8 flex justify-center">
          <LogoLockup className="h-8" />
        </div>

        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8]">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F2A52]">Password Reset</h2>
            <p className="mt-2 text-sm text-slate-500">
              Your password has been reset successfully. Redirecting you to the dashboard...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F2A52]">Set New Password</h2>
              <p className="mt-2 text-sm text-slate-500">
                Please enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">New Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F2A52] focus:ring-2 focus:ring-[#0F2A52]/20"
                  placeholder="••••••••"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Confirm Password</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0F2A52] focus:ring-2 focus:ring-[#0F2A52]/20"
                  placeholder="••••••••"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-[#FF6B6B]/10 px-3 py-2 text-xs font-medium text-[#FF6B6B]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#0F2A52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F2A52]/90 disabled:opacity-60"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Modal, PrimaryBtn, GhostBtn } from "../../components/ui/Modal.jsx";
import { processPaymentFlow } from "../../lib/razorpay.js";
import { pushToast } from "../../lib/actionBus.js";

export function GuestPaymentModal({ open, onClose, workshop, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    if (!name || name.length < 2) return setError("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Valid email is required");

    setError(null);
    setLoading(true);

    try {
      await processPaymentFlow({
        paymentFor: "Workshop",
        itemId: workshop.id,
        amount: workshop.rawPrice,
        description: `Reserve Seat - ${workshop.title}`,
        guest: { name, email, phone },
      });
      
      pushToast("Seat reserved successfully! Please check your email.");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!workshop) return null;

  return (
    <Modal open={open} onClose={onClose} title="Reserve Your Seat">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <p className="text-sm text-slate-600 mb-4">
            You are reserving a seat for <strong>{workshop.title}</strong>. Please enter your details to proceed to payment.
          </p>
        </div>
        
        {error && <div className="rounded-lg bg-coral/10 p-3 text-sm font-medium text-coral">{error}</div>}
        
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Full Name
          <input
            name="name"
            type="text"
            required
            placeholder="e.g. Aarav Sharma"
            className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm normal-case text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30"
          />
        </label>
        
        <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm normal-case text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30"
          />
        </label>

        <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Phone Number (Optional)
          <input
            name="phone"
            type="tel"
            placeholder="e.g. +91 9876543210"
            className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm normal-case text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30"
          />
        </label>
        
        <div className="flex justify-end gap-2 pt-4">
          <GhostBtn disabled={loading} onClick={onClose} type="button">
            Cancel
          </GhostBtn>
          <PrimaryBtn type="submit" loading={loading}>
            Proceed to Pay ₹{workshop.rawPrice}
          </PrimaryBtn>
        </div>
      </form>
    </Modal>
  );
}

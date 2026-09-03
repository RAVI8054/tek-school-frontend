/**
 * razorpay.js — Singleton SDK loader + checkout launcher
 *
 * Guarantees the Razorpay <script> is injected only ONCE no matter how many
 * components call loadRazorpay() concurrently.
 */
import { initiatePayment, verifyPayment } from './api.js';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

/** @type {Promise<boolean> | null} */
let _loadPromise = null;

/**
 * Lazily injects the Razorpay SDK script and resolves when it's ready.
 * Subsequent calls return the same cached promise — no duplicate <script> tags.
 *
 * @returns {Promise<boolean>} true when window.Razorpay is available.
 */
export function loadRazorpay() {
  // Already loaded
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(true);

  // Load in progress — return the same promise
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      _loadPromise = null; // Allow retry on network failure
      reject(new Error('Failed to load Razorpay SDK. Check your internet connection.'));
    };
    document.body.appendChild(script);
  });

  return _loadPromise;
}

/**
 * Opens the Razorpay checkout modal and returns a promise that:
 *  - Resolves with { razorpay_order_id, razorpay_payment_id, razorpay_signature }  on success
 *  - Rejects  with an Error on failure or modal dismiss
 *
 * @param {{
 *   key: string,
 *   amount: number,        // in paise  (backend already multiplies — so pass providerOrder.amount)
 *   currency: string,
 *   name: string,
 *   description: string,
 *   image?: string,
 *   order_id: string,      // Razorpay providerOrder.id
 *   prefill?: { name?: string, email?: string, contact?: string },
 *   notes?: Record<string, string>,
 *   theme?: { color?: string }
 * }} options
 *
 * @returns {Promise<{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }>}
 */
export function openRazorpayCheckout(options) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded. Call loadRazorpay() first.'));
      return;
    }

    const rzp = new window.Razorpay({
      ...options,
      handler(response) {
        resolve(response);
      },
      modal: {
        ondismiss() {
          reject(new Error('Payment cancelled by user.'));
        },
      },
    });

    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed.'));
    });

    rzp.open();
  });
}

/**
 * High-level helper to process the full payment flow from start to finish.
 * It calls the backend to initiate, opens the Razorpay UI, and verifies on success.
 */
export async function processPaymentFlow({
  paymentFor,
  itemId,
  amount,
  name = 'TekSchool',
  description,
  prefill,
}) {
  await loadRazorpay();

  // 1. Create order on the server
  const initRes = await initiatePayment({ paymentFor, itemId, amount });
  const { payment, providerOrder, key } = initRes.data;
  const paymentId = payment._id;

  // 2. Open Razorpay checkout modal
  const response = await openRazorpayCheckout({
    key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: providerOrder.amount,
    currency: providerOrder.currency,
    name,
    description,
    order_id: providerOrder.id,
    prefill,
    theme: { color: '#1E1B4B' }
  });

  // 3. Verify signature on the server
  await verifyPayment({
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    paymentId
  });

  return initRes.data;
}

import 'dotenv/config';
import Razorpay from 'razorpay';
import crypto from 'node:crypto';

/**
 * Thin wrapper around the Razorpay SDK + signature checks.
 * Only this file knows the secret keys / talks to Razorpay; services call these helpers.
 * (PRD §12.3 — no card data touches us; we only handle order ids + signatures + amounts.)
 */

const keyId = process.env.RAZORPAY_KEY_ID as string;
const keySecret = process.env.RAZORPAY_KEY_SECRET as string;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

// One shared client.
const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

/**
 * Create an order = tell Razorpay to expect a payment of this amount.
 * @param amountInPaise ₹7,500 → 750000 (Razorpay works in paise)
 * @param receipt your own reference (e.g. booking ref), max 40 chars
 */
export async function createOrder(amountInPaise: number, receipt: string) {
  return razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt,
  });
}

/**
 * Verify the payment callback signature (sent by the browser after checkout).
 * Razorpay signs `order_id|payment_id` with the key secret — we recompute and compare.
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return safeEqual(expected, signature);
}

/**
 * Verify a webhook signature (Razorpay → our server). HMAC of the RAW body with the webhook secret.
 * The caller must pass the raw request body string, not the parsed JSON.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
}

/**
 * Refund a captured payment. Omit the amount for a full refund; pass paise for a partial one.
 */
export async function refundPayment(paymentId: string, amountInPaise?: number) {
  return razorpay.payments.refund(paymentId, amountInPaise ? { amount: amountInPaise } : {});
}

/** Constant-time string compare (avoids leaking via timing). */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

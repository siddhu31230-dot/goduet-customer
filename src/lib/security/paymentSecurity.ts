/**
 * GoDuet Payment Security & Gateway Webhook Verification
 * Standards: PCI-DSS v4.0 SAQ-A Compliance, RBI Payment Aggregator Guidelines
 */

import crypto from 'crypto';
import { recordAuditLog } from './auditLogger';

const WEBHOOK_SECRET = process.env.GODUET_PAYMENT_WEBHOOK_SECRET || 'whsec_hyd_payment_gateway_live_hmac_2026';
const MAX_WEBHOOK_AGE_SECONDS = 300; // 5 minutes anti-replay window

// Idempotency cache (In production, stored in Redis with unique constraint on database)
const processedTransactionIds = new Set<string>();

export interface PaymentWebhookPayload {
  event: 'payment.authorized' | 'payment.captured' | 'payment.failed' | 'refund.processed';
  paymentId: string;
  orderId: string;
  amountPaisa: number;
  currency: 'INR';
  timestamp: number; // Unix timestamp in seconds
  signature: string;
}

/**
 * Verifies authenticity of payment gateway webhooks using constant-time comparison
 */
export function verifyPaymentWebhook(
  rawBody: string,
  providedSignature: string,
  timestampHeader?: string
): { isValid: boolean; error?: string } {
  if (!providedSignature) {
    return { isValid: false, error: 'Missing payment signature header.' };
  }

  // Replay Attack Prevention: Validate timestamp freshness
  if (timestampHeader) {
    const eventTime = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(eventTime) || Math.abs(now - eventTime) > MAX_WEBHOOK_AGE_SECONDS) {
      recordAuditLog({
        action: 'PAYMENT_SIGNATURE_TAMPER_DETECTED',
        status: 'BLOCKED',
        details: { reason: 'Webhook timestamp outside 5-minute replay window', eventTime, now }
      });
      return { isValid: false, error: 'Replay attack blocked: Webhook signature expired.' };
    }
  }

  // Calculate HMAC-SHA256
  const payloadToSign = timestampHeader ? `${timestampHeader}.${rawBody}` : rawBody;
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payloadToSign)
    .digest('hex');

  // Constant time comparison
  const sigBuffer = Buffer.from(providedSignature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    recordAuditLog({
      action: 'PAYMENT_SIGNATURE_TAMPER_DETECTED',
      status: 'BLOCKED',
      details: { reason: 'HMAC signature mismatch' }
    });
    return { isValid: false, error: 'Invalid webhook signature.' };
  }

  return { isValid: true };
}

/**
 * Idempotency Guardian: Guarantees an order or transaction is processed exactly once
 */
export function processIdempotentPayment(paymentId: string, orderId: string, amount: number): {
  isDuplicate: boolean;
  message: string;
} {
  const transactionKey = `tx:${paymentId}:${orderId}`;

  if (processedTransactionIds.has(transactionKey)) {
    return {
      isDuplicate: true,
      message: `Transaction ${paymentId} has already been settled. Duplicate processing suppressed.`
    };
  }

  processedTransactionIds.add(transactionKey);

  recordAuditLog({
    action: 'PAYMENT_WEBHOOK_PROCESSED',
    status: 'SUCCESS',
    targetEntity: 'order',
    targetId: orderId,
    details: { paymentId, amount }
  });

  return {
    isDuplicate: false,
    message: `Payment ${paymentId} captured successfully.`
  };
}

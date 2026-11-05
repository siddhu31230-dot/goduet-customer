import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentWebhook, processIdempotentPayment } from '@/lib/security/paymentSecurity';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-goduet-signature') || req.headers.get('x-razorpay-signature') || '';
    const timestamp = req.headers.get('x-goduet-timestamp') || '';

    // 1. Verify HMAC Signature and Anti-Replay Timestamp
    const verification = verifyPaymentWebhook(rawBody, signature, timestamp || undefined);
    if (!verification.isValid) {
      return NextResponse.json(
        { error: verification.error || 'Payment webhook signature verification failed.' },
        { status: 401 }
      );
    }

    // 2. Parse Validated Payload
    const payload = JSON.parse(rawBody);
    const { event, paymentId, orderId, amountPaisa } = payload;

    // 3. Process Idempotently to prevent double payment capture
    const result = processIdempotentPayment(paymentId, orderId, amountPaisa);

    return NextResponse.json({
      success: true,
      isDuplicate: result.isDuplicate,
      message: result.message
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Webhook processing error.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { OtpSendInputSchema } from '@/lib/security/validator';
import { generateSecureOtp } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { recordAuditLog } from '@/lib/security/auditLogger';
import { sendOtpViaFast2SMS } from '@/lib/sms/fast2sms';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Rate Limiting Check: Max 3 OTP requests per minute per IP
    const rateCheck = checkRateLimit(ip, 'otp');
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `OTP limit exceeded. Please wait ${rateCheck.resetInSeconds} seconds before requesting a new code.` },
        { status: 429 }
      );
    }

    // 2. Validate payload
    const body = await req.json();
    const parseResult = OtpSendInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Valid email or mobile number required.' },
        { status: 400 }
      );
    }

    const { identifier } = parseResult.data;

    // 3. Cryptographic OTP Generation (6 digits, randomInt)
    const { otp, expiresAt } = generateSecureOtp(identifier);

    // Fast2SMS Gateway Architecture (safely runs in simulation mode by default)
    const smsResult = await sendOtpViaFast2SMS(identifier, otp);

    // 4. Audit Log OTP Request
    recordAuditLog({
      action: 'AUTH_OTP_SENT',
      ipAddress: ip,
      status: 'SUCCESS',
      details: { identifierMasked: identifier.slice(0, 4) + '••••', smsStatus: smsResult.statusText }
    });

    // In production, dispatch via SMS gateway (Twilio / Gupshup) or SendGrid
    // In development/demo mode, return simulated delivery notice
    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${identifier}. Valid for 5 minutes.`,
      expiresAt: expiresAt.toISOString(),
      // Demo helper in non-production environments
      demoOtpCode: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to dispatch verification code.' },
      { status: 400 }
    );
  }
}

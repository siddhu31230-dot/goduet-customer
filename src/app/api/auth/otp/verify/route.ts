import { NextRequest, NextResponse } from 'next/server';
import { OtpVerifyInputSchema } from '@/lib/security/validator';
import { verifySecureOtp, createSessionToken, SECURE_COOKIE_OPTIONS, UserRole } from '@/lib/security/auth';
import { recordAuditLog } from '@/lib/security/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const body = await req.json();

    const parseResult = OtpVerifyInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid verification input format.' },
        { status: 400 }
      );
    }

    const { identifier, otp } = parseResult.data;

    // 1. Verify OTP with Attempt Counting & Timing-Safe Comparison
    const verification = verifySecureOtp(identifier, otp);

    if (!verification.success) {
      recordAuditLog({
        action: 'AUTH_LOGIN_FAILURE',
        ipAddress: ip,
        status: 'FAILURE',
        details: { identifier, reason: verification.error }
      });

      return NextResponse.json(
        { error: verification.error },
        { status: 401 }
      );
    }

    // 2. Successful verification: Create user session
    const isStudent = identifier.includes('.edu') || identifier.includes('.ac.in');
    const role: UserRole = 'customer';
    const userId = `usr_${Date.now()}`;

    recordAuditLog({
      action: 'AUTH_OTP_VERIFIED',
      actorId: userId,
      actorRole: role,
      ipAddress: ip,
      status: 'SUCCESS',
      details: { identifier }
    });

    const sessionToken = createSessionToken(userId, identifier, role, isStudent);

    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully. Welcome to GoDuet!',
      user: {
        id: userId,
        identifier,
        role,
        isStudent
      }
    });

    response.cookies.set('goduet_session', sessionToken, SECURE_COOKIE_OPTIONS);
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Verification service error.' },
      { status: 500 }
    );
  }
}

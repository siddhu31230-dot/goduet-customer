import { NextRequest, NextResponse } from 'next/server';
import { RegisterInputSchema } from '@/lib/security/validator';
import { hashPassword, createSessionToken, SECURE_COOKIE_OPTIONS } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { recordAuditLog } from '@/lib/security/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Rate Limiting Check
    const rateCheck = checkRateLimit(ip, 'auth');
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please retry in ${rateCheck.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    // 2. Strict Input Validation
    const body = await req.json();
    const parseResult = RegisterInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role } = parseResult.data;

    // 3. Argon2id Password Hashing
    const passwordHash = await hashPassword(password);

    // In production, save to PostgreSQL using parameterized query:
    // INSERT INTO users (id, email, phone, password_hash, role, full_name) VALUES ($1, $2, $3, $4, $5, $6)
    const userId = `usr_${Date.now()}`;

    // 4. Audit Logging
    recordAuditLog({
      action: 'AUTH_LOGIN_SUCCESS',
      actorId: userId,
      actorRole: role,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || undefined,
      status: 'SUCCESS',
      details: { email, phoneMasked: phone.slice(0, 7) + '••••' }
    });

    // 5. Issue Secure Session Token
    const sessionToken = createSessionToken(userId, email, role);

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully with GoDuet.',
      user: { id: userId, name, email, role }
    });

    response.cookies.set('goduet_session', sessionToken, SECURE_COOKIE_OPTIONS);
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal registration security error.' },
      { status: 500 }
    );
  }
}

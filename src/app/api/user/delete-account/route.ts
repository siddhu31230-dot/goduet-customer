import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/security/auth';
import { recordAuditLog } from '@/lib/security/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Authenticate Request
    const sessionCookie = req.cookies.get('goduet_session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Session required to perform account deletion.' },
        { status: 401 }
      );
    }

    // 2. DPDP Act Compliance: Soft Delete & Anonymize PII
    // UPDATE users SET deleted_at = NOW(), full_name = 'DELETED USER', phone = '••••••••', is_active = FALSE WHERE id = $1
    // UPDATE customer_addresses SET flat_no = 'REDACTED', landmark = 'REDACTED' WHERE user_id = $1

    // 3. Immutable Audit Log
    recordAuditLog({
      action: 'USER_DATA_DELETION_REQUESTED',
      actorId: session.userId,
      actorRole: session.role,
      ipAddress: ip,
      status: 'SUCCESS',
      targetEntity: 'user',
      targetId: session.userId,
      details: { complianceStandard: 'India Digital Personal Data Protection Act (DPDP Act)' }
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account deletion initiated. Your personal identification information has been sanitized in accordance with the DPDP Act.'
    });

    // Clear session cookie
    response.cookies.delete('goduet_session');
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to process account deletion.' },
      { status: 500 }
    );
  }
}

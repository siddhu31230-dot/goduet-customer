import { NextRequest, NextResponse } from 'next/server';
import { DocumentUploadRequestSchema } from '@/lib/security/validator';
import { generatePresignedUploadUrl } from '@/lib/security/documentSecurity';
import { verifySessionToken } from '@/lib/security/auth';
import { recordAuditLog } from '@/lib/security/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Authenticate Caller
    const sessionCookie = req.cookies.get('goduet_session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to upload KYC documents.' },
        { status: 401 }
      );
    }

    // 2. Validate Document Policy
    const body = await req.json();
    const parseResult = DocumentUploadRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { partnerType, documentType, fileName, fileSizeBytes, mimeType } = parseResult.data;

    // 3. Generate Presigned Upload Policy (Strict 15-minute TTL, safe key, MIME whitelist)
    const policy = generatePresignedUploadUrl(
      session.userId,
      partnerType,
      documentType,
      fileName,
      mimeType,
      fileSizeBytes
    );

    // 4. Audit Log
    recordAuditLog({
      action: 'DOCUMENT_UPLOAD_AUTHORIZED',
      actorId: session.userId,
      actorRole: session.role,
      ipAddress: ip,
      status: 'SUCCESS',
      targetEntity: 'document',
      targetId: policy.fileKey,
      details: { documentType, mimeType, fileSizeBytes }
    });

    return NextResponse.json({
      success: true,
      policy
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to authorize document upload.' },
      { status: 400 }
    );
  }
}

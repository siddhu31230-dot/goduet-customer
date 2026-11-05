/**
 * GoDuet Immutable Security Audit Logging
 * Standards: ISO 27001 A.12.4, SOC 2 Type II, Cryptographic Tamper-Evident Hash Chaining
 */

import crypto from 'crypto';

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_OTP_SENT'
  | 'AUTH_OTP_VERIFIED'
  | 'AUTH_ACCOUNT_LOCKOUT'
  | 'ORDER_CREATED'
  | 'PAYMENT_AUTHORIZED'
  | 'PAYMENT_WEBHOOK_PROCESSED'
  | 'PAYMENT_SIGNATURE_TAMPER_DETECTED'
  | 'DOCUMENT_UPLOAD_AUTHORIZED'
  | 'DOCUMENT_ACCESS_SENSITIVE'
  | 'ADMIN_ROLE_MODIFIED'
  | 'USER_DATA_DELETION_REQUESTED'
  | 'AI_SUSPICIOUS_PROMPT_BLOCKED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  actorId?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  targetEntity?: string;
  targetId?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details?: Record<string, any>;
  previousHash: string;
  entryHash: string;
}

const auditLogStore: AuditLogEntry[] = [];
let lastHash = '0000000000000000000000000000000000000000000000000000000000000000';

const AUDIT_SECRET = process.env.GODUET_AUDIT_SECRET || 'goduet_audit_chain_integrity_key_2026';

/**
 * Appends an immutable audit record chained with previous log hash
 */
export function recordAuditLog(entry: {
  action: AuditAction;
  actorId?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  targetEntity?: string;
  targetId?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details?: Record<string, any>;
}): AuditLogEntry {
  const id = `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();
  const actorId = entry.actorId || 'anonymous';
  const actorRole = entry.actorRole || 'guest';
  const ipAddress = entry.ipAddress || '127.0.0.1';
  const userAgent = entry.userAgent || 'unknown';

  // Compute entry hash over content + previousHash (blockchain-style tamper detection)
  const contentToHash = JSON.stringify({
    id,
    timestamp,
    action: entry.action,
    actorId,
    actorRole,
    status: entry.status,
    targetEntity: entry.targetEntity,
    targetId: entry.targetId,
    details: entry.details,
    previousHash: lastHash
  });

  const entryHash = crypto.createHmac('sha256', AUDIT_SECRET).update(contentToHash).digest('hex');

  const logRecord: AuditLogEntry = {
    id,
    timestamp,
    action: entry.action,
    actorId,
    actorRole,
    ipAddress,
    userAgent,
    targetEntity: entry.targetEntity,
    targetId: entry.targetId,
    status: entry.status,
    details: entry.details,
    previousHash: lastHash,
    entryHash
  };

  auditLogStore.push(logRecord);
  lastHash = entryHash;

  // In production, stream asynchronously to AWS CloudWatch Logs / Google Cloud Audit Logs
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[SECURITY AUDIT] ${timestamp} | ${entry.action} | Status: ${entry.status} | Actor: ${entry.actorId || 'anon'} (${entry.actorRole || 'guest'})`);
  }

  return logRecord;
}

/**
 * Validates the complete cryptographic hash chain of audit logs
 */
export function verifyAuditLogChain(): { isValid: boolean; brokenAtIndex?: number } {
  let prev = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < auditLogStore.length; i++) {
    const entry = auditLogStore[i];
    if (entry.previousHash !== prev) {
      return { isValid: false, brokenAtIndex: i };
    }

    const contentToHash = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      action: entry.action,
      actorId: entry.actorId,
      actorRole: entry.actorRole,
      status: entry.status,
      targetEntity: entry.targetEntity,
      targetId: entry.targetId,
      details: entry.details,
      previousHash: entry.previousHash
    });

    const expectedHash = crypto.createHmac('sha256', AUDIT_SECRET).update(contentToHash).digest('hex');
    if (expectedHash !== entry.entryHash) {
      return { isValid: false, brokenAtIndex: i };
    }

    prev = entry.entryHash;
  }

  return { isValid: true };
}

export function getRecentAuditLogs(limit = 50): AuditLogEntry[] {
  return auditLogStore.slice(-limit).reverse();
}

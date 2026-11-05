/**
 * GoDuet Authentication & Identity Security Module
 * Standards: Argon2id (RFC 9106), Cryptographic OTP (NIST SP 800-63B), Secure Sessions
 */

import argon2 from 'argon2';
import crypto from 'crypto';

export type UserRole = 'customer' | 'restaurant_seller' | 'delivery_partner' | 'admin';

const JWT_SECRET = process.env.GODUET_SESSION_SECRET || 'goduet_super_secret_session_signing_key_hyd_2026_xyz';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// In-memory OTP storage for validation with attempt tracking
// In multi-server production, this connects to Redis with TTL
interface StoredOtpRecord {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  lockedUntil?: number;
}

const otpStore = new Map<string, StoredOtpRecord>();

/**
 * 1. Argon2id Password Hashing
 * Memory-hard function defeating GPU/ASIC brute-force attacks
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 4,    // 4 threads
    hashLength: 32     // 256 bits
  });
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    return false;
  }
}

/**
 * 2. Cryptographically Secure OTP Generation & Verification
 */
export function generateSecureOtp(identifier: string): { otp: string; expiresAt: Date } {
  const cleanId = identifier.trim().toLowerCase();
  const existing = otpStore.get(cleanId);
  const now = Date.now();

  // Check lockout
  if (existing && existing.lockedUntil && existing.lockedUntil > now) {
    const minutesRemaining = Math.ceil((existing.lockedUntil - now) / 60000);
    throw new Error(`SECURITY LOCKOUT: Too many failed verification attempts. Please try again in ${minutesRemaining} minutes.`);
  }

  // Generate 6-digit cryptographically random OTP (never Math.random)
  const otpNumber = crypto.randomInt(100000, 999999);
  const otp = otpNumber.toString();

  // Store hashed OTP to prevent memory inspection leaks
  const hashedOtp = crypto.createHmac('sha256', JWT_SECRET).update(otp).digest('hex');

  otpStore.set(cleanId, {
    hashedOtp,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0
  });

  return {
    otp, // Returned to transport layer (SMS gateway / email)
    expiresAt: new Date(now + OTP_EXPIRY_MS)
  };
}

export function verifySecureOtp(identifier: string, enteredOtp: string): { success: boolean; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const record = otpStore.get(cleanId);
  const now = Date.now();

  if (!record) {
    return { success: false, error: 'No active OTP request found for this identifier. Please request a new code.' };
  }

  // Lockout check
  if (record.lockedUntil && record.lockedUntil > now) {
    const minutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { success: false, error: `Account temporarily locked due to excessive failed attempts. Try again in ${minutes} minutes.` };
  }

  // Expiry check
  if (now > record.expiresAt) {
    otpStore.delete(cleanId);
    return { success: false, error: 'OTP has expired. Please request a new verification code.' };
  }

  // Attempt limit check
  record.attempts += 1;
  if (record.attempts > MAX_OTP_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    return { success: false, error: 'SECURITY ALERT: Maximum OTP verification attempts exceeded. Account locked for 15 minutes.' };
  }

  const enteredHash = crypto.createHmac('sha256', JWT_SECRET).update(enteredOtp.trim()).digest('hex');

  // Constant-time comparison to defeat timing attacks
  const isMatch = crypto.timingSafeEqual(Buffer.from(record.hashedOtp), Buffer.from(enteredHash));

  if (!isMatch) {
    const remaining = MAX_OTP_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Invalid verification code. ${remaining} attempt(s) remaining before account lockout.`
    };
  }

  // Validated successfully -> invalidate immediately to prevent replay
  otpStore.delete(cleanId);
  return { success: true };
}

/**
 * 3. Secure Signed Session Token Management
 */
export interface SessionPayload {
  userId: string;
  emailOrPhone: string;
  role: UserRole;
  isStudent?: boolean;
  issuedAt: number;
  expiresAt: number;
}

export function createSessionToken(userId: string, emailOrPhone: string, role: UserRole, isStudent = false): string {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + (role === 'admin' ? 8 * 3600 : 7 * 24 * 3600); // Admin: 8h, Customer: 7 days

  const payload: SessionPayload = {
    userId,
    emailOrPhone,
    role,
    isStudent,
    issuedAt: now,
    expiresAt: expiry
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || !token.includes('.')) return null;
    const [encodedPayload, signature] = token.split('.');

    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (now > payload.expiresAt) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Cookie options for setting session tokens
 */
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
};

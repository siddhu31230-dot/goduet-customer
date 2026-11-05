/**
 * GoDuet Input Validation & Sanitization Module
 * Standards: OWASP Top 10 A03:2021 Injection Defense, Strict Schema Enforcement
 */

import { z } from 'zod';

// Regex for Indian mobile numbers (supports optional +91, spaces, hyphens)
const INDIAN_PHONE_REGEX = /^(\+91[\-\s]?)?[6789][0-9\s\-]{8,12}$/;

// Password complexity: Min 8 chars, 1 lowercase, 1 uppercase, 1 digit, 1 special char
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~_+=<>]).{8,64}$/;

/**
 * XSS Sanitizer: Neutralizes HTML tags and script injections
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Validation Schemas
 */

export const RegisterInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60).transform(sanitizeString),
  email: z.string().email('Invalid email address').max(100).toLowerCase().trim(),
  phone: z.string().regex(INDIAN_PHONE_REGEX, 'Enter a valid 10-digit Indian mobile number (+91 optional)'),
  password: z.string().regex(
    STRONG_PASSWORD_REGEX,
    'Password must be 8-64 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol'
  ),
  role: z.enum(['customer', 'restaurant_seller', 'delivery_partner']).default('customer')
});

export const LoginInputSchema = z.object({
  identifier: z.string().min(3).max(100).trim(),
  password: z.string().min(1).max(100)
});

export const OtpSendInputSchema = z.object({
  identifier: z.string().min(3, 'Email or mobile number is required').max(100).trim()
});

export const OtpVerifyInputSchema = z.object({
  identifier: z.string().min(3).max(100).trim(),
  otp: z.string().length(6, 'Verification code must be exactly 6 digits').regex(/^\d+$/, 'OTP must be digits only')
});

export const OrderItemInputSchema = z.object({
  menuItemId: z.string().min(1).max(50),
  name: z.string().min(1).max(100).transform(sanitizeString),
  price: z.number().positive(),
  quantity: z.number().int().min(1).max(20),
  restaurantId: z.string().optional(),
  isFreshItem: z.boolean().optional()
});

export const OrderCreateInputSchema = z.object({
  idempotencyKey: z.string().min(16).max(64), // Required to prevent double-charging
  items: z.array(OrderItemInputSchema).min(1, 'Order must contain at least 1 item'),
  restaurantAId: z.string().optional(),
  restaurantBId: z.string().optional(),
  deliveryAddress: z.object({
    flatNo: z.string().min(1).max(120).transform(sanitizeString),
    landmark: z.string().min(1).max(120).transform(sanitizeString),
    locality: z.string().min(1).max(80).transform(sanitizeString),
    city: z.string().default('Hyderabad'),
    pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Hyderabad pincode')
  }),
  paymentMethod: z.enum(['UPI', 'Credit/Debit Card', 'Netbanking', 'Cash on Delivery']),
  appliedCoupon: z.string().max(20).optional(),
  riderTip: z.number().min(0).max(500).default(0),
  deliveryNotes: z.string().max(200).optional().transform(val => val ? sanitizeString(val) : '')
});

export const DocumentUploadRequestSchema = z.object({
  partnerType: z.enum(['delivery_partner', 'restaurant_seller']),
  documentType: z.enum(['driving_licence', 'fssai_licence', 'aadhaar_card', 'pan_card', 'bank_statement']),
  fileName: z.string().min(3).max(100),
  fileSizeBytes: z.number().int().positive().max(5 * 1024 * 1024, 'File size must not exceed 5 MB'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'application/pdf'])
});

export const AiQueryInputSchema = z.object({
  prompt: z.string().min(2).max(500, 'Prompt must not exceed 500 characters').transform(sanitizeString),
  userId: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(500).transform(sanitizeString)
  })).max(10).optional()
});

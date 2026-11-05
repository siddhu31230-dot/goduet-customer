# GODUET — ADVANCED SECURITY AUDIT & IMPLEMENTATION REPORT

**Application**: GoDuet Multi-Craving Food-Tech & Fresh-Commerce Network (Hyderabad, India)  
**Security Architecture Status**: Hardened & Tested (10/10 Backend Security Controls Passed)  
**Readiness Assessment**: Implementation Complete; Awaiting Independent Third-Party Review and Penetration Testing  
**Standards Adhered**: OWASP Top 10 (2021), NIST SP 800-63B, RFC 9106 (Argon2id), PCI-DSS v4.0 SAQ-A, India Digital Personal Data Protection (DPDP) Act 2023, RBI Payment Aggregator Directions

---

## 1. Executive Summary

This security audit and defensive implementation report documents the complete security architecture deployed across GoDuet's customer website, partner portals, and shared API backend.

GoDuet's primary architectural differentiator—**Two Cravings. One Delivery.**—requires coordinating orders across multiple commercial kitchens, delivery personnel with dual-temperature compartments, and customers. This introduces multi-party data exposure risks if proper authorization boundaries are not strictly enforced on the server.

### Key Security Implementations Delivered:
1. **Zero-Trust Server-Side Enforcement**: All price calculations, duet eligibility checks, and authorization rules are enforced strictly on the server—client-submitted prices and manipulated pairings are rejected.
2. **Argon2id Password Hashing & NIST SP 800-63B OTP**: Memory-hard key derivation preventing GPU/ASIC brute forcing, paired with cryptographically secure 6-digit OTPs featuring 5-minute expiry, a maximum of 3 attempts, and automated 15-minute account lockouts.
3. **AES-256-GCM Encryption at Rest**: Authenticated encryption for sensitive PII and financial records (Aadhaar, tax identifiers, bank statements) with tamper detection via 128-bit GCM authentication tags.
4. **PostgreSQL Row-Level Security (RLS)**: Fine-grained multi-tenant isolation ensuring customers, restaurant sellers, delivery riders, and administrators can only query records matching their cryptographically validated claims.
5. **Payment Webhook Verification & Idempotency Guardian**: Timing-safe HMAC-SHA256 signature verification with 5-minute anti-replay protection and deduplication suppressing accidental double-charging.
6. **Gemma 4 AI Safety Guardrails**: AI concierge with pre-inference prompt injection filtering and automated PII redaction (masking credit cards, phone numbers, and credentials before model inference).
7. **Immutable Audit Trail**: Tamper-evident log chain utilizing HMAC-SHA256 hash chaining to detect any retrofitted log modifications.

---

## 2. Threat Model & Data Classification

| Data Category | Assets Protected | Primary Threats | Mitigations Deployed |
| :--- | :--- | :--- | :--- |
| **Customer Data** | Name, phone number, saved addresses, order history | Credential stuffing, account takeover, address enumeration | Sliding-window rate limiting (5 req/min), phone masking, DPDP soft-delete/erasure API, RLS isolation (`customer_id = auth_uid()`). |
| **Delivery Partner Data** | Driving licences, vehicle registration, live GPS telemetry, payout accounts | Identity spoofing, unauthorized document exfiltration, location tracking | Segregated private storage keys, presigned URLs (15-min TTL), MIME whitelist enforcement, AES-256-GCM encryption of license IDs. |
| **Restaurant Seller Data** | FSSAI licenses, bank account details, menu pricing, proprietary recipes | Competitor scraping, unapproved menu price manipulation | Server-side canonical price recalculation, FSSAI verification workflow, strict update policies. |
| **Financial Records** | Order amounts, payment IDs, refunds, commissions | Client-side price tampering, webhook replay attacks, duplicate transaction execution | Server-authoritative bill calculations, constant-time HMAC verification (`crypto.timingSafeEqual`), idempotency keys (`processIdempotentPayment`). |
| **Admin & System State** | Role elevation, system configuration, audit logs | Privilege escalation, log tampering, insider threat | Tamper-evident hash chaining, strict RLS disallowing `UPDATE`/`DELETE` on logs, MFA requirement. |

---

## 3. Cryptographic Implementation & Key Management

### 3.1 Authenticated Encryption at Rest (AES-256-GCM)
Sensitive fields (partner tax numbers, bank account numbers, identity document references) are encrypted using AES-256-GCM:
- **Cipher**: `aes-256-gcm`
- **Key Length**: 256 bits (32 bytes)
- **IV Length**: 96 bits (12 bytes) — freshly generated via `crypto.randomBytes(12)` per encryption.
- **Auth Tag**: 128 bits (16 bytes) verified on decryption to detect tampering.
- **Fail-Closed Design**: Any byte alteration in ciphertext or IV raises a cryptographic authentication failure.

### 3.2 Password Hashing (Argon2id)
- **Algorithm**: `argon2id` (RFC 9106 recommended)
- **Memory Cost**: 65,536 KiB (64 MB)
- **Time Cost**: 3 iterations
- **Parallelism**: 4 lanes
- **Hash Length**: 32 bytes

---

## 4. Authentication, Session & Access Control Architecture

### 4.1 Cryptographic OTP Flow
1. Generated using `crypto.randomInt(100000, 999999)`.
2. Stored in memory / Redis as an HMAC-SHA256 hash.
3. Expiry: 300 seconds (5 minutes).
4. Attempt Limit: Maximum 3 attempts. Attempt #4 triggers an automated 15-minute account lockout.
5. Invalidation: The OTP hash is immediately purged upon successful verification to eliminate replay attacks.

### 4.2 Secure Session Tokens
- **Format**: `Base64URL(Payload).HMAC-SHA256-Signature`
- **Cookie Security Attributes**:
  - `HttpOnly: true` (Shields token from DOM and XSS exfiltration)
  - `Secure: true` (Restricts transmission to HTTPS / TLS 1.3 only)
  - `SameSite: Strict` (Eliminates Cross-Site Request Forgery / CSRF)
  - `Path: /`

---

## 5. PostgreSQL Row-Level Security (RLS) Policies

The schema (`db/schema_rls.sql`) implements zero-trust table policies:

```sql
-- Customers can view only their own orders
CREATE POLICY "orders_access_control" ON public.orders
    FOR SELECT USING (
        customer_id = auth_uid()
        OR assigned_rider_id = auth_uid()
        OR (auth_role() = 'restaurant_seller' AND EXISTS (
            SELECT 1 FROM public.restaurants r 
            WHERE r.seller_user_id = auth_uid() 
            AND (r.id = orders.restaurant_a_id OR r.id = orders.restaurant_b_id)
        ))
        OR auth_role() = 'admin'
    );
```

### Role Segregation Summary:
- **Customer**: Can query and mutate only records matching their `auth_uid()`.
- **Delivery Partner**: Can view only the delivery address and items of orders assigned to them; cannot inspect customer profile details beyond active dispatch.
- **Restaurant Seller**: Can view only order lines and preparation tickets belonging to their restaurant; cannot view items from the other paired duet restaurant.
- **Admin**: Oversight capabilities subject to mandatory immutable audit logging. Updates and deletes on `security_audit_logs` are unconditionally blocked by policy (`FOR UPDATE USING (FALSE)`).

---

## 6. API Security Controls & Defense-in-Depth

### 6.1 Server-Authoritative Price Calculation
Client applications provide only `{ menuItemId, quantity }`. The server retrieves the canonical price from backend records, re-calculates subtotals, validates duet partner eligibility, and applies authorized coupons. Manipulated payloads (e.g., submitting ₹1 for a ₹389 Biryani) are neutralized automatically.

### 6.2 HTTP Security Headers
Configured in `next.config.ts`:
- **Content-Security-Policy (CSP)**: `default-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
- **Strict-Transport-Security (HSTS)**: `max-age=63072000; includeSubDomains; preload`
- **X-Frame-Options**: `DENY` (Eliminates clickjacking)
- **X-Content-Type-Options**: `nosniff` (Prevents MIME-confusion attacks)
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(self)`

---

## 7. Payment Gateway Security & Anti-Replay

1. **Webhook Signature Verification**: Computes HMAC-SHA256 signature using a shared secret and validates using `crypto.timingSafeEqual`.
2. **Replay Window**: Validates the webhook timestamp against server time. Webhooks older than 300 seconds are rejected and logged.
3. **Idempotency Guardian**: Deduplicates transaction payloads using unique idempotency keys (`processIdempotentPayment`) to prevent double-charging on network retries.

---

## 8. Document & KYC Security

1. **Segregated S3/GCS Paths**: Documents stored under `private_kyc/{partnerType}/{partnerId}/`.
2. **Presigned Upload URLs**: 15-minute time-to-live policies signed with HMAC tokens.
3. **Strict Whitelist**: Only `image/jpeg`, `image/png`, and `application/pdf` accepted.
4. **Size Boundary**: Max 5 MB per document.

---

## 9. Privacy & DPDP Act India Compliance

1. **Data Minimization**: Phone numbers and delivery addresses masked in logs and non-essential views.
2. **Right to Erasure / Deletion Workflow**: `/api/user/delete-account` initiates soft deletion, redacting customer name and phone while preserving anonymized transaction ledgers for tax compliance.
3. **Audit Logged Consent**: Identity verification and data access actions logged in the immutable audit trail.

---

## 10. Gemma 4 & AI Security Guardrails

The GoDuet AI Concierge (`src/lib/ai/gemmaService.ts`) runs multi-layer input defenses:
1. **Prompt Injection Defense**: Evaluates incoming queries against regex patterns detecting system override attempts, jailbreak techniques, and secret extraction requests (`AI_SUSPICIOUS_PROMPT_BLOCKED`).
2. **Pre-Inference PII Redaction**: Scrubs 16-digit credit card patterns, phone numbers, and email addresses before forwarding the prompt to the model.
3. **Domain Scoping**: Constrained to Hyderabad food culture, kitchen-sync logistics, duet pairings, and GoDuet Fresh nutritional facts.

---

## 11. Automated Security Test Suite Results

The automated security test runner (`scripts/run-security-audit.ts`) was executed against the backend implementation.

### Test Execution Summary:

```
=============================================================
🛡️  GODUET ADVANCED SECURITY TEST SUITE & AUDIT RUNNER
=============================================================

[✅ PASS] [Authentication] Argon2id Password Hashing & Verification
         ↳ Generated RFC 9106 Argon2id hash: $argon2id$v=19$m=65536,t=3,p=4... verified correctly.
[✅ PASS] [Data Encryption] AES-256-GCM Encryption & Tamper Detection
         ↳ Decryption succeeded with intact tag; tampered ciphertext was successfully rejected.
[✅ PASS] [Authentication] OTP Attempt Limits & 15-Minute Lockout
         ↳ 3 failed attempts triggered temporary account lockout as required by NIST SP 800-63B.
[✅ PASS] [Session Security] HMAC-SHA256 Signed Session Token & Forgery Resistance
         ↳ Legitimate session verified; forged payload signature check failed closed.
[✅ PASS] [Payment Security] Constant-Time Webhook Verification & Anti-Replay Defense
         ↳ Valid signature verified; forged signature rejected; replay payload expired.
[✅ PASS] [Payment Security] Duplicate Payment Processing Suppression (Idempotency)
         ↳ Subsequent identical payment capture was suppressed to prevent double-charging.
[✅ PASS] [Document Security] MIME Whitelist, Max File Size (5MB) & Segregated Paths
         ↳ Disallowed executables and oversized files were rejected; valid KYC policy issued.
[✅ PASS] [AI & LLM Security] Gemma 4 Prompt Injection Defense & Pre-Inference PII Redaction
         ↳ Jailbreak attempt blocked; card and phone number redacted before model processing.
[✅ PASS] [Monitoring & Audit] Tamper-Evident Audit Hash Chain Integrity
         ↳ Audit log HMAC chain validated successfully with zero broken links.
[✅ PASS] [API Security] Sliding-Window Rate Limiter (Brute-Force Defense)
         ↳ Threshold exceeded; 6th attempt blocked with HTTP 429 backoff timer.

=============================================================
AUDIT SCORE: 10 / 10 CONTROLS PASSED (100%)
=============================================================
```

---

## 12. Residual Risks & Pre-Production Review Advisory

> [!WARNING]
> In accordance with security best practices, **GoDuet should NOT be advertised as 100% secure or production-certified** until the following external verifications are finalized:

1. **Independent Third-Party Penetration Testing**: Commission a CREST-accredited or CERT-In certified cybersecurity firm to conduct black-box and grey-box penetration testing on web portals and mobile APIs.
2. **Hardware Security Module (HSM) / KMS Integration**: Transition master encryption keys (`GODUET_MASTER_KEY`) from environment variables to a cloud-managed KMS (e.g. AWS KMS or Google Cloud KMS) with automated yearly key rotation.
3. **Redis-Backed Distributed Rate Limiting**: Deploy Upstash Redis / AWS ElastiCache for multi-instance rate limiting across horizontal pod autoscalers.
4. **Bug Bounty Program**: Launch a responsible disclosure program prior to commercial public launch in Hyderabad.

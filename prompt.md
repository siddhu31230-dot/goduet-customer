# GoDuet — Complete Platform Specification, Features & Architecture (`prompt.md`)

> **Brand:** GoDuet  
> **Tagline:** *Two Cravings. One Delivery.*  
> **Market:** Hyderabad, Telangana, India  
> **Ecosystem:** Customer Web App (`goduet customer `) · Delivery Partner Portal (`goduet delivery `) · Restaurant & Fresh Seller Portal (`Goduet`)  
> **Shared Cloud Backend:** Supabase PostgreSQL + Auth + Storage + Realtime (**AWS Mumbai `ap-south-1`**)

---

## 1. Brand Identity & Core Value Proposition

### 1.1 What is GoDuet?
GoDuet is a Hyderabad-born dual-kitchen food-tech and wellness quick-commerce platform built around one defining promise: **order from up to two compatible partner restaurants in a single synchronized order, alongside GoDuet Fresh daily health essentials, with one rider, dual-thermal compartmentalized bags, and one single delivery fee.**

Instead of forcing households, friends, couples, and campus roommates to compromise on one cuisine or pay double delivery/platform charges across separate apps, GoDuet links nearby kitchens along shared Hyderabad dispatch corridors.

### 1.2 Official Visual Identity & Design System
Defined in `src/app/globals.css` and `src/components/BrandLogo.tsx`:

| Token / Asset | Value / Path | Usage |
| :--- | :--- | :--- |
| **Brand Logo & Symbol** | `public/goduet-logo.png`, `public/goduet-symbol.png` | Official unmodified brand identity across splash, navbar, auth, and footer |
| **Deep Teal (Primary)** | `#197F83` (`--primary-teal`) / `#125e61` (`--primary-teal-dark`) | Primary CTAs, Duet badges, active borders, glass gradients |
| **Charcoal (Secondary)** | `#555653` (`--secondary-charcoal`) | Headings, high-contrast UI chrome, secondary accents |
| **Soft Mint** | `#C3DCD7` (`--mint-bg`) | Brand hero tints, duet pills, subtle highlights |
| **GoDuet Fresh Green** | `#2D8A4E` (`--fresh-green`) | Fresh marketplace badges, cold-pressed & organic tags |
| **Light Surface** | `#FFFFFF` (`--background`) / `#f4f8f7` (`--surface-muted`) | Clean card surfaces and editorial canvas |
| **Dark Mode Palette** | `#0d1413` (`--background`) / `#141e1d` (`--surface-card`) / `#1a2826` (`--surface-muted`) | Full `.dark` theme toggle persisted in `localStorage` (`goduet_theme`) |
| **Visual Language** | `.glass-nav`, `.glass-card`, `.duet-gradient`, `.mint-gradient`, `.duet-pulse` | Rounded cards, soft glassmorphism, smooth transitions, responsive typography (`100dvh`, `overflow-x: hidden`, `viewportFit: cover`) |

---

## 2. Core Platform USP: The Synchronized Duet Engine

Implemented in `src/components/DuetHeroVisual.tsx`, `src/components/InteractiveDuetStudio.tsx`, `src/app/duet-builder/page.tsx`, and `src/context/CartContext.tsx`:

1. **Dual-Kitchen Pairing Rule:** Up to **2 eligible partner restaurants** can be combined into a single order (`duetPartners` corridor validation prevents incompatible cross-city combos and guides swapping).
2. **Route-Sync Corridor Matching:** Kitchens in the same Hyderabad micro-corridor (e.g., *Bawarchi Heritage Dum Biryani* + *The ThickShake Factory* or *Conçù Artisan Patisserie*; *Little Italy Wood-Fired Trattoria* + *The Belgian Waffle Co.*) are synchronized by prep-time delta (~3–4 min pickup gap).
3. **Dual-Thermal Delivery Bags:** Separate insulated chambers keep savory mains piping hot (up to **68°C–70°C**) while chilled shakes, artisanal desserts, and cold-pressed juices stay crisp and cold (**4°C**).
4. **One Rider & Single Delivery Fee:** Customers pay **one unified delivery fee** (`singleDeliveryFee`, e.g., ₹39) instead of two separate delivery charges (`traditionalTwoDeliveryFee`, e.g., ₹85), with savings computed in `BillSummary` (`savingsOnDelivery`).
5. **Dual-Order Checkout Guard:** Server-side order validation (`src/app/api/orders/create/route.ts`) recalculates all line items, packaging fees, platform fees, GST, coupon discounts, and duet eligibility so client-side price manipulation is rejected.

---

## 3. Customer Website (`goduet customer `) — Pages & Features

Built with **Next.js 16.4.5 (App Router + Turbopack)**, **React 19.3.0**, **TypeScript 5**, and **Tailwind CSS v4**.

### 3.1 Complete Route Map (`src/app/`)

| Route | Purpose & Implemented Capabilities |
| :--- | :--- |
| `/` (`src/app/page.tsx`) | Redesigned landing showcase: sticky promo strip (`DUETFIRST`), Hero section with `DuetHeroVisual`, 6 Feature Highlight cards, Popular Cravings cuisine grid, `InteractiveDuetStudio`, Featured Duet Restaurants, GoDuet Fresh spotlight, 10 Hyderabad Local Hubs, Student Privilege banner, 4-Step How It Works, Testimonials (*Ananya Reddy*, *Vikramaditya Rao*, *Sravani K.*), Interactive FAQ accordion |
| `/restaurants` | Full partner restaurant directory with cuisine filters, pure-veg / duet-eligible filtering, ratings, distance, and prep/delivery ETA |
| `/restaurant/[id]` | Restaurant storefront banner, duet pairing suggestions (`duetPartners`), categorized menu, Veg/Non-Veg indicators, prep time, and Add-to-Duet-Cart controls |
| `/duet-builder` | Step-by-step interactive Dual-Craving Builder for selecting Kitchen A + Kitchen B along shared Hyderabad dispatch corridors |
| `/fresh` | **GoDuet Fresh** wellness marketplace across 6 curated health categories (Fresh Juices, Herbal Juices, Sprouts, Seeds, Healthy Snacks, Homemade Products) |
| `/offers` | Promo & combo hub featuring verified discount codes: `DUETFIRST` (Flat ₹100 OFF default first-duet promo), `STUDENT15`, `HYDDUET`, `NIGHTDUET` |
| `/student` | **GoDuet Campus Privilege Program** for Hyderabad colleges (IIIT Hyderabad, HCU, BITS Pilani Hyderabad, ISB, Osmania University, Mahindra University, JNTU Hyderabad, CBIT, VNR VJIET): flat 15% student discount, zero delivery above ₹299, hostel room delivery till 3:00 AM, instant verification form |
| `/cart` | Split-kitchen cart inspector showing Restaurant A + Restaurant B + GoDuet Fresh items, delivery fee savings vs. traditional separate orders, coupon application, and itemized `BillSummary` |
| `/checkout` | Address selector (with saved Hyderabad delivery addresses), delivery instructions/tip, payment options (**UPI** — GPay / PhonePe / Paytm, **Card**, **Cash on Delivery / COD**), and server-validated order creation |
| `/order-confirmation/[orderId]` | Post-checkout live timeline & split-kitchen dispatch confirmation with confetti celebration (`canvas-confetti`) |
| `/dashboard` & `/profile` | Full **8-Tab Customer Dashboard** (`overview`, `orders`, `tracking`, `addresses`, `favorites`, `student`, `profile`, `support`) |
| `/login` | Dedicated sign-in experience supporting **Password login** and **Phone OTP login** via Supabase Auth / secure API fallback |
| `/register` | Customer onboarding form creating role-linked user accounts (`customer`) |
| `/verify-otp` | 6-digit OTP verification flow with countdown timer & attempt limits |
| `/forgot-password` & `/reset-password` | Account recovery flow integrated with Supabase Auth email/recovery links |
| `/how-it-works` | Deep dive into GoDuet's dual-kitchen route synchronization and dual-thermal bags |
| `/about` | Brand story, Hyderabad operational mission, and food-tech vision |

### 3.2 Shared UI Components (`src/components/`)

- **`Navbar.tsx`**: Sticky top announcement bar, `BrandLogo`, Hyderabad zone/location modal trigger, primary nav links (`Home`, `Restaurants`, `GoDuet Fresh`, `Duet Builder`, `How It Works`, `Offers`, `Student Perks`, `About`), search access, Light/Dark theme toggle, `Order Now`, `Cart` pill with `2 Kitchens` counter badge, `Login` / `Sign Up` or `Dashboard` menu, and responsive mobile drawer.
- **`MobileBottomNav.tsx`**: Mobile-first fixed dock (`Home`, `Restaurants`, prominent center `DUET` CTA, `Fresh`, `Cart` with badge, `Account` / `Sign In`) with `env(safe-area-inset-bottom)` iOS/Android notch support.
- **`BrandSplash.tsx`**, **`LocationModal.tsx`**, **`AuthModal.tsx`**, **`RestaurantCard.tsx`**, **`FreshProductCard.tsx`**, **`GemmaAIAssistant.tsx`**, **`Footer.tsx`**.
- **Global Contexts (`src/context/`)**: `AuthContext.tsx`, `CartContext.tsx`, `LocationContext.tsx`, `ToastContext.tsx`.

---

## 4. Curated Hyderabad Catalog & Hyperlocal Hubs

Defined in `src/data/mockData.ts`:

### 4.1 Served Hyderabad Localities (10 Hubs Across 4 Zones)
- **Central Hyderabad:** Jubilee Hills (`500033`), Banjara Hills (`500034`)
- **Cyberabad:** Hitec City (`500081`), Madhapur (`500081`), Gachibowli (`500032`), IIIT Hyderabad Campus (`500032`)
- **West Hyderabad:** Kondapur (`500084`), Kukatpally (`500072`)
- **North Hyderabad:** Begumpet (`500016`), Secunderabad (`500003`)

### 4.2 Featured Partner Restaurants
1. **Bawarchi Heritage Dum Biryani** — Biryani, Mughlai, North Indian (*Nizami Mutton Dum Biryani, Special Chicken Dum Biryani, Chicken 65, Shahi Paneer Subz Dum Biryani, Classic Double Ka Meetha*)
2. **Conçù Artisan Patisserie & Café** — Artisan desserts & coffee (*Signature Roman Tiramisu Jar, Dark Chocolate Truffle Tartlet, Spanish Iced Latte, Box of 6 Parisian Macarons*)
3. **The ThickShake Factory** — Thick shakes (*Belgian Chocolate Super Thick Shake, Ferrero Rocher Hazelnut Dream, Alphonso Mango Real Pulp Shake*)
4. **Little Italy Wood-Fired Trattoria** — Wood-fired pizzas & pasta (*Tartufata Truffle & Wild Mushroom Pizza, Quattro Formaggi Four Cheese Pizza, Penne alla Vodka*)
5. **The Hyderabad Smash Burger Co.** — Smash burgers & sides (*Double Bacon-Cheddar Smash Burger, Crispy Korean Gochujang Fried Chicken Burger, Truffle Parmesan Crinkle Fries*)
6. **Chutneys Heritage South Indian** — Heritage South Indian (*Guntur Karam Butter Steam Idli, Babai Hotel Ghee Paneer Dosa, Degree Filter Kaapi*)
7. **The Belgian Waffle Co.** — Crispy waffles (*Triple Chocolate Overload Waffle, Red Velvet Cream Cheese Waffle*)

### 4.3 GoDuet Fresh Daily Health Catalog
- **Pure Cold-Pressed Valencia Orange Juice** (*SunFresh Orchard Press Hyderabad*)
- **Vedic Green Wheatgrass & Amla Elixir** (*Prakriti Herbs & Wellness*)
- **Hyd-Pancharatna 5-Pulse Mixed Sprouts** (*Telangana Bio-Sprouts Collective*)
- **Roasted 4-Seed Superfood Crunch** (*Naturale Superfoods India*)
- **Raw A2 Gir Cow Vedic Bilona Ghee** (*GauKripa Vedic Dairy Sanctuary*)
- **Spiced Pomegranate & Beetroot Cold-Pressed Sparkler** (*SunFresh Orchard Press Hyderabad*)

---

## 5. Gemma 4 AI Food Concierge & Fast2SMS Architecture

### 5.1 Gemma 4 AI Intelligence (`src/lib/ai/gemmaService.ts` + `/api/ai/assistant`)
- **Capabilities:** Suggests corridor-compatible Duet pairings (e.g., *Bawarchi Biryani* + *ThickShake Factory* / *Conçù*; *Little Italy* + *Belgian Waffle Co.*), recommends GoDuet Fresh wellness items, and links directly to `/duet-builder` or `/fresh`.
- **AI Safety Guardrails:**
  - `sanitizeAndRedactPrompt()` blocks known prompt-injection and jailbreak patterns (`ignore previous instructions`, `system override`, `developer mode`, `reveal api key`, `dan mode`, etc.) and logs blocked attempts via `recordAuditLog()`.
  - Pre-inference PII redaction automatically masks card numbers (`[CARD_REDACTED]`), Indian mobile numbers (`[PHONE_REDACTED]`), and email addresses (`[EMAIL_REDACTED]`).

### 5.2 Fast2SMS Integration (`src/lib/sms/fast2sms.ts`)
- Normalizes Indian phone numbers (`+91` / 10-digit `[6-9]\d{9}`).
- Uses Fast2SMS (`https://www.fast2sms.com/dev/bulkV2`) with an explicit billing safety switch: **`ENABLE_LIVE_SMS_BILLING`** defaults to disabled (simulation mode) until explicitly approved and funded with `FAST2SMS_API_KEY`.

---

## 6. Three-Website Shared Ecosystem

All three portals connect to **one shared Supabase project in AWS Mumbai (`ap-south-1`)** — zero duplicate databases:

| Portal | Folder | Tech Stack | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **1. Customer Website** | `goduet customer ` | Next.js 16.4.5, React 19, TypeScript, Tailwind CSS v4, `@supabase/supabase-js` | Dual-kitchen discovery, Duet Builder, GoDuet Fresh, Cart & Checkout, 8-tab Dashboard, Student Perks, Gemma 4 AI |
| **2. Delivery Partner Portal** | `goduet delivery ` | Next.js 16.4.5, React 19, TypeScript, Tailwind CSS v4, `@supabase/supabase-js` | Rider onboarding (`/register`), KYC document vault, live pickup/dispatch tracking (`/track`, `/dashboard`), Fast2SMS alerts, admin oversight (`/admin`), support (`/support`) |
| **3. Restaurant & Fresh Seller Portal** | `Goduet` | Vite 6.2.0, React 18.3.1, TypeScript, Tailwind CSS v3, `@supabase/supabase-js` | Dual Marketplace (`FoodDeliveryView`, `FreshMarketplaceView`), `DuetPairingSimulator`, `LiveOrderTrackerModal`, `SmartCartDrawer`, `PartnerPortals`, `GroupOrderModal`, FSSAI/GST KYC vault |

### Five Unified Platform Roles (`user_role_enum`)
1. `customer`
2. `delivery_partner`
3. `restaurant_seller`
4. `fresh_seller`
5. `admin`

---

## 7. Shared Supabase Backend & Database Schema (`db/unified_master_schema.sql`)

### 7.1 Database Enums (6)
- `user_role_enum` (`customer`, `delivery_partner`, `restaurant_seller`, `fresh_seller`, `admin`)
- `order_status_enum` (`placed`, `confirmed`, `preparing`, `ready_for_pickup`, `picked_up`, `in_transit`, `delivered`, `cancelled`, `refunded`)
- `payment_status_enum` (`pending`, `authorized`, `captured`, `failed`, `refunded`)
- `kyc_status_enum` (`unverified`, `pending_review`, `approved`, `rejected`)
- `vehicle_type_enum` (`bicycle`, `scooter`, `motorcycle`, `ev_two_wheeler`)
- `support_ticket_status_enum` (`open`, `in_progress`, `resolved`, `closed`)

### 7.2 Core PostgreSQL Tables (16)
1. `profiles` — Base user record synced automatically from `auth.users` via `handle_new_user()` trigger
2. `user_roles` — Explicit role assignments per user ID
3. `addresses` — Customer saved Hyderabad delivery locations
4. `restaurants` — Partner kitchens, coordinates, duet eligibility, FSSAI metadata
5. `restaurant_menus` — Categorized dishes, veg/non-veg type, canonical pricing, prep times
6. `fresh_sellers` — Verified wellness/farm/homemade vendors
7. `fresh_products` — Cold-pressed juices, herbal tonics, sprouts, seeds, A2 dairy
8. `delivery_partners` — Rider profile, vehicle type, dual-thermal bag status, KYC status, live availability/telemetry
9. `combined_order_groups` — Master Duet parent group linking Kitchen A + Kitchen B + Rider + savings calculation
10. `orders` — Order header, customer, restaurants, assigned rider, status, payment method/status, itemized totals
11. `order_items` — Canonical line-item snapshots (`quantity`, `unit_price`, vendor reference)
12. `payments` — Gateway transaction IDs, signature/idempotency tracking, status
13. `payouts` — Automated split settlements across Kitchen A, Kitchen B, Fresh Sellers, and Delivery Partners
14. `notifications` — Multi-portal status alerts
15. `support_tickets` — Customer, rider, and seller support workflows
16. `audit_logs` — Immutable hash-chained audit ledger (`UPDATE`/`DELETE` unconditionally blocked by RLS)

### 7.3 Private & Public Storage Buckets (4)
- `partner-vault-private` — Rider Driving Licence, RC, Aadhaar/KYC docs (private signed URLs, 15-min TTL)
- `seller-vault-private` — FSSAI certificates, GST, bank passbooks (private)
- `customer-vault-private` — Student ID verification & sensitive customer uploads (private)
- `public-catalog-media` — Restaurant banners, dish images, Fresh product photos (public read)

### 7.4 Realtime Subscriptions
Enabled on: `orders`, `combined_order_groups`, `delivery_partners`, and `notifications`.

---

## 8. Security & Compliance Architecture

Detailed across `src/lib/security/*`, `next.config.ts`, `db/unified_master_schema.sql`, and `SECURITY_AUDIT_REPORT.md`:

| Security Layer | Implementation File(s) | Protection Details |
| :--- | :--- | :--- |
| **Password Hashing** | `src/lib/security/crypto.ts` | **Argon2id** (RFC 9106: 65,536 KiB memory, 3 iterations, 4 lanes, 32-byte hash) |
| **Data Encryption at Rest** | `src/lib/security/crypto.ts` | **AES-256-GCM** with 96-bit random IV & 128-bit GCM auth tag for PII/tax/bank fields; fail-closed decryption |
| **Session & OTP Hardening** | `src/lib/security/auth.ts`, `/api/auth/otp/*` | HMAC-SHA256 signed cookies (`HttpOnly`, `Secure`, `SameSite=Strict`), `crypto.randomInt` 6-digit OTPs (5-min expiry, max 3 attempts, 15-min lockout) |
| **Rate Limiting** | `src/lib/security/rateLimiter.ts` | Sliding-window rate limiting on login/OTP endpoints (e.g., 5 req/min) |
| **Input & Price Validation** | `src/lib/security/validator.ts`, `/api/orders/create` | Strict Zod schemas + zero-trust server-side canonical price & duet-pairing recalculation |
| **Payment Security** | `src/lib/security/paymentSecurity.ts`, `/api/payments/webhook` | Constant-time HMAC-SHA256 webhook verification (`crypto.timingSafeEqual`), 5-min anti-replay check, idempotency deduplication |
| **Document Security** | `src/lib/security/documentSecurity.ts`, `/api/documents/upload-url` | MIME allowlist, file-size validation, private Supabase Storage signed URLs |
| **Audit Logging** | `src/lib/security/auditLogger.ts` | Tamper-evident HMAC-SHA256 hash-chained audit logs; RLS blocks edits/deletes |
| **Row-Level Security (RLS)** | `db/unified_master_schema.sql` | `auth_uid()` and `is_admin()` helper predicates isolating customer, rider, seller, and admin queries |
| **HTTP Security Headers & CSP** | `next.config.ts` | Strict HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, CSP whitelisting `'self'`, Unsplash (`images.unsplash.com`), `*.supabase.co`, and `api.goduet.in` |
| **DPDP Act 2023 Readiness** | `/api/user/delete-account` | Right-to-erasure / soft-delete workflow + PII masking across logs & AI queries |

---

## 9. Environment Configuration & Multi-Device Operations

### 9.1 Required Environment Variables (`.env.local` — Git-Ignored)
**Frontend-safe variables:**
- `NEXT_PUBLIC_SUPABASE_URL` — Shared AWS Mumbai Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and/or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) — Public client key validated by `validateSupabaseEnv()` & `isSupabaseLiveConfigured()` in `src/lib/supabase/client.ts`

**Server-only secrets (NEVER prefixed with `NEXT_PUBLIC_`):**
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET` / `ENCRYPTION_MASTER_KEY`
- `FAST2SMS_API_KEY` & `ENABLE_LIVE_SMS_BILLING=false`

> Use `scripts/sync-supabase-env.ts` to keep environment templates aligned across all 3 portals without leaking service-role keys into frontend bundles.

### 9.2 Key Commands & Verification
```bash
# Install dependencies
npm install

# Run development server (binds cleanly for mobile/tablet testing on local Wi-Fi)
HOSTNAME=0.0.0.0 PORT=3001 npm run dev

# Build production Next.js 16 bundle (verifies all 32 App Router + API routes)
npm run build

# Start multi-device production server accessible across phones, tablets & laptops on the same LAN
HOSTNAME="0.0.0.0" PORT=3001 npm start

# Test shared Supabase configuration & connectivity
npx tsx scripts/test-supabase-connectivity.ts
```

### 9.3 Next.js 16 Image & Multi-Device Configuration (`next.config.ts` & `src/app/layout.tsx`)
- **`images.remotePatterns`**: Explicitly permits `images.unsplash.com`, `**.unsplash.com`, and `**.supabase.co` so `/_next/image` renders crisp food and fresh-product photos on all devices without 400 errors.
- **Responsive Viewport (`Viewport` export in `src/app/layout.tsx`)**: Configured with `width: 'device-width'`, `initialScale: 1`, `maximumScale: 5`, and `viewportFit: 'cover'` for phones, tablets, foldables, and desktops.

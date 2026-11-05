# GODUET — Two Cravings. One Delivery.

> **Hyderabad's Premier Food-Tech and Fresh-Products Network**  
> *More Choice. Smarter Orders. Better Value.*

---

## 🌟 Brand Identity & Official Assets

- **Brand Name**: GODUET
- **Official Tagline**: *"Two Cravings. One Delivery."*
- **Market**: Hyderabad, Telangana, India
- **Official Source of Truth Logo**: Used directly from the uploaded brand asset without distortion, redesign or replacement (`public/goduet-logo.png` & `public/goduet-symbol.png`).
- **Brand Palette (Sampled Directly from Official Logo)**:
  - **Primary**: Deep Teal (`#1f757a` / dark `#15575b` / soft tint `#e6f1f0`)
  - **Secondary**: Charcoal Grey (`#4f504c` / dark `#2d2e2c`)
  - **Background**: Soft Mint Green (`#c0d4d0` / soft tint `#e3edea` / `#f3f8f6`)
  - **Supporting Backgrounds**: Crisp White (`#ffffff`) and Warm Off-White (`#fafcfb`)
- **Typography**: Clean, elegant, modern sans-serif (`Inter` / `Geist Sans`)

---

## 🚀 Key Features Built

### 1. Signature Two-Restaurant Ordering (The Core USP)
- **Interactive Duet Studio**: Select Restaurant 1 (Main meal e.g., Bawarchi Biryani) + Select compatible Restaurant 2 (Sweet/Beverage e.g., The ThickShake Factory or Conçù Patisserie).
- **Corridor Compatibility Engine**: Ensures pairing is permitted only when route transit buffer (≤ 2.5 km) and cooking prep times overlap synchronously.
- **Dynamic Kitchen Stagger**: Kitchens are triggered on staggered timers so both dishes finish packing at the exact moment the rider arrives.
- **Dual-Thermal Compartment Delivery**: Hot chamber (65°C+) keeps biryanis, pizzas, and dosas piping hot; Cryo chamber (2°C - 5°C) keeps shakes, juices, and desserts chilled.
- **Single Delivery Fee**: Transparent pricing—customers pay **one single delivery charge** (₹39 or free with offers) saving ₹50 to ₹70 compared to two separate app orders.

### 2. GoDuet Fresh Marketplace
- Premium vertical with a clean mint-green aesthetic.
- **Categories**: Cold-Pressed Juices, Herbal Wellness Elixirs, Live Organic Sprouts, Superfood Seeds, Healthy Snacks, Artisanal Gir Cow Ghee.
- **Farm Fresh Guarantee**: Batched and cold-pressed every morning at 6:00 AM from Telangana organic farmer cooperatives (Shamshabad, Medchal, Kompally).

### 3. Student Experience ("Good Food. Better Student Deals.")
- Instant campus verification for Hyderabad universities (IIIT Hyderabad, UoH, BITS Pilani Hyderabad, ISB, Osmania, Mahindra University).
- **Perks**: Flat 15% discount code (`STUDENT15`), free delivery on orders > ₹299, and late-night hostel corridor deliveries active until 3:00 AM.

### 4. Complete Customer Experience & Architecture
- **Hyderabad Locality Selector**: Switch easily between Jubilee Hills, Banjara Hills, Hitec City, Madhapur, Gachibowli, Kondapur, Begumpet, Secunderabad, and IIIT Campus.
- **Restaurant Discovery**: Search by name, cuisine (Biryani, Pizza, Burgers, South Indian, North Indian, Chinese, Desserts, Beverages, Snacks), rating, veg-only, and Duet-Ready filters.
- **Restaurant Menu & Add-ons**: Rich categorization, item customization, veg/non-veg indicators, calorie & prep time metadata.
- **Multi-Restaurant Shopping Cart**: Distinct item sections for Restaurant A, Restaurant B, and GoDuet Fresh, cutlery toggle, delivery instructions, and tip selector.
- **Checkout & Payments**: UPI (GPay, PhonePe, Paytm, CRED), Cards, Net Banking, and Cash on Delivery.
- **Celebratory Order Tracking**: Confetti celebration, live multi-kitchen prep tracker, assigned rider card, simulated route map, and printable tax invoice.
- **Profile & Authentication**: Demo phone/email OTP login, student status badge, saved addresses, and past order history.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Partial Prerendering)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom brand color tokens
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **State Management**: React Context (`CartContext`, `LocationContext`, `AuthContext`) with `localStorage` persistence

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
# or on port 3001:
PORT=3001 npm run dev
```

### Production Build & Server
```bash
npm run build
PORT=3001 npm start
```

Visit the website at: **[http://localhost:3001](http://localhost:3001)**

-- ============================================================================
-- GODUET UNIFIED MASTER BACKEND SCHEMA & ROW-LEVEL SECURITY (RLS)
-- Platform: Supabase / PostgreSQL 15+
-- Ecosystem:
--   1. Customer App (Food + Fresh Duet Commerce)
--   2. Delivery Partner App (Hyderabad Rider Recruitment & Live Trips)
--   3. Restaurant & Fresh-Product Seller Portals
--   4. Unified Operations & Compliance Admin Portal
-- Architecture: Multi-tenant, Least-Privilege, Mobile-Ready (React Native/Flutter/iOS/Android)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMERATED TYPES
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'customer',
        'delivery_partner',
        'restaurant_seller',
        'fresh_seller',
        'admin'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM (
        'placed',
        'confirmed',
        'preparing',
        'rider_assigned',
        'picking_up_a',
        'picking_up_b',
        'on_the_way',
        'delivered',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'initiated',
        'authorized',
        'captured',
        'failed',
        'refunded'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status_enum AS ENUM (
        'submitted',
        'verification_pending',
        'documents_required',
        'approved',
        'rejected'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_type_enum AS ENUM (
        'motorcycle',
        'scooter',
        'ev_2wheeler',
        'bicycle'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 3. PROFILES & USER ACCOUNTS (Linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL DEFAULT 'customer',
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete for DPDP Act compliance
);

-- Trigger to automatically create profile on Supabase auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'GoDuet User'),
        COALESCE(new.phone, new.raw_user_meta_data->>'phone', ''),
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::user_role_enum, 'customer'::user_role_enum)
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. CUSTOMER PROFILES & ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    address_label TEXT NOT NULL DEFAULT 'Home', -- 'Home', 'Work', 'Hostel'
    flat_no TEXT NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT,
    locality TEXT NOT NULL, -- e.g. 'Hitec City', 'Gachibowli'
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    pincode VARCHAR(6) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student verification program (exclusive Hyderabad campus discounts)
CREATE TABLE IF NOT EXISTS public.student_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    campus_name TEXT NOT NULL, -- 'IIIT Hyderabad', 'ISB', 'JNTU Hyderabad'
    student_id_number_encrypted TEXT NOT NULL,
    status kyc_status_enum NOT NULL DEFAULT 'submitted',
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SELLERS: RESTAURANTS & FRESH-PRODUCT PRODUCERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES public.profiles(id),
    seller_type user_role_enum NOT NULL CHECK (seller_type IN ('restaurant_seller', 'fresh_seller')),
    business_name TEXT NOT NULL,
    trade_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    fssai_license_number TEXT NOT NULL,
    commission_rate_percentage NUMERIC(4, 2) NOT NULL DEFAULT 8.00, -- Proposed 8% GoDuet rate vs 28% legacy
    locality TEXT NOT NULL, -- 'Hitec City', 'Madhapur', 'Jubilee Hills'
    full_address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_pure_veg BOOLEAN NOT NULL DEFAULT FALSE,
    is_duet_eligible BOOLEAN NOT NULL DEFAULT TRUE, -- Can be paired in 'Two Cravings' multi-order
    avg_prep_time_minutes INT NOT NULL DEFAULT 15,
    is_accepting_orders BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    banner_image_url TEXT,
    logo_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Corridor pairing table (specifies which sellers share efficient physical corridors)
CREATE TABLE IF NOT EXISTS public.duet_compatible_corridors (
    seller_a_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    seller_b_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    corridor_name TEXT NOT NULL, -- 'Madhapur-Inorbit Metro Corridor'
    distance_between_km NUMERIC(4, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (seller_a_id, seller_b_id)
);

-- Food & Fresh Catalog Items
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    item_type user_role_enum NOT NULL CHECK (item_type IN ('restaurant_seller', 'fresh_seller')),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Biryani', 'Juices', 'Microgreens', 'Sprouts', 'Chia Seeds'
    price_paisa INT NOT NULL CHECK (price_paisa > 0), -- Stored in Paisa (e.g. 35000 = Rs 350)
    image_url TEXT,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    weight_or_volume TEXT, -- e.g. '350 ml', '250 g'
    prep_time_minutes INT NOT NULL DEFAULT 15,
    customizations_schema JSONB, -- Variations, add-ons
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. DELIVERY PARTNERS: HYDERABAD FLEET
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'GD-HYD-7821'
    preferred_zone TEXT NOT NULL, -- 'Hitec City & Madhapur'
    vehicle_type vehicle_type_enum NOT NULL DEFAULT 'motorcycle',
    vehicle_registration_number VARCHAR(50) NOT NULL,
    driving_licence_number VARCHAR(100),
    encrypted_bank_account TEXT, -- AES-256-GCM encrypted
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(150),
    upi_id VARCHAR(100),
    kyc_status kyc_status_enum NOT NULL DEFAULT 'submitted',
    rejection_reason TEXT,
    admin_notes TEXT,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    current_latitude NUMERIC(10, 7),
    current_longitude NUMERIC(10, 7),
    last_ping_at TIMESTAMPTZ,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
    total_trips_completed INT NOT NULL DEFAULT 0,
    welcome_kit_delivered BOOLEAN NOT NULL DEFAULT FALSE,
    orientation_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payout Policies (Managed by Operations Admin)
CREATE TABLE IF NOT EXISTS public.partner_payout_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
    base_payout_target_paisa INT NOT NULL DEFAULT 5000, -- Min Rs 50 proposed per completed order
    per_km_after_3km_paisa INT NOT NULL DEFAULT 1200,   -- Rs 12/km
    peak_surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.35,
    rain_allowance_paisa INT NOT NULL DEFAULT 2500,     -- Rs 25
    dual_order_bonus_paisa INT NOT NULL DEFAULT 2000,   -- Rs 20 extra for 'Two Cravings' batch
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payout Disbursals Ledger
CREATE TABLE IF NOT EXISTS public.partner_payout_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES public.delivery_partners(id),
    cycle_label VARCHAR(100) NOT NULL, -- '27 Oct - 02 Nov 2026'
    trips_count INT NOT NULL DEFAULT 0,
    base_amount_paisa INT NOT NULL DEFAULT 0,
    incentives_paisa INT NOT NULL DEFAULT 0,
    tips_paisa INT NOT NULL DEFAULT 0,
    total_gross_paisa INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'SETTLED', 'FAILED')),
    settlement_date DATE,
    reference_utr VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. THE CORE "TWO CRAVINGS. ONE DELIVERY." ORDER ENGINE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'GD-ORD-8942'
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    is_duet_order BOOLEAN NOT NULL DEFAULT FALSE,
    pickup_seller_a_id UUID NOT NULL REFERENCES public.sellers(id),
    pickup_seller_b_id UUID REFERENCES public.sellers(id), -- Second pickup for duet orders
    assigned_rider_id UUID REFERENCES public.delivery_partners(id),
    status order_status_enum NOT NULL DEFAULT 'placed',
    
    -- Canonical Financial Breakdown (Server-calculated in Paisa)
    items_subtotal_paisa INT NOT NULL,
    single_delivery_fee_paisa INT NOT NULL, -- Customer pays single delivery fee even for 2 pickups
    packaging_fee_paisa INT NOT NULL,
    platform_fee_paisa INT NOT NULL DEFAULT 500, -- Rs 5.00
    gst_charges_paisa INT NOT NULL,
    discount_paisa INT NOT NULL DEFAULT 0,
    rider_tip_paisa INT NOT NULL DEFAULT 0,
    final_total_paisa INT NOT NULL,
    
    -- Delivery Logistics
    delivery_address_json JSONB NOT NULL,
    customer_instructions TEXT,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    estimated_delivery_time TIMESTAMPTZ,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.sellers(id),
    catalog_item_id UUID NOT NULL REFERENCES public.catalog_items(id),
    item_name TEXT NOT NULL,
    unit_price_paisa INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_paisa INT NOT NULL,
    customizations_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. PAYMENT & SETTLEMENT TRANSACTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id),
    gateway_name VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY', -- 'RAZORPAY', 'STRIPE', 'UPI'
    gateway_payment_id VARCHAR(128) UNIQUE,
    amount_paisa INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'UPI', 'CARD', 'NETBANKING'
    status payment_status_enum NOT NULL DEFAULT 'initiated',
    gateway_signature_hash TEXT,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    settled_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 9. SECURE DOCUMENT STORAGE VAULT (Aadhaar, DL, RC, FSSAI)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_role user_role_enum NOT NULL,
    document_type TEXT NOT NULL, -- 'aadhaar', 'pan', 'driving_licence', 'vehicle_rc', 'fssai_cert', 'bank_statement'
    encrypted_document_number TEXT,
    storage_bucket TEXT NOT NULL DEFAULT 'partner-vault-private',
    storage_path TEXT NOT NULL, -- Private S3/Supabase path, requires HMAC signed URL
    file_mime_type VARCHAR(100) NOT NULL,
    file_size_bytes INT NOT NULL,
    verification_status kyc_status_enum NOT NULL DEFAULT 'submitted',
    verified_by_admin UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    rejection_notes TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. SECURITY AUDIT LOGS (Immutable Cryptographic Hash Chain)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action VARCHAR(100) NOT NULL,
    actor_id UUID,
    actor_role VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    target_entity VARCHAR(60),
    target_id VARCHAR(128),
    status VARCHAR(20) NOT NULL,
    details JSONB,
    previous_hash VARCHAR(64) NOT NULL,
    entry_hash VARCHAR(64) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duet_compatible_corridors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_payout_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_payout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.auth_uid() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION public.auth_role() RETURNS user_role_enum AS $$
    SELECT (NULLIF(current_setting('request.jwt.claim.role', true), 'customer'))::user_role_enum;
$$ LANGUAGE SQL STABLE;

-- Profiles Policy: Users see own profile; Admins see all
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (id = auth_uid() OR auth_role() = 'admin');

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (id = auth_uid() OR auth_role() = 'admin');

-- Addresses: Customers manage only their own addresses
CREATE POLICY "Customers own addresses" ON public.customer_addresses
    FOR ALL USING (user_id = auth_uid() OR auth_role() = 'admin');

-- Sellers & Menus: Public read active catalogs; Sellers manage only their own
CREATE POLICY "Public read active sellers" ON public.sellers
    FOR SELECT USING (is_accepting_orders = TRUE OR owner_user_id = auth_uid() OR auth_role() = 'admin');

CREATE POLICY "Sellers manage own store" ON public.sellers
    FOR ALL USING (owner_user_id = auth_uid() OR auth_role() = 'admin');

CREATE POLICY "Public read catalog" ON public.catalog_items
    FOR SELECT USING (is_available = TRUE OR EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND owner_user_id = auth_uid()) OR auth_role() = 'admin');

CREATE POLICY "Sellers manage own catalog items" ON public.catalog_items
    FOR ALL USING (EXISTS (SELECT 1 FROM public.sellers WHERE id = seller_id AND owner_user_id = auth_uid()) OR auth_role() = 'admin');

-- Delivery Partners: Riders read/update own shift & profile; Admins full review
CREATE POLICY "Riders read own profile" ON public.delivery_partners
    FOR SELECT USING (id = auth_uid() OR auth_role() = 'admin');

CREATE POLICY "Riders update own location/shift" ON public.delivery_partners
    FOR UPDATE USING (id = auth_uid() OR auth_role() = 'admin');

-- Orders: Customer reads own orders; Assigned rider reads their active deliveries;
-- Sellers read orders with items from their restaurant/farm; Admin reads all
CREATE POLICY "Customers view own orders" ON public.orders
    FOR SELECT USING (customer_id = auth_uid());

CREATE POLICY "Riders view assigned orders" ON public.orders
    FOR SELECT USING (assigned_rider_id = auth_uid());

CREATE POLICY "Sellers view own order pickups" ON public.orders
    FOR SELECT USING (pickup_seller_a_id IN (SELECT id FROM public.sellers WHERE owner_user_id = auth_uid()) OR pickup_seller_b_id IN (SELECT id FROM public.sellers WHERE owner_user_id = auth_uid()));

CREATE POLICY "Admins manage all orders" ON public.orders
    FOR ALL USING (auth_role() = 'admin');

-- Partner Documents: Strict private vault. Only owner and verified admins can access
CREATE POLICY "Document owner and admin access" ON public.partner_documents
    FOR ALL USING (owner_user_id = auth_uid() OR auth_role() = 'admin');

-- Audit Logs: System append-only; Read restricted to verified administrators
CREATE POLICY "Admins read audit logs" ON public.security_audit_logs
    FOR SELECT USING (auth_role() = 'admin');

CREATE POLICY "System insert audit logs" ON public.security_audit_logs
    FOR INSERT WITH CHECK (TRUE);

-- ----------------------------------------------------------------------------
-- 12. SUPABASE REALTIME CONFIGURATION
-- ----------------------------------------------------------------------------
-- Enable Realtime publication for dynamic order tracking and dispatch
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_partners;

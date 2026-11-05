-- ============================================================================
-- GODUET PHASE 1 — UNIFIED MASTER POSTGRESQL & SUPABASE SCHEMA
-- Region: AWS Mumbai (ap-south-1)
-- Systems:
--   1. Customer Portal (Food & Fresh Duet Orders)
--   2. Delivery Partner Portal (Hyderabad Rider Recruitment & Live Trips)
--   3. Restaurant & Fresh-Product Seller Portals
--   4. Unified Operations & Compliance Admin Portal
-- Architecture: Multi-tenant, Least-Privilege, Mobile-Ready (iOS & Android)
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

DO $$ BEGIN
    CREATE TYPE support_ticket_status_enum AS ENUM (
        'open',
        'in_progress',
        'resolved',
        'closed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- TABLE 1: PROFILES (Synchronized with Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email TEXT,
    avatar_url TEXT,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete for DPDP Act compliance
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- ----------------------------------------------------------------------------
-- TABLE 2: USER_ROLES (Explicit Role Assignments & Multi-Role Support)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL DEFAULT 'customer',
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Helper trigger to auto-create profile and default role on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role_enum;
BEGIN
    assigned_role := COALESCE((new.raw_user_meta_data->>'role')::user_role_enum, 'customer'::user_role_enum);

    INSERT INTO public.profiles (id, full_name, phone, email)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'GoDuet User'),
        COALESCE(new.phone, new.raw_user_meta_data->>'phone', ''),
        new.email
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone;

    INSERT INTO public.user_roles (user_id, role, is_primary)
    VALUES (new.id, assigned_role, TRUE)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ----------------------------------------------------------------------------
-- TABLE 3: ADDRESSES (Customer & Partner Delivery Points)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    address_label TEXT NOT NULL DEFAULT 'Home', -- 'Home', 'Work', 'Hostel'
    flat_no TEXT NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT,
    locality TEXT NOT NULL, -- e.g. 'Hitec City', 'Gachibowli', 'Madhapur'
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    pincode VARCHAR(6) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_locality ON public.addresses(locality);

-- ----------------------------------------------------------------------------
-- TABLE 4: RESTAURANTS (Commercial Kitchens for Food Deliveries)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_user_id UUID NOT NULL REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    tagline TEXT,
    cuisine_tags TEXT[] NOT NULL DEFAULT '{}', -- e.g. ['Biryani', 'Desserts']
    fssai_license_number TEXT NOT NULL,
    commission_rate_percentage NUMERIC(4, 2) NOT NULL DEFAULT 8.00, -- GoDuet 8% vs 28% legacy
    locality TEXT NOT NULL, -- 'Madhapur', 'Hitec City', 'Jubilee Hills'
    full_address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_pure_veg BOOLEAN NOT NULL DEFAULT FALSE,
    is_duet_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    avg_prep_time_minutes INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    banner_image_url TEXT,
    logo_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restaurants_locality ON public.restaurants(locality);
CREATE INDEX IF NOT EXISTS idx_restaurants_duet ON public.restaurants(is_duet_eligible) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- TABLE 5: RESTAURANT_MENUS (Food Catalog & Customizations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Biryani', 'Desserts', 'Beverages'
    price_paisa INT NOT NULL CHECK (price_paisa > 0), -- Stored in Paisa (e.g. 35000 = Rs 350)
    image_url TEXT,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    prep_time_minutes INT NOT NULL DEFAULT 15,
    customizations_schema JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restaurant_menus_rest ON public.restaurant_menus(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_menus_avail ON public.restaurant_menus(is_available);

-- ----------------------------------------------------------------------------
-- TABLE 6: FRESH_SELLERS (Local Farmers & Health-Product Producers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fresh_sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_user_id UUID NOT NULL REFERENCES public.profiles(id),
    business_name TEXT NOT NULL,
    producer_type TEXT NOT NULL DEFAULT 'Organic Farm', -- 'Microgreens Lab', 'Cold-Pressed Juicery'
    fssai_license_number TEXT NOT NULL,
    commission_rate_percentage NUMERIC(4, 2) NOT NULL DEFAULT 8.00,
    locality TEXT NOT NULL,
    full_address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_organic_certified BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
    banner_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fresh_sellers_locality ON public.fresh_sellers(locality);

-- ----------------------------------------------------------------------------
-- TABLE 7: FRESH_PRODUCTS (Microgreens, Juices, Sprouts, Seeds Catalog)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fresh_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fresh_seller_id UUID NOT NULL REFERENCES public.fresh_sellers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Fresh Juices', 'Herbal Juices', 'Fresh Sprouts', 'Microgreens', 'Chia Seeds'
    price_paisa INT NOT NULL CHECK (price_paisa > 0),
    weight_or_volume TEXT NOT NULL, -- e.g. '350 ml', '250 g'
    harvest_batch_date DATE,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fresh_products_seller ON public.fresh_products(fresh_seller_id);
CREATE INDEX IF NOT EXISTS idx_fresh_products_avail ON public.fresh_products(is_available);

-- ----------------------------------------------------------------------------
-- TABLE 8: DELIVERY_PARTNERS (Hyderabad Rider Fleet)
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
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    current_latitude NUMERIC(10, 7),
    current_longitude NUMERIC(10, 7),
    last_ping_at TIMESTAMPTZ,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
    total_trips_completed INT NOT NULL DEFAULT 0,
    welcome_kit_delivered BOOLEAN NOT NULL DEFAULT FALSE,
    orientation_completed BOOLEAN NOT NULL DEFAULT FALSE,
    rejection_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_partners_online ON public.delivery_partners(is_online, preferred_zone);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_code ON public.delivery_partners(application_code);

-- ----------------------------------------------------------------------------
-- TABLE 9: COMBINED_ORDER_GROUPS ("Two Cravings. One Delivery." Multi-Order Core)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.combined_order_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'DUET-HYD-8942'
    corridor_name TEXT NOT NULL, -- 'Madhapur-Inorbit Metro Corridor'
    pickup_seller_a_id UUID NOT NULL REFERENCES public.restaurants(id),
    pickup_seller_b_id UUID REFERENCES public.restaurants(id),
    assigned_rider_id UUID REFERENCES public.delivery_partners(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    status order_status_enum NOT NULL DEFAULT 'placed',
    customer_delivery_savings_paisa INT NOT NULL DEFAULT 4000, -- Rs 40 saved vs 2 individual apps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_combined_groups_rider ON public.combined_order_groups(assigned_rider_id);
CREATE INDEX IF NOT EXISTS idx_combined_groups_status ON public.combined_order_groups(status);

-- ----------------------------------------------------------------------------
-- TABLE 10: ORDERS (Individual Restaurant or Fresh-Seller Order Units)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'ORD-HYD-1029'
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    combined_group_id UUID REFERENCES public.combined_order_groups(id) ON DELETE SET NULL,
    is_duet_order BOOLEAN NOT NULL DEFAULT FALSE,
    restaurant_id UUID REFERENCES public.restaurants(id),
    fresh_seller_id UUID REFERENCES public.fresh_sellers(id),
    assigned_rider_id UUID REFERENCES public.delivery_partners(id),
    status order_status_enum NOT NULL DEFAULT 'placed',
    
    -- Financial Breakdown (All in Paisa)
    subtotal_paisa INT NOT NULL,
    delivery_fee_paisa INT NOT NULL,
    packaging_fee_paisa INT NOT NULL,
    platform_fee_paisa INT NOT NULL DEFAULT 500, -- Rs 5.00
    gst_charges_paisa INT NOT NULL,
    discount_paisa INT NOT NULL DEFAULT 0,
    rider_tip_paisa INT NOT NULL DEFAULT 0,
    total_paisa INT NOT NULL,
    
    delivery_address_json JSONB NOT NULL,
    customer_instructions TEXT,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_rider ON public.orders(assigned_rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency ON public.orders(idempotency_key);

-- ----------------------------------------------------------------------------
-- TABLE 11: ORDER_ITEMS (Itemized Food & Fresh Basket Elements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    item_type user_role_enum NOT NULL CHECK (item_type IN ('restaurant_seller', 'fresh_seller')),
    restaurant_menu_id UUID REFERENCES public.restaurant_menus(id),
    fresh_product_id UUID REFERENCES public.fresh_products(id),
    item_name TEXT NOT NULL,
    unit_price_paisa INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_paisa INT NOT NULL,
    customizations_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ----------------------------------------------------------------------------
-- TABLE 12: PAYMENTS (Customer Inward Transactions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id),
    gateway_name VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY', -- 'RAZORPAY', 'UPI'
    gateway_payment_id VARCHAR(128) UNIQUE,
    amount_paisa INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'UPI', 'CARD', 'NETBANKING'
    status payment_status_enum NOT NULL DEFAULT 'initiated',
    gateway_signature_hash TEXT,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    settled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway ON public.payments(gateway_payment_id);

-- ----------------------------------------------------------------------------
-- TABLE 13: PAYOUTS (Weekly Driver & Seller Disbursements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_role user_role_enum NOT NULL CHECK (recipient_role IN ('delivery_partner', 'restaurant_seller', 'fresh_seller')),
    partner_id UUID REFERENCES public.delivery_partners(id),
    seller_restaurant_id UUID REFERENCES public.restaurants(id),
    seller_fresh_id UUID REFERENCES public.fresh_sellers(id),
    cycle_label VARCHAR(100) NOT NULL, -- '27 Oct - 02 Nov 2026'
    trips_or_orders_count INT NOT NULL DEFAULT 0,
    base_amount_paisa INT NOT NULL DEFAULT 0,
    incentives_paisa INT NOT NULL DEFAULT 0,
    tips_paisa INT NOT NULL DEFAULT 0,
    total_gross_paisa INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'SETTLED', 'FAILED')),
    settlement_date DATE,
    reference_utr VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_partner ON public.payouts(partner_id);

-- ----------------------------------------------------------------------------
-- TABLE 14: NOTIFICATIONS (Transactional & Realtime User Alerts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'ORDER_UPDATE', 'RIDER_ASSIGNED', 'PAYOUT_CREDITED', 'KYC_STATUS'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- TABLE 15: SUPPORT_TICKETS (Partner, Customer & Merchant Helpdesk)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'TKT-HYD-5021'
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    user_role user_role_enum NOT NULL,
    category VARCHAR(60) NOT NULL, -- 'Payment Issue', 'Delivery Issue', 'Document Re-upload'
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status support_ticket_status_enum NOT NULL DEFAULT 'open',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'sos'
    assigned_admin_id UUID REFERENCES public.profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- ----------------------------------------------------------------------------
-- TABLE 16: AUDIT_LOGS (Cryptographically Hash-Chained Compliance Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
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

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, timestamp);

-- ----------------------------------------------------------------------------
-- 17. ROW-LEVEL SECURITY (RLS) POLICIES ACROSS ALL TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fresh_sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fresh_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combined_order_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION public.auth_uid() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = public.auth_uid() AND role = 'admin'
    );
$$ LANGUAGE SQL STABLE;

-- Profiles Policies
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (id = auth_uid() OR is_admin());

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (id = auth_uid() OR is_admin());

-- User Roles: Read-only for self; Editable exclusively by admins
CREATE POLICY "Users view own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth_uid() OR is_admin());

CREATE POLICY "Admins manage roles" ON public.user_roles
    FOR ALL USING (is_admin());

-- Addresses Policies
CREATE POLICY "Customers own addresses" ON public.addresses
    FOR ALL USING (user_id = auth_uid() OR is_admin());

-- Restaurant & Fresh Catalogs
CREATE POLICY "Public read active restaurants" ON public.restaurants
    FOR SELECT USING (is_active = TRUE OR seller_user_id = auth_uid() OR is_admin());

CREATE POLICY "Sellers manage own restaurant" ON public.restaurants
    FOR ALL USING (seller_user_id = auth_uid() OR is_admin());

CREATE POLICY "Public read menus" ON public.restaurant_menus
    FOR SELECT USING (is_available = TRUE OR EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND seller_user_id = auth_uid()) OR is_admin());

CREATE POLICY "Sellers manage own menu" ON public.restaurant_menus
    FOR ALL USING (EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND seller_user_id = auth_uid()) OR is_admin());

CREATE POLICY "Public read fresh sellers" ON public.fresh_sellers
    FOR SELECT USING (is_active = TRUE OR seller_user_id = auth_uid() OR is_admin());

CREATE POLICY "Fresh sellers manage own store" ON public.fresh_sellers
    FOR ALL USING (seller_user_id = auth_uid() OR is_admin());

CREATE POLICY "Public read fresh products" ON public.fresh_products
    FOR SELECT USING (is_available = TRUE OR EXISTS (SELECT 1 FROM public.fresh_sellers WHERE id = fresh_seller_id AND seller_user_id = auth_uid()) OR is_admin());

CREATE POLICY "Fresh sellers manage own products" ON public.fresh_products
    FOR ALL USING (EXISTS (SELECT 1 FROM public.fresh_sellers WHERE id = fresh_seller_id AND seller_user_id = auth_uid()) OR is_admin());

-- Delivery Partners Policies
CREATE POLICY "Riders view own profile" ON public.delivery_partners
    FOR SELECT USING (id = auth_uid() OR is_admin());

CREATE POLICY "Riders update own location/shift" ON public.delivery_partners
    FOR UPDATE USING (id = auth_uid() OR is_admin());

-- Orders & Combined Groups Policies
CREATE POLICY "Customers view own orders" ON public.orders
    FOR SELECT USING (customer_id = auth_uid() OR is_admin());

CREATE POLICY "Riders view assigned orders" ON public.orders
    FOR SELECT USING (assigned_rider_id = auth_uid() OR is_admin());

CREATE POLICY "Sellers view relevant orders" ON public.orders
    FOR SELECT USING (
        restaurant_id IN (SELECT id FROM public.restaurants WHERE seller_user_id = auth_uid()) OR
        fresh_seller_id IN (SELECT id FROM public.fresh_sellers WHERE seller_user_id = auth_uid()) OR
        is_admin()
    );

CREATE POLICY "Order items view access" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id AND (
                o.customer_id = auth_uid() OR
                o.assigned_rider_id = auth_uid() OR
                o.restaurant_id IN (SELECT id FROM public.restaurants WHERE seller_user_id = auth_uid()) OR
                o.fresh_seller_id IN (SELECT id FROM public.fresh_sellers WHERE seller_user_id = auth_uid()) OR
                is_admin()
            )
        )
    );

-- Payments & Payouts Policies
CREATE POLICY "Customers view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth_uid()) OR is_admin()
    );

CREATE POLICY "Recipients view own payouts" ON public.payouts
    FOR SELECT USING (
        partner_id = auth_uid() OR
        seller_restaurant_id IN (SELECT id FROM public.restaurants WHERE seller_user_id = auth_uid()) OR
        seller_fresh_id IN (SELECT id FROM public.fresh_sellers WHERE seller_user_id = auth_uid()) OR
        is_admin()
    );

-- Notifications & Support Tickets Policies
CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL USING (user_id = auth_uid());

CREATE POLICY "Users view own tickets" ON public.support_tickets
    FOR SELECT USING (user_id = auth_uid() OR is_admin());

CREATE POLICY "Users submit tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (user_id = auth_uid());

CREATE POLICY "Admins manage tickets" ON public.support_tickets
    FOR ALL USING (is_admin());

-- Audit Logs Policies: Append-only by system; Read exclusively by admins
CREATE POLICY "Admins view audit logs" ON public.audit_logs
    FOR SELECT USING (is_admin());

CREATE POLICY "System insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (TRUE);

-- ----------------------------------------------------------------------------
-- 18. REALTIME PUBLICATION CONFIGURATION
-- ----------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.combined_order_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_partners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

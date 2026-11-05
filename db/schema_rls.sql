-- ============================================================================
-- GODUET DATABASE SECURITY ARCHITECTURE & POSTGRESQL ROW-LEVEL SECURITY (RLS)
-- Environment: Supabase / PostgreSQL 15+
-- Compliance: OWASP Top 10, DPDP Act India, PCI-DSS SAQ-A Data Segregation
-- ============================================================================

-- 1. Enable Required Security Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerated Role Definitions
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'restaurant_seller', 'delivery_partner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('placed', 'confirmed', 'preparing', 'rider_assigned', 'picking_up', 'on_the_way', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('initiated', 'authorized', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Users & Role Tables
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL, -- Argon2id hash only, never plaintext
    role user_role_type NOT NULL DEFAULT 'customer',
    full_name TEXT NOT NULL,
    is_student_verified BOOLEAN DEFAULT FALSE,
    student_id_encrypted TEXT,    -- AES-256-GCM encrypted
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMPTZ        -- Soft delete for DPDP Act compliance
);

-- 4. Customer Addresses (Sensitive PII)
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    address_type TEXT NOT NULL DEFAULT 'Home',
    flat_no TEXT NOT NULL,
    landmark TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    pincode VARCHAR(6) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Partner KYC Documents (Restricted Confidential Data)
CREATE TABLE IF NOT EXISTS public.partner_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    partner_type user_role_type NOT NULL,
    document_type TEXT NOT NULL, -- 'driving_licence', 'fssai_licence', 'aadhaar', 'pan', 'bank_statement'
    document_number_encrypted TEXT, -- AES-256-GCM encrypted
    storage_path TEXT NOT NULL,     -- Private S3/GCS bucket key
    verification_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_by_admin UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Restaurants & Menu Catalog
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_user_id UUID NOT NULL REFERENCES public.users(id),
    name TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT NOT NULL,
    fssai_license_number TEXT NOT NULL,
    is_duet_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_paisa INT NOT NULL CHECK (price_paisa > 0),
    prep_time_minutes INT NOT NULL DEFAULT 15,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Two-Restaurant Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(32) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.users(id),
    is_duet_order BOOLEAN NOT NULL DEFAULT FALSE,
    restaurant_a_id UUID REFERENCES public.restaurants(id),
    restaurant_b_id UUID REFERENCES public.restaurants(id),
    assigned_rider_id UUID REFERENCES public.users(id),
    status order_status_type NOT NULL DEFAULT 'placed',
    food_subtotal_paisa INT NOT NULL,
    single_delivery_fee_paisa INT NOT NULL,
    packaging_fee_paisa INT NOT NULL,
    platform_fee_paisa INT NOT NULL DEFAULT 500, -- 500 paisa = Rs 5
    gst_charges_paisa INT NOT NULL,
    discount_paisa INT NOT NULL DEFAULT 0,
    tip_paisa INT NOT NULL DEFAULT 0,
    final_total_paisa INT NOT NULL,
    delivery_address_json JSONB NOT NULL,
    idempotency_key VARCHAR(64) UNIQUE NOT NULL, -- Guarantees atomic non-duplicate placement
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Payment & Financial Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id),
    gateway_payment_id VARCHAR(100) UNIQUE,
    amount_paisa INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'UPI', 'CARD', 'NETBANKING', 'COD'
    status payment_status_type NOT NULL DEFAULT 'initiated',
    gateway_signature_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Immutable Security Audit Trail
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action VARCHAR(80) NOT NULL,
    actor_id UUID,
    actor_role VARCHAR(40),
    ip_address INET,
    user_agent TEXT,
    target_entity VARCHAR(50),
    target_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    details JSONB,
    previous_hash VARCHAR(64) NOT NULL,
    entry_hash VARCHAR(64) NOT NULL
);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all tables containing tenant or sensitive data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions to extract authenticated role and ID from JWT context
CREATE OR REPLACE FUNCTION auth_uid() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION auth_role() RETURNS user_role_type AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.role', true), '')::user_role_type;
$$ LANGUAGE SQL STABLE;

-- ----------------------------------------------------------------------------
-- USERS POLICIES
-- ----------------------------------------------------------------------------
-- 1. Users can view and update only their own profile
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (id = auth_uid() OR auth_role() = 'admin');

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (id = auth_uid())
    WITH CHECK (id = auth_uid() AND role = (SELECT role FROM public.users WHERE id = auth_uid())); -- Prevents self-elevation to admin!

-- ----------------------------------------------------------------------------
-- CUSTOMER ADDRESSES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "addresses_owner_only" ON public.customer_addresses
    FOR ALL USING (user_id = auth_uid() OR auth_role() = 'admin');

-- ----------------------------------------------------------------------------
-- PARTNER DOCUMENTS (KYC) POLICIES
-- ----------------------------------------------------------------------------
-- Partner can view only their own documents; Admins can review all
CREATE POLICY "partner_documents_owner" ON public.partner_documents
    FOR SELECT USING (partner_id = auth_uid() OR auth_role() = 'admin');

CREATE POLICY "partner_documents_insert" ON public.partner_documents
    FOR INSERT WITH CHECK (partner_id = auth_uid() AND auth_role() IN ('delivery_partner', 'restaurant_seller'));

CREATE POLICY "partner_documents_admin_update" ON public.partner_documents
    FOR UPDATE USING (auth_role() = 'admin');

-- ----------------------------------------------------------------------------
-- RESTAURANTS & MENUS POLICIES
-- ----------------------------------------------------------------------------
-- Public can view active restaurants
CREATE POLICY "restaurants_public_view" ON public.restaurants
    FOR SELECT USING (is_active = TRUE OR seller_user_id = auth_uid() OR auth_role() = 'admin');

-- Only seller owner or admin can update restaurant
CREATE POLICY "restaurants_seller_modify" ON public.restaurants
    FOR ALL USING (seller_user_id = auth_uid() OR auth_role() = 'admin');

-- Menus viewable by all; manageable only by restaurant seller
CREATE POLICY "menu_items_public_view" ON public.menu_items
    FOR SELECT USING (is_available = TRUE OR EXISTS (
        SELECT 1 FROM public.restaurants r WHERE r.id = menu_items.restaurant_id AND (r.seller_user_id = auth_uid() OR auth_role() = 'admin')
    ));

-- ----------------------------------------------------------------------------
-- ORDERS POLICIES (Multi-Craving Segregated Access)
-- ----------------------------------------------------------------------------
-- 1. Customers can view their own orders
-- 2. Delivery partner can view ONLY orders assigned to them
-- 3. Restaurant seller can view ONLY orders containing their restaurant
-- 4. Admins have oversight
CREATE POLICY "orders_access_control" ON public.orders
    FOR SELECT USING (
        customer_id = auth_uid()
        OR assigned_rider_id = auth_uid()
        OR (auth_role() = 'restaurant_seller' AND EXISTS (
            SELECT 1 FROM public.restaurants r 
            WHERE r.seller_user_id = auth_uid() AND (r.id = orders.restaurant_a_id OR r.id = orders.restaurant_b_id)
        ))
        OR auth_role() = 'admin'
    );

-- Customers can create orders
CREATE POLICY "orders_customer_create" ON public.orders
    FOR INSERT WITH CHECK (customer_id = auth_uid());

-- Rider can update order status when assigned
CREATE POLICY "orders_rider_update_status" ON public.orders
    FOR UPDATE USING (assigned_rider_id = auth_uid() OR auth_role() = 'admin');

-- ----------------------------------------------------------------------------
-- PAYMENT TRANSACTIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "payments_customer_view" ON public.payment_transactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payment_transactions.order_id AND o.customer_id = auth_uid())
        OR auth_role() = 'admin'
    );

-- ----------------------------------------------------------------------------
-- AUDIT LOGS POLICIES (Append-Only, Zero Update/Delete)
-- ----------------------------------------------------------------------------
CREATE POLICY "audit_logs_admin_read" ON public.security_audit_logs
    FOR SELECT USING (auth_role() = 'admin');

-- Disallow updates and deletes on audit logs completely
CREATE POLICY "audit_logs_no_update" ON public.security_audit_logs
    FOR UPDATE USING (FALSE);

CREATE POLICY "audit_logs_no_delete" ON public.security_audit_logs
    FOR DELETE USING (FALSE);

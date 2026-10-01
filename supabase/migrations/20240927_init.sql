-- ====================================================================
-- VEDIKA BROKERS - SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'property_manager', 'broker', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM ('rent', 'buy');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE property_status AS ENUM ('available', 'reserved', 'sold', 'rented', 'unavailable', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('created', 'pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE visit_status AS ENUM ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'User',
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    listing_type listing_type NOT NULL DEFAULT 'rent',
    property_type TEXT NOT NULL DEFAULT 'Apartment',
    price NUMERIC NOT NULL,
    deposit NUMERIC DEFAULT 0,
    bhk TEXT NOT NULL,
    carpet_area NUMERIC,
    builtup_area NUMERIC,
    city TEXT NOT NULL DEFAULT 'Pune',
    area TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT NOT NULL, -- PROTECTED: Exact address released upon ₹1,000 verified payment
    latitude NUMERIC,
    longitude NUMERIC,
    floor INTEGER DEFAULT 1,
    total_floors INTEGER DEFAULT 1,
    furnishing TEXT DEFAULT 'Semi-Furnished',
    parking TEXT DEFAULT 'Car & Bike',
    bathrooms INTEGER DEFAULT 1,
    balconies INTEGER DEFAULT 1,
    description TEXT,
    broker_name TEXT DEFAULT 'Vedika Property Desk',
    broker_phone TEXT DEFAULT '+91 98230 12345',
    whatsapp TEXT DEFAULT '919823012345',
    status property_status NOT NULL DEFAULT 'available',
    is_verified BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    unlocks_count INTEGER DEFAULT 0,
    main_image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PROPERTY IMAGES & VIDEOS
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROPERTY AMENITIES
CREATE TABLE IF NOT EXISTS public.property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity TEXT NOT NULL
);

-- 7. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

-- 8. QR CAMPAIGNS & SCAN TRACKING
CREATE TABLE IF NOT EXISTS public.qr_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    target_page TEXT DEFAULT 'home',
    active BOOLEAN DEFAULT true,
    scans_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    qr_campaign_id UUID REFERENCES public.qr_campaigns(id) ON DELETE SET NULL,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PAYMENTS & PROPERTY UNLOCKS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL DEFAULT 1000,
    payment_method TEXT DEFAULT 'razorpay',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    bank_upi_reference TEXT,
    status payment_status NOT NULL DEFAULT 'created',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_unlocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

-- 10. REFUNDS TABLE (₹500 post-visit refund request workflow)
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL DEFAULT 500,
    reason TEXT NOT NULL,
    status refund_status NOT NULL DEFAULT 'pending',
    user_upi_id TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMPTZ
);

-- 11. VISIT REQUESTS
CREATE TABLE IF NOT EXISTS public.visit_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    requested_date DATE NOT NULL,
    requested_time TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    status visit_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. SITE CONTENT & CONFIGURATION
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'property_manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users read/update own; admins read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Properties: 
-- Public view: Everyone can read available properties.
-- NOTE ON ADDRESS SECURITY:
-- Public select returns all property columns EXCEPT that the backend securely delivers 
-- exact street address only to users who have an approved unlock row or admin status.
CREATE POLICY "Public can view active properties" ON public.properties FOR SELECT USING (status = 'available' OR public.is_admin());
CREATE POLICY "Admins manage properties" ON public.properties FOR ALL USING (public.is_admin());

-- Property images, videos, amenities: Public can view
CREATE POLICY "Public view property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Admins manage images" ON public.property_images FOR ALL USING (public.is_admin());
CREATE POLICY "Public view property videos" ON public.property_videos FOR SELECT USING (true);
CREATE POLICY "Admins manage videos" ON public.property_videos FOR ALL USING (public.is_admin());
CREATE POLICY "Public view property amenities" ON public.property_amenities FOR SELECT USING (true);
CREATE POLICY "Admins manage amenities" ON public.property_amenities FOR ALL USING (public.is_admin());

-- Favorites: Users manage their own
CREATE POLICY "Users manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- QR Campaigns: Public can read active QR campaigns (for scan verification); admins manage all
CREATE POLICY "Public read active qr campaigns" ON public.qr_campaigns FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Admins manage qr campaigns" ON public.qr_campaigns FOR ALL USING (public.is_admin());

-- Property views: Anyone can insert view
CREATE POLICY "Anyone log views" ON public.property_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read views" ON public.property_views FOR SELECT USING (public.is_admin());

-- Payments: Users see own payments; admins see all
CREATE POLICY "Users see own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- Property Unlocks: Users see own unlocked properties; admins see all
CREATE POLICY "Users see own unlocks" ON public.property_unlocks FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage unlocks" ON public.property_unlocks FOR ALL USING (public.is_admin());

-- Refunds: Users see own refunds; admins manage all
CREATE POLICY "Users see own refunds" ON public.refunds FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create refund request" ON public.refunds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage refunds" ON public.refunds FOR ALL USING (public.is_admin());

-- Visit requests: Users see own visits; admins manage all
CREATE POLICY "Users see own visits" ON public.visit_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users create visits" ON public.visit_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage visits" ON public.visit_requests FOR ALL USING (public.is_admin());

-- Notifications: Users see own notifications
CREATE POLICY "Users see own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Support tickets: Users create & view own; admins manage all
CREATE POLICY "Anyone create support tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins manage tickets" ON public.support_tickets FOR ALL USING (public.is_admin());

-- Site Content: Public can read; admins can update
CREATE POLICY "Public read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage site content" ON public.site_content FOR ALL USING (public.is_admin());

-- Admin logs: Admins only
CREATE POLICY "Admins read audit logs" ON public.admin_logs FOR ALL USING (public.is_admin());

-- ====================================================================
-- SEED DATA (INITIAL DEMO PROPERTIES & QR CAMPAIGNS)
-- ====================================================================

INSERT INTO public.qr_campaigns (code, name, location, target_page) VALUES
('QR001', 'Wakad Highway Flyover Board', 'Wakad Bridge, Pune', 'rent'),
('QR002', 'Hinjewadi Phase 1 IT Park Pillar', 'Infosys Circle, Hinjewadi', 'rent'),
('QR003', 'Baner High Street Pamphlet', 'Baner Road, Pune', 'buy'),
('QR004', 'Kothrud Metro Station Pillar', 'Vanaz Corner, Kothrud', 'home'),
('QR005', 'Viman Nagar Symbiosis Crossing', 'Viman Nagar, Pune', 'rent')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.site_content (key, value) VALUES
('business_info', '{"name":"VEDIKA BROKERS","phone":"+91 98230 12345","whatsapp":"919823012345","email":"contact@vedikabrokers.com","office_address":"Office 304, Pride Icon, Near Datta Mandir, Wakad, Pune - 411057","unlock_fee":1000,"refund_amount":500}'::jsonb)
ON CONFLICT (key) DO NOTHING;

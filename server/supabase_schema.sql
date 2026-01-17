-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. ENUMS & TYPES
-- --------------------------------------------------------
CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'couple');
CREATE TYPE booking_status AS ENUM ('pending', 'negotiating', 'confirmed', 'rejected', 'cancelled', 'completed');
CREATE TYPE message_type AS ENUM ('text', 'offer', 'acceptance', 'rejection', 'system');
CREATE TYPE enquiry_status AS ENUM ('unread', 'read', 'replied');

-- --------------------------------------------------------
-- 2. PROFILES (Extends Auth)
-- --------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'couple',
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Profiles are viewable by everyone, updateable by self
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- --------------------------------------------------------
-- 3. VENDORS (Business Profiles)
-- --------------------------------------------------------
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    location TEXT,
    price_range TEXT, -- e.g. '$', '$$', '$$$'
    rating NUMERIC DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    images TEXT[], -- Array of image URLs
    cover_image TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Vendors viewable by all, updateable by owner
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors viewable by everyone" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Owners can update own vendor profile" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can insert vendor profile" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------
-- 4. SERVICES (Packages)
-- --------------------------------------------------------
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    features TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Vendors manage own services" ON public.services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = services.vendor_id AND user_id = auth.uid())
);

-- --------------------------------------------------------
-- 5. BOOKINGS (Transactions)
-- --------------------------------------------------------
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id), -- The Couple
    vendor_id UUID NOT NULL REFERENCES public.vendors(id), -- The Vendor
    service_id UUID REFERENCES public.services(id),
    date DATE NOT NULL,
    status booking_status DEFAULT 'pending',
    total_amount NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Visible to the specific couple AND the specific vendor
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.vendors WHERE id = bookings.vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Couples can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Participants can update bookings" ON public.bookings FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.vendors WHERE id = bookings.vendor_id AND user_id = auth.uid())
);

-- --------------------------------------------------------
-- 6. MESSAGES (Negotiation)
-- --------------------------------------------------------
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    content TEXT,
    type message_type DEFAULT 'text',
    metadata JSONB, -- Stores { "price": 5000 } for offers
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Only participants of the booking can read/write messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Booking participants read messages" ON public.messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bookings b 
        WHERE b.id = messages.booking_id 
        AND (b.user_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.vendors v WHERE v.id = b.vendor_id AND v.user_id = auth.uid()))
    )
);
CREATE POLICY "Booking participants send messages" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.bookings b 
        WHERE b.id = messages.booking_id 
        AND (b.user_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.vendors v WHERE v.id = b.vendor_id AND v.user_id = auth.uid()))
    )
);

-- --------------------------------------------------------
-- 7. REVIEWS
-- --------------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Couples can create reviews for completed bookings" ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.bookings WHERE id = reviews.booking_id AND status = 'completed' OR status = 'confirmed')
);

-- --------------------------------------------------------
-- 8. ENQUIRIES (Pre-booking questions)
-- --------------------------------------------------------
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id), -- Optional, might be guest
    vendor_id UUID NOT NULL REFERENCES public.vendors(id),
    userName TEXT,
    userEmail TEXT,
    message TEXT,
    status enquiry_status DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors view received enquiries" ON public.enquiries FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.vendors WHERE id = enquiries.vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Users view own sent enquiries" ON public.enquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Everyone can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- --------------------------------------------------------
-- 9. REPORTS (Moderation)
-- --------------------------------------------------------
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    target_vendor_id UUID REFERENCES public.vendors(id),
    target_user_id UUID REFERENCES public.profiles(id),
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Only admins can see all reports, users can see their own sent reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all reports" ON public.reports FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- --------------------------------------------------------
-- 10. INDEXES & TRIGGERS
-- --------------------------------------------------------
-- Search optimization
CREATE INDEX idx_vendors_location ON public.vendors(location);
CREATE INDEX idx_vendors_category ON public.vendors(category);
CREATE INDEX idx_vendors_rating ON public.vendors(rating DESC);

-- Dashboard optimization
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_vendor ON public.bookings(vendor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Chat optimization
CREATE INDEX idx_messages_booking ON public.messages(booking_id, created_at ASC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_vendors_timestamp BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_bookings_timestamp BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Function to Handle New User Signup (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- DAPLASH DELIVERY COMPLETE SETUP SQL
-- Consolidated Schema, Policies, and Data
-- ==========================================

-- 1. CLEANUP (Optional: Uncomment if you want a fresh start)
-- DROP TABLE IF EXISTS public.requests;
-- DROP TABLE IF EXISTS public.padala_bookings;
-- DROP TABLE IF EXISTS public.pasakay_bookings;
-- DROP TABLE IF EXISTS public.manual_orders;
-- DROP TABLE IF EXISTS public.food_orders;
-- DROP TABLE IF EXISTS public.faqs;
-- DROP TABLE IF EXISTS public.menu_items;
-- DROP TABLE IF EXISTS public.stores CASCADE;
-- DROP TABLE IF EXISTS public.site_settings;

-- 2. TABLE DEFINITIONS

-- Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores Table
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    menu_image_url TEXT,
    menu_image_2_url TEXT,
    menu_image_3_url TEXT,
    external_menu_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    location TEXT,
    contact TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    base_price NUMERIC(10,2) DEFAULT 0,
    category TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT menu_items_name_key UNIQUE (name)
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT faqs_question_key UNIQUE (question)
);

-- Food Orders Table
CREATE TABLE IF NOT EXISTS public.food_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    item_price NUMERIC(10,2),
    quantity INTEGER DEFAULT 1,
    total_price NUMERIC(10,2),
    instructions TEXT,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manual Orders Table
CREATE TABLE IF NOT EXISTS public.manual_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address TEXT NOT NULL,
    order_details TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pasakay Bookings Table
CREATE TABLE IF NOT EXISTS public.pasakay_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    passengers INTEGER DEFAULT 1,
    has_baggage BOOLEAN DEFAULT FALSE,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    pickup_lat TEXT,
    pickup_lng TEXT,
    destination_lat TEXT,
    destination_lng TEXT
);

-- Padala Bookings Table
CREATE TABLE IF NOT EXISTS public.padala_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    receiver_name TEXT,
    receiver_contact TEXT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    item_description TEXT,
    item_weight TEXT,
    item_value NUMERIC(10,2),
    special_instructions TEXT,
    preferred_date DATE,
    preferred_time TEXT DEFAULT 'Morning',
    delivery_fee NUMERIC(10,2),
    distance_km NUMERIC(10,2),
    notes TEXT,
    status TEXT DEFAULT 'pending',
    pickup_lat TEXT,
    pickup_lng TEXT,
    delivery_lat TEXT,
    delivery_lng TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    request_type TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pasakay_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.padala_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Site Settings
CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin all site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Stores
CREATE POLICY "Allow public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow admin all stores" ON public.stores FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Menu Items
CREATE POLICY "Allow public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow admin all menu_items" ON public.menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQs
CREATE POLICY "Allow public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow admin all faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Food Orders
CREATE POLICY "Allow anon insert food orders" ON public.food_orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select food orders" ON public.food_orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update food orders" ON public.food_orders FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow admin all food orders" ON public.food_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Manual Orders
CREATE POLICY "Allow anon insert manual orders" ON public.manual_orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select manual orders" ON public.manual_orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow admin all manual orders" ON public.manual_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Pasakay Bookings
CREATE POLICY "Allow public insert pasakay" ON public.pasakay_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin all pasakay" ON public.pasakay_bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Padala Bookings
CREATE POLICY "Allow public insert padala" ON public.padala_bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read padala" ON public.padala_bookings FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin all padala" ON public.padala_bookings FOR ALL To authenticated USING (true) WITH CHECK (true);

-- Requests
CREATE POLICY "Allow public insert requests" ON public.requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Allow admin all requests" ON public.requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. STORAGE SETUP

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('stores', 'stores', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Simplified)
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT TO public USING (bucket_id IN ('menu-images', 'stores', 'site-assets'));
CREATE POLICY "Admin All Access" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('menu-images', 'stores', 'site-assets')) WITH CHECK (bucket_id IN ('menu-images', 'stores', 'site-assets'));

-- 6. SEED DATA

-- Site Settings
INSERT INTO public.site_settings (id, value)
VALUES 
    ('site_name', 'Daplash Delivery'),
    ('site_description', 'Your friendly neighborhood delivery service.'),
    ('contact_phone', '09569414260'),
    ('contact_email', 'support@daplash.com'),
    ('messenger_id', '100064173395989'),
    ('currency', '₱'),
    ('currency_code', 'PHP'),
    ('base_delivery_fee', '49'),
    ('base_delivery_distance', '2'),
    ('extra_delivery_fee_per_km', '10')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;

-- Stores
INSERT INTO public.stores (id, name, description, image_url, location, contact, order_index)
VALUES 
    ('e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 'Daplash House Specialty', 'Our very own kitchen serving the best local delicacies and home-cooked favorites.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800', 'Naga City', '09569414260', 1)
ON CONFLICT (id) DO NOTHING;

-- Menu Items
INSERT INTO public.menu_items (name, description, price, base_price, category, image_url, store_id, order_index)
VALUES 
    ('Daplash Signature Pizza', 'Freshly baked dough with our secret tomato sauce and premium mozzarella.', 299, 299, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 1),
    ('Classic Cheese Burger', 'Quarter pounder pure beef patty with melting cheddar and house sauce.', 149, 149, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 2),
    ('Creamy Carbonara', 'Authentic Italian style pasta with white sauce and crispy bacon.', 189, 189, 'Pasta', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 3),
    ('Iced Caramel Macchiato', 'Freshly brewed espresso with steamed milk and sweet caramel drizzle.', 110, 110, 'Drinks', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 4)
ON CONFLICT (name) DO NOTHING;

-- FAQs
INSERT INTO public.faqs (question, answer, order_index)
VALUES 
    ('How fast is your delivery service?', 'Our average delivery time within Naga City is 20 - 30 minutes, depending on the service type and traffic conditions.', 1),
    ('What are your operating hours?', 'We currently operate from 8am - 12mn daily. However, special delivery arrangements can be made via our Facebook Messenger.', 2),
    ('Do you deliver outside Naga City?', 'Yes, we do deliver to neighboring towns like Camaligan, Gainza, and Canaman for a small additional delivery fee.', 3),
    ('How do I pay for the delivery?', 'We primarily accept Cash on Delivery (COD). We are also working on integrating digital payment options like GCash soon.', 4)
ON CONFLICT (question) DO NOTHING;

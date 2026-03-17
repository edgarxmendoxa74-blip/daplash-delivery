-- Create the menu-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create the stores bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('stores', 'stores', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure public access to read images (menu-images)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects
            FOR SELECT TO public
            USING (bucket_id = 'menu-images');
    END IF;
END $$;

-- Ensure public access to read images (stores)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Stores' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access Stores" ON storage.objects
            FOR SELECT TO public
            USING (bucket_id = 'stores');
    END IF;
END $$;

-- Ensure authenticated users can upload images (menu-images)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin Upload' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Admin Upload" ON storage.objects
            FOR INSERT TO authenticated
            WITH CHECK (bucket_id = 'menu-images');
    END IF;
END $$;

-- Ensure authenticated users can upload images (stores)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin Upload Stores' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Admin Upload Stores" ON storage.objects
            FOR INSERT TO authenticated
            WITH CHECK (bucket_id = 'stores');
    END IF;
END $$;

-- Ensure authenticated users can delete images (menu-images)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin Delete' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Admin Delete" ON storage.objects
            FOR DELETE TO authenticated
            USING (bucket_id = 'menu-images');
    END IF;
END $$;

-- Ensure authenticated users can delete images (stores)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin Delete Stores' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Admin Delete Stores" ON storage.objects
            FOR DELETE TO authenticated
            USING (bucket_id = 'stores');
    END IF;
END $$;

-- Ensure padala_bookings table exists (to fix "padala booking does not exist" error)
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on padala_bookings if not enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'padala_bookings' AND rowsecurity = true
    ) THEN
        ALTER TABLE public.padala_bookings ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Ensure policies for padala_bookings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert padala_bookings' AND tablename = 'padala_bookings'
    ) THEN
        CREATE POLICY "Allow public insert padala_bookings" ON padala_bookings
            FOR INSERT TO anon WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read padala_bookings' AND tablename = 'padala_bookings'
    ) THEN
        CREATE POLICY "Allow public read padala_bookings" ON padala_bookings
            FOR SELECT USING (true);
    END IF;
END $$;


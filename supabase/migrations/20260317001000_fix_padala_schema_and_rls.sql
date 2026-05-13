-- Add GPS coordinate columns to padala_bookings
ALTER TABLE public.padala_bookings ADD COLUMN IF NOT EXISTS pickup_lat TEXT;
ALTER TABLE public.padala_bookings ADD COLUMN IF NOT EXISTS pickup_lng TEXT;
ALTER TABLE public.padala_bookings ADD COLUMN IF NOT EXISTS delivery_lat TEXT;
ALTER TABLE public.padala_bookings ADD COLUMN IF NOT EXISTS delivery_lng TEXT;

-- Ensure RLS is enabled
ALTER TABLE public.padala_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing "public insert" policies if they exist to recreate them reliably
DROP POLICY IF EXISTS "Allow public insert padala_bookings" ON public.padala_bookings;
DROP POLICY IF EXISTS "Allow public read padala_bookings" ON public.padala_bookings;

-- Create broad policies for padala_bookings
CREATE POLICY "Allow public insert padala_bookings" ON public.padala_bookings
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public read padala_bookings" ON public.padala_bookings
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin all padala_bookings" ON public.padala_bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create pasakay_bookings table
CREATE TABLE IF NOT EXISTS pasakay_bookings (
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

-- Enable RLS
ALTER TABLE pasakay_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert
CREATE POLICY "Allow public insert" ON pasakay_bookings
    FOR INSERT WITH CHECK (true);

-- Create policy for authenticated read/write (admin)
CREATE POLICY "Allow admin all" ON pasakay_bookings
    USING (auth.role() = 'authenticated');

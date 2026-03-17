-- Create padala_bookings table
CREATE TABLE IF NOT EXISTS padala_bookings (
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

-- Enable RLS on padala_bookings
ALTER TABLE padala_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for padala_bookings
CREATE POLICY "Allow public insert padala_bookings" ON padala_bookings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read padala_bookings" ON padala_bookings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin all padala_bookings" ON padala_bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
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

-- Enable RLS on requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create policies for requests
CREATE POLICY "Allow public insert requests" ON requests
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read requests" ON requests
    FOR SELECT USING (true);

CREATE POLICY "Allow admin all requests" ON requests
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

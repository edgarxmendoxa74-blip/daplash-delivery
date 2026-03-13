-- Create manual_orders table for tracking manual (non-menu) delivery orders
CREATE TABLE IF NOT EXISTS manual_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address TEXT NOT NULL,
    order_details TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE manual_orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public ordering)
CREATE POLICY "Allow anon insert manual orders" ON manual_orders
    FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated full access (for admin)
CREATE POLICY "Allow authenticated full access manual orders" ON manual_orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous to read (for admin dashboard when using anon key)
CREATE POLICY "Allow anon read manual orders" ON manual_orders
    FOR SELECT TO anon USING (true);

-- Allow anonymous to update (for status changes)
CREATE POLICY "Allow anon update manual orders" ON manual_orders
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Allow anonymous to delete
CREATE POLICY "Allow anon delete manual orders" ON manual_orders
    FOR DELETE TO anon USING (true);

-- Create food_orders table for tracking food delivery orders
CREATE TABLE IF NOT EXISTS food_orders (
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

-- Enable RLS
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public ordering)
CREATE POLICY "Allow anon insert food orders" ON food_orders
    FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated full access (for admin)
CREATE POLICY "Allow authenticated full access food orders" ON food_orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous to read (for admin dashboard when using anon key)
CREATE POLICY "Allow anon read food orders" ON food_orders
    FOR SELECT TO anon USING (true);

-- Allow anonymous to update (for status changes)
CREATE POLICY "Allow anon update food orders" ON food_orders
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Allow anonymous to delete
CREATE POLICY "Allow anon delete food orders" ON food_orders
    FOR DELETE TO anon USING (true);

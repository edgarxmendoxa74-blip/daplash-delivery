-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    location TEXT,
    contact TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add store_id to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);

-- Enable RLS on stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "Allow public read" ON stores
    FOR SELECT USING (true);

-- Create policy for authenticated all (admin)
CREATE POLICY "Allow admin all" ON stores
    USING (auth.role() = 'authenticated');

-- Create a default store if none exists (to link existing items)
-- This is a placeholder, actual store creation should be done in Admin Dashboard
-- INSERT INTO stores (name, description, image_url) 
-- VALUES ('Daplash Main', 'Our original kitchen', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800');

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items
CREATE POLICY "Allow public read menu_items" ON menu_items
    FOR SELECT USING (true);

CREATE POLICY "Allow admin all menu_items" ON menu_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for faqs
CREATE POLICY "Allow public read faqs" ON faqs
    FOR SELECT USING (true);

CREATE POLICY "Allow admin all faqs" ON faqs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

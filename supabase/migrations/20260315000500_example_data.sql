-- Add menu_image_url to stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS menu_image_url TEXT;

-- 1. Ensure columns exist
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS base_price NUMERIC(10,2) DEFAULT 0;

-- 2. Ensure unique constraints exist (using DO block for safety)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_name_key') THEN
        ALTER TABLE menu_items ADD CONSTRAINT menu_items_name_key UNIQUE (name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faqs_question_key') THEN
        ALTER TABLE faqs ADD CONSTRAINT faqs_question_key UNIQUE (question);
    END IF;
END $$;

-- 3. Add example store
INSERT INTO stores (id, name, description, image_url, location, contact, order_index)
VALUES 
('e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 'Daplash House Specialty', 'Our very own kitchen serving the best local delicacies and home-cooked favorites.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800', 'Naga City', '09569414260', 1)
ON CONFLICT (id) DO NOTHING;

-- Add example menu items for the example store
INSERT INTO menu_items (name, description, price, base_price, category, image_url, store_id, order_index)
VALUES 
('Daplash Signature Pizza', 'Freshly baked dough with our secret tomato sauce and premium mozzarella.', 299, 299, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 1),
('Classic Cheese Burger', 'Quarter pounder pure beef patty with melting cheddar and house sauce.', 149, 149, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 2),
('Creamy Carbonara', 'Authentic Italian style pasta with white sauce and crispy bacon.', 189, 189, 'Pasta', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 3),
('Iced Caramel Macchiato', 'Freshly brewed espresso with steamed milk and sweet caramel drizzle.', 110, 110, 'Drinks', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800', 'e0e0e0e0-e0e0-4e0e-ae0e-e0e0e0e0e0e0', 4)
ON CONFLICT (name) DO NOTHING;

-- Add example FAQs
INSERT INTO faqs (question, answer, order_index)
VALUES 
('How fast is your delivery service?', 'Our average delivery time within Naga City is 20 - 30 minutes, depending on the service type and traffic conditions.', 1),
('What are your operating hours?', 'We currently operate from 8am - 12mn daily. However, special delivery arrangements can be made via our Facebook Messenger.', 2),
('Do you deliver outside Naga City?', 'Yes, we do deliver to neighboring towns like Camaligan, Gainza, and Canaman for a small additional delivery fee.', 3),
('How do I pay for the delivery?', 'We primarily accept Cash on Delivery (COD). We are also working on integrating digital payment options like GCash soon.', 4)
ON CONFLICT (question) DO NOTHING;

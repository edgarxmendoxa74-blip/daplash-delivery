-- Seed default store
INSERT INTO stores (name, description, image_url, location, is_active, order_index)
VALUES (
    'Daplash Main', 
    'Our flagship store offering the best selection of food and services.', 
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    'Naga City',
    TRUE,
    0
) ON CONFLICT DO NOTHING;

-- Get the ID of the default store
DO $$
DECLARE
    default_store_id UUID;
BEGIN
    SELECT id INTO default_store_id FROM stores WHERE name = 'Daplash Main' LIMIT 1;

    -- Seed menu items
    INSERT INTO menu_items (name, description, price, base_price, category, image_url, order_index, store_id)
    VALUES 
    (
        'Daplash Signature Pizza',
        'Freshly baked dough with our secret tomato sauce and premium mozzarella.',
        299,
        299,
        'Pizza',
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        0,
        default_store_id
    ),
    (
        'Classic Cheese Burger',
        'Quarter pounder pure beef patty with melting cheddar and house sauce.',
        149,
        149,
        'Burgers',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
        1,
        default_store_id
    ),
    (
        'Creamy Carbonara',
        'Authentic Italian style pasta with white sauce and crispy bacon.',
        189,
        189,
        'Pasta',
        'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',
        2,
        default_store_id
    ),
    (
        'Iced Caramel Macchiato',
        'Freshly brewed espresso with steamed milk and sweet caramel drizzle.',
        110,
        110,
        'Drinks',
        'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800',
        3,
        default_store_id
    ) ON CONFLICT DO NOTHING;
END $$;

-- Seed FAQs
INSERT INTO faqs (question, answer, order_index)
VALUES 
(
    'What are your delivery hours?',
    'We deliver from 8 AM to 10 PM daily.',
    0
),
(
    'How do I track my order?',
    'You can track your order in real-time through the Rider Tracking page after placing an order.',
    1
),
(
    'What payment methods do you accept?',
    'We currently accept Cash on Delivery and GCash payments.',
    2
) ON CONFLICT DO NOTHING;

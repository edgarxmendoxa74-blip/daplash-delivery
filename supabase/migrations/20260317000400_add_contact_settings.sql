-- Add new contact settings to site_settings table
INSERT INTO site_settings (id, value, updated_at)
VALUES 
  ('contact_phone', '09569414260', NOW()),
  ('contact_email', 'support@daplash.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Ensure messenger_id is present (it should be, but let's be sure)
INSERT INTO site_settings (id, value, updated_at)
VALUES ('messenger_id', '61558704207383', NOW())
ON CONFLICT (id) DO NOTHING;

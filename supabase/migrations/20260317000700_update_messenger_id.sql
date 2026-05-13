-- Update Messenger ID to the correct one from the user
INSERT INTO site_settings (id, value, updated_at)
VALUES ('messenger_id', '100064173395989', NOW())
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;

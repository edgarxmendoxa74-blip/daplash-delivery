-- Add external_menu_url to stores table
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS external_menu_url TEXT;

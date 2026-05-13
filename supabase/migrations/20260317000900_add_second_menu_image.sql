-- Add menu_image_2_url to stores table
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS menu_image_2_url TEXT;

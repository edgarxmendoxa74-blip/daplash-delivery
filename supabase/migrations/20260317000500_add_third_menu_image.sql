-- Add menu_image_3_url to stores table
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS menu_image_3_url TEXT;

-- Update existing stores to have a null value (optional but explicit)
-- Not strictly necessary as new columns default to null unless specified otherwise.

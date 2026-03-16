-- Create a new bucket for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'menu-images');

-- Allow authenticated users to upload images
CREATE POLICY "Admin Upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'menu-images');

-- Allow authenticated users to delete images
CREATE POLICY "Admin Delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'menu-images');

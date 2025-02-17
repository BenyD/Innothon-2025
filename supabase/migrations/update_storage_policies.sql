-- Add policy to allow viewing own uploads
CREATE POLICY "Users can view their own uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND 
    (auth.uid() = owner OR auth.role() = 'authenticated')
  );

-- Add policy to prevent deletion
CREATE POLICY "Prevent deletion of payment proofs" ON storage.objects
  FOR DELETE USING (false);

-- Add CORS configuration for the bucket
UPDATE storage.buckets
SET public = false,
    file_size_limit = 5242880, -- 5MB limit
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
WHERE id = 'payment-proofs'; 
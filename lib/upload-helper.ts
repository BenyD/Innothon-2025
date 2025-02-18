import { supabase } from './supabase'

export async function uploadPaymentProof(file: File, registrationId: string) {
  try {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG or PNG file.');
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size too large. Please upload a file smaller than 2MB.');
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${registrationId}-${Date.now()}.${fileExt}`
    
    // Add more detailed error logging
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Explicitly set content type
      })

    if (error) {
      console.error('Supabase storage error:', error);
      if (error.message.includes('Permission denied')) {
        throw new Error('Upload permission denied. Please try again or contact support.');
      }
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Return just the filename
    return fileName;
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    throw error;
  }
} 
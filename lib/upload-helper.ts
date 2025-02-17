import { supabase } from './supabase'

export async function uploadPaymentProof(file: File, registrationId: string) {
  try {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG or PDF file.');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Please upload a file smaller than 5MB.');
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${registrationId}-${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file)

    if (error) throw error

    return {
      success: true,
      filePath: `payment-proofs/${fileName}`
    }
  } catch (error) {
    console.error('Error uploading payment proof:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    }
  }
} 
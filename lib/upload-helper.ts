import { supabase } from './supabase'

type AllowedMimeType = 'image/jpeg' | 'image/png' | 'image/jpg' | 'application/pdf';

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
    const fileName = `${registrationId}_payment.${fileExt}`
    
    const { error: uploadError, data } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type as AllowedMimeType
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
} 
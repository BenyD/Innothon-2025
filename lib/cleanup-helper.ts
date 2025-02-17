import { supabase } from '@/lib/supabase';

export async function cleanupFailedRegistration(registrationId: string) {
  try {
    // Delete the uploaded file if it exists
    await supabase.storage
      .from('payment-proofs')
      .remove([`${registrationId}_payment.*`]);

    // Delete the registration record
    await supabase
      .from('registrations')
      .delete()
      .eq('id', registrationId);

    return {
      success: true
    };
  } catch (error) {
    console.error('Error cleaning up failed registration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cleanup registration'
    };
  }
} 
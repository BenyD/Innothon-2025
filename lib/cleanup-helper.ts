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

    // Team members will be automatically deleted due to CASCADE
  } catch (error) {
    console.error('Cleanup error:', error);
  }
} 
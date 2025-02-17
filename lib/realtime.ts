import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function createRealtimeSubscription(
  table: string,
  onUpdate: (payload: any) => void
): RealtimeChannel {
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
      },
      (payload) => onUpdate(payload)
    )
    .subscribe();
} 
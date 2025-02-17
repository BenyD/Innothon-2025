import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { handleError } from '@/lib/error-handler';
import { createRealtimeSubscription } from '@/lib/realtime';

export function useAdminData<T>(
  table: string,
  query: string | undefined,
  options?: { realtime?: boolean }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: responseData, error } = await supabase
          .from(table)
          .select<string, T>(query);

        if (error) throw error;
        setData(responseData as T[] || []);
      } catch (error) {
        handleError(error, `fetching ${table}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (options?.realtime) {
      const subscription = createRealtimeSubscription(table, () => fetchData());
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [table, query, options?.realtime]);

  return { data, loading, setData };
} 
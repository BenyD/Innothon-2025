import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'super-admin' | 'admin' | 'member' | null;

export function useRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setRole(null);
          return;
        }

        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setRole(data?.role as UserRole);
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading };
} 
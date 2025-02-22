import { useRole } from '@/hooks/useRole';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { role, loading } = useRole();

  if (loading) return null;
  
  if (!role || !allowedRoles.includes(role)) {
    return fallback;
  }

  return <>{children}</>;
} 
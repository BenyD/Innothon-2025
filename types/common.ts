export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  loading?: boolean;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
} 
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
}

export type Registration = {
  id: string;
  team_size: number;
  selected_events: string[];
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  team_members: TeamMember[];
  transaction_id?: string;
  payment_method?: string;
  payment_proof?: string;
}; 
export interface Expense {
  id: string;
  bill_name: string;
  person_name: string;
  bill_number: string | null;
  items: string[];
  quantity: number[];
  amount: number;
  needs_stamp: boolean;
  is_reimbursed: boolean;
  bill_file?: string;
  bill_url?: string;
  created_at: string;
  updated_at: string;
}

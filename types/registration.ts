export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  gender: string;
  player_id?: string | null;
};

export type Registration = {
  id: string;
  team_id: string;
  team_name: string;
  team_size: number;
  selected_events: string[];
  total_amount: number;
  status: "pending" | "approved" | "rejected";
  payment_status: "pending" | "completed" | "failed";
  created_at: string;
  team_members: TeamMember[];
  transaction_id?: string;
  payment_method?: string;
  payment_proof?: string;
  game_details?: {
    game: "bgmi" | "freefire" | "pes" | null;
    format?: "duo" | "squad";
  } | null;
  payment_date?: string;
};

export type GameDetails = {
  game: "bgmi" | "freefire" | "pes";
  format?: "squad";
};

export type Tables = {
  registrations: {
    Row: {
      id: string;
      team_id: string;
      team_size: number;
      selected_events: string[];
      total_amount: number;
      status: "pending" | "approved" | "rejected";
      payment_status: "pending" | "completed" | "failed";
      payment_method: "upi" | "bank" | null;
      transaction_id: string | null;
      payment_proof: string | null;
      created_at: string;
      updated_at: string;
      game_details: {
        game: "bgmi" | "freefire" | "pes" | null;
        format?: "squad";
      } | null;
    };
    Insert: Omit<
      Tables["registrations"]["Row"],
      "id" | "created_at" | "updated_at"
    >;
    Update: Partial<Tables["registrations"]["Row"]>;
  };
  team_members: {
    Row: {
      id: string;
      registration_id: string;
      team_id: string;
      name: string;
      email: string;
      phone: string;
      college: string;
      department: string;
      year: string;
      gender: string;
      created_at: string;
      player_id: string | null;
    };
    Insert: Omit<Tables["team_members"]["Row"], "id" | "created_at">;
    Update: Partial<Tables["team_members"]["Row"]>;
  };
  events: {
    Row: {
      id: string;
      status: "upcoming" | "ongoing" | "closed";
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables["events"]["Row"], "created_at" | "updated_at">;
    Update: Partial<Tables["events"]["Row"]>;
  };
  attendance: {
    Row: {
      id: string;
      team_member_id: string;
      event_id: string;
      marked_at: string;
      marked_by: string;
      created_at: string;
    };
    Insert: Omit<Tables["attendance"]["Row"], "id" | "created_at">;
    Update: Partial<Tables["attendance"]["Row"]>;
  };
};

export type Database = {
  public: {
    Tables: Tables;
  };
};

export type GameDetails = {
  game: "bgmi" | "freefire" | "pes" | null;
  format?: "squad";
};

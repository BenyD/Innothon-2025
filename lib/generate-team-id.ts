import { supabase } from "./supabase";

export async function generateTeamId(): Promise<string> {
  try {
    // Get the latest team ID from the database
    const { data, error } = await supabase
      .from("registrations")
      .select("team_id")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    let nextNumber = 1;
    
    if (data && data.length > 0 && data[0].team_id) {
      // Extract the number from the existing team ID (e.g., "IN25-001" -> 1)
      const currentNumber = parseInt(data[0].team_id.split('-')[1], 10);
      nextNumber = currentNumber + 1;
    }

    // Format: IN25-001, IN25-002, etc.
    const teamId = `IN25-${String(nextNumber).padStart(3, '0')}`;

    // Double-check if this team ID already exists (extra safety)
    const { data: existingTeam, error: checkError } = await supabase
      .from("registrations")
      .select("team_id")
      .eq("team_id", teamId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is what we want
      throw checkError;
    }

    if (existingTeam) {
      // In the unlikely case of a collision, recursively try again
      return generateTeamId();
    }

    return teamId;
  } catch (error) {
    console.error("Error generating team ID:", error);
    throw error;
  }
} 
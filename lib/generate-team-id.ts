import { supabase } from "./supabase";

export async function generateTeamId(): Promise<string> {
  try {
    // Get the count of existing registrations
    const { count, error } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    // Generate the sequential number (starting from 1)
    const sequentialNumber = (count || 0) + 1;
    
    // Format: IN25-001, IN25-002, etc.
    const teamId = `IN25-${String(sequentialNumber).padStart(3, '0')}`;
    
    return teamId;
  } catch (error) {
    console.error("Error generating team ID:", error);
    throw error;
  }
} 
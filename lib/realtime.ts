import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

// Add specific type for payload and handler
interface RealtimePayload {
  new: Record<string, unknown>;
  old: Record<string, unknown>;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  [key: string]: unknown;
}

type RealtimeUpdateHandler = (payload: RealtimePayload) => void;

export function createRealtimeSubscription(
  table: string,
  onUpdate: RealtimeUpdateHandler
): RealtimeChannel {
  return supabase
    .channel(`${table}_changes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
      },
      (payload) => onUpdate(payload as RealtimePayload)
    )
    .subscribe();
}

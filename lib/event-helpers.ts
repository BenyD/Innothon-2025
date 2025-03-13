import { supabase } from "@/lib/supabase";
import { events } from "@/data/events";

/**
 * Initialize the events table with data from the events.ts file
 * This should be called once when setting up the application
 */
export const initializeEventsTable = async () => {
  try {
    console.log("Checking if events table exists...");

    // First check if the table exists
    const { error: tableCheckError } = await supabase
      .from("events")
      .select("id")
      .limit(1)
      .single();

    // Log detailed error information
    if (tableCheckError) {
      console.error("Table check error details:", {
        code: tableCheckError.code,
        message: tableCheckError.message,
        details: tableCheckError.details,
        hint: tableCheckError.hint,
      });
    }

    // If the table doesn't exist, try to create it directly
    if (
      tableCheckError &&
      (tableCheckError.code === "PGRST116" ||
        tableCheckError.message?.includes("does not exist"))
    ) {
      console.log("Attempting to create events table directly...");

      try {
        // Try to create the table directly using RPC
        // Note: This is not possible from client-side code, just showing the schema
        console.log(
          "Table creation not possible from client. Using static data for now."
        );
        console.log(
          "Please create the events table manually using the SQL migration script."
        );

        // Return early and use static data
        return;
      } catch (createError) {
        console.error("Error creating table:", createError);
        return;
      }
    }

    // Check if events table already has data
    const { data, error: checkError } = await supabase
      .from("events")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error checking events table:", checkError);
      throw checkError;
    }

    // If table is empty, populate it
    if (data && data.length === 0) {
      console.log("Initializing events table with data...");

      const eventsToInsert = events.map((event) => ({
        id: event.id,
        status: event.status as "upcoming" | "ongoing" | "closed",
      }));

      const { error: insertError } = await supabase
        .from("events")
        .insert(eventsToInsert);

      if (insertError) {
        console.error("Error inserting events:", insertError);
        throw insertError;
      }

      console.log(
        "Events table initialized successfully with",
        eventsToInsert.length,
        "events"
      );
    } else {
      console.log(
        "Events table already contains data, skipping initialization"
      );
    }
  } catch (error) {
    console.error("Error initializing events table:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error type:", typeof error);
      console.error("Error stringified:", JSON.stringify(error));
    }
  }
};

/**
 * Get all events with their current status from the database
 */
export const getEventsWithStatus = async () => {
  try {
    console.log("Fetching event statuses from database...");
    const { data, error } = await supabase
      .from("events")
      .select("id, status")
      .order("id");

    if (error) {
      console.error("Database error when fetching events:", error);
      throw error;
    }

    // If no data in database yet, return the static data
    if (!data || data.length === 0) {
      console.log("No events found in database, using static data");
      return events.map((event) => ({
        id: event.id,
        status: event.status,
      }));
    }

    console.log("Events fetched from database:", data);

    // Merge database data with static data to ensure all events are included
    // but prioritize database values
    const mergedEvents = events.map((staticEvent) => {
      const dbEvent = data.find((e) => e.id === staticEvent.id);
      return {
        id: staticEvent.id,
        status: dbEvent ? dbEvent.status : staticEvent.status,
      };
    });

    return mergedEvents;
  } catch (error) {
    console.error("Error fetching events with status:", error);
    // Fallback to static data
    console.log("Falling back to static data due to error");
    return events.map((event) => ({
      id: event.id,
      status: event.status,
    }));
  }
};

/**
 * Update the status of an event in the database
 */
export const updateEventStatus = async (eventId: string, status: string) => {
  try {
    console.log(`Updating event ${eventId} status to ${status}...`);

    // Check if the event exists first
    const { error: checkError } = await supabase
      .from("events")
      .select("id, status")
      .eq("id", eventId)
      .single();

    if (checkError) {
      console.error(`Error checking if event ${eventId} exists:`, checkError);
      return {
        success: false,
        error: checkError,
        message: `Event ${eventId} not found or could not be accessed.`,
      };
    }

    // If the event exists, update its status
    const { error } = await supabase
      .from("events")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) {
      console.error(`Error updating event ${eventId} status:`, error);

      // Try a direct SQL query as a fallback
      console.log(`Attempting direct SQL update for event ${eventId}...`);
      try {
        const { error: sqlError } = await supabase.rpc("update_event_status", {
          p_event_id: eventId,
          p_status: status,
        });

        if (sqlError) {
          console.error(`SQL update for event ${eventId} failed:`, sqlError);
          return {
            success: false,
            error: sqlError,
            message: `Failed to update event ${eventId} status via SQL: ${sqlError.message}`,
          };
        }

        console.log(
          `Successfully updated event ${eventId} status to ${status} via SQL`
        );
        return {
          success: true,
          message: `Event ${eventId} status updated to ${status} via SQL`,
        };
      } catch (sqlError) {
        console.error(
          `Unexpected error in SQL update for event ${eventId}:`,
          sqlError
        );
        return {
          success: false,
          error,
          message: `Failed to update event ${eventId} status: ${error.message}`,
        };
      }
    }

    console.log(`Successfully updated event ${eventId} status to ${status}`);
    return {
      success: true,
      message: `Event ${eventId} status updated to ${status}`,
    };
  } catch (error) {
    console.error(`Unexpected error updating event ${eventId} status:`, error);
    return {
      success: false,
      error,
      message: `Unexpected error updating event ${eventId} status: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};

/**
 * Get the current status of an event from the database
 */
export const getEventStatus = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("status")
      .eq("id", eventId)
      .single();

    if (error) throw error;

    return data?.status || "upcoming"; // Default to upcoming if not found
  } catch (error) {
    console.error(`Error fetching status for event ${eventId}:`, error);

    // Fallback to static data
    const event = events.find((e) => e.id === eventId);
    return event?.status || "upcoming";
  }
};

/**
 * Check if an event is disabled for registration
 * An event is disabled if its status is 'closed'
 */
export const isEventDisabledForRegistration = async (eventId: string) => {
  try {
    const status = await getEventStatus(eventId);
    return status === "closed";
  } catch (error) {
    console.error(`Error checking if event ${eventId} is disabled:`, error);
    // Default to enabled if there's an error
    return false;
  }
};

/**
 * Get all events that are available for registration
 * (events with status 'upcoming' or 'ongoing')
 */
export const getAvailableEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id, status")
      .not("status", "eq", "closed")
      .order("id");

    if (error) throw error;

    // If no data in database yet, return the static data filtered by status
    if (!data || data.length === 0) {
      return events
        .filter((event) => event.status !== "closed")
        .map((event) => ({
          id: event.id,
          status: event.status,
        }));
    }

    return data;
  } catch (error) {
    console.error("Error fetching available events:", error);
    // Fallback to static data
    return events
      .filter((event) => event.status !== "closed")
      .map((event) => ({
        id: event.id,
        status: event.status,
      }));
  }
};

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const teamId = searchParams.get("teamId");

    let query = supabase.from("attendance").select(`
      *,
      team_members!inner (
        *,
        registrations!inner (*)
      )
    `);

    // Apply filters if provided
    if (eventId && eventId !== "all") {
      query = query.eq("event_id", eventId);
    }

    if (teamId) {
      query = query.eq("team_members.team_id", teamId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching attendance:", error);
      return NextResponse.json(
        { error: "Failed to fetch attendance data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { team_member_id, event_id, marked_by } = body;

    if (!team_member_id || !event_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if attendance record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("attendance")
      .select("*")
      .eq("team_member_id", team_member_id)
      .eq("event_id", event_id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking attendance record:", checkError);
      return NextResponse.json(
        { error: "Failed to check attendance record" },
        { status: 500 }
      );
    }

    if (existingRecord) {
      return NextResponse.json(
        { error: "Attendance already marked", data: existingRecord },
        { status: 409 }
      );
    }

    // Create new attendance record
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        team_member_id,
        event_id,
        marked_at: new Date().toISOString(),
        marked_by: marked_by || "admin",
      })
      .select();

    if (error) {
      console.error("Error marking attendance:", error);
      return NextResponse.json(
        { error: "Failed to mark attendance" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const teamMemberId = searchParams.get("teamMemberId");
    const eventId = searchParams.get("eventId");

    if (!id && (!teamMemberId || !eventId)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    let query = supabase.from("attendance").delete();

    if (id) {
      query = query.eq("id", id);
    } else {
      query = query
        .eq("team_member_id", teamMemberId as string)
        .eq("event_id", eventId as string);
    }

    const { error } = await query;

    if (error) {
      console.error("Error removing attendance:", error);
      return NextResponse.json(
        { error: "Failed to remove attendance" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import type { TeamMember } from "@/types/registration";
import { events } from "@/data/events";

export async function sendApprovalEmails(
  teamMembers: TeamMember[],
  registrationId: string,
  selectedEventIds: string[],
  totalAmount: number,
  teamSize: number,
  teamId: string
) {
  const selectedEventTitles = selectedEventIds.map(
    (id) => events.find((e) => e.id === id)?.title || id
  );

  try {
    console.log("Sending approval emails...");
    const response = await fetch("/api/send-approval-emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamMembers,
        registrationId,
        selectedEvents: selectedEventTitles,
        totalAmount,
        teamSize,
        teamId,
      }),
    });

    const data = await response.json();
    console.log("Email API response:", data);

    if (!response.ok || !data.success) {
      console.error("Email sending failed:", data);
      throw new Error(
        data.error || 
        `Failed to send emails (Status: ${response.status})`
      );
    }

    return { 
      success: true, 
      details: data.details 
    };
  } catch (error) {
    console.error("Error sending approval emails:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      details: error
    };
  }
}

export async function sendRejectionEmails(
  teamMembers: TeamMember[],
  registrationId: string,
  selectedEventIds: string[],
  totalAmount: number,
  teamSize: number
) {
  const selectedEventTitles = selectedEventIds.map(
    (id) => events.find((e) => e.id === id)?.title || id
  );

  try {
    const response = await fetch("/api/send-rejection-emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamMembers,
        registrationId,
        selectedEvents: selectedEventTitles,
        totalAmount,
        teamSize,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to send emails");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending rejection emails:", error);
    return { success: false, error };
  }
}

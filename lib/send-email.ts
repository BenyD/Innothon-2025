import type { TeamMember } from "@/types/registration";
import { events } from "@/data/events";

export async function sendApprovalEmails(
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
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to send emails");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending approval emails:", error);
    return { success: false, error };
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

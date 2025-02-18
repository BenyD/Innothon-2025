import * as XLSX from "xlsx";
import { events } from "@/data/events";
import type { Registration } from "@/types/registration";

interface GameDetails {
  game: "bgmi" | "freefire" | "pes" | null;
  format?: "duo" | "squad";
}

type ExcelRow = Record<string, string | number>;

export const exportToExcel = (data: ExcelRow[], filename: string) => {
  // Add column widths for better readability
  const colWidths = [
    { wch: 25 }, // Team Name
    { wch: 30 }, // College
    { wch: 15 }, // Status
    { wch: 12 }, // Amount
    { wch: 25 }, // Transaction ID
    { wch: 25 }, // Leader Name
    { wch: 30 }, // Leader Email
    { wch: 15 }, // Leader Phone
    { wch: 25 }, // Member 2
    { wch: 30 }, // Member 2 College
    { wch: 25 }, // Member 3
    { wch: 30 }, // Member 3 College
    { wch: 20 }, // Registration Date
    { wch: 15 }, // Payment Status
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Apply column widths
  worksheet["!cols"] = colWidths;

  // Add some styling
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

  // Add the file creation date to the filename
  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}_${date}.xlsx`);
};

const getEventTitles = (eventIds: string[]): string => {
  return eventIds
    .map(
      (eventId) =>
        events.find((e) => e.id === eventId)?.title || "Unknown Event"
    )
    .join(", ");
};

const formatGameDetails = (details: GameDetails): string => {
  if (!details) return "-";

  const parts = [];
  if (details.game) parts.push(`Game: ${details.game}`);
  if (details.format) parts.push(`Format: ${details.format}`);

  return parts.length ? parts.join(" | ") : "-";
};

export const formatRegistrationForExcel = (registration: Registration) => {
  // Format the date
  const registrationDate = new Date(registration.created_at).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  // Format the amount with Indian currency
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(registration.total_amount);

  // Capitalize status
  const formattedStatus =
    registration.status.charAt(0).toUpperCase() + registration.status.slice(1);

  return {
    "Team Name": registration.team_name || "N/A",
    College: registration.team_members[0]?.college || "N/A",
    Status: formattedStatus,
    Amount: formattedAmount,
    "Transaction ID": registration.transaction_id || "Pending",
    "Payment Status": registration.payment_status || "Pending",
    "Payment Date": registration.payment_date
      ? new Date(registration.payment_date).toLocaleString("en-IN")
      : "Pending",
    "Leader Name": registration.team_members[0]?.name || "N/A",
    "Leader Email": registration.team_members[0]?.email || "N/A",
    "Leader Phone": registration.team_members[0]?.phone || "N/A",
    "Leader Gender": registration.team_members[0]?.gender || "N/A",
    "Member 2": registration.team_members[1]?.name || "-",
    "Member 2 College": registration.team_members[1]?.college || "-",
    "Member 2 Phone": registration.team_members[1]?.phone || "-",
    "Member 3": registration.team_members[2]?.name || "-",
    "Member 3 College": registration.team_members[2]?.college || "-",
    "Member 3 Phone": registration.team_members[2]?.phone || "-",
    "Registration Date": registrationDate,
    "Selected Events": Array.isArray(registration.selected_events)
      ? getEventTitles(registration.selected_events)
      : "N/A",
    "Game Details": registration.game_details
      ? formatGameDetails(registration.game_details)
      : "-",
  };
};

// Add a new function for event-specific exports
export const formatEventRegistrationForExcel = (
  registration: Registration,
  eventId: string
) => {
  const baseFormat = formatRegistrationForExcel(registration);
  const event = events.find((e) => e.id === eventId);

  // Add event-specific fields
  const eventSpecificFormat = {
    ...baseFormat,
    Event: event?.title || "Unknown Event",
    "Event Fee": event?.registrationFee || "N/A",
  };

  // Add special fields for Pixel Showdown
  if (eventId === "pixel-showdown" && registration.game_details) {
    return {
      ...eventSpecificFormat,
      "Game Type": registration.game_details.game || "N/A",
      "Game ID": registration.game_details.format || "N/A",
    };
  }

  return eventSpecificFormat;
};

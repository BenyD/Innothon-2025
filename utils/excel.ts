import * as XLSX from "xlsx";
import { events } from "@/data/events";
import type { Registration, GameDetails } from "@/types/registration";

type ExcelRow = Record<string, string | number>;

export const exportToExcel = (data: ExcelRow[], filename: string) => {
  // Sort data by Team ID in ascending order
  const sortedData = [...data].sort((a, b) => {
    const teamIdA = (a["Team ID"] as string) || "";
    const teamIdB = (b["Team ID"] as string) || "";
    return teamIdA.localeCompare(teamIdB);
  });

  // Updated column widths for better readability
  const colWidths = [
    { wch: 15 }, // Registration ID
    { wch: 15 }, // Team ID
    { wch: 20 }, // Registration Date
    { wch: 25 }, // Team Name
    { wch: 12 }, // Status
    { wch: 12 }, // Payment Status
    { wch: 20 }, // Transaction ID
    { wch: 20 }, // Payment Date
    { wch: 15 }, // Amount
    { wch: 25 }, // Leader Name
    { wch: 30 }, // Leader Email
    { wch: 15 }, // Leader Phone
    { wch: 30 }, // Leader College
    { wch: 20 }, // Leader Department
    { wch: 8 }, // Leader Year
    { wch: 10 }, // Leader Gender
    { wch: 25 }, // Member 2
    { wch: 30 }, // Member 2 Email
    { wch: 15 }, // Member 2 Phone
    { wch: 30 }, // Member 2 College
    { wch: 20 }, // Member 2 Department
    { wch: 8 }, // Member 2 Year
    { wch: 25 }, // Member 3
    { wch: 30 }, // Member 3 Email
    { wch: 15 }, // Member 3 Phone
    { wch: 30 }, // Member 3 College
    { wch: 20 }, // Member 3 Department
    { wch: 8 }, // Member 3 Year
    { wch: 40 }, // Selected Events
    { wch: 25 }, // Game Type
    { wch: 15 }, // Game Format
    { wch: 15 }, // Player ID
  ];

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create the main worksheet with sorted data
  const worksheet = XLSX.utils.json_to_sheet(sortedData);

  // Set column widths
  worksheet["!cols"] = colWidths;

  // Add column headers with bold styling
  const headers = [
    "Registration ID",
    "Team ID",
    "Registration Date",
    "Team Name",
    "Status",
    "Payment Status",
    "Transaction ID",
    "Payment Date",
    "Amount",
    "Leader Name",
    "Leader Email",
    "Leader Phone",
    "Leader College",
    "Leader Department",
    "Leader Year",
    "Leader Gender",
    "Member 2",
    "Member 2 Email",
    "Member 2 Phone",
    "Member 2 College",
    "Member 2 Department",
    "Member 2 Year",
    "Member 3",
    "Member 3 Email",
    "Member 3 Phone",
    "Member 3 College",
    "Member 3 Department",
    "Member 3 Year",
    "Selected Events",
    "Game Type",
    "Game Format",
    "Player ID",
  ].map((header) => ({ v: header, t: "s", s: { font: { bold: true } } }));

  // Add headers at the top
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

  // Add the date to the filename
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

const formatGameDetails = (
  details: Omit<GameDetails, "game"> & { game: GameDetails["game"] | null }
): string => {
  if (!details) return "-";

  const parts = [];
  if (details.game) parts.push(`Game: ${details.game}`);
  if (details.format) parts.push(`Format: ${details.format}`);

  return parts.length ? parts.join(" | ") : "-";
};

export const formatRegistrationForExcel = (registration: Registration) => {
  // Format the date with time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format the amount with Indian currency
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(registration.total_amount);

  // Capitalize status
  const formattedStatus =
    registration.status.charAt(0).toUpperCase() + registration.status.slice(1);

  // Format payment status
  const formattedPaymentStatus =
    registration.payment_status.charAt(0).toUpperCase() +
    registration.payment_status.slice(1);

  // Format selected events
  const formattedEvents = Array.isArray(registration.selected_events)
    ? registration.selected_events
        .map((event) => events.find((e) => e.id === event)?.title || event)
        .join(", ")
    : "N/A";

  // Format game details
  const formatGameDetails = (details: GameDetails) => {
    if (!details) return "-";
    return `${details.game?.toUpperCase() || "N/A"} (${details.format?.toUpperCase() || "N/A"})`;
  };

  return {
    "Registration ID": registration.id || "N/A",
    "Team ID": registration.team_id || "N/A",
    "Registration Date": formatDate(registration.created_at),
    "Team Name": registration.team_name || "N/A",
    Status: formattedStatus,
    "Payment Status": formattedPaymentStatus,
    "Transaction ID": registration.transaction_id || "Pending",
    "Payment Date": registration.payment_date
      ? formatDate(registration.payment_date)
      : "Pending",
    Amount: formattedAmount,

    // Leader Details
    "Leader Name": registration.team_members[0]?.name || "N/A",
    "Leader Email": registration.team_members[0]?.email || "N/A",
    "Leader Phone": registration.team_members[0]?.phone || "N/A",
    "Leader College": registration.team_members[0]?.college || "N/A",
    "Leader Department": registration.team_members[0]?.department || "N/A",
    "Leader Year": registration.team_members[0]?.year || "N/A",
    "Leader Gender": registration.team_members[0]?.gender || "N/A",

    // Member 2 Details
    "Member 2": registration.team_members[1]?.name || "-",
    "Member 2 Email": registration.team_members[1]?.email || "-",
    "Member 2 Phone": registration.team_members[1]?.phone || "-",
    "Member 2 College": registration.team_members[1]?.college || "-",
    "Member 2 Department": registration.team_members[1]?.department || "-",
    "Member 2 Year": registration.team_members[1]?.year || "-",

    // Member 3 Details
    "Member 3": registration.team_members[2]?.name || "-",
    "Member 3 Email": registration.team_members[2]?.email || "-",
    "Member 3 Phone": registration.team_members[2]?.phone || "-",
    "Member 3 College": registration.team_members[2]?.college || "-",
    "Member 3 Department": registration.team_members[2]?.department || "-",
    "Member 3 Year": registration.team_members[2]?.year || "-",

    "Selected Events": formattedEvents,
    "Game Type": registration.game_details?.game?.toUpperCase() || "N/A",
    "Game Format": registration.game_details?.format?.toUpperCase() || "N/A",
    "Player ID": registration.team_members[0]?.player_id || "N/A",
  };
};

export const formatEventRegistrationForExcel = (
  registration: Registration,
  eventId: string
) => {
  const baseFormat = formatRegistrationForExcel(registration);
  const event = events.find((e) => e.id === eventId);

  // Add event-specific fields
  const eventSpecificFormat = {
    ...baseFormat,
    "Event Name": event?.title || "Unknown Event",
    "Event Fee": event?.registrationFee || "N/A",
  };

  // Add special fields for Pixel Showdown
  if (eventId === "pixel-showdown" && registration.game_details) {
    return {
      ...eventSpecificFormat,
      "Game Type": registration.game_details.game?.toUpperCase() || "N/A",
      "Game Format": registration.game_details.format?.toUpperCase() || "N/A",
      "Player ID": registration.team_members[0]?.player_id || "N/A",
    };
  }

  return eventSpecificFormat;
};

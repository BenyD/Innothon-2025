import * as XLSX from "xlsx";
import { events } from "@/data/events";
import type { Registration, TeamMember } from "@/types/registration";

type ExcelData = Record<string, string | number | null | undefined>;
type ExcelRow = ExcelData;

// Custom error class for Excel operations
export class ExcelExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExcelExportError";
  }
}

// Constants
const BATCH_SIZE = 1000;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Cache implementation
class ExcelCache {
  private cache: Map<string, { data: XLSX.WorkBook; timestamp: number }>;
  private readonly maxSize: number;

  constructor(maxSize = 10) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): XLSX.WorkBook | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, workbook: XLSX.WorkBook): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp
      )[0][0];
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data: workbook, timestamp: Date.now() });
  }
}

const excelCache = new ExcelCache();

// Validate data before export
const validateExportData = (data: ExcelRow[]) => {
  if (!Array.isArray(data)) {
    throw new ExcelExportError("Export data must be an array");
  }
  if (data.length === 0) {
    throw new ExcelExportError("Export data cannot be empty");
  }
};

// Field validation rules
const validateField = (
  value: string | number | null | undefined,
  fieldName: string
): boolean => {
  if (value === null || value === undefined) return true;

  switch (fieldName) {
    case "Email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
    case "Phone":
      return /^\d{10}$/.test(String(value));
    case "Year":
      return ["1", "2", "3", "4"].includes(String(value));
    default:
      return true;
  }
};

// Create cell styles
const createStyles = () => {
  return {
    header: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4A5568" } },
      alignment: { vertical: "center", horizontal: "center" },
    },
    date: { numFmt: "yyyy-mm-dd hh:mm:ss" },
    text: { alignment: { vertical: "center", horizontal: "left" } },
    center: { alignment: { vertical: "center", horizontal: "center" } },
  };
};

// Process data in batches
const processBatch = async (
  data: ExcelRow[],
  start: number,
  onProgress?: (progress: number) => void
): Promise<ExcelRow[]> => {
  const batch = data.slice(start, start + BATCH_SIZE);
  const processedBatch = batch.map((row) =>
    Object.entries(row).reduce((acc, [key, value]) => {
      if (validateField(value, key)) {
        acc[key] = value;
      } else {
        acc[key] = "Invalid";
      }
      return acc;
    }, {} as ExcelRow)
  );

  if (onProgress) {
    const progress = Math.min(((start + BATCH_SIZE) / data.length) * 100, 100);
    onProgress(progress);
  }

  return processedBatch;
};

export const exportToExcel = async (
  data: ExcelData[],
  filename: string,
  isAccountsSheet: boolean = false,
  onProgress?: (progress: number) => void
) => {
  try {
    // Validate the data
    validateExportData(data);

    // Check cache first
    const cacheKey = `${filename}_${JSON.stringify(data)}`;
    const cachedWorkbook = excelCache.get(cacheKey);
    if (cachedWorkbook) {
      XLSX.writeFile(
        cachedWorkbook,
        `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      return;
    }

    const styles = createStyles();

    // Get columns from all data to ensure we capture all possible keys
    const columns = Array.from(
      new Set(data.flatMap((row) => Object.keys(row)))
    ).map((key) => ({
      key,
      width: Math.max(
        15, // minimum width
        Math.min(
          50, // maximum width
          key.length * 1.5 // approximate width based on key length
        )
      ),
    }));

    // Ensure we have at least one column
    if (columns.length === 0) {
      throw new ExcelExportError("No columns found in data");
    }

    const workbook = XLSX.utils.book_new();
    let processedData: ExcelRow[] = [];

    // Process data in batches
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batchData = await processBatch(data, i, onProgress);
      processedData = [...processedData, ...batchData];
    }

    // Ensure all rows have all columns (with empty values for missing data)
    const normalizedData = processedData.map((row) => {
      const normalizedRow: ExcelRow = {};
      columns.forEach(({ key }) => {
        normalizedRow[key] = row[key] ?? "N/A";
      });
      return normalizedRow;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(normalizedData);

    // Set column widths
    worksheet["!cols"] = columns.map((col) => ({ wch: col.width }));

    // Add headers with styling
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [columns.map((col) => ({ v: col.key, t: "s", s: styles.header }))],
      { origin: "A1" }
    );

    // Add styling to data cells
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          // Apply currency format to Amount column
          if (columns[C].key === "Amount") {
            cell.s = { ...styles.text, numFmt: "₹#,##0.00" };
          } else if (columns[C].key.includes("Date")) {
            cell.s = styles.date;
          } else {
            cell.s = styles.text;
          }
        }
      }
    }

    // Add auto filter and freeze panes
    worksheet["!autofilter"] = {
      ref: `A1:${XLSX.utils.encode_col(columns.length - 1)}1`,
    };
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isAccountsSheet ? "Accounts" : "Registrations"
    );

    // Cache the workbook
    excelCache.set(cacheKey, workbook);

    // Save the file
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `${filename}_${date}.xlsx`);
  } catch (error: unknown) {
    console.error("Excel export error:", error);
    if (error instanceof ExcelExportError) {
      throw error;
    }
    throw new ExcelExportError(
      `Failed to export Excel file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const formatRegistrationForExcel = (registration: Registration) => {
  try {
    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "Invalid Date";
      }
    };

    // Format selected events with null check
    const formattedEvents = Array.isArray(registration.selected_events)
      ? registration.selected_events
          .map((event) => events.find((e) => e.id === event)?.title || event)
          .join(", ")
      : "N/A";

    // Base data for a team member with null checks
    const createMemberData = (
      member: TeamMember | undefined,
      memberType: string
    ) => ({
      "Team ID": registration.team_id || "N/A",
      "Registration ID": registration.id || "N/A",
      Amount: registration.total_amount || 0,
      Name: member?.name || "N/A",
      Email: member?.email || "N/A",
      Phone: member?.phone || "N/A",
      College: member?.college || "N/A",
      Department: member?.department || "N/A",
      Year: member?.year || "N/A",
      "Selected Events": formattedEvents,
      "Registration Date": formatDate(
        registration.created_at || new Date().toISOString()
      ),
      "Member Type": memberType,
    });

    // Ensure team_members array exists and has at least one member
    if (
      !Array.isArray(registration.team_members) ||
      registration.team_members.length === 0
    ) {
      // Return single row with available registration data
      return [
        {
          "Team ID": registration.team_id || "N/A",
          "Registration ID": registration.id || "N/A",
          Amount: registration.total_amount || 0,
          Name: "N/A",
          Email: "N/A",
          Phone: "N/A",
          College: "N/A",
          Department: "N/A",
          Year: "N/A",
          "Selected Events": formattedEvents,
          "Registration Date": formatDate(
            registration.created_at || new Date().toISOString()
          ),
          "Member Type": "No Members",
        },
      ];
    }

    // Create an array of team members' data with proper checks
    const teamData = [
      // Always include the leader (first member)
      createMemberData(registration.team_members[0], "Leader"),
      // Add other members if they exist
      ...(registration.team_members.slice(1) || []).map((member, index) =>
        createMemberData(member, `Member ${index + 2}`)
      ),
    ];

    return teamData;
  } catch {
    // Return a single row with error information
    return [
      {
        "Team ID": registration?.team_id || "Error",
        "Registration ID": registration?.id || "Error",
        Amount: 0,
        Name: "Error Processing Registration",
        Email: "N/A",
        Phone: "N/A",
        College: "N/A",
        Department: "N/A",
        Year: "N/A",
        "Selected Events": "N/A",
        "Registration Date": new Date().toLocaleString("en-IN"),
        "Member Type": "Error",
      },
    ];
  }
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

export const formatAttendanceForExcel = (
  registration: Registration,
  member: TeamMember,
  eventName: string,
  isAttending: boolean
) => {
  return {
    "Team ID": registration.team_id || "N/A",
    "Team Name": registration.team_name || "N/A",
    "Member Name": member.name || "N/A",
    Email: member.email || "N/A",
    Phone: member.phone || "N/A",
    College: member.college || "N/A",
    Department: member.department || "N/A",
    Year: member.year || "N/A",
    Event: eventName,
    "Attendance Status": isAttending ? "Present" : "Absent",
    Date: new Date().toLocaleDateString(),
  };
};

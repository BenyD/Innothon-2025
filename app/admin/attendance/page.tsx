"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  CheckCircle2,
  User2,
  Calendar,
  RefreshCw,
  Download,
  Percent,
  UserCheck,
  School,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { exportToExcel } from "@/utils/excel";
import type {
  Registration,
  Attendance,
  TeamMember,
} from "@/types/registration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { events } from "@/data/events";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Helper function to get event display names
const getEventDisplayName = (eventCode: string) => {
  switch (eventCode) {
    case "pixel-showdown":
      return "Pixel Showdown";
    case "code-quest":
      return "Code Quest";
    case "design-derby":
      return "Design Derby";
    case "idea-innovate":
      return "Idea Innovate";
    case "capture-the-flag":
      return "Capture The Flag";
    default:
      return eventCode
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

type SortOrder = "asc" | "desc";

export default function AttendancePage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [attendanceData, setAttendanceData] = useState<
    Record<string, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<SortOrder>("asc");
  const [attendanceStats, setAttendanceStats] = useState({
    totalApproved: 0,
    totalAttended: 0,
    attendancePercentage: 0,
  });
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Fetch registrations and attendance data
  const fetchData = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        // First fetch approved registrations
        const { data: registrationsData, error: registrationsError } =
          await supabase
            .from("registrations")
            .select(
              `
              *,
              team_members!team_members_registration_id_fkey(
                id,
                name,
                email,
                phone,
                college,
                department,
                year
              )
            `
            )
            .eq("status", "approved")
            .order("team_id", { ascending: true });

        if (registrationsError) {
          console.error("Error fetching registrations:", registrationsError);
          throw new Error(
            `Failed to fetch registrations: ${registrationsError.message}`
          );
        }

        // Fetch attendance data
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*")
          .order("marked_at", { ascending: false });

        if (attendanceError) {
          console.error("Error fetching attendance:", attendanceError);
          throw new Error(
            `Failed to fetch attendance: ${attendanceError.message}`
          );
        }

        // Process attendance data into a more usable format
        const attendanceMap: Record<string, string[]> = {};

        if (attendanceData) {
          attendanceData.forEach((attendance: Attendance) => {
            if (!attendanceMap[attendance.event_id]) {
              attendanceMap[attendance.event_id] = [];
            }
            attendanceMap[attendance.event_id].push(attendance.team_member_id);
          });
        }

        if (!registrationsData) {
          throw new Error("No registrations data received");
        }

        // Transform the data to match the Registration type
        const transformedRegistrations = registrationsData.map(
          (
            reg: Omit<Registration, "team_members"> & {
              team_members: TeamMember[];
            }
          ) => ({
            ...reg,
            team_members: reg.team_members || [],
          })
        );

        setRegistrations(transformedRegistrations);
        setAttendanceData(attendanceMap);

        // Calculate attendance stats
        const totalApproved = transformedRegistrations.reduce(
          (total, reg) => total + (reg.team_members?.length || 0),
          0
        );

        const totalAttended = Object.values(attendanceMap).reduce(
          (total, members) => total + members.length,
          0
        );

        const attendancePercentage =
          totalApproved > 0
            ? Math.round((totalAttended / totalApproved) * 100)
            : 0;

        setAttendanceStats({
          totalApproved,
          totalAttended,
          attendancePercentage,
        });

        if (showToast) {
          toast({
            title: "Data refreshed",
            description: "Latest attendance data has been loaded",
          });
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error instanceof Error ? error.message : "Unknown error"
        );
        if (showToast) {
          toast({
            title: "Refresh failed",
            description:
              error instanceof Error
                ? error.message
                : "Could not refresh attendance data",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [toast]
  );

  // Mark attendance for a team member
  const markAttendance = async (
    teamMemberId: string,
    eventId: string,
    isChecked: boolean
  ) => {
    try {
      if (isChecked) {
        // Add attendance record
        const { error } = await supabase
          .from("attendance")
          .insert({
            team_member_id: teamMemberId,
            event_id: eventId,
            marked_at: new Date().toISOString(),
            marked_by: "admin",
          })
          .select();

        if (error) {
          console.error("Supabase error while marking attendance:", error);
          throw new Error(`Failed to mark attendance: ${error.message}`);
        }

        // Update local state
        setAttendanceData((prev) => {
          const updated = { ...prev };
          if (!updated[eventId]) {
            updated[eventId] = [];
          }
          if (!updated[eventId].includes(teamMemberId)) {
            updated[eventId] = [...updated[eventId], teamMemberId];
          }
          return updated;
        });

        toast({
          title: "Attendance marked",
          description: "Attendance has been recorded successfully",
        });
      } else {
        // Remove attendance record
        const { error } = await supabase.from("attendance").delete().match({
          team_member_id: teamMemberId,
          event_id: eventId,
        });

        if (error) {
          console.error("Supabase error while removing attendance:", error);
          throw new Error(`Failed to remove attendance: ${error.message}`);
        }

        // Update local state
        setAttendanceData((prev) => {
          const updated = { ...prev };
          if (updated[eventId]) {
            updated[eventId] = updated[eventId].filter(
              (id) => id !== teamMemberId
            );
          }
          return updated;
        });

        toast({
          title: "Attendance removed",
          description: "Attendance record has been removed",
        });
      }

      // Recalculate stats
      fetchData();
    } catch (error) {
      console.error(
        "Error marking attendance:",
        error instanceof Error ? error.message : "Unknown error",
        error
      );
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if a team member's attendance is marked
  const isAttendanceMarked = useCallback(
    (teamMemberId: string, eventId: string) => {
      return attendanceData[eventId]?.includes(teamMemberId) || false;
    },
    [attendanceData]
  );

  // Export attendance data to Excel
  const handleExport = () => {
    try {
      const exportData = registrations.flatMap((registration) => {
        return registration.team_members.map((member) => {
          const isAttending =
            selectedEvent === "all"
              ? Object.keys(attendanceData).some((eventId) =>
                  attendanceData[eventId]?.includes(member.id)
                )
              : isAttendanceMarked(member.id, selectedEvent);

          return {
            "Team ID": registration.team_id,
            "Team Name": registration.team_name,
            "Member Name": member.name,
            Email: member.email,
            Phone: member.phone,
            College: member.college,
            Department: member.department,
            Year: member.year,
            Event:
              selectedEvent === "all"
                ? "All Events"
                : getEventDisplayName(selectedEvent),
            "Attendance Status": isAttending ? "Present" : "Absent",
            Date: new Date().toLocaleDateString(),
          };
        });
      });

      exportToExcel(
        exportData,
        `attendance-${selectedEvent}-${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast({
        title: "Export successful",
        description: "Attendance data has been exported to Excel",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "Could not export attendance data",
        variant: "destructive",
      });
    }
  };

  // Filter registrations based on search query, selected event, and active tab
  useEffect(() => {
    let filtered = [...registrations];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (reg) =>
          reg.team_id.toLowerCase().includes(query) ||
          reg.team_members.some(
            (member) =>
              member.name.toLowerCase().includes(query) ||
              member.college.toLowerCase().includes(query) ||
              member.department.toLowerCase().includes(query)
          )
      );
    }

    // Apply event filter
    if (selectedEvent !== "all") {
      filtered = filtered.filter((reg) =>
        reg.selected_events.includes(selectedEvent)
      );
    }

    // Apply tab filter
    if (activeTab === "present") {
      filtered = filtered.filter((reg) =>
        reg.team_members.some((member) =>
          selectedEvent === "all"
            ? reg.selected_events.some((event) =>
                isAttendanceMarked(member.id, event)
              )
            : isAttendanceMarked(member.id, selectedEvent)
        )
      );
    } else if (activeTab === "absent") {
      filtered = filtered.filter((reg) =>
        reg.team_members.some((member) =>
          selectedEvent === "all"
            ? reg.selected_events.every(
                (event) => !isAttendanceMarked(member.id, event)
              )
            : !isAttendanceMarked(member.id, selectedEvent)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = a.team_id || "";
      const valueB = b.team_id || "";
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setFilteredRegistrations(filtered);
  }, [
    registrations,
    searchQuery,
    selectedEvent,
    sortDirection,
    activeTab,
    attendanceData,
    isAttendanceMarked,
  ]);

  // Initial data fetch
  useEffect(() => {
    fetchData();

    // Set up real-time subscription for attendance changes
    const attendanceChannel = supabase
      .channel("attendance_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attendanceChannel);
    };
  }, [fetchData]);

  return (
    <AdminLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl"
        >
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Attendance Management
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Track and manage participant attendance
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10 transition-all"
            >
              {refreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleExport}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            variants={item}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">
                  Total Approved Participants
                </h3>
                <p className="text-3xl font-bold text-white mt-1">
                  {attendanceStats.totalApproved}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-green-500/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Total Attendance</h3>
                <p className="text-3xl font-bold text-white mt-1">
                  {attendanceStats.totalAttended}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-yellow-500/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Percent className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Attendance Percentage</h3>
                <p className="text-3xl font-bold text-white mt-1">
                  {attendanceStats.attendancePercentage}%
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Progress
                value={attendanceStats.attendancePercentage}
                className="h-2"
              />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters Card */}
        <motion.div
          variants={item}
          className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by team ID, name, college, or department..."
                className="pl-10 bg-white/5 border-white/10 hover:border-white/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 hover:border-white/20 text-white transition-all">
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-md border border-white/10">
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="bg-white/5 border-white/10 hover:border-white/20 text-white transition-all"
              >
                {sortDirection === "asc" ? (
                  <ArrowUpDown className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 rotate-180" />
                )}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white/10"
                >
                  All Participants
                </TabsTrigger>
                <TabsTrigger
                  value="present"
                  className="data-[state=active]:bg-white/10"
                >
                  Present
                </TabsTrigger>
                <TabsTrigger
                  value="absent"
                  className="data-[state=active]:bg-white/10"
                >
                  Absent
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Attendance List */}
        <motion.div variants={item} className="space-y-4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 animate-pulse"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-6 bg-white/10 rounded w-1/4"></div>
                      <div className="h-6 bg-white/10 rounded w-1/6"></div>
                    </div>
                    <div className="space-y-3">
                      {Array(3)
                        .fill(0)
                        .map((_, j) => (
                          <div
                            key={j}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-5 bg-white/10 rounded"></div>
                              <div className="h-5 bg-white/10 rounded w-1/3"></div>
                            </div>
                            <div className="h-5 bg-white/10 rounded w-1/4"></div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      <Badge
                        variant="outline"
                        className="text-base font-medium bg-white/10 hover:bg-white/20 border-white/20 text-white"
                      >
                        {registration.team_id}
                      </Badge>
                      {registration.team_members.every((member) =>
                        selectedEvent === "all"
                          ? registration.selected_events.every((event) =>
                              isAttendanceMarked(member.id, event)
                            )
                          : isAttendanceMarked(member.id, selectedEvent)
                      ) && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Team Present
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {registration.selected_events.map((event) => (
                        <Badge
                          key={event}
                          className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {getEventDisplayName(event)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 mb-3">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                      {registration.team_size} members
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <School className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                      {registration.team_members[0]?.college}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                      {new Date(registration.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {registration.team_members.map((member) => (
                      <div
                        key={member.id}
                        className="flex justify-between items-center py-2 border-t border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <User2 className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-400">
                              {member.college} • {member.department} • Year{" "}
                              {member.year}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-4">
                            {/* Registration Desk Check-in */}
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                              <Checkbox
                                id={`registration-desk-${member.id}`}
                                checked={isAttendanceMarked(
                                  member.id,
                                  "registration-desk"
                                )}
                                onCheckedChange={(checked) =>
                                  markAttendance(
                                    member.id,
                                    "registration-desk",
                                    checked === true
                                  )
                                }
                              />
                              <Label
                                htmlFor={`registration-desk-${member.id}`}
                                className="text-sm cursor-pointer whitespace-nowrap"
                              >
                                {isAttendanceMarked(
                                  member.id,
                                  "registration-desk"
                                ) ? (
                                  <span className="text-green-400 flex items-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Reported at Registration Desk
                                  </span>
                                ) : (
                                  <span className="text-red-400">
                                    Not Reported at Registration Desk
                                  </span>
                                )}
                              </Label>
                            </div>

                            {/* Event Venue Check-ins */}
                            <div className="space-y-2">
                              <p className="text-xs text-gray-400 mb-1">
                                Event Venue Check-in:
                              </p>
                              {registration.selected_events.map((event) => (
                                <div
                                  key={event}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    id={`venue-${member.id}-${event}`}
                                    checked={isAttendanceMarked(
                                      member.id,
                                      event
                                    )}
                                    onCheckedChange={(checked) =>
                                      markAttendance(
                                        member.id,
                                        event,
                                        checked === true
                                      )
                                    }
                                    disabled={
                                      !isAttendanceMarked(
                                        member.id,
                                        "registration-desk"
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`venue-${member.id}-${event}`}
                                    className={`text-sm cursor-pointer whitespace-nowrap ${
                                      !isAttendanceMarked(
                                        member.id,
                                        "registration-desk"
                                      )
                                        ? "opacity-50"
                                        : ""
                                    }`}
                                  >
                                    {isAttendanceMarked(member.id, event) ? (
                                      <span className="text-green-400 flex items-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                        {getEventDisplayName(event)}
                                      </span>
                                    ) : (
                                      <span className="text-red-400">
                                        {getEventDisplayName(event)}
                                      </span>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={item}
              className="text-center py-12 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">
                No registrations found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

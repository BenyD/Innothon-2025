"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Search,
  Building2,
  Clock,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  Filter,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Registration } from "@/types/registration";
// import { calculateRegistrationRevenue } from "@/utils/revenue";
import { calculateTotalRevenue } from "@/utils/revenue";

// Add animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Add this helper function at the top of the file
const getGameDetails = (registration: Registration) => {
  if (
    !registration.selected_events.includes("pixel-showdown") ||
    !registration.game_details
  ) {
    return null;
  }

  const { game } = registration.game_details;

  switch (game) {
    case "bgmi":
      return "BGMI Squad";
    case "pes":
      return "PES Individual";
    case "valorant":
      return "VALORANT 5v5";
    case "freefire":
      return "Free Fire Squad";
    default:
      return null;
  }
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

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [sortBy, setSortBy] = useState<"created_at" | "team_id" | "events">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterEvent, setFilterEvent] = useState<string | null>(null);
  const router = useRouter();

  const fetchRegistrations = useCallback(async () => {
    try {
      console.log("Fetching all registrations");
      const { data, error } = await supabase
        .from("registrations")
        .select(
          `
          *,
          team_members!team_members_registration_id_fkey (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched registrations:", data);
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Error in fetchRegistrations:", error);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    const channel = supabase
      .channel("registration_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        async () => {
          const { data, error } = await supabase
            .from("registrations")
            .select(
              `
              *,
              team_members (*)
            `
            )
            .order("created_at", { ascending: false });

          if (!error && data) {
            setRegistrations(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get unique events from all registrations
  const allEvents = useMemo(() => {
    const eventSet = new Set<string>();
    registrations.forEach((reg) => {
      reg.selected_events.forEach((event) => {
        eventSet.add(event);
      });
    });
    return Array.from(eventSet);
  }, [registrations]);

  useEffect(() => {
    // Filter registrations based on search query and event filter
    let filtered = registrations.filter((reg) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        reg.team_members[0]?.name?.toLowerCase().includes(searchLower) ||
        reg.team_members[0]?.email?.toLowerCase().includes(searchLower) ||
        reg.team_members[0]?.phone?.includes(searchQuery) ||
        reg.team_members[0]?.college?.toLowerCase().includes(searchLower) ||
        reg.team_id.toLowerCase().includes(searchLower); // Added search by Team ID

      // Apply event filter if selected
      const matchesEventFilter = filterEvent
        ? reg.selected_events.includes(filterEvent)
        : true;

      return matchesSearch && matchesEventFilter;
    });

    // Sort the filtered registrations
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "team_id") {
        return sortDirection === "asc"
          ? a.team_id.localeCompare(b.team_id)
          : b.team_id.localeCompare(a.team_id);
      } else if (sortBy === "events") {
        return sortDirection === "asc"
          ? a.selected_events.length - b.selected_events.length
          : b.selected_events.length - a.selected_events.length;
      } else {
        // Default sort by created_at
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredRegistrations(filtered);
  }, [searchQuery, registrations, sortBy, sortDirection, filterEvent]);

  // Toggle sort direction or change sort field
  const handleSort = (field: "created_at" | "team_id" | "events") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Update the revenue display in the stats section
  const totalRevenue = calculateTotalRevenue(registrations);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Team Registrations</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, team ID..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            variants={itemAnimation}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <h3 className="text-gray-400 text-sm">Total Teams</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {registrations.length}
            </p>
          </motion.div>
          <motion.div
            variants={itemAnimation}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-white mt-1 flex items-center">
              <span className="text-lg mr-1">₹</span>
              {totalRevenue}
            </p>
          </motion.div>
          <motion.div
            variants={itemAnimation}
            className="bg-white/5 border border-white/10 rounded-lg p-4 sm:col-span-2 lg:col-span-1"
          >
            <h3 className="text-gray-400 text-sm">Pending Approvals</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {registrations.filter((reg) => reg.status === "pending").length}
            </p>
          </motion.div>
        </div>

        {/* Sorting and Filtering Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort("created_at")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm 
                ${sortBy === "created_at" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-gray-400"}`}
            >
              <Clock className="w-4 h-4" />
              Date
              {sortBy === "created_at" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </button>
            <button
              onClick={() => handleSort("team_id")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm 
                ${sortBy === "team_id" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-gray-400"}`}
            >
              <Tag className="w-4 h-4" />
              Team ID
              {sortBy === "team_id" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </button>
            <button
              onClick={() => handleSort("events")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm 
                ${sortBy === "events" ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-gray-400"}`}
            >
              <Calendar className="w-4 h-4" />
              Events
              {sortBy === "events" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </button>
          </div>

          <div className="relative">
            <select
              value={filterEvent || ""}
              onChange={(e) => setFilterEvent(e.target.value || null)}
              className="appearance-none pl-8 pr-10 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">All Events</option>
              {allEvents.map((event) => (
                <option key={event} value={event}>
                  {getEventDisplayName(event)}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Registration Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredRegistrations.map((registration) => (
            <motion.div
              key={registration.id}
              variants={itemAnimation}
              onClick={() =>
                router.push(`/admin/registrations/${registration.id}`)
              }
              className="group relative overflow-hidden p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] 
                border border-white/10 hover:border-purple-500/50 transition-all duration-300
                hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.1)] cursor-pointer"
            >
              {/* Status Indicator */}
              <div className="absolute top-0 right-0 w-20 h-20">
                <div
                  className={`absolute transform rotate-45 translate-y-[-50%] translate-x-[-10%] w-[200%] py-1.5
                  ${
                    registration.status === "approved"
                      ? "bg-green-500/20"
                      : registration.status === "rejected"
                        ? "bg-red-500/20"
                        : "bg-yellow-500/20"
                  }`}
                />
              </div>

              {/* Main Content */}
              <div className="space-y-4 sm:space-y-6">
                {/* Header with Team Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-purple-400 transition-colors">
                      {registration.team_members[0]?.name}
                      {registration.team_size > 1 && (
                        <span className="text-gray-400 text-sm ml-2">
                          +{registration.team_size - 1} members
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        {registration.team_members[0]?.college}
                      </span>
                      <span className="hidden sm:inline-block text-gray-600">
                        •
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {new Date(registration.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Add game details badge for Pixel Showdown */}
                  {registration.selected_events.includes("pixel-showdown") &&
                    registration.game_details && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {getGameDetails(registration)}
                      </span>
                    )}
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Team ID</span>
                    <p className="text-sm font-medium text-purple-400 break-all">
                      {registration.team_id}
                    </p>
                  </div>
                  {registration.transaction_id && (
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">
                        Transaction ID
                      </span>
                      <p className="text-sm font-medium text-blue-400 break-all">
                        {registration.transaction_id}
                      </p>
                    </div>
                  )}
                </div>

                {/* Registered Events */}
                <div className="flex flex-wrap gap-2">
                  {registration.selected_events.map((event) => (
                    <span
                      key={event}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      {getEventDisplayName(event)}
                    </span>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg bg-white/5">
                    <Calendar className="w-4 h-4 text-purple-400 mb-1" />
                    <span className="text-sm text-gray-400">
                      {registration.selected_events.length}
                    </span>
                    <span className="text-xs text-gray-500">Events</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg bg-white/5">
                    <Users className="w-4 h-4 text-green-400 mb-1" />
                    <span className="text-sm text-gray-400">
                      {registration.team_size}
                    </span>
                    <span className="text-xs text-gray-500">Members</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg bg-white/5">
                    <span className="text-sm font-medium text-yellow-400 mb-1">
                      ₹
                    </span>
                    <span className="text-sm text-gray-400">
                      {registration.total_amount}
                    </span>
                    <span className="text-xs text-gray-500">Amount</span>
                  </div>
                </div>

                {/* Player ID Details */}
                <div className="space-y-2 mt-2">
                  {registration.team_members.map((member) => (
                    <div key={member.id} className="text-sm">
                      {/* ... existing member details ... */}

                      {registration.selected_events.includes(
                        "pixel-showdown"
                      ) &&
                        member.player_id && (
                          <div className="flex items-center gap-1 text-gray-400 mt-1">
                            <Gamepad2 className="w-3 h-3" />
                            <span>
                              {registration.game_details?.game === "bgmi"
                                ? "BGMI ID: "
                                : registration.game_details?.game === "freefire"
                                  ? "Free Fire ID: "
                                  : "PES Username: "}
                              <span className="text-gray-300">
                                {member.player_id}
                              </span>
                            </span>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredRegistrations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              No registrations found
            </h3>
            <p className="text-gray-500 mt-1">
              {searchQuery || filterEvent
                ? "Try adjusting your search or filters"
                : "Registrations will appear here"}
            </p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

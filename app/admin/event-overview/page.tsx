"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  IndianRupee,
  Filter,
  CheckCircle2,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { events } from "@/data/events";
import type { Registration } from "@/types/registration";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  exportToExcel,
  formatRegistrationForExcel,
  formatEventRegistrationForExcel,
} from "@/utils/excel";
import { Button } from "@/components/ui/button";

type EventRegistration = Registration & {
  event_id: string;
};

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

export default function EventOverview() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("registrations")
        .select(
          `
          *,
          team_members!team_members_registration_id_fkey (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedData: EventRegistration[] = [];
      data?.forEach((registration) => {
        registration.selected_events.forEach((eventId: string) => {
          let amount = 500; // default amount
          if (eventId === "digital-divas") {
            amount = registration.team_size * 200;
          } else if (
            eventId === "pixel-showdown" &&
            registration.game_details
          ) {
            const { game, format } = registration.game_details;
            if (game === "pes") amount = 100;
            else if (game === "bgmi") amount = 200;
            else if (game === "freefire") {
              amount = format === "squad" ? 200 : 100;
            }
          }

          transformedData.push({
            ...registration,
            event_id: eventId,
            total_amount: amount,
          });
        });
      });

      setRegistrations(transformedData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Filter registrations based on all criteria
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      searchQuery === "" ||
      registration.team_members.some(
        (member) =>
          member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.college?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesEvent =
      selectedEvent === "all" || registration.event_id === selectedEvent;
    const matchesStatus =
      selectedStatus === "all" || registration.status === selectedStatus;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  // Group registrations by event
  const groupedRegistrations = filteredRegistrations.reduce(
    (acc, registration) => {
      const eventId = registration.event_id;
      if (!acc[eventId]) {
        acc[eventId] = [];
      }
      acc[eventId].push(registration);
      return acc;
    },
    {} as Record<string, EventRegistration[]>
  );

  // Update the total participants calculation to count unique participants
  const totalParticipants = filteredRegistrations.reduce((acc, reg) => {
    // Get unique participant IDs from this registration
    const participantIds = reg.team_members.map((member) => member.id);

    // Add only unique IDs that we haven't seen before
    participantIds.forEach((id) => {
      if (!acc.has(id)) {
        acc.add(id);
      }
    });

    return acc;
  }, new Set()).size;

  // Update revenue calculation to handle different event prices
  const calculateEventRevenue = (registration: EventRegistration) => {
    if (registration.status !== "approved") return 0;

    if (registration.event_id === "digital-divas") {
      return registration.team_size * 200; // ₹200 per participant
    }

    if (
      registration.event_id === "pixel-showdown" &&
      registration.game_details
    ) {
      const { game, format } = registration.game_details;
      if (game === "pes") return 100; // ₹100 per player
      if (game === "bgmi") return 200; // ₹200 per team
      if (game === "freefire") {
        return format === "squad" ? 200 : 100; // ₹200 for squad, ₹100 for duo
      }
    }

    return 500; // Default price for other events
  };

  const totalAmount = filteredRegistrations.reduce(
    (sum, reg) => sum + calculateEventRevenue(reg),
    0
  );

  const approvedCount = filteredRegistrations.filter(
    (reg) => reg.status === "approved"
  ).length;

  const getGameSpecificStats = (registrations: Registration[]) => {
    const pixelShowdownRegs = registrations.filter(
      (reg) =>
        reg.selected_events.includes("pixel-showdown") && reg.game_details
    );

    return {
      bgmi: pixelShowdownRegs.filter((r) => r.game_details?.game === "bgmi")
        .length,
      pes: pixelShowdownRegs.filter((r) => r.game_details?.game === "pes")
        .length,
      freefire_squad: pixelShowdownRegs.filter(
        (r) =>
          r.game_details?.game === "freefire" &&
          r.game_details?.format === "squad"
      ).length,
      freefire_duo: pixelShowdownRegs.filter(
        (r) =>
          r.game_details?.game === "freefire" &&
          r.game_details?.format === "duo"
      ).length,
    };
  };

  const gameStats = getGameSpecificStats(filteredRegistrations);

  const handleExportEvent = (
    eventId: string,
    eventRegistrations: EventRegistration[]
  ) => {
    const eventName =
      events.find((e) => e.id === eventId)?.title || "Unknown Event";
    const formattedData = eventRegistrations.map((registration) =>
      formatEventRegistrationForExcel(registration, eventId)
    );
    exportToExcel(formattedData, `${eventName}-registrations`);
  };

  const handleExportAllRegistrations = () => {
    const formattedData = filteredRegistrations.map(formatRegistrationForExcel);
    exportToExcel(formattedData, `all-registrations`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header & Stats */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Event Overview
            </h1>
            <Button
              onClick={handleExportAllRegistrations}
              className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Global Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search teams or colleges..."
                  className="pl-9 bg-white/5 border-white/10 text-white w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2">
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-white/5 border-white/10">
                    <SelectValue placeholder="Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[140px] bg-white/5 border-white/10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <motion.div
              variants={item}
              className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Total Participants</h3>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {totalParticipants}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <IndianRupee className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Total Revenue</h3>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                    ₹{totalAmount}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">
                    Approved Registrations
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {approvedCount}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Event Cards - Remove individual filters */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4 sm:space-y-6"
        >
          {Object.entries(groupedRegistrations).map(
            ([eventId, eventRegistrations]) => (
              <motion.div
                key={eventId}
                variants={item}
                className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Event Header */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-white/5 to-transparent border-b border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-white">
                        {events.find((e) => e.id === eventId)?.title ||
                          "Unknown Event"}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {eventRegistrations.length} team
                        {eventRegistrations.length !== 1 ? "s" : ""} registered
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-purple-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {eventRegistrations.filter(
                              (reg) => reg.status === "approved"
                            ).length
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                          <IndianRupee className="w-4 h-4" />
                          <span>
                            {eventRegistrations.reduce(
                              (sum, reg) => sum + reg.total_amount,
                              0
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          handleExportEvent(eventId, eventRegistrations)
                        }
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile-optimized table - without filters */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Team
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                          College
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {eventRegistrations.map((registration) => (
                        <tr
                          key={`${registration.id}-${registration.event_id}`}
                          onClick={() =>
                            router.push(
                              `/admin/registrations/${registration.id}`
                            )
                          }
                          className="hover:bg-white/5 cursor-pointer"
                        >
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-white">
                                {registration.team_members[0]?.name}
                              </span>
                              <span className="text-sm text-gray-400 sm:hidden">
                                {registration.team_members[0]?.college}
                              </span>
                              {registration.team_size > 1 && (
                                <span className="text-xs text-gray-500">
                                  +{registration.team_size - 1} members
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-300 hidden sm:table-cell">
                            {registration.team_members[0]?.college}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                registration.status === "approved"
                                  ? "bg-green-500/10 text-green-400"
                                  : registration.status === "rejected"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {registration.status.charAt(0).toUpperCase() +
                                registration.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-gray-300">
                            ₹{registration.total_amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )
          )}

          {/* Empty State */}
          {Object.keys(groupedRegistrations).length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">
                No registrations found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </motion.div>

        {/* Game Statistics for Pixel Showdown */}
        {selectedEvent === "pixel-showdown" && (
          <div className="mt-6 px-4">
            <h3 className="text-lg font-medium text-white mb-4">
              Game Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                <h4 className="text-sm text-gray-400">BGMI Teams</h4>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-white">
                    {gameStats.bgmi}
                  </p>
                  <span className="text-xs text-gray-500">
                    ₹{gameStats.bgmi * 200}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10">
                <h4 className="text-sm text-gray-400">PES Players</h4>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-white">
                    {gameStats.pes}
                  </p>
                  <span className="text-xs text-gray-500">
                    ₹{gameStats.pes * 100}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10">
                <h4 className="text-sm text-gray-400">Free Fire Squad</h4>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-white">
                    {gameStats.freefire_squad}
                  </p>
                  <span className="text-xs text-gray-500">
                    ₹{gameStats.freefire_squad * 200}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-white/10">
                <h4 className="text-sm text-gray-400">Free Fire Duo</h4>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-white">
                    {gameStats.freefire_duo}
                  </p>
                  <span className="text-xs text-gray-500">
                    ₹{gameStats.freefire_duo * 100}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-white/10">
                <h4 className="text-sm text-gray-400">VALORANT Teams</h4>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-white">
                    {gameStats.valorant}
                  </p>
                  <span className="text-xs text-gray-500">
                    ₹{gameStats.valorant * 250}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

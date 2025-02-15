"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Users, Search, Filter } from "lucide-react";
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

type EventRegistration = Registration & {
  event_id: string;
};

export default function EventOverview() {
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
          team_members (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to split registrations by events
      const transformedData: EventRegistration[] = [];
      data?.forEach((registration) => {
        registration.selected_events.forEach((eventId) => {
          transformedData.push({
            ...registration,
            event_id: eventId,
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

  // Filter registrations based on search query and filters
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      searchQuery === "" ||
      registration.team_members.some(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.college.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesEvent =
      selectedEvent === "all" || registration.event_id === selectedEvent;

    const matchesStatus =
      selectedStatus === "all" || registration.status === selectedStatus;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  // Group registrations by event
  const groupedRegistrations = filteredRegistrations.reduce((acc, registration) => {
    const eventId = registration.event_id;
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(registration);
    return acc;
  }, {} as Record<string, EventRegistration[]>);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <h1 className="text-xl lg:text-2xl font-bold text-white">Event Registration Overview</h1>
          
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 sm:max-w-[200px]">
              <Input
                placeholder="Search teams or colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by event" />
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-48 bg-white/5 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRegistrations).map(([eventId, eventRegistrations]) => (
              <motion.div
                key={eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">
                    {events.find((e) => e.id === eventId)?.title || "Unknown Event"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {eventRegistrations.length} team{eventRegistrations.length !== 1 ? 's' : ''} registered
                  </p>
                </div>

                <div className="overflow-hidden">
                  <div className="overflow-x-auto -mx-6 lg:mx-0">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-400">Team</th>
                          <th className="px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-400">Members</th>
                          <th className="px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-400">College</th>
                          <th className="px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-400">Status</th>
                          <th className="px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-400">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {eventRegistrations.map((registration) => (
                          <tr
                            key={`${registration.id}-${eventId}`}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span className="text-white">
                                  {registration.team_members[0]?.name}
                                  {registration.team_size > 1 && 
                                    ` + ${registration.team_size - 1}`}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                              <div className="space-y-1">
                                {registration.team_members.map((member) => (
                                  <div key={member.id}>
                                    {member.name} - {member.department}, {member.year}th Year
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {registration.team_members[0]?.college}
                            </td>
                            <td className="px-4 py-3">
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
                            <td className="px-4 py-3 text-sm text-gray-300">
                              ₹{registration.total_amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ))}

            {Object.keys(groupedRegistrations).length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No registrations found matching the current filters.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 
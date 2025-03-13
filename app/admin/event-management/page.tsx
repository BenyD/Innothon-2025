"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { events } from "@/data/events";
import {
  RefreshCw,
  Save,
  CheckCircle,
  XCircle,
  Calendar,
  Settings,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import {
  initializeEventsTable,
  getEventsWithStatus,
  updateEventStatus,
} from "@/lib/event-helpers";

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

export default function EventManagement() {
  const [eventStatuses, setEventStatuses] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchEventStatuses = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        console.log("Fetching event statuses...");

        // Try to initialize events table
        try {
          await initializeEventsTable();
        } catch (initError) {
          console.error("Failed to initialize events table:", initError);
          // Continue with static data if initialization fails
        }

        // Get events with status from database or fallback to static data
        const eventsWithStatus = await getEventsWithStatus();
        console.log("Received events with status:", eventsWithStatus);

        // Convert to record format
        const statusesRecord: Record<string, string> = {};
        eventsWithStatus.forEach((event) => {
          statusesRecord[event.id] = event.status;
        });

        console.log("Setting event statuses:", statusesRecord);
        setEventStatuses(statusesRecord);

        if (showToast) {
          toast({
            title: "Events refreshed",
            description: "Latest event statuses have been loaded",
          });
        }
      } catch (error) {
        console.error("Error fetching event statuses:", error);

        // Fallback to static data if everything fails
        const staticStatuses: Record<string, string> = {};
        events.forEach((event) => {
          staticStatuses[event.id] = event.status;
        });
        console.log("Using static data as fallback:", staticStatuses);
        setEventStatuses(staticStatuses);

        if (showToast) {
          toast({
            title: "Using static data",
            description:
              "Could not connect to database. Using static event data.",
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

  useEffect(() => {
    fetchEventStatuses();

    // Set up real-time subscription for events table
    const eventsChannel = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events" },
        (payload) => {
          console.log("Received real-time update:", payload);

          // Only update if we're not in the middle of saving
          if (!saving) {
            console.log("Refreshing event statuses due to real-time update");
            fetchEventStatuses();
          } else {
            console.log("Ignoring real-time update while saving");
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(eventsChannel);
    };
  }, [fetchEventStatuses, saving]);

  const handleStatusChange = (eventId: string, status: string) => {
    console.log(`Changing status of ${eventId} to ${status}`);
    setEventStatuses((prev) => {
      const newStatuses = {
        ...prev,
        [eventId]: status,
      };
      console.log("New event statuses:", newStatuses);
      return newStatuses;
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      // Check if we can access the events table
      const { error: checkError } = await supabase
        .from("events")
        .select("id")
        .limit(1);

      // If we can't access the events table, show an error
      if (checkError) {
        console.error("Error checking events table:", checkError);
        toast({
          title: "Database Error",
          description:
            "Cannot save changes because the events table doesn't exist. Please run the migration script first.",
          variant: "destructive",
        });
        return;
      }

      // Log the changes we're about to make
      console.log("Saving event status changes:", eventStatuses);

      // Update each event status in the database
      const updatePromises = Object.entries(eventStatuses).map(
        ([eventId, status]) => updateEventStatus(eventId, status)
      );

      const results = await Promise.all(updatePromises);
      console.log("Update results:", results);

      // Check if any updates failed
      const failedUpdates = results.filter((result) => !result.success);

      if (failedUpdates.length > 0) {
        console.error("Failed updates:", failedUpdates);

        // Log detailed error messages to console
        failedUpdates.forEach((update) => {
          console.error(`Update failed: ${update.message || "Unknown error"}`);
        });

        toast({
          title: "Some updates failed",
          description: `${failedUpdates.length} event status updates failed. Please check the console for details.`,
          variant: "destructive",
        });
      } else {
        // Don't refresh the event statuses, just keep our current state
        // This prevents any race conditions with the real-time subscription
        console.log("All updates successful, keeping current state");

        // Verify the changes were actually persisted by directly checking the database
        try {
          console.log("Verifying changes were persisted...");
          const { data: verifyData, error: verifyError } = await supabase
            .from("events")
            .select("id, status");

          if (verifyError) {
            console.error("Error verifying changes:", verifyError);
          } else {
            console.log("Current database state:", verifyData);

            // Check if any events don't match our expected state
            const mismatchedEvents = verifyData.filter(
              (dbEvent) => eventStatuses[dbEvent.id] !== dbEvent.status
            );

            if (mismatchedEvents.length > 0) {
              console.warn(
                "Some events don't match expected state:",
                mismatchedEvents
              );

              // Force update our state to match the database
              const updatedStatuses = { ...eventStatuses };
              verifyData.forEach((dbEvent) => {
                updatedStatuses[dbEvent.id] = dbEvent.status;
              });

              console.log(
                "Forcing state update to match database:",
                updatedStatuses
              );
              setEventStatuses(updatedStatuses);
            } else {
              console.log("All events match expected state");
            }
          }
        } catch (verifyError) {
          console.error("Error during verification:", verifyError);
        }

        toast({
          title: "Changes saved",
          description: "Event statuses have been updated successfully",
        });
      }
    } catch (error) {
      console.error("Error saving event statuses:", error);
      toast({
        title: "Error",
        description:
          "Failed to save changes. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
            Ongoing
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Unknown
          </Badge>
        );
    }
  };

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
          variants={item}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl"
        >
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Event Management
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Control event registrations and status
            </p>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 hover:border-purple-500/50 text-white hover:text-white bg-black/50 backdrop-blur-sm hover:bg-black/70"
                    onClick={() => fetchEventStatuses(true)}
                    disabled={refreshing || saving}
                  >
                    {refreshing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2 text-purple-500" />
                    )}
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh event statuses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={saveChanges}
                    disabled={saving || refreshing}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save all status changes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Events Table */}
        <motion.div
          variants={item}
          className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">
                  Event Status Management
                </h2>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {events.length} Events
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Event Name</TableHead>
                    <TableHead className="text-gray-400">
                      Current Status
                    </TableHead>
                    <TableHead className="text-gray-400">New Status</TableHead>
                    <TableHead className="text-gray-400">
                      Registration
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                          <p className="text-sm text-gray-400">
                            Loading events...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="w-6 h-6 text-yellow-400" />
                          <p className="text-sm text-gray-400">
                            No events found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow
                        key={event.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-2">
                            {event.title}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {event.shortDescription}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(
                            eventStatuses[event.id] || event.status
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={eventStatuses[event.id] || "upcoming"}
                            onValueChange={(value) =>
                              handleStatusChange(event.id, value)
                            }
                          >
                            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 hover:border-white/20 text-white transition-all">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/95 backdrop-blur-md border border-white/10">
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {eventStatuses[event.id] === "closed" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                <XCircle className="w-3 h-3 mr-1" />
                                Disabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enabled
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          variants={item}
          className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">
              About Event Status
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-black/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Upcoming
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">
                Event is scheduled but not yet started. Registrations are open
                for participants.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                  Ongoing
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">
                Event is currently in progress. Registrations may still be open
                depending on event policy.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                  Closed
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">
                Event has ended or registrations are closed. Users cannot
                register for this event.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Search,
  Filter,
  Clock,
  RefreshCw,
  Download,
  ChevronRight,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User2,
  IndianRupee,
  Mail,
  Phone,
  School,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { Registration } from "@/types/registration";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { exportToExcel, formatRegistrationForExcel } from "@/utils/excel";
import { sendApprovalEmails, sendRejectionEmails } from "@/lib/send-email";
import { calculateRegistrationRevenue } from "@/utils/revenue";

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

type SortField = "created_at" | "team_size" | "total_amount" | "team_id";
type SortOrder = "asc" | "desc";

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sortBy") as SortField) || "created_at";
    }
    return "created_at";
  });
  const [sortDirection, setSortDirection] = useState<SortOrder>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sortDirection") as SortOrder) || "desc";
    }
    return "desc";
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const handleApprove = async (registrationId: string) => {
    try {
      setUpdating(registrationId);
      const registration = registrations.find(
        (reg) => reg.id === registrationId
      );
      if (!registration?.team_members) {
        throw new Error("No team members found");
      }

      const { error } = await supabase
        .from("registrations")
        .update({
          status: "approved",
          payment_status: "completed",
        })
        .eq("id", registrationId);

      if (error) throw error;

      // Send approval emails
      const emailResult = await sendApprovalEmails(
        registration.team_members,
        registration.id,
        registration.selected_events,
        registration.total_amount,
        registration.team_size,
        registration.team_id
      );

      if (!emailResult.success) {
        toast({
          title: "Warning",
          description:
            "Registration approved but failed to send notification emails",
          variant: "destructive",
        });
      }

      toast({
        title: "Registration approved",
        description: "The team registration has been approved successfully",
      });

      // Refresh the registrations list
      fetchRegistrations();
    } catch (error) {
      console.error("Error approving registration:", error);
      toast({
        title: "Approval failed",
        description: "Could not approve the registration",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (registrationId: string) => {
    try {
      setUpdating(registrationId);
      const registration = registrations.find(
        (reg) => reg.id === registrationId
      );
      if (!registration?.team_members) {
        throw new Error("No team members found");
      }

      const { error } = await supabase
        .from("registrations")
        .update({
          status: "rejected",
          payment_status: "pending",
        })
        .eq("id", registrationId);

      if (error) throw error;

      // Send rejection emails
      const emailResult = await sendRejectionEmails(
        registration.team_members,
        registration.id,
        registration.selected_events,
        registration.total_amount,
        registration.team_size
      );

      if (!emailResult.success) {
        toast({
          title: "Warning",
          description:
            "Registration rejected but failed to send notification emails",
          variant: "destructive",
        });
      }

      toast({
        title: "Registration rejected",
        description: "The team registration has been rejected",
      });

      // Refresh the registrations list
      fetchRegistrations();
    } catch (error) {
      console.error("Error rejecting registration:", error);
      toast({
        title: "Rejection failed",
        description: "Could not reject the registration",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const fetchRegistrations = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

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

        setRegistrations(data || []);

        if (showToast) {
          toast({
            title: "Registrations refreshed",
            description: "Latest data has been loaded",
          });
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
        if (showToast) {
          toast({
            title: "Refresh failed",
            description: "Could not refresh registration data",
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

  // Get unique events from all registrations
  const allEvents = useMemo(() => {
    const events = new Set<string>();
    registrations.forEach((reg) => {
      reg.selected_events.forEach((event) => {
        events.add(event);
      });
    });
    return Array.from(events).sort();
  }, [registrations]);

  // Filter and sort registrations
  useEffect(() => {
    let filtered = [...registrations];

    // Apply tab filter (status)
    if (activeTab !== "all") {
      filtered = filtered.filter((reg) => reg.status === activeTab);
    }

    // Apply selected events filter
    if (selectedEvents.length > 0) {
      filtered = filtered.filter((reg) =>
        selectedEvents.some((event) => reg.selected_events.includes(event))
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          // Search by team ID
          reg.team_id?.toLowerCase().includes(query) ||
          // Search by team member name
          reg.team_members.some((member) =>
            member.name.toLowerCase().includes(query)
          ) ||
          // Search by team member email
          reg.team_members.some((member) =>
            member.email.toLowerCase().includes(query)
          ) ||
          // Search by team member college
          reg.team_members.some((member) =>
            member.college.toLowerCase().includes(query)
          ) ||
          // Search by team member phone
          reg.team_members.some((member) =>
            member.phone.toLowerCase().includes(query)
          )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "team_size":
          valueA = a.team_size;
          valueB = b.team_size;
          break;
        case "total_amount":
          valueA = a.total_amount;
          valueB = b.total_amount;
          break;
        case "team_id":
          valueA = a.team_id || "";
          valueB = b.team_id || "";
          break;
        case "created_at":
        default:
          valueA = new Date(a.created_at).getTime();
          valueB = new Date(b.created_at).getTime();
          break;
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredRegistrations(filtered);
  }, [
    registrations,
    searchQuery,
    sortBy,
    sortDirection,
    selectedEvents,
    activeTab,
  ]);

  useEffect(() => {
    fetchRegistrations();

    // Set up real-time subscription
    const channel = supabase
      .channel("registrations_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registrations" },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRegistrations]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      localStorage.setItem("sortDirection", newDirection);
    } else {
      // Set new field and default to descending order
      setSortBy(field);
      setSortDirection("desc");
      localStorage.setItem("sortBy", field);
      localStorage.setItem("sortDirection", "desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-purple-500" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-purple-500" />
    );
  };

  const handleEventCheckboxChange = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleExport = (type: string) => {
    let dataToExport: Record<string, string | number>[] = [];
    let filename = "";

    switch (type) {
      case "all":
        dataToExport = registrations.map(formatRegistrationForExcel);
        filename = "all-registrations";
        break;
      case "filtered":
        dataToExport = filteredRegistrations.map(formatRegistrationForExcel);
        filename = "filtered-registrations";
        break;
      case "participants":
        // Only approved registrations
        dataToExport = registrations
          .filter((reg) => reg.status === "approved")
          .map(formatRegistrationForExcel);
        filename = "approved-participants";
        break;
      case "pending":
        dataToExport = registrations
          .filter((reg) => reg.status === "pending")
          .map(formatRegistrationForExcel);
        filename = "pending-registrations";
        break;
      default:
        dataToExport = registrations.map(formatRegistrationForExcel);
        filename = "registrations";
    }

    exportToExcel(dataToExport, filename);

    toast({
      title: "Export started",
      description: `Your ${filename} data is being prepared for download`,
    });
  };

  const getStatusCounts = () => {
    const counts = {
      all: registrations.length,
      pending: registrations.filter((reg) => reg.status === "pending").length,
      approved: registrations.filter((reg) => reg.status === "approved").length,
      rejected: registrations.filter((reg) => reg.status === "rejected").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <AdminLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-2 sm:p-6 space-y-6"
      >
        {/* Header with Title and Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl"
        >
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Registrations
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage and track all event registrations
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchRegistrations(true)}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2 text-white hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black/95 backdrop-blur-md border border-white/10 text-white"
              >
                <DropdownMenuLabel className="text-gray-400">
                  Export Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("all")}
                >
                  Export All Registrations
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("participants")}
                >
                  Export All Participants (Approved Only)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("filtered")}
                >
                  Export Filtered Registrations
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("pending")}
                >
                  Export Pending Registrations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Tabs for quick filtering */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4 bg-black/50 backdrop-blur-sm border border-purple-500/20">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
            >
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
            >
              <Clock className="w-3 h-3 mr-1 text-yellow-400" />
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
            >
              <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
              Approved ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white"
            >
              <XCircle className="w-3 h-3 mr-1 text-red-400" />
              Rejected ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {/* Content is shared across all tabs */}
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            {/* Content is shared across all tabs */}
          </TabsContent>
          <TabsContent value="approved" className="mt-0">
            {/* Content is shared across all tabs */}
          </TabsContent>
          <TabsContent value="rejected" className="mt-0">
            {/* Content is shared across all tabs */}
          </TabsContent>
        </Tabs>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
            </div>
            <Input
              type="text"
              placeholder="Search by team ID, member name, email, college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/80 border border-purple-500/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-purple-500/30 hover:border-purple-500/50 text-white hover:text-white bg-black/50 backdrop-blur-sm hover:bg-black/70"
                >
                  <Filter className="w-4 h-4 mr-2 text-purple-500" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/95 backdrop-blur-sm border border-purple-500/20">
                <DropdownMenuLabel className="text-gray-400">
                  Filter by Event
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-500/20" />
                <div className="px-2 py-2 max-h-60 overflow-y-auto">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="all-events"
                      checked={selectedEvents.length === 0}
                      onCheckedChange={() => setSelectedEvents([])}
                      className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <Label
                      htmlFor="all-events"
                      className="text-sm text-white cursor-pointer"
                    >
                      All Events
                    </Label>
                  </div>
                  {allEvents.map((event) => (
                    <div
                      key={event}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={event}
                        checked={selectedEvents.includes(event)}
                        onCheckedChange={() => handleEventCheckboxChange(event)}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <Label
                        htmlFor={event}
                        className="text-sm text-white cursor-pointer"
                      >
                        {getEventDisplayName(event)}
                      </Label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-purple-500/30 hover:border-purple-500/50 text-white hover:text-white bg-black/50 backdrop-blur-sm hover:bg-black/70"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2 text-purple-500" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 backdrop-blur-sm border border-purple-500/20">
                <DropdownMenuLabel className="text-gray-400">
                  Sort Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-500/20" />
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer flex items-center justify-between data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-white"
                  onClick={() => handleSort("created_at")}
                >
                  <span>Date</span>
                  {getSortIcon("created_at")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer flex items-center justify-between data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-white"
                  onClick={() => handleSort("team_size")}
                >
                  <span>Team Size</span>
                  {getSortIcon("team_size")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer flex items-center justify-between data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-white"
                  onClick={() => handleSort("total_amount")}
                >
                  <span>Amount</span>
                  {getSortIcon("total_amount")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer flex items-center justify-between data-[highlighted]:bg-purple-500/10 data-[highlighted]:text-white"
                  onClick={() => handleSort("team_id")}
                >
                  <span>Team ID</span>
                  {getSortIcon("team_id")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedEvents.length > 0 || activeTab !== "all") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-400">Active filters:</span>
            {activeTab !== "all" && (
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Status: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                <button
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => setActiveTab("all")}
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedEvents.map((event) => (
              <Badge
                key={event}
                className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                {getEventDisplayName(event)}
                <button
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => handleEventCheckboxChange(event)}
                >
                  ×
                </button>
              </Badge>
            ))}
            {(selectedEvents.length > 0 || activeTab !== "all") && (
              <Button
                variant="link"
                className="text-sm text-purple-400 hover:text-purple-300 p-0 h-auto"
                onClick={() => {
                  setSelectedEvents([]);
                  setActiveTab("all");
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Registrations List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {loading ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20"></div>
                      <div className="space-y-3 flex-1">
                        <div className="flex gap-2">
                          <div className="h-5 w-32 bg-purple-500/10 rounded"></div>
                          <div className="h-5 w-24 bg-purple-500/10 rounded-full"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-4 w-24 bg-purple-500/10 rounded"></div>
                          <div className="h-4 w-32 bg-purple-500/10 rounded"></div>
                          <div className="h-4 w-28 bg-purple-500/10 rounded"></div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <div className="h-6 w-28 bg-blue-500/10 rounded-full"></div>
                          <div className="h-6 w-24 bg-blue-500/10 rounded-full"></div>
                        </div>
                        <div className="pt-3 mt-3 border-t border-purple-500/10 flex flex-wrap gap-2">
                          <div className="h-4 w-48 bg-purple-500/10 rounded"></div>
                          <div className="h-4 w-32 bg-purple-500/10 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 mt-3 md:mt-0">
                      <div className="h-6 w-24 bg-purple-500/10 rounded-full"></div>
                      <div className="h-8 w-28 bg-purple-500/10 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
          ) : filteredRegistrations.length > 0 ? (
            filteredRegistrations.map((registration) => (
              <motion.div
                key={registration.id}
                variants={item}
                className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 hover:bg-black/60 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="bg-purple-500/20 rounded-full p-2.5 flex-shrink-0 border border-purple-500/30">
                      <User2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium text-white">
                          {registration.team_id || "No Team ID"}
                        </h3>
                        <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {registration.team_members[0]?.name || "Unnamed"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
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
                          {new Date(
                            registration.created_at
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <IndianRupee className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                          {registration.status === "approved"
                            ? calculateRegistrationRevenue(registration)
                            : registration.total_amount}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {registration.selected_events.map((event) => (
                          <Badge
                            key={event}
                            className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          >
                            {getEventDisplayName(event)}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-purple-500/10 flex flex-wrap gap-3">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                          {registration.team_members[0]?.email}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-pink-400" />
                          {registration.team_members[0]?.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 mt-3 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                        registration.status === "approved"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : registration.status === "rejected"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {registration.status === "approved" ? (
                        <CheckCircle className="w-3 h-3 mr-1.5" />
                      ) : registration.status === "rejected" ? (
                        <XCircle className="w-3 h-3 mr-1.5" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1.5" />
                      )}
                      {registration.status.charAt(0).toUpperCase() +
                        registration.status.slice(1)}
                    </span>

                    <div className="flex gap-2">
                      {registration.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-400 hover:text-green-300 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 bg-black/30"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleApprove(registration.id);
                            }}
                            disabled={updating === registration.id}
                          >
                            {updating === registration.id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 bg-black/30"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReject(registration.id);
                            }}
                            disabled={updating === registration.id}
                          >
                            {updating === registration.id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Reject
                          </Button>
                        </>
                      )}
                      <Link href={`/admin/registrations/${registration.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 bg-black/30"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl">
              <Users className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">
                No registrations found
              </h3>
              <p className="text-gray-500 mt-1 max-w-md mx-auto">
                {searchQuery || selectedEvents.length > 0 || activeTab !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no team registrations yet."}
              </p>
              {(searchQuery ||
                selectedEvents.length > 0 ||
                activeTab !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4 border-purple-500/30 hover:border-purple-500/50 text-white bg-black/50 backdrop-blur-sm hover:bg-black/70"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedEvents([]);
                    setActiveTab("all");
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

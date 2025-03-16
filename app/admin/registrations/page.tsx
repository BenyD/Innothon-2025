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
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    []
  );
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingTotal, setProcessingTotal] = useState(0);
  const [currentProcessingEmail, setCurrentProcessingEmail] = useState<
    string | null
  >(null);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "updating" | "emailing" | "complete"
  >("idle");
  const [showProgressDialog, setShowProgressDialog] = useState(false);
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
  const [showMultipleEventsOnly, setShowMultipleEventsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

    // Apply multiple events filter
    if (showMultipleEventsOnly) {
      filtered = filtered.filter((reg) => reg.selected_events.length > 1);
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
    showMultipleEventsOnly,
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

  const handleExport = async (type: string) => {
    let registrationsToExport: Registration[] = [];
    let filename = "";
    let isAccountsSheet = false;

    switch (type) {
      case "all":
        registrationsToExport = registrations;
        filename = "all-registrations";
        break;
      case "filtered":
        registrationsToExport = filteredRegistrations;
        filename = "filtered-registrations";
        break;
      case "participants":
        // Only approved registrations
        registrationsToExport = registrations.filter(
          (reg) => reg.status === "approved"
        );
        filename = "approved-participants";
        break;
      case "pending":
        registrationsToExport = registrations.filter(
          (reg) => reg.status === "pending"
        );
        filename = "pending-registrations";
        break;
      case "accounts":
        registrationsToExport = registrations.filter(
          (reg) => reg.status === "pending"
        );
        filename = "accounts-sheet";
        isAccountsSheet = true;
        break;
      default:
        registrationsToExport = registrations;
        filename = "registrations";
    }

    try {
      let formattedData;

      if (isAccountsSheet) {
        // Format data specifically for accounts sheet
        formattedData = registrationsToExport.map((registration) => ({
          "Team ID": registration.team_id || "N/A",
          "Amount Paid": registration.total_amount || 0,
          "Transaction ID": registration.transaction_id || "N/A",
          "Registration Date": new Date(
            registration.created_at || Date.now()
          ).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          Remarks: "", // Empty column for manual remarks
        }));
      } else {
        // Use existing formatRegistrationForExcel for other exports
        formattedData = registrationsToExport.flatMap(
          formatRegistrationForExcel
        );
      }

      if (formattedData.length === 0) {
        throw new Error("No data to export");
      }

      await exportToExcel(formattedData, filename, isAccountsSheet);

      toast({
        title: "Export started",
        description: `Your ${filename} data is being prepared for download`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Could not export registration data",
        variant: "destructive",
      });
    }
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

  // Function to handle bulk approval
  const handleBulkApprove = async () => {
    if (selectedRegistrations.length === 0) {
      toast({
        title: "No registrations selected",
        description: "Please select at least one registration to approve",
        variant: "destructive",
      });
      return;
    }

    try {
      setBulkProcessing(true);
      setShowApproveDialog(false);
      setShowProgressDialog(true);
      setProcessingStatus("updating");
      setProcessingProgress(0);

      // Get the selected registration objects that are pending
      const selectedRegistrationObjects = registrations.filter(
        (reg) =>
          selectedRegistrations.includes(reg.id) && reg.status === "pending"
      );

      if (selectedRegistrationObjects.length === 0) {
        toast({
          title: "No pending registrations",
          description: "Only pending registrations can be approved",
          variant: "destructive",
        });
        setBulkProcessing(false);
        setShowProgressDialog(false);
        return;
      }

      const pendingIds = selectedRegistrationObjects.map((reg) => reg.id);
      setProcessingTotal(pendingIds.length);

      // Update all selected pending registrations to approved status
      setProcessingStatus("updating");
      const { error } = await supabase
        .from("registrations")
        .update({
          status: "approved",
          payment_status: "completed",
        })
        .in("id", pendingIds);

      if (error) throw error;

      // Send approval emails for each registration
      setProcessingStatus("emailing");
      let emailFailures = 0;
      let totalEmails = 0;
      let sentEmails = 0;

      // Calculate total emails to send
      selectedRegistrationObjects.forEach((reg) => {
        if (reg.team_members) {
          totalEmails += reg.team_members.length;
        }
      });

      setProcessingTotal(totalEmails);
      setProcessingProgress(0);

      for (const registration of selectedRegistrationObjects) {
        if (!registration.team_members) continue;

        // Process each team member individually
        for (let i = 0; i < registration.team_members.length; i++) {
          const member = registration.team_members[i];

          // Update progress for this specific email
          setProcessingProgress(sentEmails);
          setCurrentProcessingEmail(`${member.name} (${member.email})`);

          // Small delay to make the progress visible
          await new Promise((resolve) => setTimeout(resolve, 300));

          sentEmails++;
        }

        // Send the actual emails (we keep the original email sending logic)
        const emailResult = await sendApprovalEmails(
          registration.team_members,
          registration.id,
          registration.selected_events,
          registration.total_amount,
          registration.team_size,
          registration.team_id
        );

        if (!emailResult.success) {
          emailFailures++;
        }
      }

      // Set to complete
      setProcessingProgress(totalEmails);
      setProcessingStatus("complete");
      setCurrentProcessingEmail(null);

      if (emailFailures > 0) {
        toast({
          title: "Warning",
          description: `${emailFailures} email notifications failed to send`,
          variant: "destructive",
        });
      }

      toast({
        title: "Bulk approval successful",
        description: `${pendingIds.length} registrations have been approved`,
      });

      // Clear selection and refresh the registrations list
      setSelectedRegistrations([]);
      fetchRegistrations();

      // Close the progress dialog after a short delay
      setTimeout(() => {
        setShowProgressDialog(false);
        setProcessingStatus("idle");
      }, 1500);
    } catch (error) {
      console.error("Error in bulk approval:", error);
      toast({
        title: "Bulk approval failed",
        description: "Could not approve the selected registrations",
        variant: "destructive",
      });
      setShowProgressDialog(false);
      setProcessingStatus("idle");
    } finally {
      setBulkProcessing(false);
    }
  };

  // Function to handle bulk rejection
  const handleBulkReject = async () => {
    if (selectedRegistrations.length === 0) {
      toast({
        title: "No registrations selected",
        description: "Please select at least one registration to reject",
        variant: "destructive",
      });
      return;
    }

    try {
      setBulkProcessing(true);
      setShowRejectDialog(false);
      setShowProgressDialog(true);
      setProcessingStatus("updating");
      setProcessingProgress(0);

      // Get the selected registration objects that are pending
      const selectedRegistrationObjects = registrations.filter(
        (reg) =>
          selectedRegistrations.includes(reg.id) && reg.status === "pending"
      );

      if (selectedRegistrationObjects.length === 0) {
        toast({
          title: "No pending registrations",
          description: "Only pending registrations can be rejected",
          variant: "destructive",
        });
        setBulkProcessing(false);
        setShowProgressDialog(false);
        return;
      }

      const pendingIds = selectedRegistrationObjects.map((reg) => reg.id);
      setProcessingTotal(pendingIds.length);

      // Update all selected pending registrations to rejected status
      setProcessingStatus("updating");
      const { error } = await supabase
        .from("registrations")
        .update({
          status: "rejected",
          payment_status: "pending",
        })
        .in("id", pendingIds);

      if (error) throw error;

      // Send rejection emails for each registration
      setProcessingStatus("emailing");
      let emailFailures = 0;
      let totalEmails = 0;
      let sentEmails = 0;

      // Calculate total emails to send
      selectedRegistrationObjects.forEach((reg) => {
        if (reg.team_members) {
          totalEmails += reg.team_members.length;
        }
      });

      setProcessingTotal(totalEmails);
      setProcessingProgress(0);

      for (const registration of selectedRegistrationObjects) {
        if (!registration.team_members) continue;

        // Process each team member individually
        for (let i = 0; i < registration.team_members.length; i++) {
          const member = registration.team_members[i];

          // Update progress for this specific email
          setProcessingProgress(sentEmails);
          setCurrentProcessingEmail(`${member.name} (${member.email})`);

          // Small delay to make the progress visible
          await new Promise((resolve) => setTimeout(resolve, 300));

          sentEmails++;
        }

        // Send the actual emails (we keep the original email sending logic)
        const emailResult = await sendRejectionEmails(
          registration.team_members,
          registration.id,
          registration.selected_events,
          registration.total_amount,
          registration.team_size
        );

        if (!emailResult.success) {
          emailFailures++;
        }
      }

      // Set to complete
      setProcessingProgress(totalEmails);
      setProcessingStatus("complete");
      setCurrentProcessingEmail(null);

      if (emailFailures > 0) {
        toast({
          title: "Warning",
          description: `${emailFailures} email notifications failed to send`,
          variant: "destructive",
        });
      }

      toast({
        title: "Bulk rejection successful",
        description: `${pendingIds.length} registrations have been rejected`,
      });

      // Clear selection and refresh the registrations list
      setSelectedRegistrations([]);
      fetchRegistrations();

      // Close the progress dialog after a short delay
      setTimeout(() => {
        setShowProgressDialog(false);
        setProcessingStatus("idle");
      }, 1500);
    } catch (error) {
      console.error("Error in bulk rejection:", error);
      toast({
        title: "Bulk rejection failed",
        description: "Could not reject the selected registrations",
        variant: "destructive",
      });
      setShowProgressDialog(false);
      setProcessingStatus("idle");
    } finally {
      setBulkProcessing(false);
    }
  };

  // Function to toggle selection of a registration
  const toggleRegistrationSelection = (registrationId: string) => {
    if (!selectionMode) return;

    setSelectedRegistrations((prev) =>
      prev.includes(registrationId)
        ? prev.filter((id) => id !== registrationId)
        : [...prev, registrationId]
    );
  };

  // Function to toggle selection of all visible registrations
  const toggleSelectAll = () => {
    if (selectedRegistrations.length === filteredRegistrations.length) {
      // If all are selected, deselect all
      setSelectedRegistrations([]);
    } else {
      // Otherwise, select all visible registrations
      setSelectedRegistrations(filteredRegistrations.map((reg) => reg.id));
    }
  };

  // Function to enable selection mode and select all
  const handleSelectAll = () => {
    setSelectionMode(true);
    setSelectedRegistrations(filteredRegistrations.map((reg) => reg.id));
  };

  // Function to enable selection mode
  const handleSelectMultiple = () => {
    setSelectionMode(true);
    setSelectedRegistrations([]);
  };

  // Function to exit selection mode
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedRegistrations([]);
  };

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
            {!selectionMode ? (
              <>
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
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="text-white hover:text-white hover:bg-yellow-500/10 focus:bg-yellow-500/10 cursor-pointer font-medium"
                      onClick={() => handleExport("accounts")}
                    >
                      Export Accounts Sheet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="border-purple-500/30 hover:border-purple-500/50 text-white hover:text-white bg-purple-500/10 hover:bg-purple-500/20"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Select All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectMultiple}
                  className="border-purple-500/30 hover:border-purple-500/50 text-white hover:text-white bg-purple-500/10 hover:bg-purple-500/20"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select Multiple
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exitSelectionMode}
                  className="border-red-500/30 hover:border-red-500/50 text-white hover:text-white bg-red-500/10 hover:bg-red-500/20"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Selection
                </Button>

                <span className="text-sm text-white bg-purple-500/20 px-3 py-1.5 rounded-md border border-purple-500/30">
                  {selectedRegistrations.length} Selected
                </span>
              </>
            )}
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
                <DropdownMenuSeparator className="bg-purple-500/20" />
                <DropdownMenuLabel className="text-gray-400">
                  Special Filters
                </DropdownMenuLabel>
                <div className="px-2 py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="multiple-events"
                      checked={showMultipleEventsOnly}
                      onCheckedChange={(checked) =>
                        setShowMultipleEventsOnly(checked === true)
                      }
                      className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <Label
                      htmlFor="multiple-events"
                      className="text-sm text-white cursor-pointer"
                    >
                      Multiple Events Only
                    </Label>
                  </div>
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
        {(selectedEvents.length > 0 ||
          activeTab !== "all" ||
          showMultipleEventsOnly) && (
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
            {showMultipleEventsOnly && (
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                Multiple Events Only
                <button
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => setShowMultipleEventsOnly(false)}
                >
                  ×
                </button>
              </Badge>
            )}
            {(selectedEvents.length > 0 ||
              activeTab !== "all" ||
              showMultipleEventsOnly) && (
              <Button
                variant="link"
                className="text-sm text-purple-400 hover:text-purple-300 p-0 h-auto"
                onClick={() => {
                  setSelectedEvents([]);
                  setActiveTab("all");
                  setShowMultipleEventsOnly(false);
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Bulk Action Section - Only show when in selection mode */}
        {selectionMode && selectedRegistrations.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <Checkbox
                id="select-all"
                checked={
                  selectedRegistrations.length > 0 &&
                  selectedRegistrations.length === filteredRegistrations.length
                }
                onCheckedChange={toggleSelectAll}
                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 h-6 w-6 rounded-md"
              />
              <Label
                htmlFor="select-all"
                className="text-sm font-medium text-white cursor-pointer"
              >
                {selectedRegistrations.length === 0
                  ? "Select All Registrations"
                  : selectedRegistrations.length ===
                      filteredRegistrations.length
                    ? "Deselect All Registrations"
                    : `Selected ${selectedRegistrations.length} of ${filteredRegistrations.length} Registrations`}
              </Label>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Dialog
                open={showApproveDialog}
                onOpenChange={setShowApproveDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-400 hover:text-green-300 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 bg-black/30 flex-1 sm:flex-auto"
                    disabled={
                      bulkProcessing ||
                      !selectedRegistrations.some(
                        (id) =>
                          registrations.find((reg) => reg.id === id)?.status ===
                          "pending"
                      )
                    }
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve Pending (
                    {
                      selectedRegistrations.filter(
                        (id) =>
                          registrations.find((reg) => reg.id === id)?.status ===
                          "pending"
                      ).length
                    }
                    )
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 backdrop-blur-md border border-purple-500/30 text-white">
                  <DialogHeader>
                    <DialogTitle>Confirm Bulk Approval</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      You are about to approve{" "}
                      {
                        selectedRegistrations.filter(
                          (id) =>
                            registrations.find((reg) => reg.id === id)
                              ?.status === "pending"
                        ).length
                      }{" "}
                      pending registrations. This action will mark them as
                      approved and send confirmation emails to all team members.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowApproveDialog(false)}
                      className="border-white/20 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBulkApprove}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={bulkProcessing}
                    >
                      {bulkProcessing ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      Confirm Approval
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 bg-black/30 flex-1 sm:flex-auto"
                    disabled={
                      bulkProcessing ||
                      !selectedRegistrations.some(
                        (id) =>
                          registrations.find((reg) => reg.id === id)?.status ===
                          "pending"
                      )
                    }
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject Pending (
                    {
                      selectedRegistrations.filter(
                        (id) =>
                          registrations.find((reg) => reg.id === id)?.status ===
                          "pending"
                      ).length
                    }
                    )
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 backdrop-blur-md border border-red-500/30 text-white">
                  <DialogHeader>
                    <DialogTitle>Confirm Bulk Rejection</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      You are about to reject{" "}
                      {
                        selectedRegistrations.filter(
                          (id) =>
                            registrations.find((reg) => reg.id === id)
                              ?.status === "pending"
                        ).length
                      }{" "}
                      pending registrations. This action will mark them as
                      rejected and send rejection emails to all team members.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(false)}
                      className="border-white/20 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBulkReject}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={bulkProcessing}
                    >
                      {bulkProcessing ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      Confirm Rejection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Progress Dialog */}
        <Dialog
          open={showProgressDialog}
          onOpenChange={(open) => {
            // Only allow closing if not processing
            if (!bulkProcessing) setShowProgressDialog(open);
          }}
        >
          <DialogContent className="bg-black/95 backdrop-blur-md border border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle>
                {processingStatus === "updating" &&
                  "Updating Registration Status..."}
                {processingStatus === "emailing" &&
                  "Sending Notification Emails..."}
                {processingStatus === "complete" && "Processing Complete"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {processingStatus === "updating" &&
                  "Updating database records for selected registrations."}
                {processingStatus === "emailing" && currentProcessingEmail && (
                  <span>
                    Sending email to{" "}
                    <span className="text-yellow-400 font-medium">
                      {currentProcessingEmail}
                    </span>
                  </span>
                )}
                {processingStatus === "complete" &&
                  "All operations completed successfully."}
              </DialogDescription>
            </DialogHeader>

            <div className="my-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white font-medium">
                  {processingProgress} of {processingTotal}
                  <span className="ml-2 px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                    {Math.round(
                      (processingProgress / Math.max(processingTotal, 1)) * 100
                    )}
                    %
                  </span>
                </span>
              </div>
              <Progress
                value={
                  (processingProgress / Math.max(processingTotal, 1)) * 100
                }
                className="h-3 bg-purple-500/20"
              />

              {processingStatus === "emailing" && (
                <div className="mt-6 text-sm text-gray-400">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium text-purple-400">Email Queue:</p>
                    <span className="text-xs bg-black/50 px-2 py-1 rounded-md border border-purple-500/20">
                      {processingProgress} sent •{" "}
                      {processingTotal - processingProgress} remaining
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 bg-black/50 p-3 rounded-md border border-purple-500/20">
                    {selectedRegistrations
                      .filter(
                        (id) =>
                          registrations.find((reg) => reg.id === id)?.status ===
                          "pending"
                      )
                      .flatMap((id) => {
                        const reg = registrations.find((r) => r.id === id);
                        if (!reg || !reg.team_members) return [];

                        return reg.team_members.map((member, memberIndex) => {
                          const teamIndex = selectedRegistrations
                            .filter(
                              (id) =>
                                registrations.find((reg) => reg.id === id)
                                  ?.status === "pending"
                            )
                            .indexOf(id);

                          // Calculate overall index for this email
                          const previousTeamMembersCount = selectedRegistrations
                            .filter(
                              (id) =>
                                registrations.find((reg) => reg.id === id)
                                  ?.status === "pending"
                            )
                            .slice(0, teamIndex)
                            .reduce((count, id) => {
                              const r = registrations.find(
                                (reg) => reg.id === id
                              );
                              return count + (r?.team_members?.length || 0);
                            }, 0);

                          const emailIndex =
                            previousTeamMembersCount + memberIndex;
                          const isActive = emailIndex === processingProgress;

                          return (
                            <div
                              key={`${id}-${member.email}`}
                              className={`py-2 px-3 rounded-md ${
                                emailIndex < processingProgress
                                  ? "text-green-400 bg-green-500/10 border border-green-500/20"
                                  : isActive
                                    ? "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 animate-pulse"
                                    : "text-gray-500 border border-gray-500/10"
                              }`}
                            >
                              <div className="flex items-center">
                                {emailIndex < processingProgress && (
                                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                )}
                                {isActive && (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
                                )}
                                {emailIndex > processingProgress && (
                                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {member.name}{" "}
                                    {memberIndex === 0 ? "(Team Lead)" : ""}
                                  </div>
                                  <div className="text-xs truncate">
                                    {member.email}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Team: {reg.team_id || "Unknown"}
                                  </div>
                                </div>

                                {emailIndex < processingProgress && (
                                  <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded-full text-green-300 ml-2">
                                    Sent
                                  </span>
                                )}
                                {isActive && (
                                  <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full text-yellow-300 ml-2">
                                    Sending...
                                  </span>
                                )}
                                {emailIndex > processingProgress && (
                                  <span className="text-xs bg-gray-500/20 px-2 py-0.5 rounded-full text-gray-400 ml-2">
                                    Queued
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {processingStatus === "complete" && (
                <Button
                  onClick={() => setShowProgressDialog(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                className={`bg-black/50 backdrop-blur-sm border ${
                  selectionMode &&
                  selectedRegistrations.includes(registration.id)
                    ? "border-purple-500 ring-1 ring-purple-500/50"
                    : "border-purple-500/20"
                } rounded-xl p-5 hover:bg-black/60 transition-colors relative cursor-pointer`}
                onClick={(e) => {
                  if (selectionMode) {
                    toggleRegistrationSelection(registration.id);
                  } else {
                    // Only navigate if not in selection mode and not clicking on a button
                    if (!(e.target as HTMLElement).closest("button")) {
                      router.push(`/admin/registrations/${registration.id}`);
                    }
                  }
                }}
              >
                {/* Only show checkbox when in selection mode */}
                {selectionMode && (
                  <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5">
                    <Checkbox
                      id={`select-${registration.id}`}
                      checked={selectedRegistrations.includes(registration.id)}
                      onCheckedChange={() => {
                        // Prevent the click from bubbling up to the parent div
                        // which would toggle the selection again
                        toggleRegistrationSelection(registration.id);
                      }}
                      className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 h-6 w-6 rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

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

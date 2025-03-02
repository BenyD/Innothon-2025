"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  IndianRupee,
  ArrowUpRight,
  Mail,
  User2,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import type { Registration } from "@/types/registration";
import type { Contact } from "@/types/contact";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { exportToExcel, formatRegistrationForExcel } from "@/utils/excel";

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

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [recentMessages, setRecentMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [registrationsData, messagesData] = await Promise.all([
          supabase
            .from("registrations")
            .select(
              `
            *,
            team_members!team_members_registration_id_fkey (*)
          `
            )
            .order("created_at", { ascending: false }),
          supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        if (registrationsData.error) throw registrationsData.error;
        if (messagesData.error) throw messagesData.error;

        setRegistrations(registrationsData.data || []);
        setRecentMessages(messagesData.data || []);

        if (showToast) {
          toast({
            title: "Dashboard refreshed",
            description: "Latest data has been loaded",
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (showToast) {
          toast({
            title: "Refresh failed",
            description: "Could not refresh dashboard data",
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
    fetchData();

    // Set up real-time subscriptions
    const registrationsChannel = supabase
      .channel("registrations_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registrations" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel("messages_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [fetchData]);

  // Calculate statistics
  const totalRevenue = registrations.reduce(
    (acc, reg) => acc + reg.total_amount,
    0
  );
  const approvedRevenue = registrations
    .filter((reg) => reg.status === "approved")
    .reduce((acc, reg) => acc + reg.total_amount, 0);
  const pendingRegistrations = registrations.filter(
    (reg) => reg.status === "pending"
  ).length;
  const approvedRegistrations = registrations.filter(
    (reg) => reg.status === "approved"
  ).length;
  const rejectedRegistrations = registrations.filter(
    (reg) => reg.status === "rejected"
  ).length;
  const totalParticipants = registrations.reduce(
    (acc, reg) => acc + reg.team_size,
    0
  );
  const unreadMessages = recentMessages.filter(
    (msg: Contact) => !msg.read
  ).length;

  // Calculate event distribution
  const eventDistribution = useMemo(() => {
    const eventCounts: Record<string, number> = {};
    registrations.forEach((reg) => {
      reg.selected_events.forEach((event) => {
        eventCounts[event] = (eventCounts[event] || 0) + 1;
      });
    });

    return Object.entries(eventCounts)
      .map(([event, count]) => ({
        event,
        count,
        displayName: getEventDisplayName(event),
      }))
      .sort((a, b) => b.count - a.count);
  }, [registrations]);

  // Calculate registration status percentages
  const totalRegistrationsCount = registrations.length;
  const pendingPercentage = totalRegistrationsCount
    ? Math.round((pendingRegistrations / totalRegistrationsCount) * 100)
    : 0;
  const approvedPercentage = totalRegistrationsCount
    ? Math.round((approvedRegistrations / totalRegistrationsCount) * 100)
    : 0;
  const rejectedPercentage = totalRegistrationsCount
    ? Math.round((rejectedRegistrations / totalRegistrationsCount) * 100)
    : 0;

  // Calculate recent activity (last 24 hours)
  const recentActivity = useMemo(() => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentRegs = registrations.filter(
      (reg) => new Date(reg.created_at) > oneDayAgo
    ).length;

    const recentMsgs = recentMessages.filter(
      (msg: Contact) => new Date(msg.created_at) > oneDayAgo
    ).length;

    return {
      registrations: recentRegs,
      messages: recentMsgs,
    };
  }, [registrations, recentMessages]);

  const handleExport = (type: string) => {
    let dataToExport: Record<string, string | number>[] = [];
    let filename = "";

    switch (type) {
      case "all":
        dataToExport = registrations.map(formatRegistrationForExcel);
        filename = "all-registrations";
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back! Here&apos;s what&apos;s happening with Innothon.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
                  >
                    {refreshing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh dashboard data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 backdrop-blur-sm border border-white/10">
                <DropdownMenuLabel className="text-gray-400">
                  Export Options (Excel)
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
                  onClick={() => handleExport("pending")}
                >
                  Export Pending Registrations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue}`}
            subtitle={`₹${approvedRevenue} approved`}
            icon={IndianRupee}
            color="text-green-400"
            loading={loading}
          />
          <StatCard
            title="Total Participants"
            value={totalParticipants}
            subtitle={`${registrations.length} teams`}
            icon={Users}
            color="text-blue-400"
            loading={loading}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingRegistrations}
            subtitle={
              pendingPercentage > 0
                ? `${pendingPercentage}% of total`
                : "No pending"
            }
            icon={Clock}
            color="text-yellow-400"
            loading={loading}
          />
          <StatCard
            title="Unread Messages"
            value={unreadMessages}
            subtitle={unreadMessages > 0 ? "Needs attention" : "All caught up"}
            icon={Mail}
            color="text-purple-400"
            loading={loading}
          />
        </motion.div>

        {/* Recent Activity & Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview */}
          <motion.div
            variants={item}
            className="lg:col-span-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                Registration Status
              </h2>
              <Link
                href="/admin/analytics"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Details
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Approved</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {approvedRegistrations} ({approvedPercentage}%)
                  </span>
                </div>
                <Progress value={approvedPercentage} className="h-2 bg-white/5">
                  <div className="h-full bg-green-500 rounded-full" />
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Pending</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {pendingRegistrations} ({pendingPercentage}%)
                  </span>
                </div>
                <Progress value={pendingPercentage} className="h-2 bg-white/5">
                  <div className="h-full bg-yellow-500 rounded-full" />
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Rejected</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {rejectedRegistrations} ({rejectedPercentage}%)
                  </span>
                </div>
                <Progress value={rejectedPercentage} className="h-2 bg-white/5">
                  <div className="h-full bg-red-500 rounded-full" />
                </Progress>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-medium text-white mb-4">
                  Recent Activity (24h)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 text-blue-400 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-lg font-medium">
                        {recentActivity.registrations}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      New Registrations
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 text-purple-400 mb-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-lg font-medium">
                        {recentActivity.messages}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">New Messages</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Registrations */}
          <motion.div
            variants={item}
            className="lg:col-span-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                Recent Registrations
              </h2>
              <Link
                href="/admin/registrations"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center justify-between p-4 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                          <div className="h-3 w-24 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                    </div>
                  ))
              ) : registrations.length > 0 ? (
                registrations.slice(0, 5).map((registration) => (
                  <Link
                    key={registration.id}
                    href={`/admin/registrations/${registration.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <User2 className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">
                            {registration.team_members[0]?.name}
                            {registration.team_size > 1 && (
                              <span className="text-gray-400 text-sm ml-1">
                                +{registration.team_size - 1} others
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <p className="text-xs text-gray-400">
                              {registration.team_members[0]?.college}
                            </p>
                            <span className="hidden sm:inline-block text-gray-600 text-xs">
                              •
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {registration.selected_events
                                .slice(0, 2)
                                .map((event) => (
                                  <span
                                    key={event}
                                    className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-gray-300"
                                  >
                                    {getEventDisplayName(event)}
                                  </span>
                                ))}
                              {registration.selected_events.length > 2 && (
                                <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-gray-300">
                                  +{registration.selected_events.length - 2}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                        <span className="text-xs text-gray-500">
                          {new Date(
                            registration.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400">
                    No registrations yet
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Registrations will appear here once teams sign up
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Event Distribution & Recent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Distribution */}
          <motion.div
            variants={item}
            className="lg:col-span-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                Event Distribution
              </h2>
              <Link
                href="/admin/analytics"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Details
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                        <div className="h-4 w-8 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full"></div>
                    </div>
                  ))
              ) : eventDistribution.length > 0 ? (
                eventDistribution.map((event, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">
                        {event.displayName}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {event.count}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{
                          width: `${Math.min(100, (event.count / eventDistribution[0].count) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">No event data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            variants={item}
            className="lg:col-span-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                Recent Messages
              </h2>
              <Link
                href="/admin/messages"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center justify-between p-4 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                          <div className="h-3 w-48 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                    </div>
                  ))
              ) : recentMessages.length > 0 ? (
                recentMessages.map((message: Contact) => (
                  <Link
                    key={message.id}
                    href={`/admin/messages/${message.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">
                              {message.name}
                            </p>
                            {!message.read && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-1">
                            {message.message.slice(0, 60)}...
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400">
                    No messages yet
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Messages from the contact form will appear here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

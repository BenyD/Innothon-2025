"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { X, Users, IndianRupee, Activity, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalMessages: number;
  recentMessages: number;
  unreadMessages: number;
  conversionRate: string;
  totalRegistrations: number;
  totalRevenue: number;
  pendingApprovals: number;
  approvalRate: string;
}

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Add date range options
const DATE_RANGES = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All time",
};

// Define the valid date range values
type DateRange = "24h" | "7d" | "30d" | "90d" | "all";

type ActivityItem = {
  type: "registration" | "message";
  id: string;
  created_at: string;
  // For registration type
  team_members?: { name: string; college: string }[];
  team_size?: number;
  total_amount?: number;
  status?: "pending" | "approved" | "rejected";
  // For message type
  name?: string;
  email?: string;
  message?: string;
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>("24h");
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    recentMessages: 0,
    unreadMessages: 0,
    conversionRate: "0.0",
    totalRegistrations: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    approvalRate: "0.0",
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const router = useRouter();

  const fetchDashboardData = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      if (isRetry) setRetrying(true);

      // First fetch registrations with payment status
      const registrationsResult = await supabase.from("registrations").select(`
        id,
        created_at,
        team_size,
        total_amount,
        status,
        payment_status,
        team_members (
          id,
          name,
          college
        )
      `);

      if (registrationsResult.error) throw registrationsResult.error;
      const registrations = registrationsResult.data || [];

      // Then fetch messages
      const messagesResult = await supabase
        .from("contact_messages")
        .select("*");

      if (messagesResult.error) throw messagesResult.error;
      const messages = messagesResult.data || [];

      // Calculate stats
      const totalRegistrations = registrations.length;
      const pendingApprovals = registrations.filter(
        (reg) => reg.status === "pending"
      ).length;
      const approvedRegistrations = registrations.filter(
        (reg) => reg.status === "approved"
      ).length;

      const totalRevenue = registrations.reduce((sum, reg) => {
        if (reg.status === "approved" && reg.payment_status === "completed") {
          return sum + (Number(reg.total_amount) || 0);
        }
        return sum;
      }, 0);

      const approvalRate =
        totalRegistrations > 0
          ? ((approvedRegistrations / totalRegistrations) * 100).toFixed(1)
          : "0.0";

      const totalMessages = messages.length;
      const recentMessages = messages.filter((msg) => {
        const msgDate = new Date(msg.created_at);
        const now = new Date();
        const daysDiff =
          (now.getTime() - msgDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7;
      }).length;

      // Update stats
      setStats({
        totalMessages,
        recentMessages,
        unreadMessages: 0,
        conversionRate: approvalRate,
        totalRegistrations,
        totalRevenue,
        pendingApprovals,
        approvalRate,
      });

      // Update recent activity
      const newRecentActivity = [
        ...registrations.slice(0, 8).map((reg) => ({
          type: "registration" as const,
          id: reg.id,
          created_at: reg.created_at,
          team_members: reg.team_members,
          team_size: reg.team_size,
          total_amount: reg.total_amount,
          status: reg.status,
        })),
        ...messages.slice(0, 8).map((msg) => ({
          type: "message" as const,
          id: msg.id,
          created_at: msg.created_at,
          name: msg.name,
          email: msg.email,
          message: msg.message,
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 8);

      setRecentActivity(newRecentActivity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []); // Empty dependency array since all setState functions are stable

  // Fetch data when component mounts or date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, dateRange]);

  // Add this to debug state updates
  useEffect(() => {
    console.log("Stats updated:", stats);
  }, [stats]);

  // Add realtime subscription for dashboard updates
  useEffect(() => {
    const channel = supabase
      .channel("dashboard_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          // Refresh dashboard data when changes occur
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboardData]);

  // Update the stat cards section
  const statCards = [
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Activity,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Date Range Selector */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl lg:text-2xl font-bold text-white">
            Dashboard
          </h1>
          <Select
            value={dateRange}
            onValueChange={(value: DateRange) => setDateRange(value)}
          >
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemAnimation}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold text-white mt-2">
                    {loading ? <Skeleton className="h-8 w-16" /> : card.value}
                  </h3>
                </div>
                <card.icon className="w-12 h-12 text-white/20" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6 min-h-[calc(100vh-24rem)]">
            <div className="flex items-center mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-white">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3 lg:space-y-4 h-[calc(100vh-28rem)] overflow-y-auto custom-scrollbar">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-3 lg:space-y-4"
                >
                  {recentActivity.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemAnimation}
                      className="group relative flex items-center justify-between p-3 lg:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      onClick={() => {
                        if (item.type === "registration") {
                          router.push(`/admin/registrations#${item.id}`);
                        } else {
                          router.push(`/admin/messages#${item.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          {item.type === "registration" ? (
                            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                          ) : (
                            <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm lg:text-base text-white font-medium">
                            {item.type === "registration"
                              ? `${item.team_members?.[0]?.name || "Unknown"} ${
                                  (item.team_size ?? 0) > 1
                                    ? `+ ${(item.team_size ?? 0) - 1} ${
                                        (item.team_size ?? 0) === 2
                                          ? "other"
                                          : "others"
                                      }`
                                    : ""
                                }`
                              : item.name}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-400">
                            {item.type === "registration"
                              ? item.team_members?.[0]?.college ||
                                "Unknown College"
                              : item.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.type === "registration" ? (
                          <>
                            <p className="text-white font-medium">
                              ₹{item.total_amount || 0}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                item.status === "approved"
                                  ? "bg-green-500/10 text-green-400"
                                  : item.status === "rejected"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {item.status
                                ? item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)
                                : "Pending"}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <p className="text-red-500">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchDashboardData(true)}
                disabled={retrying}
                className="border-red-500/20 hover:border-red-500/40 text-red-500"
              >
                {retrying ? "Retrying..." : "Retry"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import {
  X,
  Users,
  IndianRupee,
  Activity,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
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

  const fetchDashboardData = useCallback(
    async (isRetry = false) => {
      try {
        setLoading(true);
        setError(null);
        if (isRetry) setRetrying(true);

        // Fetch all registrations first (without date filter for total stats)
        const { data: allRegistrations, error: allRegError } =
          await supabase.from("registrations").select(`
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

        if (allRegError) throw allRegError;

        // Calculate total stats
        const totalRegistrations = allRegistrations?.length || 0;
        const pendingApprovals =
          allRegistrations?.filter((reg) => reg.status === "pending").length ||
          0;
        const totalRevenue =
          allRegistrations?.reduce(
            (sum, reg) => sum + (reg.total_amount || 0),
            0
          ) || 0;

        // Update stats immediately
        setStats((prevStats) => ({
          ...prevStats,
          totalRegistrations,
          totalRevenue,
          pendingApprovals,
        }));

        // Now fetch recent activity based on date range
        const now = new Date();
        const ranges = {
          "24h": new Date(now.getTime() - 24 * 60 * 60 * 1000),
          "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          "90d": new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          all: new Date(0),
        };

        const startDate = ranges[dateRange];

        const { data: recentRegistrations } = await supabase
          .from("registrations")
          .select(
            `
            id,
            created_at,
            team_size,
            total_amount,
            status,
            team_members (
              id,
              name,
              college
            )
          `
          )
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: false })
          .limit(8);

        // Update recent activity
        const recentActivity: ActivityItem[] =
          recentRegistrations?.map((reg) => ({
            type: "registration" as const,
            id: reg.id,
            created_at: reg.created_at,
            team_members: reg.team_members,
            team_size: reg.team_size,
            total_amount: reg.total_amount,
            status: reg.status,
          })) || [];

        setRecentActivity(recentActivity);
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
    },
    [dateRange]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, fetchDashboardData]);

  const statCards = [
    {
      title: "Total Registrations",
      value: loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        stats.totalRegistrations.toString()
      ),
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Revenue",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        `₹${stats.totalRevenue.toLocaleString()}`
      ),
      icon: IndianRupee,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Approvals",
      value: loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        stats.pendingApprovals.toString()
      ),
      icon: Activity,
      color: "from-yellow-500 to-yellow-600",
      highlight: stats.pendingApprovals > 0,
    },
    {
      title: "Total Messages",
      value: loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        stats.totalMessages.toString()
      ),
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
      badge:
        stats.unreadMessages > 0 ? stats.unreadMessages.toString() : undefined,
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
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className="absolute -inset-0.5 bg-gradient-to-r opacity-75 group-hover:opacity-100 blur-sm transition duration-300"
                style={{
                  backgroundImage: `linear-gradient(to right, ${stat.color})`,
                }}
              />
              <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <stat.icon className="w-5 h-5 text-gray-400" />
                  <span
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${stat.color})`,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6 min-h-[calc(100vh-24rem)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-white">
                Recent Activity
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-colors"
                asChild
              >
                <Link
                  href="/admin/activity"
                  className="flex items-center gap-2"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { MessageSquare, Clock, Mail, X, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useInterval } from "@/hooks/useInterval";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { AnalyticsData } from "@/types/analytics";

interface DashboardStats {
  totalMessages: number;
  recentMessages: number;
  unreadMessages: number;
  conversionRate: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  loading: boolean;
}

interface MessageTrend {
  date: string;
  count: number;
}

interface RecentActivity {
  id: number;
  name: string;
  email: string;
  created_at: string;
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

const item = {
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
  all: "All time",
};

const REFRESH_INTERVAL = 30000; // 30 seconds

// Define the valid date range values
type DateRange = "24h" | "7d" | "30d" | "all";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>("24h");
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    recentMessages: 0,
    unreadMessages: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [messagesTrend, setMessagesTrend] = useState<MessageTrend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const fetchDashboardData = useCallback(
    async (isRetry = false) => {
      try {
        if (isRetry) setRetrying(true);
        setError(null);
        const now = new Date();
        let startDate;

        switch (dateRange) {
          case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "30d":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "24h":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = null;
        }

        const dateFilter = startDate ? { gte: startDate.toISOString() } : {};

        const [totalResult, recentResult, unreadResult, activityResult] =
          await Promise.all([
            supabase.from("contact_messages").select("*", { count: "exact" }),
            supabase.from("contact_messages").select("*").match(dateFilter),
            supabase
              .from("contact_messages")
              .select("*", { count: "exact" })
              .eq("read", false),
            supabase
              .from("contact_messages")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(5),
          ]);

        const trendResult = await supabase
          .from("contact_messages")
          .select("created_at")
          .order("created_at", { ascending: true });

        const trend = trendResult.data?.reduce(
          (acc: MessageTrend[], message: { created_at: string }) => {
            const date = new Date(message.created_at).toLocaleDateString();
            const existing = acc.find((item) => item.date === date);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ date, count: 1 });
            }
            return acc;
          },
          []
        );

        setMessagesTrend(trend || []);

        const conversionRate = Math.round(
          ((totalResult.count || 0) / (stats.totalMessages || 1)) * 100
        );

        setStats({
          totalMessages: totalResult.count || 0,
          recentMessages: recentResult.data?.length || 0,
          unreadMessages: unreadResult.count || 0,
          conversionRate: conversionRate,
        });
        setRecentActivity(activityResult.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    },
    [dateRange, stats.totalMessages]
  );

  useEffect(() => {
    fetchDashboardData();
    fetchAnalyticsData();
  }, [dateRange, fetchDashboardData]);

  useInterval(() => {
    fetchDashboardData();
  }, REFRESH_INTERVAL);

  async function fetchAnalyticsData() {
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to load analytics data");
    } finally {
      setAnalyticsLoading(false);
    }
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    loading,
  }: StatCardProps) => (
    <motion.div variants={item}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm">{title}</p>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

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
          <StatCard
            title="Total Messages"
            value={stats.totalMessages}
            icon={MessageSquare}
            color="text-blue-500"
            loading={loading}
          />
          <StatCard
            title={`Last ${DATE_RANGES[dateRange]}`}
            value={stats.recentMessages}
            icon={Clock}
            color="text-purple-500"
            loading={loading}
          />
          <StatCard
            title="Unread Messages"
            value={stats.unreadMessages}
            icon={Mail}
            color="text-pink-500"
            loading={loading}
          />
          <StatCard
            title="Response Rate"
            value={`${stats.conversionRate}%`}
            icon={TrendingUp}
            color="text-green-500"
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 lg:space-y-4">
              {loading ? (
                [...Array(3)].map((_, index) => (
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
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      variants={item}
                      className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm lg:text-base text-white font-medium">
                            {activity.name}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-400">
                            {activity.email}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <AnalyticsSection
          data={analyticsData}
          loading={analyticsLoading}
          error={error}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div variants={item} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
            <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-white mb-4">
                Message History
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messagesTrend}>
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Registrations"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
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

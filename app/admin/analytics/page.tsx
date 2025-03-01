"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock4,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import {
  LineChart,
  BarChart,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  Bar,
  Pie,
  Cell,
} from "recharts";
import type { Registration } from "@/types/registration";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#6366F1",
];

// First, add types for the trend data
type TrendData = { date: string; count: number };
type EventData = { name: string; value: number };
type RevenueData = { event: string; revenue: number; potentialRevenue: number };
type RevenueTrendData = {
  date: string;
  revenue: number;
  potentialRevenue: number;
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalRevenue: 0,
    approvedRevenue: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    averageTeamSize: 0,
  });
  const [registrationTrend, setRegistrationTrend] = useState<TrendData[]>([]);
  const [eventDistribution, setEventDistribution] = useState<EventData[]>([]);
  const [revenueByEvent, setRevenueByEvent] = useState<RevenueData[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendData[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      const { data: registrations, error } = await supabase
        .from("registrations")
        .select("*");

      if (error) throw error;

      // Calculate basic stats
      const total = registrations.length;
      const pending = registrations.filter(
        (r) => r.status === "pending"
      ).length;
      const approved = registrations.filter(
        (r) => r.status === "approved"
      ).length;
      const rejected = registrations.filter(
        (r) => r.status === "rejected"
      ).length;

      // Calculate both actual and potential revenue
      const totalRevenue = registrations.reduce(
        (sum, r) => sum + r.total_amount,
        0
      );
      const approvedRevenue = registrations
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + r.total_amount, 0);

      const avgTeamSize =
        registrations.reduce((sum, r) => sum + r.team_size, 0) / total;

      setStats({
        totalRegistrations: total,
        totalRevenue: totalRevenue, // Show total potential revenue
        approvedRevenue: approvedRevenue, // Add this to show approved revenue
        pendingRegistrations: pending,
        approvedRegistrations: approved,
        rejectedRegistrations: rejected,
        averageTeamSize: Number(avgTeamSize.toFixed(1)),
      });

      // Process all trends and distributions
      setRegistrationTrend(processRegistrationTrend(registrations));
      setEventDistribution(processEventDistribution(registrations));
      setRevenueByEvent(processRevenueByEvent(registrations));
      setRevenueTrend(processRevenueTrend(registrations));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Track registration metrics and revenue
          </p>
        </div>

        {/* Stats Overview - Optimized for mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Registrations"
            value={stats.totalRegistrations}
            icon={Users}
            color="text-blue-400"
            loading={loading}
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue}`}
            icon={IndianRupee}
            color="text-green-400"
            loading={loading}
            subtitle={`₹${stats.approvedRevenue} approved`}
          />
          <StatCard
            title="Pending"
            value={stats.pendingRegistrations}
            icon={Clock4}
            color="text-yellow-400"
            loading={loading}
          />
          <StatCard
            title="Approved"
            value={stats.approvedRegistrations}
            icon={CheckCircle2}
            color="text-emerald-400"
            loading={loading}
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedRegistrations}
            icon={XCircle}
            color="text-red-400"
            loading={loading}
          />
          <StatCard
            title="Avg Team"
            value={stats.averageTeamSize}
            icon={Users}
            color="text-purple-400"
            loading={loading}
          />
        </div>

        {/* Charts Grid - Optimized for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Registration Trend */}
          <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">
              Registration Trend
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart data={registrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      value.split("-").slice(1).join("/")
                    }
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "white",
                    }}
                    itemStyle={{ color: "white" }}
                    labelStyle={{ color: "white" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="count" stroke="#8B5CF6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Distribution */}
          <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">
              Event Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={eventDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}
                    labelLine={false}
                  >
                    {eventDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "white",
                    }}
                    itemStyle={{ color: "white" }}
                    labelStyle={{ color: "white" }}
                    formatter={(value, name) => [`${value}`, `${name}`]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    layout="horizontal"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Charts - Full width on all screens */}
          <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Revenue Trend */}
            <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">
                Revenue Trend
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        value.split("-").slice(1).join("/")
                      }
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "0.5rem",
                        fontSize: "12px",
                        color: "white",
                      }}
                      itemStyle={{ color: "white" }}
                      labelStyle={{ color: "white" }}
                      formatter={(value) => [`₹${value}`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Approved"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="potentialRevenue"
                      name="Potential"
                      stroke="#6366F1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by Event */}
            <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-4">
                Revenue by Event
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={revenueByEvent}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis
                      dataKey="event"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "0.5rem",
                        fontSize: "12px",
                        color: "white",
                      }}
                      itemStyle={{ color: "white" }}
                      labelStyle={{ color: "white" }}
                      formatter={(value) => [`₹${value}`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="revenue" name="Approved" fill="#10B981" />
                    <Bar
                      dataKey="potentialRevenue"
                      name="Potential"
                      fill="#6366F1"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Helper functions
function processRegistrationTrend(registrations: Registration[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  return last7Days.map((date) => ({
    date,
    count: registrations.filter((r) => r.created_at.split("T")[0] === date)
      .length,
  }));
}

function processEventDistribution(registrations: Registration[]) {
  const eventCounts: { [key: string]: number } = {};
  registrations.forEach((reg) => {
    reg.selected_events.forEach((event) => {
      eventCounts[event] = (eventCounts[event] || 0) + 1;
    });
  });

  return Object.entries(eventCounts).map(([name, value]) => ({
    name,
    value,
  }));
}

function processRevenueByEvent(registrations: Registration[]): RevenueData[] {
  const eventRevenue: {
    [key: string]: { approved: number; potential: number };
  } = {};

  registrations.forEach((reg) => {
    const amountPerEvent = reg.total_amount / reg.selected_events.length;
    reg.selected_events.forEach((event) => {
      if (!eventRevenue[event]) {
        eventRevenue[event] = { approved: 0, potential: 0 };
      }
      if (reg.status === "approved") {
        eventRevenue[event].approved += amountPerEvent;
      }
      eventRevenue[event].potential += amountPerEvent;
    });
  });

  return Object.entries(eventRevenue).map(
    ([event, { approved, potential }]) => ({
      event,
      revenue: Math.round(approved),
      potentialRevenue: Math.round(potential),
    })
  );
}

function processRevenueTrend(
  registrations: Registration[]
): RevenueTrendData[] {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  return last7Days.map((date) => {
    const dayRegistrations = registrations.filter(
      (r) => r.created_at.split("T")[0] === date
    );

    return {
      date,
      revenue: dayRegistrations
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + r.total_amount, 0),
      potentialRevenue: dayRegistrations.reduce(
        (sum, r) => sum + r.total_amount,
        0
      ),
    };
  });
}

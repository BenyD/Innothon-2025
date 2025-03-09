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
type ParticipantDistribution = { name: string; value: number };
type EventParticipantData = {
  event: string;
  total: number;
  internal: number;
  external: number;
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
    totalParticipants: 0,
    internalParticipants: 0,
    externalParticipants: 0,
  });
  const [registrationTrend, setRegistrationTrend] = useState<TrendData[]>([]);
  const [eventDistribution, setEventDistribution] = useState<EventData[]>([]);
  const [revenueByEvent, setRevenueByEvent] = useState<RevenueData[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendData[]>([]);
  const [participantDistribution, setParticipantDistribution] = useState<
    ParticipantDistribution[]
  >([]);
  const [eventParticipants, setEventParticipants] = useState<
    EventParticipantData[]
  >([]);

  const fetchStats = useCallback(async () => {
    try {
      // First, fetch registrations
      const { data: registrations, error: registrationsError } = await supabase
        .from("registrations")
        .select("*");

      if (registrationsError) throw registrationsError;

      if (!registrations || registrations.length === 0) {
        setStats({
          totalRegistrations: 0,
          totalRevenue: 0,
          approvedRevenue: 0,
          pendingRegistrations: 0,
          approvedRegistrations: 0,
          rejectedRegistrations: 0,
          averageTeamSize: 0,
          totalParticipants: 0,
          internalParticipants: 0,
          externalParticipants: 0,
        });
        setLoading(false);
        return;
      }

      // Then, fetch team members
      const { data: teamMembers, error: teamMembersError } = await supabase
        .from("team_members")
        .select("*");

      if (teamMembersError) throw teamMembersError;

      // Associate team members with their registrations
      const registrationsWithTeamMembers = registrations.map((reg) => {
        const members =
          teamMembers?.filter((member) => member.team_id === reg.team_id) || [];
        return {
          ...reg,
          team_members: members,
        };
      });

      // Calculate basic stats
      const total = registrationsWithTeamMembers.length;
      const pending = registrationsWithTeamMembers.filter(
        (r) => r.status === "pending"
      ).length;
      const approved = registrationsWithTeamMembers.filter(
        (r) => r.status === "approved"
      ).length;
      const rejected = registrationsWithTeamMembers.filter(
        (r) => r.status === "rejected"
      ).length;

      // Calculate both actual and potential revenue
      const totalRevenue = registrationsWithTeamMembers.reduce(
        (sum, r) => sum + r.total_amount,
        0
      );
      const approvedRevenue = registrationsWithTeamMembers
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + r.total_amount, 0);

      const avgTeamSize =
        registrationsWithTeamMembers.reduce((sum, r) => sum + r.team_size, 0) /
        total;

      // Calculate total participants and internal vs external
      const totalParticipants = registrationsWithTeamMembers.reduce(
        (sum, r) => sum + (r.team_members?.length || 0),
        0
      );

      const internalParticipants = registrationsWithTeamMembers.reduce(
        (sum, r) =>
          sum +
          (r.team_members?.filter((member) => {
            const college = member.college?.toLowerCase() || "";
            return college.includes("hindustan") || college.includes("hits");
          })?.length || 0),
        0
      );

      const externalParticipants = totalParticipants - internalParticipants;

      setStats({
        totalRegistrations: total,
        totalRevenue: totalRevenue, // Show total potential revenue
        approvedRevenue: approvedRevenue, // Add this to show approved revenue
        pendingRegistrations: pending,
        approvedRegistrations: approved,
        rejectedRegistrations: rejected,
        averageTeamSize: Number(avgTeamSize.toFixed(1)),
        totalParticipants,
        internalParticipants,
        externalParticipants,
      });

      // Process all trends and distributions
      setRegistrationTrend(
        processRegistrationTrend(registrationsWithTeamMembers)
      );
      setEventDistribution(
        processEventDistribution(registrationsWithTeamMembers)
      );
      setRevenueByEvent(processRevenueByEvent(registrationsWithTeamMembers));
      setRevenueTrend(processRevenueTrend(registrationsWithTeamMembers));
      setParticipantDistribution([
        { name: "Internal", value: internalParticipants },
        { name: "External", value: externalParticipants },
      ]);
      setEventParticipants(
        processEventParticipants(registrationsWithTeamMembers)
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
            title="Total Registrations"
            value={stats.totalRegistrations}
            icon={Users}
            color="text-blue-400"
            loading={loading}
          />
          <StatCard
            title="Revenue"
            value={`₹${typeof stats.totalRevenue === "number" ? stats.totalRevenue.toLocaleString("en-IN") : 0}`}
            icon={IndianRupee}
            color="text-green-400"
            loading={loading}
            subtitle={`₹${typeof stats.approvedRevenue === "number" ? stats.approvedRevenue.toLocaleString("en-IN") : 0} approved`}
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
        </div>

        {/* Participants Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants}
            icon={Users}
            color="text-blue-400"
            loading={loading}
          />
          <StatCard
            title="Internal Participants"
            value={stats.internalParticipants}
            icon={Users}
            color="text-emerald-400"
            loading={loading}
            subtitle="From Hindustan/HITS"
          />
          <StatCard
            title="External Participants"
            value={stats.externalParticipants}
            icon={Users}
            color="text-purple-400"
            loading={loading}
            subtitle="From other institutions"
          />
        </div>

        {/* Charts Grid - Optimized for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Registration Trend */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
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
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
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
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue by Event */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
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
                    formatter={(value) => [`₹${value}`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="revenue"
                    name="Approved Revenue"
                    fill="#10B981"
                  />
                  <Bar
                    dataKey="potentialRevenue"
                    name="Potential Revenue"
                    fill="#6366F1"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
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
                    formatter={(value) => [`₹${value}`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Approved Revenue"
                    stroke="#10B981"
                  />
                  <Line
                    type="monotone"
                    dataKey="potentialRevenue"
                    name="Potential Revenue"
                    stroke="#6366F1"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* New Charts for Participant Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Internal vs External Participants */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">
            Internal vs External Participants
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={participantDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={true}
                >
                  <Cell fill="#3B82F6" />
                  <Cell fill="#8B5CF6" />
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
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Participants by Event */}
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">
            Participants by Event
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={eventParticipants}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="event"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
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
                <Bar dataKey="total" name="Total" fill="#3B82F6" />
                <Bar dataKey="internal" name="Internal" fill="#10B981" />
                <Bar dataKey="external" name="External" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
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

function processEventParticipants(
  registrations: Registration[]
): EventParticipantData[] {
  const eventParticipants: {
    [key: string]: {
      total: number;
      internal: number;
      external: number;
    };
  } = {};

  registrations.forEach((reg) => {
    if (!reg.selected_events) return;

    reg.selected_events.forEach((event) => {
      if (!eventParticipants[event]) {
        eventParticipants[event] = { total: 0, internal: 0, external: 0 };
      }

      // Count total participants for this event
      const participantsInEvent = reg.team_members?.length || 0;
      eventParticipants[event].total += participantsInEvent;

      // Count internal participants (from Hindustan/HITS)
      const internalParticipantsInEvent =
        reg.team_members?.filter((member) => {
          const college = member.college?.toLowerCase() || "";
          return college.includes("hindustan") || college.includes("hits");
        })?.length || 0;

      eventParticipants[event].internal += internalParticipantsInEvent;
      eventParticipants[event].external +=
        participantsInEvent - internalParticipantsInEvent;
    });
  });

  return Object.entries(eventParticipants).map(
    ([event, { total, internal, external }]) => ({
      event,
      total,
      internal,
      external,
    })
  );
}

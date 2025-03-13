"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock4,
  RefreshCw,
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
import type { Registration, TeamMember } from "@/types/registration";
import { events as staticEvents } from "@/data/events"; // Import static events data
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { calculateRegistrationRevenue } from "@/utils/revenue";

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

// Add types for the new components
type YearDistribution = Record<string, number>;

type EventComparisonData = {
  eventId: string;
  eventName: string;
  isOnline: boolean;
  teamCount: number;
  participantCount: number;
  internalCount: number;
  externalCount: number;
  approvedPercentage: number;
  revenue: number;
  avgTeamSize: string;
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

  // New state variables for the added components
  const [yearDistribution, setYearDistribution] = useState<YearDistribution>({
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    Other: 0,
  });
  const [eventComparisonData, setEventComparisonData] = useState<
    EventComparisonData[]
  >([]);
  const [configError, setConfigError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        setConfigError(
          "Supabase is not properly configured. Please check your environment variables."
        );
        setLoading(false);
        return;
      }

      // First, fetch registrations
      const { data: registrations, error: registrationsError } = await supabase
        .from("registrations")
        .select("*");

      if (registrationsError) {
        console.error("Error fetching registrations:", registrationsError);
        throw registrationsError;
      }

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

      // Then, fetch team members for each registration
      const { data: teamMembersData, error: teamMembersError } = await supabase
        .from("team_members")
        .select("*");

      if (teamMembersError) {
        console.error("Error fetching team members:", teamMembersError);
        throw teamMembersError;
      }

      // Use static events data directly instead of trying to fetch from Supabase
      const events = staticEvents.map((event) => ({
        id: event.id,
        title: event.title,
      }));

      // Ensure we have the required data
      const teamMembers = teamMembersData || [];

      // Combine registrations with their team members
      const registrationsWithTeamMembers = registrations.map((reg) => ({
        ...reg,
        team_members:
          teamMembers.filter((member) => member.registration_id === reg.id) ||
          [],
      }));

      // Ensure all registrations have the required fields
      registrationsWithTeamMembers.forEach((reg) => {
        if (!reg.selected_events) reg.selected_events = [];
        if (!reg.team_members) reg.team_members = [];
        if (!reg.total_amount) reg.total_amount = 0;
        if (!reg.team_size) reg.team_size = 0;
        if (!reg.created_at) reg.created_at = new Date().toISOString();
      });

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

      // Calculate total potential revenue (all registrations)
      const totalRevenue = registrationsWithTeamMembers.reduce(
        (sum, r) => sum + (r.total_amount || 0),
        0
      );

      // Calculate approved revenue using the utility function
      const approvedRevenue = registrationsWithTeamMembers
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + calculateRegistrationRevenue(r), 0);

      const avgTeamSize =
        total > 0
          ? registrationsWithTeamMembers.reduce(
              (sum, r) => sum + (r.team_size || 0),
              0
            ) / total
          : 0;

      // Calculate total participants and internal vs external
      const totalParticipants = registrationsWithTeamMembers.reduce(
        (sum, r) => sum + (r.team_members?.length || 0),
        0
      );

      const internalParticipants = registrationsWithTeamMembers.reduce(
        (sum, r) =>
          sum +
          (r.team_members?.filter((member: TeamMember) => {
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

      try {
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

        // Process new data for the added components
        setYearDistribution(
          calculateYearDistribution(registrationsWithTeamMembers)
        );
        setEventComparisonData(
          prepareEventComparisonData(registrationsWithTeamMembers, events)
        );
      } catch (processingError) {
        console.error("Error processing analytics data:", processingError);
        // Continue execution even if processing fails
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error type:", typeof error);
        console.error("Error stringified:", JSON.stringify(error));
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl"
        >
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Comprehensive analytics and insights for all event registrations
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStats()}
              disabled={loading}
              className="border-white/10 hover:border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10 transition-all"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Display configuration error if any */}
        {configError && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
            <p className="font-medium">Configuration Error</p>
            <p className="text-sm mt-1">{configError}</p>
          </div>
        )}

        {/* Stats Overview - Optimized for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
            title="Total Teams"
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

        {/* Charts Grid - First row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
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

        {/* Charts Grid - Second row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
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

        {/* Charts Grid - Third row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
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

        {/* Event Comparison View */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Event Comparison</h3>
            <p className="text-sm text-gray-400">
              Side-by-side comparison of event metrics
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Internal
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    External
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Approved %
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Avg Team Size
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-black/50">
                {eventComparisonData
                  .sort((a, b) => b.participantCount - a.participantCount)
                  .map((event) => (
                    <tr key={event.eventId}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="font-medium text-white">
                            {event.eventName}
                          </span>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              event.isOnline
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {event.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-white">
                        {event.teamCount}
                      </td>
                      <td className="px-4 py-3 text-center text-white">
                        {event.participantCount}
                      </td>
                      <td className="px-4 py-3 text-center text-emerald-400">
                        {event.internalCount} (
                        {Math.round(
                          (event.internalCount / event.participantCount) * 100
                        )}
                        %)
                      </td>
                      <td className="px-4 py-3 text-center text-purple-400">
                        {event.externalCount} (
                        {Math.round(
                          (event.externalCount / event.participantCount) * 100
                        )}
                        %)
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-white/10 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{ width: `${event.approvedPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white">
                            {event.approvedPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-green-400">
                        ₹{event.revenue}
                      </td>
                      <td className="px-4 py-3 text-center text-white">
                        {event.avgTeamSize}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Year of Study Distribution */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              Year of Study Distribution
            </h3>
            <p className="text-sm text-gray-400">
              Breakdown of participants by year
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Overall Year Distribution */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h4 className="text-md font-medium text-white mb-4">
                Overall Year Distribution
              </h4>

              <div className="space-y-4">
                {(() => {
                  const totalParticipants = Object.values(
                    yearDistribution
                  ).reduce((sum, count) => sum + count, 0);

                  // Calculate percentages and prepare data for visualization
                  const yearData = [
                    {
                      year: "1st Year",
                      count: yearDistribution["1"],
                      color: "bg-blue-400",
                    },
                    {
                      year: "2nd Year",
                      count: yearDistribution["2"],
                      color: "bg-purple-400",
                    },
                    {
                      year: "3rd Year",
                      count: yearDistribution["3"],
                      color: "bg-green-400",
                    },
                    {
                      year: "4th Year",
                      count: yearDistribution["4"],
                      color: "bg-amber-400",
                    },
                    {
                      year: "Other",
                      count: yearDistribution["Other"],
                      color: "bg-gray-400",
                    },
                  ];

                  return (
                    <>
                      {/* Bar chart visualization */}
                      <div className="h-8 w-full flex rounded-md overflow-hidden">
                        {yearData.map((item, index) => (
                          <div
                            key={index}
                            className={`${item.color} h-full`}
                            style={{
                              width: `${totalParticipants > 0 ? (item.count / totalParticipants) * 100 : 0}%`,
                              minWidth: item.count > 0 ? "8px" : "0",
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        {yearData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${item.color}`}
                            ></div>
                            <span className="text-sm text-gray-300">
                              {item.year}
                            </span>
                            <span className="text-sm font-medium text-white ml-auto">
                              {item.count}
                              <span className="text-xs text-gray-400 ml-1">
                                (
                                {totalParticipants > 0
                                  ? Math.round(
                                      (item.count / totalParticipants) * 100
                                    )
                                  : 0}
                                %)
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
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
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => ({
      date,
      count: registrations.filter((r) => {
        try {
          return r.created_at && r.created_at.split("T")[0] === date;
        } catch (e) {
          console.error("Error processing registration date:", e);
          return false;
        }
      }).length,
    }));
  } catch (error) {
    console.error("Error in processRegistrationTrend:", error);
    return [];
  }
}

function processEventDistribution(registrations: Registration[]) {
  try {
    const eventCounts: { [key: string]: number } = {};
    registrations.forEach((reg) => {
      if (!reg.selected_events) return;

      reg.selected_events.forEach((event) => {
        eventCounts[event] = (eventCounts[event] || 0) + 1;
      });
    });

    return Object.entries(eventCounts).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error("Error in processEventDistribution:", error);
    return [];
  }
}

function processRevenueByEvent(registrations: Registration[]): RevenueData[] {
  try {
    const eventRevenue: {
      [key: string]: { approved: number; potential: number };
    } = {};

    registrations.forEach((reg) => {
      if (!reg.selected_events || !reg.selected_events.length) return;

      // Calculate revenue per event using the utility function
      const approvedAmount =
        reg.status === "approved" ? calculateRegistrationRevenue(reg) : 0;
      const potentialAmount = reg.total_amount || 0;

      // Distribute evenly across selected events
      const approvedAmountPerEvent =
        approvedAmount / reg.selected_events.length;
      const potentialAmountPerEvent =
        potentialAmount / reg.selected_events.length;

      reg.selected_events.forEach((event) => {
        if (!eventRevenue[event]) {
          eventRevenue[event] = { approved: 0, potential: 0 };
        }
        if (reg.status === "approved") {
          eventRevenue[event].approved += approvedAmountPerEvent;
        }
        eventRevenue[event].potential += potentialAmountPerEvent;
      });
    });

    return Object.entries(eventRevenue).map(
      ([event, { approved, potential }]) => ({
        event,
        revenue: Math.round(approved),
        potentialRevenue: Math.round(potential),
      })
    );
  } catch (error) {
    console.error("Error in processRevenueByEvent:", error);
    return [];
  }
}

function processRevenueTrend(
  registrations: Registration[]
): RevenueTrendData[] {
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => {
      try {
        const dayRegistrations = registrations.filter(
          (r) => r.created_at && r.created_at.split("T")[0] === date
        );

        return {
          date,
          revenue: dayRegistrations
            .filter((r) => r.status === "approved")
            .reduce((sum, r) => sum + calculateRegistrationRevenue(r), 0),
          potentialRevenue: dayRegistrations.reduce(
            (sum, r) => sum + (r.total_amount || 0),
            0
          ),
        };
      } catch (e) {
        console.error(`Error processing revenue trend for date ${date}:`, e);
        return { date, revenue: 0, potentialRevenue: 0 };
      }
    });
  } catch (error) {
    console.error("Error in processRevenueTrend:", error);
    return [];
  }
}

function processEventParticipants(
  registrations: Registration[]
): EventParticipantData[] {
  try {
    const eventParticipants: {
      [key: string]: {
        total: number;
        internal: number;
        external: number;
      };
    } = {};

    registrations.forEach((reg) => {
      if (!reg.selected_events || !reg.team_members) return;

      reg.selected_events.forEach((event) => {
        if (!eventParticipants[event]) {
          eventParticipants[event] = { total: 0, internal: 0, external: 0 };
        }

        // Count total participants for this event
        const participantsInEvent = reg.team_members?.length || 0;
        eventParticipants[event].total += participantsInEvent;

        // Count internal participants (from Hindustan/HITS)
        const internalParticipantsInEvent =
          reg.team_members?.filter((member: TeamMember) => {
            try {
              const college = member.college?.toLowerCase() || "";
              return college.includes("hindustan") || college.includes("hits");
            } catch (e) {
              console.error("Error processing team member college:", e);
              return false;
            }
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
  } catch (error) {
    console.error("Error in processEventParticipants:", error);
    return [];
  }
}

// Add helper function to calculate year distribution
function calculateYearDistribution(
  registrations: Registration[]
): YearDistribution {
  try {
    const yearCounts: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      Other: 0,
    };

    // Use a Set to track unique participant IDs
    const processedParticipants = new Set<string>();

    registrations.forEach((reg) => {
      if (!reg.team_members) return;

      reg.team_members.forEach((member) => {
        try {
          // Skip if we've already counted this participant
          if (!member.id || processedParticipants.has(member.id)) return;
          processedParticipants.add(member.id);

          // Count by year
          if (member.year && ["1", "2", "3", "4"].includes(member.year)) {
            yearCounts[member.year]++;
          } else {
            yearCounts["Other"]++;
          }
        } catch (e) {
          console.error("Error processing team member year:", e);
        }
      });
    });

    return yearCounts;
  } catch (error) {
    console.error("Error in calculateYearDistribution:", error);
    return {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      Other: 0,
    };
  }
}

// Helper function to determine if a participant is internal (from HITS/Hindustan)
function isInternalParticipant(member: TeamMember): boolean {
  try {
    const college = member.college?.toLowerCase() || "";
    return college.includes("hindustan") || college.includes("hits");
  } catch (error) {
    console.error("Error in isInternalParticipant:", error);
    return false;
  }
}

// Helper function to calculate internal and external participants
function calculateInternalExternalParticipants(registrations: Registration[]): {
  internal: number;
  external: number;
} {
  try {
    // Use a Set to track unique participant IDs
    const internalParticipantIds = new Set<string>();
    const externalParticipantIds = new Set<string>();

    registrations.forEach((reg) => {
      if (!reg.team_members) return;

      reg.team_members.forEach((member) => {
        try {
          if (!member.id) return;

          if (isInternalParticipant(member)) {
            internalParticipantIds.add(member.id);
          } else {
            externalParticipantIds.add(member.id);
          }
        } catch (e) {
          console.error("Error processing participant:", e);
        }
      });
    });

    return {
      internal: internalParticipantIds.size,
      external: externalParticipantIds.size,
    };
  } catch (error) {
    console.error("Error in calculateInternalExternalParticipants:", error);
    return {
      internal: 0,
      external: 0,
    };
  }
}

// Helper function to determine if an event is online (gaming) or offline
function isOnlineGamingEvent(eventId: string): boolean {
  try {
    return eventId === "pixel-showdown";
  } catch (error) {
    console.error("Error in isOnlineGamingEvent:", error);
    return false;
  }
}

// Helper function to calculate total participants for an event
function calculateEventParticipants(registrations: Registration[]): number {
  try {
    return registrations.reduce((acc, reg) => {
      try {
        // Get unique participant IDs from this registration
        if (!reg.team_members) return acc;

        const participantIds = reg.team_members
          .filter((member) => member.id)
          .map((member) => member.id);

        // Add only unique IDs that we haven't seen before
        participantIds.forEach((id) => {
          if (id && !acc.has(id)) {
            acc.add(id);
          }
        });

        return acc;
      } catch (e) {
        console.error("Error calculating event participants:", e);
        return acc;
      }
    }, new Set<string>()).size;
  } catch (error) {
    console.error("Error in calculateEventParticipants:", error);
    return 0;
  }
}

// Helper function to prepare event comparison data
function prepareEventComparisonData(
  registrations: Registration[],
  events: { id: string; title: string }[]
): EventComparisonData[] {
  // Group registrations by event
  const groupedRegistrations: Record<string, Registration[]> = {};

  registrations.forEach((reg) => {
    if (!reg.selected_events) return;

    reg.selected_events.forEach((eventId) => {
      if (!groupedRegistrations[eventId]) {
        groupedRegistrations[eventId] = [];
      }
      groupedRegistrations[eventId].push(reg);
    });
  });

  // Prepare comparison data for each event
  return Object.entries(groupedRegistrations).map(([eventId, eventRegs]) => {
    const participantCount = calculateEventParticipants(eventRegs);
    const { internal, external } =
      calculateInternalExternalParticipants(eventRegs);
    const approvedCount = eventRegs.filter(
      (reg) => reg.status === "approved"
    ).length;
    const approvedPercentage =
      eventRegs.length > 0
        ? Math.round((approvedCount / eventRegs.length) * 100)
        : 0;

    // Calculate revenue using the utility function
    const revenue = eventRegs
      .filter((reg) => reg.status === "approved")
      .reduce((sum, reg) => {
        // Calculate per-event revenue (divide by number of events)
        return (
          sum + calculateRegistrationRevenue(reg) / reg.selected_events.length
        );
      }, 0);

    const avgTeamSize =
      eventRegs.length > 0
        ? (
            eventRegs.reduce((sum, reg) => sum + reg.team_size, 0) /
            eventRegs.length
          ).toFixed(1)
        : "0";

    return {
      eventId,
      eventName: events.find((e) => e.id === eventId)?.title || eventId,
      isOnline: isOnlineGamingEvent(eventId),
      teamCount: eventRegs.length,
      participantCount,
      internalCount: internal,
      externalCount: external,
      approvedPercentage,
      revenue: Math.round(revenue),
      avgTeamSize,
    };
  });
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import {
  Download,
  Building2,
  Mail,
  Phone,
  Search,
  Gamepad2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Registration } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/excel";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatYear = (year: string | undefined) => {
  if (!year) return "";

  const yearMap: { [key: string]: string } = {
    "1": "1st",
    "2": "2nd",
    "3": "3rd",
    "4": "4th",
  };

  return yearMap[year] || year;
};

export default function GamingOverview() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add game statistics state
  const [gameStats, setGameStats] = useState({
    bgmi: { count: 0, revenue: 0 },
    pes: { count: 0, revenue: 0 },
    freefire_squad: { count: 0, revenue: 0 },
    total: { count: 0, revenue: 0 },
  });

  const fetchGamingRegistrations = useCallback(async (showToast = false) => {
    try {
      if (showToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data: registrationsData, error: registrationsError } =
        await supabase
          .from("registrations")
          .select(
            `
          *,
          team_members!team_members_registration_id_fkey (
            id,
            name,
            email,
            phone,
            college,
            department,
            year,
            player_id
          )
        `
          )
          .contains("selected_events", ["pixel-showdown"]);

      if (registrationsError) {
        console.error("Error fetching registrations:", registrationsError);
        return;
      }

      // Calculate game statistics from valid registrations
      const stats = {
        bgmi: { count: 0, revenue: 0 },
        pes: { count: 0, revenue: 0 },
        freefire_squad: { count: 0, revenue: 0 },
        total: { count: 0, revenue: 0 },
      };

      registrationsData.forEach((registration) => {
        if (registration.game_details?.game === "bgmi") {
          stats.bgmi.count += 1;
          if (registration.status === "approved") {
            stats.bgmi.revenue += 200; // ₹200 per team
            stats.total.revenue += 200;
          }
          stats.total.count += 1;
        } else if (registration.game_details?.game === "freefire") {
          stats.freefire_squad.count += 1;
          if (registration.status === "approved") {
            stats.freefire_squad.revenue += 200; // ₹200 per team
            stats.total.revenue += 200;
          }
          stats.total.count += 1;
        } else if (registration.game_details?.game === "pes") {
          stats.pes.count += 1;
          if (registration.status === "approved") {
            stats.pes.revenue += 100; // ₹100 per person
            stats.total.revenue += 100;
          }
          stats.total.count += 1;
        }
      });

      setGameStats(stats);
      setRegistrations(registrationsData || []);

      if (showToast) {
        toast({
          title: "Gaming registrations refreshed",
          description: "Latest data has been loaded",
        });
      }
    } catch (error) {
      console.error("Error in fetchGamingRegistrations:", error);
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh gaming registration data",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Add game options constant
  const gameOptions = [
    { value: "all", label: "All Games" },
    { value: "bgmi", label: "BGMI" },
    { value: "pes", label: "PES" },
    { value: "freefire", label: "Free Fire" },
  ];

  // Add status options constant
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  // Add useEffect to fetch data on component mount
  useEffect(() => {
    fetchGamingRegistrations();
  }, [fetchGamingRegistrations]);

  const filteredRegistrations = registrations.filter((reg) => {
    if (!reg) return false;

    const matchesSearch =
      searchQuery === "" ||
      (reg.team_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (reg.team_members || []).some((member) =>
        (member?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );

    const matchesGame =
      selectedGame === "all" || reg.game_details?.game === selectedGame;

    const matchesStatus =
      selectedStatus === "all" || reg.status === selectedStatus;

    return matchesSearch && matchesGame && matchesStatus;
  });

  const handleExport = (type: string) => {
    // Filter registrations with game details
    let gameRegistrations = filteredRegistrations.filter(
      (reg) => reg.game_details
    );

    let filename = "gaming-registrations";

    switch (type) {
      case "all":
        gameRegistrations = registrations.filter((reg) => reg.game_details);
        filename = "all-gaming-registrations";
        break;
      case "filtered":
        // Already filtered above
        filename = "filtered-gaming-registrations";
        break;
      case "approved":
        gameRegistrations = gameRegistrations.filter(
          (reg) => reg.status === "approved"
        );
        filename = "approved-gaming-registrations";
        break;
      case "pending":
        gameRegistrations = gameRegistrations.filter(
          (reg) => reg.status === "pending"
        );
        filename = "pending-gaming-registrations";
        break;
      default:
        break;
    }

    // Format the data for Excel
    const formattedData = gameRegistrations.map((registration) => {
      const teamLead = registration.team_members[0] || {};
      const otherMembers = registration.team_members.slice(1) || [];

      // Create a properly typed object that matches ExcelData
      const data: Record<string, string | number | null | undefined> = {
        "Team ID": registration.team_id || "N/A",
        "Registration ID": registration.id || "N/A",
        "Game Type": registration.game_details?.game?.toUpperCase() || "N/A",
        "Game Format":
          registration.game_details?.format?.toUpperCase() || "N/A",
        "Player ID": teamLead.player_id || "N/A",
        "Team Lead": teamLead.name || "N/A",
        Email: teamLead.email || "N/A",
        Phone: teamLead.phone || "N/A",
        College: teamLead.college || "N/A",
        Department: teamLead.department || "N/A",
        Year: teamLead.year || "N/A",
        "Team Size": registration.team_size || 1,
        Amount: registration.total_amount || 0,
        Status: (registration.status || "N/A").toUpperCase(),
        "Registration Date": new Date(
          registration.created_at || Date.now()
        ).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Team Members":
          otherMembers.map((m) => m.name || "N/A").join(", ") || "N/A",
        "Team Members Emails":
          otherMembers.map((m) => m.email || "N/A").join(", ") || "N/A",
        "Team Members Phones":
          otherMembers.map((m) => m.phone || "N/A").join(", ") || "N/A",
      };

      return data;
    });

    exportToExcel(formattedData, filename);

    toast({
      title: "Export started",
      description:
        "Your gaming registrations data is being prepared for download",
    });
  };

  return (
    <AdminLayout>
      <div className="p-2 sm:p-6 space-y-6">
        {/* Header with Title and Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-xl"
        >
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Gaming Overview
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage and track all gaming registrations for Pixel Showdown
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchGamingRegistrations(true)}
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
                  Export All Gaming Registrations
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("filtered")}
                >
                  Export Filtered Gaming Registrations
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("approved")}
                >
                  Export Approved Gaming Registrations
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:text-white hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer"
                  onClick={() => handleExport("pending")}
                >
                  Export Pending Gaming Registrations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Main Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/30 transition-all shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-lg bg-blue-500/20">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm text-gray-400 font-medium">
                  Total Registrations
                </h4>
                <div className="flex items-end justify-between mt-1.5">
                  <p className="text-xl sm:text-3xl font-bold text-white">
                    {gameStats.total.count}
                  </p>
                  <span className="text-sm text-blue-400 font-medium">
                    ₹{gameStats.total.revenue}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-violet-500/10 border border-purple-500/20 hover:border-purple-500/30 transition-all shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-lg bg-purple-500/20">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm text-gray-400 font-medium">
                  BGMI Teams
                </h4>
                <div className="flex items-end justify-between mt-1.5">
                  <p className="text-xl sm:text-3xl font-bold text-white">
                    {gameStats.bgmi.count}
                  </p>
                  <span className="text-sm text-purple-400 font-medium">
                    ₹{gameStats.bgmi.revenue}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-emerald-500/10 border border-green-500/20 hover:border-green-500/30 transition-all shadow-lg shadow-green-500/5 hover:shadow-green-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-lg bg-green-500/20">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm text-gray-400 font-medium">
                  PES Players
                </h4>
                <div className="flex items-end justify-between mt-1.5">
                  <p className="text-xl sm:text-3xl font-bold text-white">
                    {gameStats.pes.count}
                  </p>
                  <span className="text-sm text-green-400 font-medium">
                    ₹{gameStats.pes.revenue}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-amber-500/10 border border-orange-500/20 hover:border-orange-500/30 transition-all shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-lg bg-orange-500/20">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm text-gray-400 font-medium">
                  Free Fire Squad
                </h4>
                <div className="flex items-end justify-between mt-1.5">
                  <p className="text-xl sm:text-3xl font-bold text-white">
                    {gameStats.freefire_squad.count}
                  </p>
                  <span className="text-sm text-orange-400 font-medium">
                    ₹{gameStats.freefire_squad.revenue}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 sm:space-y-0 sm:flex sm:flex-row gap-4 mb-4 sm:mb-6 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Search teams or players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border-white/10 hover:border-white/20 focus:border-purple-500/50 text-white pl-9 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 hover:border-white/20 text-white transition-all">
                <SelectValue placeholder="Select Game" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-md border border-white/10">
                {gameOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 hover:border-white/20 text-white transition-all">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-md border border-white/10">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10"></div>
                    <div>
                      <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
                      <div className="h-4 w-24 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                    <div className="h-6 w-24 bg-white/10 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="p-3 rounded-lg bg-white/5">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="h-5 w-32 bg-white/10 rounded"></div>
                          <div className="h-5 w-16 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredRegistrations.map(
              (registration) =>
                registration && (
                  <motion.div
                    key={registration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 sm:p-5 rounded-xl bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border ${
                      registration.status === "approved"
                        ? "border-green-500/20 hover:border-green-500/30"
                        : registration.status === "rejected"
                          ? "border-red-500/20 hover:border-red-500/30"
                          : "border-yellow-500/20 hover:border-yellow-500/30"
                    } transition-all shadow-lg shadow-black/40`}
                  >
                    {/* Header with Team ID and Status */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-5 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 sm:p-3 rounded-lg ${
                            registration.game_details?.game === "bgmi"
                              ? "bg-purple-500/20"
                              : registration.game_details?.game === "pes"
                                ? "bg-green-500/20"
                                : "bg-orange-500/20"
                          }`}
                        >
                          <Gamepad2
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              registration.game_details?.game === "bgmi"
                                ? "text-purple-400"
                                : registration.game_details?.game === "pes"
                                  ? "text-green-400"
                                  : "text-orange-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-xl font-medium text-white flex flex-wrap items-center gap-2">
                            <span className="truncate max-w-[200px]">
                              Team #{registration.team_id}
                            </span>
                            {registration.status === "approved" && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs sm:text-sm text-gray-300">
                              {registration.game_details?.game?.toUpperCase() ||
                                "No Game Selected"}
                              {registration.game_details?.game === "freefire" &&
                                ` (${registration.game_details.format?.toUpperCase() || ""})`}
                            </p>
                            <span className="text-xs text-gray-500">
                              • {registration.team_members?.length || 0} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            registration.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : registration.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {registration.status?.toUpperCase() || "PENDING"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="hidden sm:inline">Registered:</span>
                          {new Date(
                            registration.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Team Members Section Title */}
                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                      Team Members
                    </h4>

                    {/* Team Members */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {(registration.team_members || []).map(
                        (member, index) =>
                          member && (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-3 sm:p-4 rounded-lg ${
                                registration.game_details?.game === "bgmi"
                                  ? "bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 hover:border-purple-500/20"
                                  : registration.game_details?.game === "pes"
                                    ? "bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 hover:border-green-500/20"
                                    : "bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 hover:border-orange-500/20"
                              } transition-all h-full overflow-hidden shadow-sm hover:shadow-md`}
                            >
                              <div className="flex flex-col h-full">
                                <div>
                                  {/* Name and Player ID */}
                                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5 mb-2.5">
                                    <h4 className="text-sm sm:text-base text-white font-medium truncate max-w-[65%]">
                                      {member.name || "No Name"}
                                    </h4>
                                    {member.player_id && (
                                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                                        ID: {member.player_id}
                                      </span>
                                    )}
                                  </div>

                                  {/* College Details */}
                                  <div className="text-xs sm:text-sm text-gray-300 space-y-1.5 mb-3">
                                    <div className="flex items-center gap-2 w-full">
                                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-400" />
                                      <span className="truncate max-w-full inline-block">
                                        {member.college || "No College"}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 pl-6">
                                      <span className="truncate max-w-[70%] inline-block">
                                        {member.department || "No Department"}
                                      </span>
                                      {member.year && (
                                        <span className="whitespace-nowrap flex-shrink-0 text-gray-400">
                                          • {formatYear(member.year)} Year
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm text-gray-300 mt-auto pt-2 border-t border-white/5">
                                  <div className="flex items-center gap-2 w-full">
                                    <Mail className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                    <span className="truncate max-w-full inline-block">
                                      {member.email || "No Email"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                    <span className="truncate max-w-full inline-block">
                                      {member.phone || "No Phone"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                      )}
                    </div>
                  </motion.div>
                )
            )}

            {/* Empty State */}
            {filteredRegistrations.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 rounded-xl"
              >
                <Filter className="w-16 h-16 text-gray-600 mx-auto mb-5" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No registrations found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery ||
                  selectedGame !== "all" ||
                  selectedStatus !== "all"
                    ? "Try adjusting your filters or search query to find what you're looking for."
                    : "Gaming registrations will appear here once teams sign up for Pixel Showdown."}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

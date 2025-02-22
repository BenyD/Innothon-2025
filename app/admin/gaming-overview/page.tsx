"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Users, Download, Building2, Mail, Phone } from "lucide-react";
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

  // Add game statistics state
  const [gameStats, setGameStats] = useState({
    valorant: 0,
    bgmi: 0,
    pes: 0,
    freefire_squad: 0,
    freefire_duo: 0,
  });

  const fetchGamingRegistrations = useCallback(async () => {
    try {
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
        valorant:
          registrationsData?.filter((r) => r.game_details?.game === "valorant")
            .length || 0,
        bgmi:
          registrationsData?.filter((r) => r.game_details?.game === "bgmi")
            .length || 0,
        pes:
          registrationsData?.filter((r) => r.game_details?.game === "pes")
            .length || 0,
        freefire_squad:
          registrationsData?.filter(
            (r) =>
              r.game_details?.game === "freefire" &&
              r.game_details?.format === "squad"
          ).length || 0,
        freefire_duo:
          registrationsData?.filter(
            (r) =>
              r.game_details?.game === "freefire" &&
              r.game_details?.format === "duo"
          ).length || 0,
      };

      setGameStats(stats);
      setRegistrations(registrationsData || []);
    } catch (error) {
      console.error("Error in fetchGamingRegistrations:", error);
    }
  }, []);

  // Add game options constant
  const gameOptions = [
    { value: "all", label: "All Games" },
    { value: "valorant", label: "VALORANT" },
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

  return (
    <AdminLayout>
      <div className="p-2 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-0">
            Gaming Registrations
          </h1>
          <Button
            onClick={() => {
              // Add export functionality
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-white/10">
            <h4 className="text-xs sm:text-sm text-gray-400">VALORANT Teams</h4>
            <div className="flex items-end justify-between mt-1.5 sm:mt-2">
              <p className="text-lg sm:text-2xl font-bold text-white">
                {gameStats.valorant}
              </p>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹{gameStats.valorant * 250}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-white/10">
            <h4 className="text-xs sm:text-sm text-gray-400">BGMI Teams</h4>
            <div className="flex items-end justify-between mt-1.5 sm:mt-2">
              <p className="text-lg sm:text-2xl font-bold text-white">
                {gameStats.bgmi}
              </p>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹{gameStats.bgmi * 200}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10">
            <h4 className="text-xs sm:text-sm text-gray-400">PES Players</h4>
            <div className="flex items-end justify-between mt-1.5 sm:mt-2">
              <p className="text-lg sm:text-2xl font-bold text-white">
                {gameStats.pes}
              </p>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹{gameStats.pes * 100}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-white/10">
            <h4 className="text-xs sm:text-sm text-gray-400">
              Free Fire Squad
            </h4>
            <div className="flex items-end justify-between mt-1.5 sm:mt-2">
              <p className="text-lg sm:text-2xl font-bold text-white">
                {gameStats.freefire_squad}
              </p>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹{gameStats.freefire_squad * 200}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10">
            <h4 className="text-xs sm:text-sm text-gray-400">Free Fire Duo</h4>
            <div className="flex items-end justify-between mt-1.5 sm:mt-2">
              <p className="text-lg sm:text-2xl font-bold text-white">
                {gameStats.freefire_duo}
              </p>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ₹{gameStats.freefire_duo * 100}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-row gap-4 mb-4 sm:mb-6">
          <Input
            placeholder="Search teams or players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white"
          />
          <div className="flex gap-2 sm:gap-4">
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select Game" />
              </SelectTrigger>
              <SelectContent>
                {gameOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-2 sm:space-y-4">
          {filteredRegistrations.map(
            (registration) =>
              registration && (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                        Team #{registration.team_id}
                        {registration.status === "approved" && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-gray-400">
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
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        registration.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : registration.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {registration.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-2 sm:space-y-3">
                    {(registration.team_members || []).map(
                      (member) =>
                        member && (
                          <div
                            key={member.id}
                            className="p-2 sm:p-3 rounded-lg bg-white/5"
                          >
                            <div className="space-y-2">
                              {/* Name and Player ID */}
                              <div className="flex items-center justify-between">
                                <p className="text-sm sm:text-base text-white font-medium">
                                  {member.name || "No Name"}
                                </p>
                                {member.player_id && (
                                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                    ID: {member.player_id}
                                  </span>
                                )}
                              </div>

                              {/* College Details */}
                              <div className="text-xs sm:text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>{member.college || "No College"}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <span>
                                    {member.department || "No Department"}
                                  </span>
                                  {member.year && (
                                    <span>
                                      • {formatYear(member.year)} Year
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Contact Info */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{member.email || "No Email"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{member.phone || "No Phone"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
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
              className="text-center py-12"
            >
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">
                No registrations found
              </h3>
              <p className="text-gray-500 mt-1">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Registrations will appear here"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

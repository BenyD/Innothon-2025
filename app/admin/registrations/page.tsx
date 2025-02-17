"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Calendar, Users, User2, IndianRupee, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Registration } from "@/types/registration";

// Add animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const router = useRouter();

  const fetchRegistrations = useCallback(async () => {
    try {
      console.log("Fetching all registrations");
      const { data, error } = await supabase
        .from("registrations")
        .select(
          `
          *,
          team_members!team_members_registration_id_fkey (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched registrations:", data);
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Error in fetchRegistrations:", error);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    const channel = supabase
      .channel("registration_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        async () => {
          const { data, error } = await supabase
            .from("registrations")
            .select(
              `
              *,
              team_members (*)
            `
            )
            .order("created_at", { ascending: false });

          if (!error && data) {
            setRegistrations(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const filtered = registrations.filter((reg) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        reg.team_members[0]?.name?.toLowerCase().includes(searchLower) ||
        reg.team_members[0]?.email?.toLowerCase().includes(searchLower) ||
        reg.team_members[0]?.phone?.includes(searchQuery) ||
        reg.team_members[0]?.college?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredRegistrations(filtered);
  }, [searchQuery, registrations]);


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Team Registrations</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            variants={itemAnimation}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <h3 className="text-gray-400 text-sm">Total Teams</h3>
            <p className="text-2xl font-bold text-white mt-1">{registrations.length}</p>
          </motion.div>
          <motion.div
            variants={itemAnimation}
            className="bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-white mt-1">
              ₹{registrations.reduce((acc, reg) => acc + reg.total_amount, 0)}
            </p>
          </motion.div>
          <motion.div
            variants={itemAnimation}
            className="bg-white/5 border border-white/10 rounded-lg p-4 sm:col-span-2 lg:col-span-1"
          >
            <h3 className="text-gray-400 text-sm">Pending Approvals</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {registrations.filter(reg => reg.status === "pending").length}
            </p>
          </motion.div>
        </div>

        {/* Registration Cards */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
          {filteredRegistrations.map((registration) => (
            <motion.div
              key={registration.id}
              variants={itemAnimation}
              onClick={() => router.push(`/admin/registrations/${registration.id}`)}
              className="group relative p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 
                hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-white">
                      {registration.team_members[0]?.name}
                      {registration.team_size > 1 && 
                        <span className="text-gray-400 text-sm ml-1">
                          +{registration.team_size - 1} members
                        </span>
                      }
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.status === "approved"
                        ? "bg-green-500/10 text-green-400"
                        : registration.status === "rejected"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{registration.team_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{registration.selected_events.length} Events</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User2 className="w-4 h-4" />
                  <span className="capitalize">
                    {registration.team_members[0]?.gender || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{registration.team_size} Members</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <IndianRupee className="w-4 h-4" />
                  <span>₹{registration.total_amount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredRegistrations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">No registrations found</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery ? "Try adjusting your search" : "Registrations will appear here"}
            </p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

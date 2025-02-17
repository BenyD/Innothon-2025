"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";
import Link from "next/link";
import type { Registration } from "@/types/registration";
import type { Contact } from "@/types/contact";

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

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [recentMessages, setRecentMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [registrationsData, messagesData] = await Promise.all([
        supabase
          .from("registrations")
          .select(`*, team_members (*)`)
          .order('created_at', { ascending: false }),
        supabase
          .from("contact_messages")
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (registrationsData.error) throw registrationsData.error;
      if (messagesData.error) throw messagesData.error;

      setRegistrations(registrationsData.data || []);
      setRecentMessages(messagesData.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate statistics
  const totalRevenue = registrations.reduce((acc, reg) => acc + reg.total_amount, 0);
  const pendingRegistrations = registrations.filter(reg => reg.status === "pending").length;
  const totalParticipants = registrations.reduce((acc, reg) => acc + reg.team_size, 0);
  const unreadMessages = recentMessages.filter(msg => !msg.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with Innothon.
          </p>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue}`}
            icon={IndianRupee}
            color="text-green-400"
            loading={loading}
          />
          <StatCard
            title="Total Participants"
            value={totalParticipants}
            icon={Users}
            color="text-blue-400"
            loading={loading}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingRegistrations}
            icon={Clock}
            color="text-yellow-400"
            loading={loading}
          />
          <StatCard
            title="Unread Messages"
            value={unreadMessages}
            icon={Mail}
            color="text-purple-400"
            loading={loading}
          />
        </motion.div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registrations */}
          <motion.div
            variants={item}
            className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Registrations</h2>
              <Link
                href="/admin/registrations"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {registrations.slice(0, 5).map((registration) => (
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
                          {registration.team_size > 1 && 
                            <span className="text-gray-400 text-sm ml-1">
                              +{registration.team_size - 1} others
                            </span>
                          }
                        </p>
                        <p className="text-sm text-gray-400">
                          {registration.team_members[0]?.college}
                        </p>
                      </div>
                    </div>
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
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            variants={item}
            className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
              <Link
                href="/admin/messages"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/messages/${message.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{message.name}</p>
                        <p className="text-sm text-gray-400">{message.message.slice(0, 50)}...</p>
                      </div>
                    </div>
                    {!message.read && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                        New
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

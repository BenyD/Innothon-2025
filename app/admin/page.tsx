"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Users, MessageSquare, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalMessages: number;
  recentMessages: number;
  averageResponseTime: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    recentMessages: 0,
    averageResponseTime: "Calculating...",
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch total messages
      const { count: totalMessages, error: countError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });

      if (countError) throw countError;

      // Fetch messages from last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentData, error: recentError } = await supabase
        .from('contact_messages')
        .select('*')
        .gte('created_at', twentyFourHoursAgo);

      if (recentError) throw recentError;

      // Calculate average response time (mock data for now)
      // In a real app, you'd calculate this based on when messages were responded to
      const avgResponseTime = "2.5 hours";

      setStats({
        totalMessages: totalMessages || 0,
        recentMessages: recentData?.length || 0,
        averageResponseTime: avgResponseTime,
      });

      // Fetch recent activity
      const { data: activity, error: activityError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityError) throw activityError;
      setRecentActivity(activity || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div variants={item}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{title}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? "Loading..." : value}
              </p>
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
      <div className="space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Dashboard Overview
          </h2>
          <p className="text-sm lg:text-base text-gray-400 mt-1">
            Welcome back! Here's what's happening with Innothon 2025.
          </p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <motion.div variants={item}>
            <StatCard
              title="Total Messages"
              value={stats.totalMessages}
              icon={MessageSquare}
              color="text-blue-400"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              title="Messages (24h)"
              value={stats.recentMessages}
              icon={Clock}
              color="text-purple-400"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatCard
              title="Avg. Response Time"
              value={stats.averageResponseTime}
              icon={Users}
              color="text-pink-400"
            />
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-semibold text-white">Recent Activity</h3>
              <Link 
                href="/admin/messages"
                className="text-xs lg:text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </Link>
            </div>
            <div className="space-y-3 lg:space-y-4">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={item}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm lg:text-base text-white font-medium">{activity.name}</p>
                      <p className="text-xs lg:text-sm text-gray-400">{activity.email}</p>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
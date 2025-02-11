"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Globe, Users, Clock, MousePointer, X, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  pageViews: {
    total: number;
    trend: Array<{ date: string; views: number }>;
  };
  visitors: {
    total: number;
    trend: Array<{ date: string; visitors: number }>;
  };
  bounceRate: number;
  avgTimeOnSite: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface AnalyticsSectionProps {
  data: AnalyticsData | null;
  loading: boolean;
  error?: string | null;
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

export function AnalyticsSection({ 
  data, 
  loading, 
  error 
}: AnalyticsSectionProps) {
  if (error) {
    return (
      <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-red-500" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <AnalyticsSkeletonLoader />;
  }

  if (!data) {
    return null;
  }

  return (
    <motion.div
      variants={item}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-white">Analytics Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={data.pageViews.total.toLocaleString()}
          icon={MousePointer}
          color="text-blue-400"
        />
        <StatCard
          title="Unique Visitors"
          value={data.visitors.total.toLocaleString()}
          icon={Users}
          color="text-purple-400"
        />
        <StatCard
          title="Avg. Time on Site"
          value={data.avgTimeOnSite}
          icon={Clock}
          color="text-pink-400"
        />
        <StatCard
          title="Bounce Rate"
          value={`${data.bounceRate}%`}
          icon={TrendingDown}
          color="text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Trend Chart */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Traffic Trend</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.pageViews.trend}>
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Visitor Engagement */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
          <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Visitor Engagement</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.visitors.trend}>
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    name="Visitors"
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
            <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-50" />
      <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
} 
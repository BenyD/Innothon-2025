"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { AnalyticsData } from "@/types/analytics";
import { AnalyticsGraphs } from "@/components/admin/AnalyticsGraphs";

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchAnalyticsData() {
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics data");
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-xl lg:text-2xl font-bold text-white">
          Analytics Overview
        </h1>

        <AnalyticsSection
          data={analyticsData}
          loading={loading}
          error={error}
        />

        <AnalyticsGraphs />
      </div>
    </AdminLayout>
  );
}

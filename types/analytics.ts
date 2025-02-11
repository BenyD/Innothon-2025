export interface AnalyticsData {
  pageViews: {
    total: number;
    trend: Array<{
      date: string;
      views: number;
    }>;
  };
  visitors: {
    total: number;
    trend: Array<{
      date: string;
      visitors: number;
    }>;
  };
  bounceRate: number;
  avgTimeOnSite: string;
} 
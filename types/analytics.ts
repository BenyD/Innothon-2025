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
  countries: Array<{
    country: string;
    visitors: number;
  }>;
  avgTimeOnSite: string;
} 
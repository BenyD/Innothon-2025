import { NextResponse } from 'next/server';

// Add this type at the top of the file
type PageViewData = {
  date: string;
  value: number;
};

export async function GET() {
  try {
    const projectId = process.env.VERCEL_PROJECT_ID;
    const token = process.env.VERCEL_ACCESS_TOKEN;

    if (!projectId || !token) {
      throw new Error('Missing required environment variables');
    }

    // Get analytics data from Vercel API
    const response = await fetch(
      `https://api.vercel.com/v1/analytics/stats?projectId=${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the data into our expected format
    return NextResponse.json({
      pageViews: data.pageViews || 0,
      uniqueVisitors: data.uniques || 0,
      averageTime: formatTime(data.averageDuration || 0),
      trend: data.pageViews?.map((item: PageViewData) => ({
        date: item.date,
        value: item.value
      })) || []
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 
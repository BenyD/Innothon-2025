import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function GET() {
  try {
    await limiter.check(10, 'ANALYTICS_API');

    const [pageViewsRes, visitorsRes] = await Promise.all([
      fetch(`https://api.vercel.com/v1/projects/${PROJECT_ID}/analytics/views`, {
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        },
      }),
      fetch(`https://api.vercel.com/v1/projects/${PROJECT_ID}/analytics/visitors`, {
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        },
      }),
    ]);

    const [pageViews, visitors] = await Promise.all([
      pageViewsRes.json(),
      visitorsRes.json(),
    ]);

    // Calculate bounce rate (example calculation)
    const bounceRate = 35; // You'll need to calculate this from your data

    return NextResponse.json({
      pageViews: {
        total: pageViews.total || 0,
        trend: pageViews.data || [],
      },
      visitors: {
        total: visitors.total || 0,
        trend: visitors.data || [],
      },
      bounceRate,
      avgTimeOnSite: "2m 45s",
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429 }
    );
  }
} 
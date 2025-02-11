import "./globals.css";
import { GeistSans } from "geist/font";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Use Geist as the primary font
const geist = GeistSans;

export const metadata = {
  title: "Innothon 2025 - Hindustan Institute of Technology and Science",
  description: "Join us for Innothon 2025, a 24-hour hackathon at Hindustan Institute of Technology and Science.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-black text-white selection:bg-purple-500/30 selection:text-white touch-manipulation antialiased min-h-screen">
        <MainLayout>{children}</MainLayout>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

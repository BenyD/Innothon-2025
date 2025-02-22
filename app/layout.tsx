import "./globals.css";
import { GeistSans } from "geist/font";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";

// Use Geist as the primary font
const geist = GeistSans;

export const metadata: Metadata = {
  title: "Innothon 2025 - Hindustan Institute of Technology and Science",
  description:
    "Join us for Innothon 2025, a technical fest at Hindustan Institute of Technology and Science.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

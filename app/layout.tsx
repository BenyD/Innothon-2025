import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type React from "react";
import { cn } from "../lib/utils";

// Initialize Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const geist = GeistSans;

export const metadata = {
  title: "Innothon 2025 - Hindustan Institute of Technology and Science",
  description:
    "Join us at Innothon 2025 - A premier technical and cultural fest at Hindustan Institute of Technology and Science. Experience an exciting blend of technology, innovation, and cultural events as brilliant minds come together to showcase their talents and creativity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("scroll-smooth", inter.variable)}>
      <body className={cn(
        inter.className,
        "bg-black text-white selection:bg-purple-500/30 selection:text-white touch-manipulation antialiased min-h-screen"
      )}>
        <div className="relative">
          {/* Animated background elements - Optimized for mobile */}
          <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#4B0082] w-48 sm:w-72 h-48 sm:h-72 blur-[8rem] sm:blur-[10rem] rounded-full opacity-50 sm:opacity-100"></div>
            <div className="absolute bottom-0 left-0 bg-[#2563eb] w-48 sm:w-72 h-48 sm:h-72 blur-[8rem] sm:blur-[10rem] rounded-full opacity-50 sm:opacity-100"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4B0082] w-64 sm:w-96 h-64 sm:h-96 blur-[8rem] sm:blur-[10rem] rounded-full opacity-20 sm:opacity-30"></div>
          </div>

          {/* Grid pattern overlay - Optimized for mobile */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px] sm:bg-[length:50px_50px] z-0"></div>

          {/* Main content - Improved mobile spacing */}
          <div className="relative z-1">
            <Navbar />
            <main className="space-y-8 sm:space-y-12"> {/* Reduced spacing for mobile */}
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

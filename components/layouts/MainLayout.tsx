"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <div className="relative">
      {/* Animated background elements - Only show on non-admin pages */}
      {!isAdminRoute && (
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#4B0082] w-48 sm:w-72 h-48 sm:h-72 blur-[8rem] sm:blur-[10rem] rounded-full opacity-50 sm:opacity-100"></div>
          <div className="absolute bottom-0 left-0 bg-[#2563eb] w-48 sm:w-72 h-48 sm:h-72 blur-[8rem] sm:blur-[10rem] rounded-full opacity-50 sm:opacity-100"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4B0082] w-64 sm:w-96 h-64 sm:h-96 blur-[8rem] sm:blur-[10rem] rounded-full opacity-20 sm:opacity-30"></div>
        </div>
      )}

      {/* Grid pattern overlay - Only show on non-admin pages */}
      {!isAdminRoute && (
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px] sm:bg-[length:50px_50px] z-0"></div>
      )}

      {/* Main content */}
      <div className="relative z-1">
        {/* Only show Navbar on non-admin pages */}
        {!isAdminRoute && <Navbar />}
        
        <main className={cn(
          "space-y-8 sm:space-y-12",
          // Remove top padding on admin pages since admin has its own padding
          isAdminRoute && "!space-y-0"
        )}>
          {children}
        </main>
        
        {/* Only show Footer on non-admin pages */}
        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
} 
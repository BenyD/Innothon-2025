import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Innothon 2025 - Hindustan Institute of Technology and Science",
  description:
    "Join us for an exciting innovation hackathon hosted by the Department of CSE at Hindustan Institute of Technology and Science.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#030014] text-white overflow-x-hidden`}
      >
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <div className="absolute top-0 right-0 bg-[#4B0082] w-72 h-72 blur-[10rem] rounded-full"></div>
            <div className="absolute bottom-0 left-0 bg-[#2563eb] w-72 h-72 blur-[10rem] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4B0082] w-96 h-96 blur-[10rem] rounded-full opacity-30"></div>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] z-0"></div>

          {/* Main content - Adjusted spacing */}
          <div className="relative z-1">
            <Navbar />
            <main className="space-y-12">
              {" "}
              {/* Reduced from space-y-16 */}
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

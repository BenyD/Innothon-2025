import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// Initialize Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
      <body
        className={cn(
          inter.className,
          "bg-black text-white selection:bg-purple-500/30 selection:text-white touch-manipulation antialiased min-h-screen"
        )}
      >
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}

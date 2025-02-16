"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  LogOut,
  MessageSquare,
  User,
  LayoutDashboard,
  Home,
  Menu,
  X,
  Users,
  Calendar,
} from "lucide-react";
import Image from "next/image";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email: string | undefined;
    role?: string;
  } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
      } else {
        setUser({
          id: user.id,
          email: user.email,
          role: user.role,
        });
      }
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/admin/login");
        }
        setUser(
          session?.user
            ? {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
              }
            : null
        );
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, checkUser]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/admin/messages",
    },
    {
      title: "Registrations",
      icon: Users,
      href: "/admin/registrations",
    },
    {
      title: "Event Overview",
      href: "/admin/event-overview",
      icon: Calendar,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="max-w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side with menu and branding */}
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden -ml-2 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Branding - Optimized for mobile */}
              <div className="flex items-center">
                {/* BSP Logo and Title */}
                <Image
                  src="/bsp_logo.png"
                  alt="BSP Logo"
                  width={100}
                  height={100}
                  className="w-[45px] h-auto object-contain"
                  priority
                />
                <div className="h-8 w-px mx-4 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Admin Panel
                </h1>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Back to Site - Icon only on mobile */}
              <Link
                href="/"
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Back to Site"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline ml-2">Back to Site</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline ml-2 max-w-[120px] truncate">
                    {user?.email}
                  </span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-1 w-48 py-1 bg-black/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Mobile Sidebar */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/95 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-in-out`}
        >
          <div className="pt-20 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 w-64 h-[calc(100vh-4rem)] border-r border-white/10 bg-black/95 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${
            isMobileMenuOpen ? "hidden" : "block"
          } lg:ml-64 p-4 lg:p-8`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

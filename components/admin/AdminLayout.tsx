"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Gamepad2,
  Calendar,
  Settings,
  BarChart3,
  MessagesSquare,
  Menu,
  X,
  User,
  Home,
  IndianRupee,
} from "lucide-react";
import Image from "next/image";
import { useRole } from "@/hooks/useRole";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
  adminOnly?: boolean;
  badge?: boolean;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

// Reorganized nav items into categories
const navItems: NavCategory[] = [
  {
    category: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
      },
      {
        title: "Registrations",
        href: "/admin/registrations",
        icon: Users,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
      },
    ],
  },
  {
    category: "Event Management",
    items: [
      {
        title: "Event Overview",
        href: "/admin/event-overview",
        icon: Calendar,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
      },
      {
        title: "Gaming Overview",
        href: "/admin/gaming-overview",
        icon: Gamepad2,
        color: "text-pink-400",
        bgColor: "bg-pink-400/10",
      },
      {
        title: "Expense Tracker",
        href: "/admin/expenses",
        icon: IndianRupee,
        color: "text-teal-400",
        bgColor: "bg-teal-400/10",
      },
    ],
  },
  {
    category: "Communication",
    items: [
      {
        title: "Messages",
        href: "/admin/messages",
        icon: MessagesSquare,
        color: "text-cyan-400",
        bgColor: "bg-cyan-400/10",
        badge: true,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        color: "text-orange-400",
        bgColor: "bg-orange-400/10",
        adminOnly: true,
      },
    ],
  },
];

// Update the sidebar rendering in both mobile and desktop views
const SidebarContent = ({
  pathname,
  unreadMessages,
  role,
}: {
  pathname: string;
  unreadMessages: number;
  role: string;
}) => (
  <div className="space-y-6">
    {navItems.map((category) => (
      <div key={category.category} className="space-y-2">
        <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {category.category}
        </h3>
        {category.items
          .filter((item) => !item.adminOnly || role === "super-admin")
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all group ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-md ${isActive ? item.bgColor : "bg-transparent group-hover:" + item.bgColor}`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span
                    className={`text-sm ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                  >
                    {item.title}
                  </span>
                </div>
                {item.badge && unreadMessages > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                  >
                    {unreadMessages}
                  </Badge>
                )}
              </Link>
            );
          })}
      </div>
    ))}
  </div>
);

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { role, loading } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    id: string;
    email: string | undefined;
    role?: string;
  } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

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
    }
  }, [router]);

  const fetchUnreadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id")
        .eq("read", false);

      if (error) throw error;
      setUnreadMessages(data?.length || 0);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  }, []);

  useEffect(() => {
    checkUser();
    fetchUnreadMessages();

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
      }
    );

    // Set up real-time subscription for messages
    const messagesChannel = supabase
      .channel("messages_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => {
          fetchUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(messagesChannel);
    };
  }, [router, checkUser, fetchUnreadMessages]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Redirect from settings if not super-admin
    if (
      !loading &&
      pathname?.includes("/admin/settings") &&
      role !== "super-admin"
    ) {
      router.push("/admin");
    }
  }, [loading, role, pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    router.push("/admin/login");
    return null;
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
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Back to Site - Show text on larger screens */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center"
                      title="Back to Site"
                    >
                      <Home className="w-5 h-5" />
                      <span className="hidden md:inline ml-2">
                        Back to Site
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to main site</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline ml-2 max-w-[150px] lg:max-w-[200px] xl:max-w-[250px] truncate">
                    {user?.email}
                  </span>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-1 w-48 py-1 bg-black/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-50"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/admin/profile"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm"
            >
              <div className="pt-20 p-4 h-full overflow-y-auto">
                <SidebarContent
                  pathname={pathname}
                  unreadMessages={unreadMessages}
                  role={role}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 w-64 h-[calc(100vh-4rem)] border-r border-white/10 bg-black/95 p-4 overflow-y-auto">
          <SidebarContent
            pathname={pathname}
            unreadMessages={unreadMessages}
            role={role}
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${
            isMobileMenuOpen ? "hidden lg:block" : "block"
          } lg:ml-64 p-4 lg:p-8`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

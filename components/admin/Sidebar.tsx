"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  LineChart,
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Registrations",
      href: "/admin/registrations",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: LineChart,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-black/50 backdrop-blur-sm border-r border-white/10">
      <div className="flex flex-1 flex-col gap-y-4 pt-6">
        <div className="flex flex-1 flex-col gap-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 px-6 py-3 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "border-l-2 border-purple-500 bg-purple-500/10 text-purple-500"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-auto pb-6">
          <button
            onClick={() => {/* Add logout handler */}}
            className="flex w-full items-center gap-x-3 px-6 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 
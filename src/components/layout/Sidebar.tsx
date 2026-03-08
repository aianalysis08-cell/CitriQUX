"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Layout,
  Layers,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: BarChart3, label: "Overview", href: "/dashboard" },
  { icon: Layout, label: "Projects", href: "/projects" },
  { icon: Layers, label: "Analyses", href: "/analyses" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 glass-strong border-r border-white/5 z-30 hidden lg:flex flex-col p-6">
      <Link href="/dashboard" className="flex items-center gap-2 mb-10 group">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center glow-primary">
          <Layout className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Critiq<span className="gradient-text">UX</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary-500/10 text-primary-400 border border-primary-500/20 glow-primary"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3 font-medium text-sm">
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-400" : "group-hover:text-white")} />
                {item.label}
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
        >
          <HelpCircle className="w-5 h-5" />
          Support
        </Link>

        {/* Trial Card / Credit Info */}
        <div className="mt-6 p-4 rounded-2xl glass border border-primary-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1">
            <Sparkles className="text-primary-400/30 w-12 h-12 -rotate-12" />
          </div>
          <p className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Free Plan</p>
          <p className="text-[10px] text-white/50 mb-3">8 / 10 credits left</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
            <div className="w-[80%] h-full gradient-primary" />
          </div>
          <Link
            href="/billing"
            className="block text-center py-2 rounded-lg bg-primary-500 text-white text-[10px] font-bold hover:opacity-90 transition-opacity"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </aside>
  );
}

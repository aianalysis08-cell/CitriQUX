"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Palette,
  TrendingUp,
  Activity,
  Target,
  Eye,
  Layers,
  BarChart3,
  FileText,
  Layout,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const aiTools = [
  { icon: Bot, label: "AI UX Copilot", href: "/ai-ux-copilot" },
  { icon: Palette, label: "AI Redesign Engine", href: "/ai-redesign-engine" },
  { icon: TrendingUp, label: "Heatmap Prediction", href: "/heatmap-prediction" },
  { icon: Activity, label: "Conversion Simulator", href: "/conversion-simulator" },
  { icon: Target, label: "UX Benchmark", href: "/ux-benchmark" },
  { icon: Eye, label: "Pattern Recognition", href: "/pattern-recognition" },
  { icon: Layers, label: "Design System Generator", href: "/design-system-generator" },
  { icon: BarChart3, label: "Behavior Analytics", href: "/behavior-analytics" },
  { icon: FileText, label: "PRD Generator", href: "/prd-generator" },
];

const dashboardItems = [
  { icon: BarChart3, label: "Overview", href: "/dashboard" },
  { icon: Layout, label: "Projects", href: "/projects" },
  { icon: Layers, label: "Analyses", href: "/analyses" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Floating Action Button (FAB) to open drawer */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 left-6 z-40 lg:hidden p-4 rounded-2xl md:top-4 md:left-4 md:bottom-auto md:p-2 md:bg-white/10 md:text-white/80 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300 transform backdrop-blur-[40px] backdrop-saturate-[180%] border border-white/[0.08]",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Menu className="w-6 h-6 md:w-5 md:h-5 md:hover:text-white" />
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? (isOpen ? 0 : "-100%") : 0,
        }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col p-6",
          "bg-white/[0.02] backdrop-blur-[50px] backdrop-saturate-[180%] border-r border-white/[0.08] shadow-[8px_0_32px_0_rgba(0,0,0,0.2)]",
          "lg:z-30 lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 group" onClick={handleLinkClick}>
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center glow-primary">
              <Layout className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Critiq<span className="gradient-text">UX</span>
            </span>
          </Link>

          <button
            className="lg:hidden text-white/50 hover:text-white p-1 rounded-md bg-white/5"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2 pb-4">
          {/* AI Tools Section */}
          <div>
            <div className="px-3 mb-2 text-xs font-bold text-white/40 uppercase tracking-widest">
              AI Tools
            </div>
            <div className="space-y-1">
              {aiTools.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between p-2.5 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-white/10 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3 font-medium text-sm">
                      <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white group-hover:scale-110 transition-transform")} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Dashboard Section */}
          <div>
            <div className="px-3 mb-2 text-xs font-bold text-white/40 uppercase tracking-widest">
              Dashboard
            </div>
            <div className="space-y-1">
              {dashboardItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between p-2.5 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-white/10 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-3 font-medium text-sm">
                      <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white group-hover:scale-110 transition-transform")} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>
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
            onClick={handleLinkClick}
          >
            <HelpCircle className="w-5 h-5" />
            Support
          </Link>

          {/* Trial Card / Credit Info */}
          <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
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
        {/* Global styles for custom scrollbar */}
        <style dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
      </motion.aside>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Code,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Bot, label: "AI UX Copilot", href: "/ai-ux-copilot" },
  { icon: Palette, label: "AI Redesign Engine", href: "/ai-redesign-engine" },
  { icon: TrendingUp, label: "Heatmap Prediction", href: "/heatmap-prediction" },
  { icon: Activity, label: "Conversion Simulator", href: "/conversion-simulator" },
  { icon: Target, label: "UX Benchmark", href: "/ux-benchmark" },
  { icon: Eye, label: "Pattern Recognition", href: "/pattern-recognition" },
  { icon: Layers, label: "Design System Generator", href: "/design-system-generator" },
  { icon: BarChart3, label: "Behavior Analytics", href: "/behavior-analytics" },
  { icon: FileText, label: "PRD Generator", href: "/prd-generator" },
  { icon: Code, label: "Developer Mode", href: "/developer-mode" },
];

interface LeftPanelProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapseToggle: () => void;
}

export function LeftPanel({ isOpen, isCollapsed, onToggle, onCollapseToggle }: LeftPanelProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Collapsed Toggle Button */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{
              type: "tween",
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1]
            }}
            onClick={onCollapseToggle}
            className="fixed left-4 top-32 z-40 p-3 rounded-xl glass-strong text-white border border-white/10 hover:bg-white/10 transition-all group will-change-transform"
          >
            <motion.div
              animate={{ x: isCollapsed ? 0 : 2 }}
              transition={{
                type: "tween",
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
                repeat: isCollapsed ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
      <button
        onClick={onToggle}
        className="fixed left-4 top-24 z-60 lg:hidden p-3 rounded-xl glass-strong text-white border border-white/10 hover:bg-white/10 transition-all"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Left Panel */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "4rem" : "20rem",
        }}
        transition={{
          type: "tween",
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1] // Custom cubic bezier for smoothness
        }}
        className="fixed left-0 top-24 bottom-0 glass-strong border-r border-white/5 z-50 flex flex-col pointer-events-auto will-change-transform"
      >
        {/* Header */}
        <motion.div 
          className="p-6 border-b border-white/5"
          layout
          transition={{
            type: "tween",
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    type: "tween",
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Tools</h2>
                    <p className="text-xs text-white/50">Powered by AI</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "tween",
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary mx-auto"
                >
                  <Sparkles className="text-white w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{
                    type: "tween",
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  onClick={onCollapseToggle}
                  className="hidden lg:flex p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { delay: index * 0.05 }
              }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center transition-all duration-200 cursor-pointer relative",
                  isCollapsed ? "justify-center p-3" : "justify-between p-4 rounded-xl",
                  pathname === item.href
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20 glow-primary"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
                onMouseEnter={() => {
                  console.log('Hovering on collapsed icon:', item.label);
                  setActiveItem(item.href);
                }}
                onMouseLeave={() => {
                  console.log('Leaving collapsed icon:', item.label);
                  setActiveItem(null);
                }}
              >
                <div className={cn(
                  "flex items-center transition-all",
                  isCollapsed ? "" : "gap-3"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    pathname === item.href
                      ? "bg-primary-500/20"
                      : "bg-white/5 group-hover:bg-white/10"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5",
                      pathname === item.href ? "text-primary-400" : "group-hover:text-white"
                    )} />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          type: "tween",
                          duration: 0.2,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(item.href);
                          // Close mobile menu after navigation
                          if (window.innerWidth < 1024) {
                            onToggle();
                          }
                        }}
                      >
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {getToolDescription(item.label)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && pathname === item.href && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{
                        type: "tween",
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <ChevronRight className="w-4 h-4 text-primary-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed state */}
                <AnimatePresence>
                  {isCollapsed && activeItem === item.href && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: -5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -5 }}
                      transition={{
                        type: "tween",
                        duration: 0.12,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      style={{ zIndex: 9999 }}
                      className="absolute left-full ml-3 px-4 py-3 rounded-xl glass-strong border border-white/20 text-white text-sm whitespace-nowrap shadow-2xl"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-white/60 leading-tight">{getToolDescription(item.label)}</p>
                      </div>
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white/10" 
                           style={{ borderRightColor: 'rgba(255,255,255,0.05)' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                type: "tween",
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="p-4 border-t border-white/5 will-change-transform"
            >
              <div className="p-4 rounded-2xl glass border border-primary-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1">
                  <Sparkles className="text-primary-400/30 w-12 h-12 -rotate-12" />
                </div>
                <p className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Pro Tools</p>
                <p className="text-[10px] text-white/50 mb-3">Unlock all AI features</p>
                <button className="w-full py-2 rounded-lg bg-primary-500 text-white text-xs font-bold hover:opacity-90 transition-opacity">
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}

function getToolDescription(label: string): string {
  const descriptions: Record<string, string> = {
    "AI UX Copilot": "Get AI assistance for UX decisions",
    "AI Redesign Engine": "Automated design improvements",
    "Heatmap Prediction": "Predict user attention patterns",
    "Conversion Simulator": "Test conversion optimization",
    "UX Benchmark": "Compare against industry standards",
    "Pattern Recognition": "Identify design patterns",
    "Design System Generator": "Generate design systems",
    "Behavior Analytics": "Analyze user behavior",
    "PRD Generator": "Generate product requirements",
    "Developer Mode": "Technical implementation tools"
  };
  return descriptions[label] || "Advanced AI tool";
}

import React from "react";
import {
  BarChart3,
  Layers,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  totalProjects: number;
  totalAnalyses: number;
  creditsLeft: number;
}

export function StatsCards({ totalProjects, totalAnalyses, creditsLeft }: StatsCardsProps) {
  // We'll use static +/-% changes for now since we don't have historical data computation easily available
  const stats = [
    {
      label: "Active Projects",
      value: totalProjects.toString(),
      change: "+2",
      isPositive: true,
      icon: BarChart3,
      color: "text-primary-400",
      bg: "bg-primary-500/10",
    },
    {
      label: "Total Analyses",
      value: totalAnalyses.toString(),
      change: "+24",
      isPositive: true,
      icon: Layers,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
    },
    {
      label: "Average UX Score",
      value: "82", // Placeholder until we calculate average score from analyses
      change: "-3",
      isPositive: false,
      icon: Zap,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Remaining Credits",
      value: creditsLeft.toString(),
      change: "Monthly",
      isPositive: true,
      icon: Sparkles,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="apple-glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5 group-hover:glow-primary transition-all`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
              stat.isPositive ? "bg-success/20 text-success" : "bg-error/20 text-error"
            )}>
              {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stat.value}</h3>
          </div>

          {/* Subtle background glow */}
          <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>
      ))}
    </div>
  );
}

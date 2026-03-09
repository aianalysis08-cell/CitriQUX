"use client";

import React from "react";
import type { BenchmarkTab } from "@/types";
import { Trophy, LayoutGrid, ArrowRightLeft, TriangleRight, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenchmarkTabsProps {
    activeTab: BenchmarkTab;
    onChangeTab: (tab: BenchmarkTab) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABS: { id: BenchmarkTab; label: string; icon: any }[] = [
    { id: "ranking", label: "Leaderboard", icon: Trophy },
    { id: "categories", label: "Category Breakdown", icon: LayoutGrid },
    { id: "head-to-head", label: "1v1 Matchup", icon: ArrowRightLeft },
    { id: "gaps", label: "Gap Analysis", icon: TriangleRight },
    { id: "opportunities", label: "Blue Oceans", icon: Waves },
];

export function BenchmarkTabs({ activeTab, onChangeTab }: BenchmarkTabsProps) {
    return (
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onChangeTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-w-max",
                            isActive
                                ? "bg-white/10 text-white shadow-lg border border-white/5"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", isActive ? "text-primary-400" : "opacity-70")} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

"use client";

import React from "react";
import type { GapItem } from "@/types";
import { AlertTriangle, CheckCircle, TrendingDown, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface GapAnalysisProps {
    gapAnalysis: GapItem[];
    ownSiteLabel: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GapAnalysis({ gapAnalysis, ownSiteLabel }: GapAnalysisProps) {
    const criticalGaps = gapAnalysis.filter(g => g.severity === "critical");
    const minorGaps = gapAnalysis.filter(g => g.severity === "warning");
    const winningAreas = gapAnalysis.filter(g => g.severity === "winning");

    return (
        <div className="mt-8 space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                    Where you stand vs the market average
                </h3>
                <p className="text-white/50">
                    Sorted by urgency — biggest gaps first
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass-strong p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h4 className="text-red-400 font-bold">Critical Gaps</h4>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{criticalGaps.length}</p>
                    <p className="text-xs text-white/50">Urgent areas for improvement</p>
                </div>

                <div className="glass-strong p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <h4 className="text-amber-400 font-bold">Minor Gaps</h4>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{minorGaps.length}</p>
                    <p className="text-xs text-white/50">Slightly behind market average</p>
                </div>

                <div className="glass-strong p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <h4 className="text-green-400 font-bold">Winning Areas</h4>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{winningAreas.length}</p>
                    <p className="text-xs text-white/50">Above market average</p>
                </div>
            </div>

            <div className="space-y-4">
                {gapAnalysis.map((gap) => {
                    const isCritical = gap.severity === "critical";
                    const isWarning = gap.severity === "warning";
                    const isWinning = gap.severity === "winning";

                    return (
                        <div
                            key={gap.category}
                            className={cn(
                                "glass p-6 rounded-2xl border transition-all",
                                isCritical ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50" :
                                    isWarning ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50" :
                                        "border-green-500/30 bg-green-500/5 hover:border-green-500/50"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: Category & Gap Values */}
                                <div className="md:w-1/3 shrink-0">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                                            isCritical ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                                isWarning ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                                    "bg-green-500/20 text-green-400 border-green-500/30"
                                        )}>
                                            {isCritical ? "🔴 Critical" : isWarning ? "🟡 Warning" : "🟢 Winning"}
                                        </span>
                                        <h4 className="text-lg font-bold text-white ml-2">{gap.categoryLabel}</h4>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-white">You ({gap.yourScore.toFixed(1)})</span>
                                                <span className={isWinning ? "text-green-400" : isCritical ? "text-red-400" : "text-amber-400"}>
                                                    {isWinning ? `+${gap.gap.toFixed(1)}` : gap.gap.toFixed(1)} gap
                                                </span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden w-full">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full w-full transition-all",
                                                        isWinning ? "bg-green-400" : isCritical ? "bg-red-400" : "bg-amber-400"
                                                    )}
                                                    style={{ width: `${(gap.yourScore / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[10px] text-white/50 mb-1.5 uppercase tracking-wider font-bold">
                                                <span>Market Avg ({gap.marketAverage.toFixed(1)})</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full">
                                                <div
                                                    className="h-full rounded-full w-full bg-white/30"
                                                    style={{ width: `${(gap.marketAverage / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Ai Fix Details */}
                                <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                                    <h5 className="text-xs font-bold text-primary-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <Target className="w-3.5 h-3.5" />
                                        How to close this gap
                                    </h5>
                                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                                        &quot;{gap.recommendation}&quot;
                                    </p>

                                    {isCritical && (
                                        <div className="mt-4 inline-flex items-center gap-2 text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
                                            <Zap className="w-3.5 h-3.5" />
                                            Prioritize fixing this immediately
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

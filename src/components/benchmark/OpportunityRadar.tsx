"use client";

import React from "react";
import type { OpportunityItem } from "@/types";
import { Waves, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpportunityRadarProps {
    opportunities: OpportunityItem[];
}

export function OpportunityRadar({ opportunities }: OpportunityRadarProps) {
    // If no opportunities found
    if (!opportunities || opportunities.length === 0) {
        return (
            <div className="glass-strong p-8 rounded-2xl border border-white/10 mt-8 text-center">
                <Waves className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white font-medium">No distinct blue ocean opportunities identified.</p>
                <p className="text-white/50 text-sm mt-2">The market is highly competitive in all evaluated areas.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-8">
            <div className="text-center mb-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />
                <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                    <Waves className="w-8 h-8 text-cyan-400 animate-pulse" />
                    Blue Ocean Opportunities
                </h3>
                <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
                    UX areas where ALL measured competitors score poorly. Focusing on these gives you a
                    first-mover advantage to capture attention and conversion where the market isn&apos;t looking.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opportunities.map((opp, idx) => (
                    <div key={idx} className="glass p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 bg-cyan-500/5 transition-all relative overflow-hidden group">
                        {/* Soft decorative background element */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4 gap-4">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    {opp.title}
                                </h4>

                                <span className={cn(
                                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border whitespace-nowrap",
                                    opp.estimatedImpact === 'high' ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                        opp.estimatedImpact === 'medium' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                            "bg-white/5 text-white/50 border-white/10"
                                )}>
                                    Impact: {opp.estimatedImpact}
                                </span>
                            </div>

                            <div className="mb-6 flex-grow">
                                <p className="text-sm text-white/70 leading-relaxed">
                                    &quot;{opp.description}&quot;
                                </p>
                            </div>

                            <div className="mt-auto space-y-4 pt-4 border-t border-white/10">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                                        <span>Market Average Score</span>
                                        <span className="text-red-400">{opp.averageScore.toFixed(1)}/10</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full">
                                        <div
                                            className="h-full rounded-full w-full bg-red-400"
                                            style={{ width: `${(opp.averageScore / 10) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-1 italic text-right">Critically low across the board</p>
                                </div>

                                <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-white/50" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Effort required</p>
                                        <p className="text-sm font-medium text-white capitalize">{opp.effort}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 glass-strong p-8 rounded-2xl border border-white/10 text-center">
                <AlertCircle className="w-8 h-8 text-white/30 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">How to use this matrix</h4>
                <p className="text-white/50 text-sm max-w-xl mx-auto">
                    Prioritize <span className="text-green-400 font-bold">High Impact</span> + <span className="text-white font-bold">Low/Medium Effort</span> opportunities first. These offer the fastest path to establishing competitive differentiation in areas where users are currently frustrated by all existing options.
                </p>
            </div>
        </div>
    );
}

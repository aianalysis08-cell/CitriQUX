"use client";

import React from "react";
import { Globe, Eye, BarChart3, Users, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenchmarkLoadingProps {
    step: number;
    siteCount: number;
}

const STEPS = [
    { icon: Globe, label: 'Fetching site information', detail: 'Identifying all submitted domains' },
    { icon: Eye, label: 'Analyzing visual design', detail: 'Evaluating typography, color, hierarchy' },
    { icon: BarChart3, label: 'Scoring UX dimensions', detail: 'Running 9 category evaluations per site' },
    { icon: Users, label: 'Running competitive comparison', detail: 'Ranking all sites relative to each other' },
    { icon: Sparkles, label: 'Generating strategic insights', detail: 'Building your 30-day competitive plan' },
    { icon: CheckCircle, label: 'Finalizing report', detail: 'Saving your benchmark results' },
];

export function BenchmarkLoading({ step, siteCount }: BenchmarkLoadingProps) {
    const currentStepSafe = Math.min(Math.max(step, 0), STEPS.length - 1);
    const progressPercent = ((currentStepSafe) / (STEPS.length - 1)) * 100;
    // Estimate ~30 seconds for 2 sites, +10s per extra site. 
    // Each step taking roughly 4-5 seconds based on auto-advance.
    const estimatedSecondsLeft = Math.max(2, (STEPS.length - currentStepSafe) * 5);

    return (
        <div className="glass-strong p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto mt-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                    Analyzing {siteCount} websites...
                </h2>
                <p className="text-white/50 text-sm">
                    Please wait. This comprehensive analysis takes approximately 20-40 seconds.
                </p>
            </div>

            <div className="space-y-6 relative z-10">
                {STEPS.map((s, idx) => {
                    const isCompleted = idx < currentStepSafe;
                    const isCurrent = idx === currentStepSafe;
                    const isPending = idx > currentStepSafe;

                    return (
                        <div key={idx} className={cn("flex items-start gap-4 transition-all duration-300", isPending ? "opacity-30" : "opacity-100")}>
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                                isCompleted ? "bg-green-500/20 border-green-500/30 text-green-400" :
                                    isCurrent ? "bg-primary-500/20 border-primary-500/50 text-primary-400 glow-primary" :
                                        "bg-white/5 border-white/10 text-white/30"
                            )}>
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                                    isCurrent ? <s.icon className="w-5 h-5 animate-pulse" /> :
                                        <s.icon className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className={cn(
                                    "font-medium transition-colors",
                                    isCompleted ? "text-white/70 line-through" :
                                        isCurrent ? "text-primary-400 font-semibold" :
                                            "text-white"
                                )}>
                                    {s.label}
                                </h4>
                                {(isCurrent || isCompleted) && (
                                    <p className="text-sm text-white/50 mt-1">{s.detail}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 relative z-10">
                <div className="flex justify-between text-xs text-white/40 font-medium mb-2 uppercase tracking-wider">
                    <span>Overall Progress</span>
                    <span>~{estimatedSecondsLeft}s remaining</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

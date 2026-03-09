"use client";

import React from "react";
import type { SiteAnalysis } from "@/types";
import { Copy, Target, Sparkles, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteScoreCardProps {
    analysis: SiteAnalysis;
    rank: number;
}

export function SiteScoreCard({ analysis, rank }: SiteScoreCardProps) {
    const { site, scores, keyFindings, aboveTheFold, ctaAssessment, trustAssessment } = analysis;

    const handleCopy = () => {
        navigator.clipboard.writeText(site.url);
    };

    return (
        <div className="glass-strong p-6 sm:p-8 rounded-3xl border border-white/10 mt-8 relative overflow-hidden">

            {/* Decorative gradient */}
            <div className={cn(
                "absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20",
                site.isOwn ? "bg-primary-500" : "bg-white/50"
            )} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={site.faviconUrl}
                            alt={site.domain}
                            className="w-12 h-12 rounded-xl bg-white p-1 border border-white/10 shadow-xl"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                        {site.isOwn && (
                            <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary-500 rounded-full border-2 border-surface-900 flex items-center justify-center text-[10px]">
                                You
                            </span>
                        )}
                        {rank === 1 && !site.isOwn && (
                            <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full border-2 border-surface-900 flex items-center justify-center text-xs shadow-lg">
                                🥇
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            {site.domain}
                            <button onClick={handleCopy} className="text-white/20 hover:text-white/60 transition-colors" title="Copy URL">
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </h2>
                        <p className="text-sm text-white/50">{site.label}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Rank</p>
                        <p className="text-3xl font-mono font-bold text-white tracking-tighter">
                            #{rank}
                        </p>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="text-right">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Overall</p>
                        <p className={cn(
                            "text-3xl font-mono font-bold tracking-tighter",
                            site.isOwn ? "text-primary-400" : rank === 1 ? "text-yellow-400" : "text-white"
                        )}>
                            {scores.overall.toFixed(1)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* Left Column: Diagnostics */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                        <h3 className="text-sm font-bold text-white/70 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary-400" /> Key Findings
                        </h3>
                        <p className="text-white/90 leading-relaxed font-medium">&quot;{keyFindings}&quot;</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                                Strengths
                            </h3>
                            <ul className="space-y-2">
                                {analysis.strengths.map((str, idx) => (
                                    <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                                        <span className="text-green-400 mt-0.5">•</span> {str}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                                Weaknesses
                            </h3>
                            <ul className="space-y-2">
                                {analysis.weaknesses.map((wk, idx) => (
                                    <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5">•</span> {wk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-white/50 mb-2">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs uppercase font-bold tracking-wider">Above Fold</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed">{aboveTheFold}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-white/50 mb-2">
                                <Target className="w-4 h-4" />
                                <span className="text-xs uppercase font-bold tracking-wider">CTA Strategy</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed">{ctaAssessment}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-white/50 mb-2">
                                <span className="w-4 h-4 flex items-center justify-center">🛡️</span>
                                <span className="text-xs uppercase font-bold tracking-wider">Trust Signals</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed">{trustAssessment}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Score Breakdown */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-max">
                    <h3 className="text-sm font-bold text-white/90 mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                        Category Scores
                        <span className="text-xs font-normal text-white/40">/10 scale</span>
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(scores)
                            .filter(([key]) => key !== 'overall')
                            .map(([key, val]) => {
                                const numVal = val as number;
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                                            <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-white font-mono">{numVal.toFixed(1)}</span>
                                        </div>
                                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden w-full">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full w-full transition-all",
                                                    numVal >= 8 ? "bg-green-400" : numVal >= 6 ? "bg-amber-400" : "bg-red-400"
                                                )}
                                                style={{ width: `${(numVal / 10) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

            </div>
        </div>
    );
}

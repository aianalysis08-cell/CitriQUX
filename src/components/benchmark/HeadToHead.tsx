"use client";

import React, { useState } from "react";
import type { SiteAnalysis, BenchmarkCategory } from "@/types";
import { Trophy, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeadToHeadProps {
    sites: SiteAnalysis[];
    initialSites?: [string, string];
}

const CATEGORY_LABELS: Record<BenchmarkCategory, string> = {
    visualDesign: "Visual Polish",
    navigation: "Navigation & IA",
    accessibility: "Accessibility",
    mobileUX: "Mobile UX",
    ctaClarity: "CTA Clarity",
    pageSpeedFeel: "Speed & Flow",
    trustSignals: "Trust Signals",
    contentQuality: "Content Quality",
    conversionFlow: "Conversion UX",
};

export function HeadToHead({ sites, initialSites }: HeadToHeadProps) {
    const [siteA, setSiteA] = useState<string>(initialSites?.[0] || sites[0]?.site.domain);
    const [siteB, setSiteB] = useState<string>(initialSites?.[1] || sites[1]?.site.domain || sites[0]?.site.domain);

    const analysisA = sites.find(s => s.site.domain === siteA);
    const analysisB = sites.find(s => s.site.domain === siteB);

    if (!analysisA || !analysisB) return null;

    const categories = Object.keys(CATEGORY_LABELS) as BenchmarkCategory[];

    let winsA = 0;
    let winsB = 0;

    categories.forEach(c => {
        if (analysisA.scores[c] > analysisB.scores[c]) winsA++;
        else if (analysisA.scores[c] < analysisB.scores[c]) winsB++;
    });

    const overallWinner = winsA > winsB ? analysisA : winsA < winsB ? analysisB : null;

    return (
        <div className="mt-8 space-y-6">
            {/* Site Selectors */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <select
                    value={siteA}
                    onChange={(e) => setSiteA(e.target.value)}
                    className="w-full md:w-64 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-medium text-white focus:outline-none focus:border-primary-500/50"
                >
                    {sites.map(s => (
                        <option key={s.site.domain} value={s.site.domain} className="bg-surface-800">
                            {s.site.domain} {s.site.isOwn ? "(You)" : ""}
                        </option>
                    ))}
                </select>

                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <ArrowRightLeft className="w-5 h-5 text-white/50" />
                </div>

                <select
                    value={siteB}
                    onChange={(e) => setSiteB(e.target.value)}
                    className="w-full md:w-64 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-medium text-white focus:outline-none focus:border-amber-500/50"
                >
                    {sites.map(s => (
                        <option key={s.site.domain} value={s.site.domain} className="bg-surface-800">
                            {s.site.domain} {s.site.isOwn ? "(You)" : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* Categories Matchup */}
            <div className="glass-strong p-8 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={analysisA.site.faviconUrl} className="w-8 h-8 rounded bg-white" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
                        <div>
                            <h3 className="text-lg font-bold text-white">{analysisA.site.domain}</h3>
                            <p className="text-primary-400 font-bold text-sm">Overall: {analysisA.scores.overall.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white/10">VS</div>
                    <div className="flex items-center gap-3 text-right">
                        <div>
                            <h3 className="text-lg font-bold text-white">{analysisB.site.domain}</h3>
                            <p className="text-amber-400 font-bold text-sm">Overall: {analysisB.scores.overall.toFixed(1)}</p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={analysisB.site.faviconUrl} className="w-8 h-8 rounded bg-white" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                </div>

                <div className="space-y-6">
                    {categories.map(cat => {
                        const scoreA = analysisA.scores[cat];
                        const scoreB = analysisB.scores[cat];
                        const winner = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'TIE';

                        return (
                            <div key={cat} className="grid grid-cols-[1fr_200px_1fr] gap-6 items-center">
                                {/* Left Bar (A) */}
                                <div className="flex items-center gap-4 justify-end">
                                    {winner === 'A' && <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />}
                                    <span className={cn("font-bold text-sm w-8 shrink-0 text-right", winner === 'A' ? "text-primary-400" : "text-white/50")}>
                                        {scoreA.toFixed(1)}
                                    </span>
                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden w-full flex justify-end">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", winner === 'A' ? "bg-primary-500 glow-primary" : "bg-white/20")}
                                            style={{ width: `${(scoreA / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Center Label */}
                                <div className="text-center font-medium text-xs text-white/60 tracking-wider uppercase">
                                    {CATEGORY_LABELS[cat]}
                                </div>

                                {/* Right Bar (B) */}
                                <div className="flex items-center gap-4 justify-start">
                                    <div className="h-4 bg-white/5 rounded-full overflow-hidden w-full">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", winner === 'B' ? "bg-amber-500 glow-accent" : "bg-white/20")}
                                            style={{ width: `${(scoreB / 10) * 100}%` }}
                                        />
                                    </div>
                                    <span className={cn("font-bold text-sm w-8 shrink-0", winner === 'B' ? "text-amber-500" : "text-white/50")}>
                                        {scoreB.toFixed(1)}
                                    </span>
                                    {winner === 'B' && <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Matchup Summary Banner */}
            {overallWinner && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-[2px]">
                        <Trophy className="w-32 h-32" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
                        {overallWinner.site.domain} wins overall!
                    </h2>
                    <p className="text-white/60 text-sm relative z-10">
                        {overallWinner.site.domain} outperformed in {overallWinner === analysisA ? winsA : winsB} out of 9 categories.
                    </p>
                </div>
            )}

            {/* Detailed Analysis Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[analysisA, analysisB].map((analysis, i) => (
                    <div key={i} className={cn(
                        "p-6 rounded-2xl border bg-black/20",
                        i === 0 ? "border-primary-500/30" : "border-amber-500/30"
                    )}>
                        <div className="flex items-center gap-3 mb-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={analysis.site.faviconUrl} className="w-6 h-6 rounded" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
                            <h4 className="font-bold text-white">{analysis.site.domain}</h4>
                        </div>

                        <p className="text-sm text-white/70 italic mb-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                            &quot;{analysis.keyFindings}&quot;
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h5 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                    Top Strengths
                                </h5>
                                <ul className="space-y-2">
                                    {analysis.strengths.map((s, idx) => (
                                        <li key={idx} className="text-sm text-white/70 flex items-start gap-2">
                                            <span className="text-green-400 mt-0.5">✓</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                    Key Weaknesses
                                </h5>
                                <ul className="space-y-2">
                                    {analysis.weaknesses.map((w, idx) => (
                                        <li key={idx} className="text-sm text-white/70 flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">✗</span> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

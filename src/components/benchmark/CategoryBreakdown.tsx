"use client";

import React from "react";
import type { SiteAnalysis, CategoryWinner, BenchmarkCategory } from "@/types";
import {
    Palette, Compass, Eye, Smartphone, Target,
    Zap, Shield, FileText, TrendingUp, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBreakdownProps {
    sites: SiteAnalysis[];
    categoryWinners: CategoryWinner[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_META: Record<BenchmarkCategory, { label: string; icon: any }> = {
    visualDesign: { label: "Visual Design", icon: Palette },
    navigation: { label: "Navigation & IA", icon: Compass },
    accessibility: { label: "Accessibility", icon: Eye },
    mobileUX: { label: "Mobile UX", icon: Smartphone },
    ctaClarity: { label: "CTA Clarity", icon: Target },
    pageSpeedFeel: { label: "Speed & Flow", icon: Zap },
    trustSignals: { label: "Trust Signals", icon: Shield },
    contentQuality: { label: "Content Quality", icon: FileText },
    conversionFlow: { label: "Conversion Flow", icon: TrendingUp },
};

function getScoreColor(score: number): string {
    if (score >= 8.5) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (score >= 7.0) return "text-green-300 bg-green-300/10 border-green-300/20";
    if (score >= 5.5) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
}

function getBarColor(score: number): string {
    if (score >= 7.0) return "bg-green-400";
    if (score >= 5.5) return "bg-amber-400";
    return "bg-red-400";
}

export function CategoryBreakdown({ sites, categoryWinners }: CategoryBreakdownProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ownSite = sites.find(s => s.site.isOwn);
    const categories = Object.keys(CATEGORY_META) as BenchmarkCategory[];

    return (
        <div className="glass border border-white/10 rounded-2xl overflow-hidden mt-8">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs text-white/50 uppercase tracking-wider">
                            <th className="p-4 font-medium pl-6 sticky left-0 z-20 bg-surface-900 border-r border-white/5">
                                Category
                            </th>
                            {sites.map(siteObj => (
                                <th
                                    key={siteObj.site.domain}
                                    className={cn(
                                        "p-4 font-medium text-center border-r border-white/5",
                                        siteObj.site.isOwn ? "bg-primary-500/10 text-primary-300" : ""
                                    )}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={siteObj.site.faviconUrl}
                                            alt=""
                                            className="w-5 h-5 rounded bg-white"
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                        <span className="truncate max-w-[100px]">{siteObj.site.domain}</span>
                                        {siteObj.site.isOwn && <span className="text-[9px] bg-primary-500/20 border border-primary-500/30 px-1.5 py-0.5 rounded-full text-primary-400">YOUR SITE</span>}
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 font-medium text-center pr-6">Winner</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {categories.map((catKey) => {
                            const meta = CATEGORY_META[catKey];
                            const Icon = meta.icon;
                            const winner = categoryWinners.find(w => w.category === catKey);

                            return (
                                <tr key={catKey} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-6 sticky left-0 z-20 bg-surface-900 group-hover:bg-[#1a1c23] border-r border-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <Icon className="w-4 h-4 text-white/70" />
                                            </div>
                                            <span className="font-medium text-white">{meta.label}</span>
                                        </div>
                                    </td>

                                    {sites.map(siteObj => {
                                        const score = siteObj.scores[catKey];
                                        const isWinner = winner?.winningSite === siteObj.site.domain;
                                        const styleClass = getScoreColor(score);
                                        const barClass = getBarColor(score);

                                        return (
                                            <td
                                                key={siteObj.site.domain}
                                                className={cn(
                                                    "p-4 text-center border-r border-white/5",
                                                    siteObj.site.isOwn ? "bg-primary-500/5 group-hover:bg-primary-500/10" : ""
                                                )}
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className={cn(
                                                        "inline-flex items-center justify-center w-12 h-8 rounded-lg border font-bold text-sm tracking-tight relative",
                                                        styleClass
                                                    )}>
                                                        {score.toFixed(1)}
                                                        {isWinner && (
                                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-surface-900">
                                                                <Trophy className="w-3 h-3 text-yellow-900" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-16 h-1 mt-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full w-full", barClass)}
                                                            style={{ width: `${(score / 10) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    })}

                                    <td className="p-4 text-center pr-6">
                                        {winner ? (
                                            <div className="flex items-center justify-center gap-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={sites.find(s => s.site.domain === winner.winningSite)?.site.faviconUrl}
                                                    className="w-4 h-4 rounded bg-white"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                    alt=""
                                                />
                                                <span className="text-xs font-medium text-white/70 truncate max-w-[100px]">
                                                    {winner.winningSite}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-white/30 text-xs text-center">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-white/5 border-t border-white/10">
                            <td className="p-4 pl-6 font-bold text-white sticky left-0 z-20 bg-surface-800 border-r border-white/5">
                                Overall Score
                            </td>
                            {sites.map(siteObj => (
                                <td
                                    key={siteObj.site.domain}
                                    className={cn(
                                        "p-4 text-center border-r border-white/5",
                                        siteObj.site.isOwn ? "bg-primary-500/10" : ""
                                    )}
                                >
                                    <span className={cn(
                                        "text-xl font-bold font-mono tracking-tighter",
                                        siteObj.rank === 1 ? "text-yellow-400" : siteObj.site.isOwn ? "text-cyan-400" : "text-white"
                                    )}>
                                        {siteObj.scores.overall.toFixed(1)}
                                    </span>
                                </td>
                            ))}
                            <td className="p-4"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

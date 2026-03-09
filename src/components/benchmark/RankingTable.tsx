"use client";

import React from "react";
import type { SiteAnalysis } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingTableProps {
    sites: SiteAnalysis[];
    onSelectSite: (domain: string) => void;
    selectedDomain: string | null;
}

const RANK_BADGE_STYLE = {
    1: { bg: "bg-yellow-500/20", border: "border-yellow-500/40", text: "text-yellow-400", label: "🥇 1" },
    2: { bg: "bg-slate-300/20", border: "border-slate-300/40", text: "text-slate-300", label: "🥈 2" },
    3: { bg: "bg-amber-700/20", border: "border-amber-700/40", text: "text-amber-600", label: "🥉 3" },
};

export function RankingTable({ sites, onSelectSite, selectedDomain }: RankingTableProps) {
    const ownSite = sites.find(s => s.site.isOwn);
    const ownScore = ownSite?.scores.overall ?? 0;

    return (
        <div className="glass border border-white/10 rounded-2xl overflow-hidden mt-8">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs text-white/50 uppercase tracking-wider">
                            <th className="p-4 font-medium pl-6 w-20 text-center">Rank</th>
                            <th className="p-4 font-medium">Website</th>
                            <th className="p-4 font-medium text-center">Score</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right pr-6">Vs You</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {sites.map((analysis) => {
                            const { rank, site, scores } = analysis;
                            const isSelected = site.domain === selectedDomain;
                            const isOwn = site.isOwn;
                            const rankStyle = RANK_BADGE_STYLE[rank as keyof typeof RANK_BADGE_STYLE] || {
                                bg: "bg-white/5", border: "border-white/10", text: "text-white/40", label: rank.toString()
                            };

                            // Gap vs user
                            const gap = (!isOwn && ownScore) ? (scores.overall - ownScore) : 0;
                            const gapFormatted = Math.abs(gap).toFixed(1);

                            return (
                                <tr
                                    key={site.domain}
                                    onClick={() => onSelectSite(site.domain)}
                                    className={cn(
                                        "group transition-all cursor-pointer hover:bg-white/5",
                                        isSelected ? "bg-primary-500/10 border-l-2 border-l-primary-500" : "border-l-2 border-l-transparent",
                                        isOwn ? "bg-primary-500/5 hover:bg-primary-500/10" : ""
                                    )}
                                >
                                    <td className="p-4 pl-6 text-center">
                                        <span className={cn(
                                            "inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold font-mono tracking-tighter",
                                            rankStyle.bg, rankStyle.border, rankStyle.text
                                        )}>
                                            {rankStyle.label}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={site.faviconUrl}
                                                alt=""
                                                className="w-6 h-6 rounded bg-white"
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                                                    {site.domain}
                                                </div>
                                                <div className="text-xs text-white/40">{site.label}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={cn(
                                                "text-lg font-bold",
                                                rank === 1 ? "text-yellow-400" : isOwn ? "text-primary-400" : "text-white"
                                            )}>
                                                {scores.overall.toFixed(1)}<span className="text-white/30 text-xs font-normal">/10</span>
                                            </span>
                                            <div className="w-16 h-1 mt-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full w-full", rank === 1 ? "bg-yellow-400" : "bg-white/30")}
                                                    style={{ width: `${(scores.overall / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {isOwn && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                                Your Site
                                            </span>
                                        )}
                                        {rank === 1 && !isOwn && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                                                Category Leader
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        {isOwn ? (
                                            <span className="text-white/30 text-xs italic">—</span>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2 text-xs font-medium">
                                                {gap > 0 ? (
                                                    <>
                                                        <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                                                        <span className="text-red-400">+{gapFormatted} ahead</span>
                                                    </>
                                                ) : gap < 0 ? (
                                                    <>
                                                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                                                        <span className="text-green-400">{gapFormatted} behind</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Minus className="w-3.5 h-3.5 text-white/40" />
                                                        <span className="text-white/40">Tied</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

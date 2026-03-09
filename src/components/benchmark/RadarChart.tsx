"use client";

import React from "react";
import type { SiteAnalysis } from "@/types";
import {
    Radar,
    RadarChart as RechartsRadar,
    PolarGrid,
    PolarAngleAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface RadarChartProps {
    sites: SiteAnalysis[];
}

const CATEGORY_LABELS: Record<string, string> = {
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

const SITE_COLORS = [
    "var(--accent-cyan, #00e5ff)",   // User's site (cyan)
    "#f59e0b",                       // Comp 1 (amber)
    "#ec4899",                       // Comp 2 (pink)
    "#8b5cf6",                       // Comp 3 (purple)
    "#10b981",                       // Comp 4 (emerald fallback)
];

export function RadarChart({ sites }: RadarChartProps) {
    // Map data to Recharts format
    // Recharts expects: { category: "Visual Polish", "critiqux.com": 9.0, "maze.design": 7.5 }

    const rawCategories = Object.keys(CATEGORY_LABELS);

    const data = rawCategories.map((catKey) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataPoint: any = { category: CATEGORY_LABELS[catKey] };
        sites.forEach((siteObj) => {
            dataPoint[siteObj.site.domain] = siteObj.scores[catKey as keyof typeof siteObj.scores];
        });
        return dataPoint;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-strong p-4 rounded-xl border border-white/10 shadow-2xl z-50">
                    <p className="text-white font-bold text-sm mb-3 pb-2 border-b border-white/10">{label}</p>
                    <div className="space-y-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-6 text-xs">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-white/70">{entry.name}</span>
                                </div>
                                <span className="text-white font-bold" style={{ color: entry.color }}>
                                    {Number(entry.value).toFixed(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden mt-8">
            {/* Background glow behind chart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/5 blur-[100px] rounded-full pointer-events-none" />

            <h3 className="text-xl font-bold text-white mb-2">Comparative UX Radar</h3>
            <p className="text-white/50 text-sm mb-8">
                Visualizing strengths and weaknesses across all 9 evaluative dimensions.
            </p>

            <div className="h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                            formatter={(value, _entry: any) => {
                                const siteInfo = sites.find(s => s.site.domain === value)?.site;
                                return (
                                    <span className="text-white/70 text-xs ml-1 inline-flex items-center gap-2">
                                        {siteInfo && (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={siteInfo.faviconUrl}
                                                    className="w-4 h-4 rounded bg-white"
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    onError={(e: any) => e.currentTarget.style.display = 'none'}
                                                    alt=""
                                                />
                                            </>
                                        )}
                                        {value}
                                        {siteInfo?.isOwn && <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-1 py-0.5 rounded border border-cyan-400/20 italic ml-1">(You)</span>}
                                    </span>
                                );
                            }}
                        />

                        {sites.map((siteObj, index) => {
                            const isOwn = siteObj.site.isOwn;
                            const color = isOwn ? SITE_COLORS[0] : SITE_COLORS[(index % (SITE_COLORS.length - 1)) + 1];

                            return (
                                <Radar
                                    key={siteObj.site.domain}
                                    name={siteObj.site.domain}
                                    dataKey={siteObj.site.domain}
                                    stroke={color}
                                    strokeWidth={isOwn ? 2.5 : 1.5}
                                    fill={color}
                                    fillOpacity={isOwn ? 0.2 : 0.05}
                                    strokeDasharray={isOwn ? undefined : "4 4"}
                                />
                            );
                        })}
                    </RechartsRadar>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

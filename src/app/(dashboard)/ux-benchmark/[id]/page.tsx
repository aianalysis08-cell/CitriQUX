"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Target, AlertCircle, ArrowLeft } from "lucide-react";
import type { BenchmarkState } from "@/types";

import { BenchmarkSkeleton } from "@/components/benchmark/BenchmarkSkeleton";
import { RankingTable } from "@/components/benchmark/RankingTable";
import { RadarChart } from "@/components/benchmark/RadarChart";
import { CategoryBreakdown } from "@/components/benchmark/CategoryBreakdown";
import { HeadToHead } from "@/components/benchmark/HeadToHead";
import { GapAnalysis } from "@/components/benchmark/GapAnalysis";
import { OpportunityRadar } from "@/components/benchmark/OpportunityRadar";
import { AIStrategicInsight } from "@/components/benchmark/AIStrategicInsight";
import { BenchmarkTabs } from "@/components/benchmark/BenchmarkTabs";
import { SiteScoreCard } from "@/components/benchmark/SiteScoreCard";
import { ExportReport } from "@/components/benchmark/ExportReport";

export default function BenchmarkDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [state, setState] = useState<BenchmarkState>({
        status: "loading",
        loadingStep: 5,
        result: null,
        error: null,
        activeTab: "ranking",
        headToHeadSites: null,
    });

    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

    useEffect(() => {
        async function loadReport() {
            try {
                const res = await fetch(`/api/benchmark/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load report");
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ownSiteUrl = data.sites.find((s: any) => s.site.isOwn)?.site.domain;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const compSiteUrl = data.sites.find((s: any) => !s.site.isOwn)?.site.domain;

                setState({
                    status: "success",
                    loadingStep: 5,
                    result: data,
                    error: null,
                    activeTab: "ranking",
                    headToHeadSites: [ownSiteUrl || data.sites[0].site.domain, compSiteUrl || data.sites[0].site.domain],
                });

                setSelectedDomain(ownSiteUrl || data.sites[0].site.domain);

            } catch (err) {
                setState(prev => ({
                    ...prev,
                    status: "error",
                    error: err instanceof Error ? err.message : "Report not found"
                }));
            }
        }

        if (id) {
            loadReport();
        }
    }, [id]);

    if (state.status === "loading") {
        return <BenchmarkSkeleton />;
    }

    if (state.status === "error" || !state.result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
                <p className="text-white/50 mb-8">{state.error}</p>
                <button
                    onClick={() => router.push('/benchmark')}
                    className="px-6 py-3 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const { result } = state;
    const ownSiteLabel = result.sites.find((s) => s.site.isOwn)?.site.domain || "Your Site";
    const competitorLabels = result.sites.filter((s) => !s.site.isOwn).map((s) => s.site.domain);
    const selectedAnalysis = result.sites.find(s => s.site.domain === selectedDomain) || result.sites[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push('/benchmark')}
                        className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to New Analysis
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="w-8 h-8 text-primary-400" />
                        Competitive UX Benchmark
                    </h1>
                    <p className="text-white/50">
                        Analysis complete for {result.sites.length} domains. Generated {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <ExportReport result={result} />
            </div>

            <AIStrategicInsight
                insight={result.aiInsight}
                ownSiteLabel={ownSiteLabel}
                competitorLabels={competitorLabels}
            />

            {/* Main Analysis Area */}
            <div className="glass-strong p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="mb-6 overflow-x-auto pb-2">
                    <BenchmarkTabs
                        activeTab={state.activeTab}
                        onChangeTab={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
                    />
                </div>

                <div className="min-h-[500px]">
                    {state.activeTab === "ranking" && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <RankingTable
                                sites={result.sites}
                                onSelectSite={setSelectedDomain}
                                selectedDomain={selectedDomain}
                            />
                            <SiteScoreCard analysis={selectedAnalysis} rank={selectedAnalysis.rank} />
                        </div>
                    )}

                    {state.activeTab === "categories" && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <RadarChart sites={result.sites} />
                            <CategoryBreakdown sites={result.sites} categoryWinners={result.categoryWinners} />
                        </div>
                    )}

                    {state.activeTab === "head-to-head" && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <HeadToHead sites={result.sites} initialSites={state.headToHeadSites as any} />
                        </div>
                    )}

                    {state.activeTab === "gaps" && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <GapAnalysis gapAnalysis={result.gapAnalysis} ownSiteLabel={ownSiteLabel} />
                        </div>
                    )}

                    {state.activeTab === "opportunities" && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <OpportunityRadar opportunities={result.opportunities} />
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

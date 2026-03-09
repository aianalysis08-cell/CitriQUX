"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Target, AlertCircle } from "lucide-react";
import type { BenchmarkState, BenchmarkInputForm } from "@/types";

import { BenchmarkInput } from "@/components/benchmark/BenchmarkInput";
import { BenchmarkLoading } from "@/components/benchmark/BenchmarkLoading";
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

export default function BenchmarkPage() {
    const router = useRouter();
    const supabase = createClient();

    const [userPlan, setUserPlan] = useState<"free" | "pro" | "enterprise">("free");
    const [state, setState] = useState<BenchmarkState>({
        status: "idle",
        loadingStep: 0,
        result: null,
        error: null,
        activeTab: "ranking",
        headToHeadSites: null,
    });

    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

    useEffect(() => {
        async function getUserPlan() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // For testing bypass: Just assume free or pro plan if not logged in
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("subscription_plan")
                .eq("id", user.id)
                .single();

            if (profile?.subscription_plan) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setUserPlan(profile.subscription_plan as any);
            }
        }
        getUserPlan();
    }, [supabase]);

    // Loading animation simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state.status === "loading") {
            interval = setInterval(() => {
                setState((prev) => ({
                    ...prev,
                    loadingStep: prev.loadingStep < 5 ? prev.loadingStep + 1 : 5
                }));
            }, 4500); // advance roughly every 4.5 seconds
        }
        return () => clearInterval(interval);
    }, [state.status]);

    const handleRunBenchmark = async (form: BenchmarkInputForm) => {
        setState((prev) => ({ ...prev, status: "loading", error: null, loadingStep: 0 }));

        try {
            const res = await fetch("/api/benchmark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.upgrade) {
                    throw new Error("Competitor limit reached. Upgrade to Pro for more simultaneous comparisons.");
                }
                throw new Error(data.error || "Failed to generate benchmark report");
            }

            // If we got a saved ID back, redirect ideally... but since the user is already here,
            // we can just optionally swap out the URL using next/router without reload, OR just show it.
            // Easiest is to redirect to the saved report page to ensure sharability/refresh works.
            if (data.id) {
                router.push(`/ux-benchmark/${data.id}`);
            } else {
                // Fallback display if not saved (bypassed auth)
                setState((prev) => ({
                    ...prev,
                    status: "success",
                    result: data,
                    headToHeadSites: [data.sites[0].site.domain, data.sites[1]?.site?.domain || data.sites[0].site.domain]
                }));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setSelectedDomain(data.sites.find((s: any) => s.site.isOwn)?.site.domain || data.sites[0].site.domain);
            }

        } catch (err) {
            setState((prev) => ({
                ...prev,
                status: "error",
                error: err instanceof Error ? err.message : "An unexpected error occurred"
            }));
        }
    };

    if (state.status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
                <p className="text-white/50 mb-8">{state.error}</p>
                <button
                    onClick={() => setState(prev => ({ ...prev, status: "idle", error: null }))}
                    className="px-6 py-3 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (state.status === "loading") {
        // Determine roughly how many sites are being processed based on form max (we don't have form state lifted here unless we refactor, but it's okay)
        return <BenchmarkLoading step={state.loadingStep} siteCount={3} />; // Default generic count for loader UI
    }

    // If idle, show form
    if (state.status === "idle" || !state.result) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Competitor UX Benchmark</h1>
                    <p className="text-white/50">
                        Compare your website&apos;s User Experience against your top competitors in real-time.
                    </p>
                </div>
                <BenchmarkInput onSubmit={handleRunBenchmark} isLoading={false} userPlan={userPlan} />
            </div>
        );
    }

    // --- Success State (if not redirecting to /benchmark/[id]) ---
    const { result } = state;
    const ownSiteLabel = result.sites.find((s) => s.site.isOwn)?.site.domain || "Your Site";
    const competitorLabels = result.sites.filter((s) => !s.site.isOwn).map((s) => s.site.domain);
    const selectedAnalysis = result.sites.find(s => s.site.domain === selectedDomain) || result.sites[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="w-8 h-8 text-primary-400" />
                        Competitive UX Benchmark
                    </h1>
                    <p className="text-white/50">
                        Analysis complete for {result.sites.length} domains. Last updated {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <ExportReport result={result} />
            </div>

            {/* Strategic Summary (Top) */}
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

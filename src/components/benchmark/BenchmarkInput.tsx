"use client";

import React, { useState } from "react";
import { X, Search, Globe, ChevronDown, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";
import type { BenchmarkInputForm } from "@/types";

interface BenchmarkInputProps {
    onSubmit: (form: BenchmarkInputForm) => void;
    isLoading: boolean;
    userPlan: "free" | "pro" | "enterprise";
}

const MAX_COMPETITORS = {
    free: 1,
    pro: 3,
    enterprise: 10,
};

const INDUSTRIES = [
    "SaaS / Tech", "E-commerce", "Healthcare", "Finance",
    "Education", "Marketing / Agency", "Media / Publishing", "Other"
];

const GOALS = [
    "Increase Signups", "Reduce Churn", "Improve Conversion",
    "Accessibility Compliance", "General UX Audit", "Other"
];

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function BenchmarkInput({ onSubmit, isLoading, userPlan }: BenchmarkInputProps) {
    const [ownUrl, setOwnUrl] = useState("");
    const [ownLabel, setOwnLabel] = useState("");
    const [competitors, setCompetitors] = useState<{ id: string; url: string; label: string }[]>([
        { id: "1", url: "", label: "" },
    ]);
    const [industry, setIndustry] = useState(INDUSTRIES[0]);
    const [primaryGoal, setPrimaryGoal] = useState(GOALS[0]);
    const [showOptional, setShowOptional] = useState(false);
    const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

    const maxAllowed = MAX_COMPETITORS[userPlan] || 1;

    const handleUrlBlur = (id: string, url: string, isOwn: boolean) => {
        if (!url) {
            setUrlErrors((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            return;
        }

        // Auto-prepend https:// if missing
        let parsedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            parsedUrl = `https://${url}`;
            if (isOwn) setOwnUrl(parsedUrl);
            else {
                setCompetitors((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, url: parsedUrl } : c))
                );
            }
        }

        if (!isValidUrl(parsedUrl)) {
            setUrlErrors((prev) => ({ ...prev, [id]: "Invalid URL format" }));
        } else {
            setUrlErrors((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    const getFavicon = (url: string) => {
        if (!isValidUrl(url)) return null;
        try {
            const u = new URL(url);
            const domain = u.hostname.replace("www.", "");
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        } catch {
            return null;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        if (!ownUrl || !isValidUrl(ownUrl)) {
            setUrlErrors((prev) => ({ ...prev, own: "Valid URL is required" }));
            return;
        }

        const validCompetitors = competitors.filter(c => c.url.trim() !== "");
        let hasError = false;

        validCompetitors.forEach((c) => {
            if (!isValidUrl(c.url)) {
                setUrlErrors((prev) => ({ ...prev, [c.id]: "Invalid URL" }));
                hasError = true;
            }
        });

        if (hasError) return;

        if (validCompetitors.length === 0) {
            setUrlErrors((prev) => ({ ...prev, [competitors[0].id]: "Add at least 1 competitor" }));
            return;
        }

        onSubmit({
            ownUrl,
            ownLabel: ownLabel || "My Site",
            competitors: validCompetitors.map(c => ({
                url: c.url,
                label: c.label || "Competitor"
            })).slice(0, maxAllowed),
            industry,
            primaryGoal,
        });
    };

    return (
        <div className="glass-strong p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto mt-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    ⚔️ Competitor UX Benchmark
                </h2>
                <p className="text-white/50 mt-1">
                    See exactly how your UX stacks up against your biggest competitors.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Your Site Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                        Your Website
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5">Label (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. My Landing Page"
                                    value={ownLabel}
                                    onChange={(e) => setOwnLabel(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5">URL <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        placeholder="https://your-site.com"
                                        value={ownUrl}
                                        onChange={(e) => setOwnUrl(e.target.value)}
                                        onBlur={(e) => handleUrlBlur("own", e.target.value, true)}
                                        className={`w-full bg-black/20 border ${urlErrors.own ? 'border-red-500/50' : 'border-white/10'} rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50`}
                                        disabled={isLoading}
                                    />
                                    {ownUrl && !urlErrors.own && isValidUrl(ownUrl) && (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={getFavicon(ownUrl)!}
                                            alt=""
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white text-[8px]"
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                    )}
                                </div>
                                {urlErrors.own && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {urlErrors.own}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competitors Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                            Competitors
                        </h3>
                        <span className="text-xs text-white/40">
                            {competitors.length} of {maxAllowed} allowed on {userPlan} plan
                        </span>
                    </div>

                    <div className="space-y-3">
                        {competitors.map((comp, index) => (
                            <div key={comp.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group transition-all">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder={`Competitor ${index + 1} Label (Optional)`}
                                            value={comp.label}
                                            onChange={(e) => setCompetitors(prev => prev.map(c => c.id === comp.id ? { ...c, label: e.target.value } : c))}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                type="text"
                                                placeholder="https://competitor.com"
                                                value={comp.url}
                                                onChange={(e) => setCompetitors(prev => prev.map(c => c.id === comp.id ? { ...c, url: e.target.value } : c))}
                                                onBlur={(e) => handleUrlBlur(comp.id, e.target.value, false)}
                                                className={`w-full bg-black/20 border ${urlErrors[comp.id] ? 'border-red-500/50' : 'border-white/10'} rounded-lg pl-10 pr-10 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50`}
                                                disabled={isLoading}
                                            />
                                            {comp.url && !urlErrors[comp.id] && isValidUrl(comp.url) && (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    src={getFavicon(comp.url)!}
                                                    alt=""
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white text-[8px]"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                />
                                            )}
                                        </div>
                                        {urlErrors[comp.id] && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {urlErrors[comp.id]}</p>}
                                    </div>
                                </div>
                                {competitors.length > 1 && !isLoading && (
                                    <button
                                        type="button"
                                        onClick={() => setCompetitors(prev => prev.filter(c => c.id !== comp.id))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {competitors.length < maxAllowed ? (
                        <button
                            type="button"
                            onClick={() => setCompetitors(prev => [...prev, { id: Math.random().toString(), url: "", label: "" }])}
                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                            disabled={isLoading}
                        >
                            + Add Competitor
                        </button>
                    ) : (
                        userPlan === "free" && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex justify-between items-center mt-2">
                                <span className="text-sm text-amber-200/80">Upgrade to Pro to benchmark up to 3 competitors at once.</span>
                                <a href="/billing" className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1">Upgrade <ArrowRight className="w-3 h-3" /></a>
                            </div>
                        )
                    )}
                </div>

                {/* Optional Context */}
                <div className="pt-2 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => setShowOptional(!showOptional)}
                        className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        {showOptional ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        Optional Context
                    </button>

                    {showOptional && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5">Industry</label>
                                <select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
                                    disabled={isLoading}
                                >
                                    {INDUSTRIES.map(ind => <option key={ind} value={ind} className="bg-surface-800">{ind}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5">Primary Goal</label>
                                <select
                                    value={primaryGoal}
                                    onChange={(e) => setPrimaryGoal(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
                                    disabled={isLoading}
                                >
                                    {GOALS.map(g => <option key={g} value={g} className="bg-surface-800">{g}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 gradient-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--primary-500),0.3)]"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5 animate-pulse" />
                            <span>Initializing Analysis...</span>
                        </div>
                    ) : (
                        <>
                            <span>⚔️ Run Benchmark Analysis</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

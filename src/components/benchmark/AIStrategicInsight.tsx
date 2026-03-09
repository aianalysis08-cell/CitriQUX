"use client";

import React, { useState } from "react";
import type { AIStrategicInsight } from "@/types";
import { CheckCircle2, XCircle, Target, Rocket, Copy, Waves, Check } from "lucide-react";

interface AIStrategicInsightProps {
    insight: AIStrategicInsight;
    ownSiteLabel: string;
    competitorLabels: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AIStrategicInsight({ insight, ownSiteLabel, competitorLabels }: AIStrategicInsightProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = `
UX STRATEGIC INSIGHT for ${ownSiteLabel}

POSITIONING:
${insight.positioningStatement}

COMPETITIVE ADVANTAGES:
${insight.competitiveAdvantages.map(a => `- ${a}`).join('\n')}

CRITICAL GAPS:
${insight.criticalGaps.map(g => `- ${g}`).join('\n')}

30-DAY ATTACK PLAN:
Week 1-2: ${insight.thirtyDayPlan.week1_2}
Week 3: ${insight.thirtyDayPlan.week3}
Week 4: ${insight.thirtyDayPlan.week4}

WIN PROBABILITY:
${insight.winProbability.description}
${insight.winProbability.details.map(d => `- ${d}`).join('\n')}

MARKET OPENING:
${insight.marketOpening}
    `.trim();

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-strong p-8 rounded-3xl border border-white/10 mt-12 mb-12 shadow-2xl relative overflow-hidden group">
            {/* Decorative gradient background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        🤖 AI Strategic Analysis
                    </h2>
                    <p className="text-white/50 text-sm mt-1">Powered by GPT-4o Comparative Intelligence</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Report"}
                </button>
            </div>

            <div className="space-y-8 relative z-10">

                {/* Positioning */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary-400" />
                        Current Positioning
                    </h3>
                    <p className="text-lg text-white font-medium leading-relaxed">
                        &quot;{insight.positioningStatement}&quot;
                    </p>
                </div>

                {/* Advantages & Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 hover:bg-green-500/10 transition-colors">
                        <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Your Competitive Advantages
                        </h3>
                        <ul className="space-y-3">
                            {insight.competitiveAdvantages.map((adv, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 mt-2" />
                                    <span className="text-sm text-white/90 leading-relaxed font-medium">{adv}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 hover:bg-red-500/10 transition-colors">
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Critical Gaps to Close
                        </h3>
                        <ul className="space-y-3">
                            {insight.criticalGaps.map((gap, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                                    <span className="text-sm text-white/90 leading-relaxed font-medium">{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 30 Day Plan */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-amber-400" />
                        30-Day Attack Plan
                    </h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-500 before:via-accent-500 before:to-transparent">

                        {/* Week 1-2 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-surface-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-gradient-to-br from-primary-600 to-primary-400 text-white font-bold text-xs">
                                W1-2
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-white/10 shadow-lg">
                                <p className="text-sm text-white/90 font-medium">{insight.thirtyDayPlan.week1_2}</p>
                            </div>
                        </div>

                        {/* Week 3 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-surface-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-gradient-to-br from-accent-600 to-accent-400 text-white font-bold text-xs">
                                W3
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-white/10 shadow-lg">
                                <p className="text-sm text-white/90 font-medium">{insight.thirtyDayPlan.week3}</p>
                            </div>
                        </div>

                        {/* Week 4 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-surface-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-gradient-to-br from-amber-600 to-amber-400 text-white font-bold text-xs">
                                W4
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-white/10 shadow-lg">
                                <p className="text-sm text-white/90 font-medium">{insight.thirtyDayPlan.week4}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Win Probability & Market Opening */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-white/50" />
                            Path to Victory
                        </h3>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 font-bold text-lg mb-4">
                            {insight.winProbability.description}
                        </p>
                        <ul className="space-y-2">
                            {insight.winProbability.details.map((detail, idx) => (
                                <li key={idx} className="text-xs text-white/60 flex items-start gap-2">
                                    <span className="mt-1">•</span> {detail}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 blur-[1px]">
                            <Waves className="w-32 h-32" />
                        </div>
                        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                            <Waves className="w-4 h-4" />
                            Unique Market Opening
                        </h3>
                        <p className="text-white text-sm leading-relaxed font-semibold relative z-10">
                            &quot;{insight.marketOpening}&quot;
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

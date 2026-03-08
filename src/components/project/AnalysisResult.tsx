"use client";

import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    ArrowLeft,
    Share2,
    Download,
    Zap,
    Sparkles,
    Target
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import Image from "next/image";

interface FeedbackItem {
    id: string;
    category: string;
    severity: "low" | "medium" | "high";
    message: string;
    suggestion: string;
}

interface AnalysisResultProps {
    score: number;
    image_url: string;
    summary: string;
    feedback: FeedbackItem[];
    onBack?: () => void;
}

export function AnalysisResult({ score, image_url, summary, feedback, onBack }: AnalysisResultProps) {
    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case "high": return "text-error bg-error/10 border-error/20";
            case "medium": return "text-warning bg-warning/10 border-warning/20";
            default: return "text-success bg-success/10 border-success/20";
        }
    };

    const getSeverityIcon = (sev: string) => {
        switch (sev) {
            case "high": return <AlertCircle className="w-4 h-4" />;
            case "medium": return <AlertTriangle className="w-4 h-4" />;
            default: return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-all text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project
                </button>
                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl glass border-white/10 text-white/70 hover:text-white transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Image and Summary */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden relative group">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-3 h-3 text-primary-400" />
                                Analyzed Interface
                            </span>
                            <span className="text-[10px] font-bold text-white/30">ID: CRQ-82910</span>
                        </div>
                        <div className="aspect-video relative bg-surface-900 flex items-center justify-center p-8 overflow-hidden">
                            <Image
                                src={image_url}
                                fill
                                style={{ objectFit: 'contain' }}
                                className="rounded-xl shadow-2xl transition-transform group-hover:scale-[1.01] duration-500"
                                alt="Analyzed Design"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="text-primary-400 w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Executive Summary</h3>
                        <p className="text-white/60 leading-relaxed text-sm lg:text-base">
                            {summary}
                        </p>
                    </div>
                </div>

                {/* Right Column: Score and Feedback */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Score Card */}
                    <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                        <div className="relative mb-6">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    className="text-white/5"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <motion.circle
                                    initial={{ strokeDashoffset: 364 }}
                                    animate={{ strokeDashoffset: 364 - (364 * score) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="text-primary-500"
                                    strokeWidth="8"
                                    strokeDasharray="364"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white">{score}</span>
                                <span className="text-[10px] font-bold text-white/30 uppercase">UX Score</span>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Status: {score > 80 ? "Excellent" : score > 60 ? "Good" : "Needs Work"}</h4>
                        <p className="text-white/40 text-[10px] font-medium max-w-[200px]">
                            This score is calculated based on 8 core UX heuristics.
                        </p>
                    </div>

                    {/* Feedback Items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-4 h-4 text-accent-400" />
                                Actionable Insights
                            </h3>
                            <span className="text-[10px] font-bold text-white/30">{feedback.length} items</span>
                        </div>

                        {feedback.map((item, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={item.id}
                                className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={cn(
                                        "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1.5",
                                        getSeverityColor(item.severity)
                                    )}>
                                        {getSeverityIcon(item.severity)}
                                        {item.severity}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/30">{item.category}</span>
                                </div>
                                <h4 className="text-sm font-bold text-white/90 mb-2 leading-tight">{item.message}</h4>
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:bg-primary-500/5 group-hover:border-primary-500/20 transition-all">
                                    <p className="text-[11px] text-white/50 leading-relaxed italic">
                                        <span className="text-primary-400 font-bold not-italic mr-1">Fix:</span>
                                        {item.suggestion}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

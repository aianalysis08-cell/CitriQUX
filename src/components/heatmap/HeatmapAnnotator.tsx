"use client";

import React, { useState, useRef } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import type {
    HeatmapState,
    AnalysisReport,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    AnnotationSeverity,
    AnnotationCategory,
} from "@/types";
import { HeatmapSkeleton } from "./HeatmapSkeleton";
import { HeatmapLegend } from "./HeatmapLegend";
import { HeatmapControls } from "./HeatmapControls";
import { AnnotationBox } from "./AnnotationBox";
import { SEVERITY_COLORS } from "./AnnotationTooltip";

interface HeatmapAnnotatorProps {
    imageUrl: string | null;
    analysisResult: AnalysisReport | null;
    onReset?: () => void;
}

export function HeatmapAnnotator({
    imageUrl,
    analysisResult,
    onReset,
}: HeatmapAnnotatorProps) {
    const [heatmapState, setHeatmapState] = useState<HeatmapState>({
        status: "idle",
        result: null,
        error: null,
        activeAnnotationId: null,
        visibleSeverities: ["critical", "warning", "suggestion"],
        visibleCategories: [],
    });

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [naturalSize, setNaturalSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const runHeatmapAnalysis = async () => {
        if (!imageUrl) return;

        setHeatmapState((prev) => ({ ...prev, status: "loading", error: null }));

        try {
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30s timeout

            // Ensure we have natural dimensions
            const imgWidth = imageRef.current?.naturalWidth || naturalSize?.width;
            const imgHeight = imageRef.current?.naturalHeight || naturalSize?.height;

            const response = await fetch("/api/heatmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl,
                    imageWidth: imgWidth,
                    imageHeight: imgHeight,
                    analysisContext: analysisResult
                        ? {
                            overallScore: analysisResult.ux_score,
                            categories: analysisResult.scores,
                        }
                        : undefined,
                }),
                signal: abortController.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate heatmap");
            }

            // Initialize all unique categories found to visible
            const allCategories = Array.from(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new Set(data.annotations.map((a: any) => a.category))
            ) as AnnotationCategory[];

            setHeatmapState({
                status: "success",
                result: data,
                error: null,
                activeAnnotationId: null,
                visibleSeverities: ["critical", "warning", "suggestion"],
                visibleCategories: allCategories,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.name === "AbortError") {
                setHeatmapState((prev) => ({
                    ...prev,
                    status: "error",
                    error: "Analysis timed out after 30 seconds. Please try again.",
                }));
            } else {
                setHeatmapState((prev) => ({
                    ...prev,
                    status: "error",
                    error: err.message || "An unexpected error occurred.",
                }));
            }
        }
    };

    const handleExportJson = () => {
        if (!heatmapState.result) return;
        const blob = new Blob([JSON.stringify(heatmapState.result, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ux-heatmap-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportMarkdown = () => {
        if (!heatmapState.result) return;
        const { summary, annotations } = heatmapState.result;

        let md = `# UX Issue Heatmap Report\nGenerated: ${new Date().toLocaleString()}\n\n`;
        md += `## Summary\n`;
        md += `- 🔴 Critical: ${summary.critical}\n`;
        md += `- 🟡 Warning: ${summary.warning}\n`;
        md += `- 🔵 Suggestions: ${summary.suggestion}\n\n`;
        md += `## Issues Found\n\n`;

        annotations.forEach((ann, i) => {
            md += `### ${i + 1}. ${ann.label} [${ann.severity.toUpperCase()}]\n`;
            md += `**Category:** ${ann.category}\n`;
            md += `**Location:** x:${ann.x.toFixed(1)}% y:${ann.y.toFixed(1)}%\n\n`;
            md += `**Issue:** ${ann.detail}\n\n`;
            md += `**Fix:** ${ann.recommendation}\n\n`;
            if (ann.wcagRule || ann.heuristicRule) {
                md += `**Rule:** ${ann.wcagRule ?? ann.heuristicRule}\n\n`;
            }
            md += `---\n\n`;
        });

        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ux-heatmap-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ---------------------------------------------------------------------------
    // RENDER STATES
    // ---------------------------------------------------------------------------

    // STATE A: No Image Uploaded
    if (!imageUrl) {
        return (
            <div className="glass-strong p-8 rounded-2xl border border-white/10 mt-8 opacity-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-white/50" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        Upload an image to unlock
                    </h3>
                    <p className="text-white/50 text-center max-w-sm">
                        Upload a design screenshot above to enable the AI UX Annotator and
                        pinpoint exact issues visually.
                    </p>
                </div>

                <h2 className="text-2xl font-semibold text-white mb-4">
                    🎯 UX Issue Heatmap
                </h2>
                <HeatmapSkeleton />
            </div>
        );
    }

    // STATE B / LOADING / ERROR: Image uploaded but analysis not successful yet
    if (heatmapState.status !== "success" || !heatmapState.result) {
        return (
            <div className="glass-strong p-8 rounded-2xl border border-white/10 mt-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                            🎯 UX Issue Heatmap Annotator
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                Beta
                            </span>
                        </h2>
                        <p className="text-white/50 mt-1">
                            AI will pinpoint exact UX problems directly on your design
                        </p>
                    </div>
                </div>

                {heatmapState.status === "loading" ? (
                    <HeatmapSkeleton />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white/5 p-6 rounded-xl border border-white/10">
                        {/* Hidden image just to get natural size before starting */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imageRef}
                            src={imageUrl}
                            alt="Design screenshot hidden preview"
                            className="hidden"
                            onLoad={(e) => {
                                setNaturalSize({
                                    width: e.currentTarget.naturalWidth,
                                    height: e.currentTarget.naturalHeight,
                                });
                            }}
                        />

                        <div
                            className="aspect-video rounded-lg border border-white/10 bg-black/50 flex items-center justify-center relative overflow-hidden"
                            style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "top center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            <p className="text-white/50 text-sm z-10 font-medium">
                                Ready for Analysis
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-white mb-4">
                                What will be analyzed:
                            </h3>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "Contrast ratio failures (WCAG AA)",
                                    "Touch target sizes and spacing",
                                    "Navigation density and overload",
                                    "Visual hierarchy issues",
                                    "CTA visibility & placement",
                                    "Typography consistency",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/70">
                                        <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {heatmapState.error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-6">
                                    <p className="text-red-400 text-sm">{heatmapState.error}</p>
                                </div>
                            )}

                            <button
                                onClick={runHeatmapAnalysis}
                                className="w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 gradient-primary text-white hover:opacity-90 cursor-pointer shadow-[0_0_20px_rgba(var(--primary-500),0.3)]"
                            >
                                <span>⚡ Generate Heatmap Annotations</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // STATE C: Success / Annotated View
    const { result, visibleSeverities, visibleCategories, activeAnnotationId } =
        heatmapState;

    const allCategories = Array.from(
        new Set(result.annotations.map((a) => a.category))
    ) as AnnotationCategory[];

    return (
        <div className="glass-strong p-8 rounded-2xl border border-white/10 mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-white">
                    🎯 UX Issue Heatmap
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={runHeatmapAnalysis}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors flex items-center gap-2"
                    >
                        <Loader2 className="w-4 h-4 hidden" />
                        Regenerate
                    </button>
                    {onReset && (
                        <button
                            onClick={() => {
                                setHeatmapState({
                                    status: "idle",
                                    result: null,
                                    error: null,
                                    activeAnnotationId: null,
                                    visibleSeverities: ["critical", "warning", "suggestion"],
                                    visibleCategories: [],
                                });
                                onReset();
                            }}
                            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm transition-colors"
                        >
                            Reset Analysis
                        </button>
                    )}
                    <button
                        onClick={handleExportJson}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={handleExportMarkdown}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                    >
                        Export MD
                    </button>
                </div>
            </div>

            <HeatmapLegend
                summary={result.summary}
                onFilterToggle={(sev) => {
                    setHeatmapState((prev) => ({
                        ...prev,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        visibleSeverities: prev.visibleSeverities.includes(sev as any)
                            ? prev.visibleSeverities.filter((s) => s !== sev)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : [...prev.visibleSeverities, sev as any],
                    }));
                }}
            />

            <HeatmapControls
                visibleSeverities={visibleSeverities}
                visibleCategories={visibleCategories}
                allCategories={allCategories}
                onSeverityToggle={(s) =>
                    setHeatmapState((prev) => ({
                        ...prev,
                        visibleSeverities: prev.visibleSeverities.includes(s)
                            ? prev.visibleSeverities.filter((x) => x !== s)
                            : [...prev.visibleSeverities, s],
                    }))
                }
                onCategoryToggle={(c) =>
                    setHeatmapState((prev) => ({
                        ...prev,
                        visibleCategories: prev.visibleCategories.includes(c)
                            ? prev.visibleCategories.filter((x) => x !== c)
                            : [...prev.visibleCategories, c],
                    }))
                }
                onSelectAll={() =>
                    setHeatmapState((prev) => ({
                        ...prev,
                        visibleSeverities: ["critical", "warning", "suggestion"],
                        visibleCategories: allCategories,
                    }))
                }
                onClearAll={() =>
                    setHeatmapState((prev) => ({
                        ...prev,
                        visibleSeverities: [],
                        visibleCategories: [],
                    }))
                }
            />

            {/* 
        ========================================================================
        CRITICAL IMPLEMENTATION: The Annotated Image Container 
        ========================================================================
      */}
            <div
                ref={containerRef}
                style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                    lineHeight: 0,
                    borderRadius: "10px",
                    overflow: "hidden",
                    userSelect: "none",
                    border: "1px solid var(--border, rgba(255,255,255,0.1))",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Annotated UI Design"
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: "10px",
                    }}
                    draggable={false}
                />

                {result.annotations.map((annotation, index) => {
                    const isFiltered =
                        !visibleSeverities.includes(annotation.severity) ||
                        !visibleCategories.includes(annotation.category);

                    return (
                        <AnnotationBox
                            key={annotation.id}
                            annotation={annotation}
                            index={index + 1}
                            isActive={activeAnnotationId === annotation.id}
                            isFiltered={isFiltered}
                            onHover={(id) =>
                                setHeatmapState((prev) => ({ ...prev, activeAnnotationId: id }))
                            }
                            onClick={(id) => {
                                setHeatmapState((prev) => ({
                                    ...prev,
                                    activeAnnotationId: id,
                                }));
                                document
                                    .getElementById(`annotation-item-${id}`)
                                    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                            }}
                        />
                    );
                })}
            </div>

            {/* 
        ========================================================================
        Annotation List Detail View
        ========================================================================
      */}
            <div className="mt-8 space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {result.annotations.map((annotation, index) => {
                    const isFiltered =
                        !visibleSeverities.includes(annotation.severity) ||
                        !visibleCategories.includes(annotation.category);
                    if (isFiltered) return null;

                    const isActive = activeAnnotationId === annotation.id;
                    const colors = SEVERITY_COLORS[annotation.severity];

                    return (
                        <div
                            id={`annotation-item-${annotation.id}`}
                            key={annotation.id}
                            onClick={() =>
                                setHeatmapState((prev) => ({
                                    ...prev,
                                    activeAnnotationId: annotation.id,
                                }))
                            }
                            onMouseEnter={() =>
                                setHeatmapState((prev) => ({
                                    ...prev,
                                    activeAnnotationId: annotation.id,
                                }))
                            }
                            onMouseLeave={() =>
                                setHeatmapState((prev) => ({
                                    ...prev,
                                    activeAnnotationId: null,
                                }))
                            }
                            style={{
                                display: "flex",
                                gap: "12px",
                                padding: "14px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                backgroundColor: isActive ? `${colors.border}15` : "var(--bg-card, rgba(255,255,255,0.02))",
                                border: `1px solid ${isActive ? colors.border : "var(--border, rgba(255,255,255,0.1))"
                                    }`,
                                transition: "all 0.2s ease",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "4px",
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        backgroundColor: colors.badge,
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <span
                                    style={{
                                        fontSize: "9px",
                                        textTransform: "uppercase",
                                        fontWeight: "700",
                                        color: colors.badge,
                                    }}
                                >
                                    {annotation.severity}
                                </span>
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            color: "var(--text-primary, #ffffff)",
                                        }}
                                    >
                                        {annotation.label}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            color: "var(--text-muted, #8892a4)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {annotation.category}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        lineHeight: "1.5",
                                        color: "var(--text-muted, #8892a4)",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {annotation.detail}
                                </p>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        padding: "6px 10px",
                                        backgroundColor: "rgba(0, 229, 255, 0.05)",
                                        border: "1px solid rgba(0, 229, 255, 0.1)",
                                        borderRadius: "6px",
                                        color: "var(--text-primary, #ffffff)",
                                    }}
                                >
                                    <strong style={{ color: "var(--accent-cyan, #00e5ff)" }}>
                                        Fix:{" "}
                                    </strong>
                                    {annotation.recommendation}
                                </div>
                                {(annotation.wcagRule || annotation.heuristicRule) && (
                                    <p
                                        style={{
                                            fontSize: "10px",
                                            color: "var(--text-muted, #8892a4)",
                                            marginTop: "6px",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        📋 {annotation.wcagRule ?? annotation.heuristicRule}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

"use client";

import React from "react";
import type { HeatmapResult } from "@/types";

interface HeatmapLegendProps {
    summary: HeatmapResult["summary"];
    onFilterToggle?: (severity: string) => void;
}

export function HeatmapLegend({ summary, onFilterToggle }: HeatmapLegendProps) {
    return (
        <div className="flex items-center gap-4 flex-wrap">
            {[
                {
                    severity: "critical",
                    label: "Critical",
                    count: summary.critical,
                    color: "#ef4444",
                },
                {
                    severity: "warning",
                    label: "Warning",
                    count: summary.warning,
                    color: "#f59e0b",
                },
                {
                    severity: "suggestion",
                    label: "Suggestions",
                    count: summary.suggestion,
                    color: "#3b82f6",
                },
            ].map(({ severity, label, count, color }) => (
                <div
                    key={severity}
                    onClick={() => onFilterToggle?.(severity)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}40`,
                        cursor: "pointer",
                    }}
                >
                    <div
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: color,
                        }}
                    />
                    <span style={{ fontSize: "13px", fontWeight: "700", color }}>
                        {count}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted, #8892a4)" }}>
                        {label}
                    </span>
                </div>
            ))}
            <span
                style={{
                    fontSize: "12px",
                    color: "var(--text-muted, #8892a4)",
                    marginLeft: "auto",
                }}
            >
                {summary.total} issues found
            </span>
        </div>
    );
}

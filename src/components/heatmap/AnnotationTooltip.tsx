"use client";

import React from "react";
import type { HeatmapAnnotation } from "@/types";

export const SEVERITY_COLORS = {
    critical: {
        border: "#ef4444", // red-500
        bg: "rgba(239, 68, 68, 0.15)",
        bgActive: "rgba(239, 68, 68, 0.30)",
        badge: "#ef4444",
        text: "#fecaca",
    },
    warning: {
        border: "#f59e0b", // amber-500
        bg: "rgba(245, 158, 11, 0.15)",
        bgActive: "rgba(245, 158, 11, 0.30)",
        badge: "#f59e0b",
        text: "#fde68a",
    },
    suggestion: {
        border: "#3b82f6", // blue-500
        bg: "rgba(59, 130, 246, 0.15)",
        bgActive: "rgba(59, 130, 246, 0.30)",
        badge: "#3b82f6",
        text: "#bfdbfe",
    },
};

interface AnnotationTooltipProps {
    annotation: HeatmapAnnotation;
    index: number;
}

export function AnnotationTooltip({
    annotation,
    index,
}: AnnotationTooltipProps) {
    const isLowerHalf = annotation.y > 50;
    const isRightSide = annotation.x > 60;
    const colors = SEVERITY_COLORS[annotation.severity];

    return (
        <div
            style={{
                position: "absolute",
                [isLowerHalf ? "bottom" : "top"]: "calc(100% + 6px)",
                [isRightSide ? "right" : "left"]: 0,
                width: "280px",
                backgroundColor: "var(--bg-primary, #0a0f1e)",
                border: `1px solid ${colors.border}`,
                borderRadius: "10px",
                padding: "12px",
                zIndex: 50,
                boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px ${colors.border}20`,
                pointerEvents: "none",
            }}
        >
            {/* Header row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                }}
            >
                {/* Numbered badge */}
                <span
                    style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: colors.badge,
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {index}
                </span>

                {/* Severity badge */}
                <span
                    style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: colors.badge,
                        backgroundColor: `${colors.badge}20`,
                        padding: "2px 6px",
                        borderRadius: "4px",
                    }}
                >
                    {annotation.severity}
                </span>

                {/* Category tag */}
                <span
                    style={{
                        fontSize: "10px",
                        color: "var(--text-muted, #8892a4)",
                        marginLeft: "auto",
                    }}
                >
                    {annotation.category}
                </span>
            </div>

            {/* Label */}
            <p
                style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "var(--text-primary, #f0f4ff)",
                    marginBottom: "6px",
                }}
            >
                {annotation.label}
            </p>

            {/* Detail */}
            <p
                style={{
                    fontSize: "11px",
                    lineHeight: "1.5",
                    color: "var(--text-muted, #8892a4)",
                    marginBottom: "8px",
                }}
            >
                {annotation.detail}
            </p>

            {/* Fix recommendation */}
            <div
                style={{
                    backgroundColor: "rgba(0, 229, 255, 0.06)",
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    borderRadius: "6px",
                    padding: "8px",
                }}
            >
                <p
                    style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "var(--accent-cyan, #00e5ff)",
                        marginBottom: "3px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    Fix
                </p>
                <p
                    style={{
                        fontSize: "11px",
                        lineHeight: "1.4",
                        color: "var(--text-primary, #f0f4ff)",
                    }}
                >
                    {annotation.recommendation}
                </p>
            </div>

            {/* WCAG or Heuristic rule tag if present */}
            {(annotation.wcagRule || annotation.heuristicRule) && (
                <p
                    style={{
                        fontSize: "10px",
                        color: "var(--text-muted, #8892a4)",
                        marginTop: "8px",
                        fontStyle: "italic",
                    }}
                >
                    📋 {annotation.wcagRule ?? annotation.heuristicRule}
                </p>
            )}
        </div>
    );
}

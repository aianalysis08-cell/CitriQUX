"use client";

import React from "react";
import type { AnnotationSeverity, AnnotationCategory } from "@/types";
import { SEVERITY_COLORS } from "./AnnotationTooltip";

interface HeatmapControlsProps {
    visibleSeverities: AnnotationSeverity[];
    visibleCategories: AnnotationCategory[];
    allCategories: AnnotationCategory[];
    onSeverityToggle: (s: AnnotationSeverity) => void;
    onCategoryToggle: (c: AnnotationCategory) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

// A generic "All" or typed pill component
function FilterPill({
    active,
    label,
    color,
    onClick,
}: {
    active: boolean;
    label: string;
    color: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: active ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: active ? `${color}30` : "transparent",
                color: active ? color : "var(--text-muted, #8892a4)",
                border: `1px solid ${active ? color : "var(--border, #333)"}`,
            }}
        >
            {label}
        </button>
    );
}

export function HeatmapControls({
    visibleSeverities,
    visibleCategories,
    allCategories,
    onSeverityToggle,
    onCategoryToggle,
    onSelectAll,
    onClearAll,
}: HeatmapControlsProps) {
    const allSeveritiesActive = visibleSeverities.length === 3;
    const allCategoriesActive = visibleCategories.length === allCategories.length;

    return (
        <div className="flex flex-col gap-3 py-4 border-t border-b border-white/10 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm text-white/50 w-20">Severity:</span>
                <div className="flex items-center gap-2 flex-wrap">
                    <FilterPill
                        active={allSeveritiesActive && allCategoriesActive}
                        label="All Issues"
                        color="#ffffff"
                        onClick={allSeveritiesActive && allCategoriesActive ? onClearAll : onSelectAll}
                    />
                    <FilterPill
                        active={visibleSeverities.includes("critical")}
                        label="Critical"
                        color={SEVERITY_COLORS.critical.badge}
                        onClick={() => onSeverityToggle("critical")}
                    />
                    <FilterPill
                        active={visibleSeverities.includes("warning")}
                        label="Warning"
                        color={SEVERITY_COLORS.warning.badge}
                        onClick={() => onSeverityToggle("warning")}
                    />
                    <FilterPill
                        active={visibleSeverities.includes("suggestion")}
                        label="Suggestion"
                        color={SEVERITY_COLORS.suggestion.badge}
                        onClick={() => onSeverityToggle("suggestion")}
                    />
                </div>
            </div>

            {allCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="text-sm text-white/50 w-20">Category:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {allCategories.map((cat) => (
                            <FilterPill
                                key={cat}
                                active={visibleCategories.includes(cat)}
                                label={cat}
                                color="#00e5ff" // Use cyan for categories
                                onClick={() => onCategoryToggle(cat)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

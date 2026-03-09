"use client";

import React from "react";
import type { HeatmapAnnotation } from "@/types";
import { AnnotationTooltip, SEVERITY_COLORS } from "./AnnotationTooltip";

interface AnnotationBoxProps {
    annotation: HeatmapAnnotation;
    index: number;
    isActive: boolean;
    isFiltered: boolean;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
}

export function AnnotationBox({
    annotation,
    index,
    isActive,
    isFiltered,
    onHover,
    onClick,
}: AnnotationBoxProps) {
    const colors = SEVERITY_COLORS[annotation.severity];

    if (isFiltered) return null;

    return (
        <div
            style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`,
                position: "absolute",
                border: `2px solid ${colors.border}`,
                backgroundColor: isActive ? colors.bgActive : colors.bg,
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                zIndex: isActive ? 20 : 10,
                pointerEvents: "all",
                animation: isActive ? "heatmapPulse 1.5s ease infinite" : undefined,
            }}
            className="annotation-box-enter"
            onMouseEnter={() => onHover(annotation.id)}
            onMouseLeave={() => onHover(null)}
            onClick={(e) => {
                e.stopPropagation();
                onClick(annotation.id);
            }}
        >
            {/* Number badge — top left corner of box */}
            <div
                style={{
                    position: "absolute",
                    top: "-10px",
                    left: "-2px",
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
                    boxShadow: `0 0 0 2px rgba(0,0,0,0.5)`,
                }}
            >
                {index}
            </div>

            {/* Short label — only show if box is wide enough */}
            {annotation.width > 15 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "2px",
                        left: "4px",
                        fontSize: "10px",
                        color: colors.text,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "90%",
                        textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    }}
                >
                    {annotation.label}
                </div>
            )}

            {/* Tooltip — show when active */}
            {isActive && <AnnotationTooltip annotation={annotation} index={index} />}
        </div>
    );
}

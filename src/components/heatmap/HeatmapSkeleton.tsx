"use client";

import React from "react";

export function HeatmapSkeleton() {
    return (
        <div>
            {/* Fake summary bar shimmer */}
            <div className="flex gap-3 mb-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: "100px",
                            height: "32px",
                            borderRadius: "20px",
                            background:
                                "linear-gradient(90deg, var(--bg-card) 25%, rgba(255,255,255,0.06) 50%, var(--bg-card) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                        }}
                    />
                ))}
            </div>

            {/* Fake image area shimmer */}
            <div
                style={{
                    width: "100%",
                    paddingTop: "56.25%", // 16:9 aspect ratio placeholder
                    position: "relative",
                    borderRadius: "12px",
                    background:
                        "linear-gradient(90deg, var(--bg-card) 25%, rgba(255,255,255,0.06) 50%, var(--bg-card) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                }}
            >
                {/* Fake annotation boxes to suggest what's coming */}
                {[
                    [15, 20, 25, 8],
                    [45, 5, 30, 6],
                    [60, 55, 20, 10],
                    [10, 70, 40, 8],
                ].map(([x, y, w, h], i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${w}%`,
                            height: `${h}%`,
                            border: "2px solid rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            animation: `fadeInOut 2s ease ${i * 0.3}s infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Status text */}
            <div className="text-center mt-4">
                <p style={{ color: "var(--text-muted, #8892a4)", fontSize: "14px" }}>
                    🔍 AI is scanning your design for UX issues...
                </p>
                <p
                    style={{
                        color: "var(--text-muted, #8892a4)",
                        fontSize: "12px",
                        marginTop: "4px",
                    }}
                >
                    Checking contrast ratios, touch targets, hierarchy, and more
                </p>
            </div>
        </div>
    );
}

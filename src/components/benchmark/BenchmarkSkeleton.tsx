"use client";

import React from "react";

export function BenchmarkSkeleton() {
    return (
        <div className="animate-pulse space-y-8 mt-8">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-64 bg-white/5 rounded-lg mb-2" />
                    <div className="h-4 w-96 bg-white/5 rounded-lg" />
                </div>
                <div className="h-10 w-32 bg-white/5 rounded-xl border border-white/10" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-max">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 w-32 bg-white/5 rounded-lg" />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="glass p-8 rounded-3xl border border-white/10 h-[500px]">
                {/* Table skeleton */}
                <div className="space-y-4">
                    <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-4 items-center p-4">
                            <div className="h-10 w-10 bg-white/10 rounded-full shrink-0" />
                            <div className="h-6 w-32 bg-white/5 rounded" />
                            <div className="h-4 w-full bg-white/5 rounded-full mx-8" />
                            <div className="h-6 w-16 bg-white/5 rounded shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

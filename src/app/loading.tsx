import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-surface-950">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 rounded-full border border-primary-500/20 blur-sm glow-primary animate-pulse-slow"></div>
                    <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
                </div>
                <p className="text-sm font-medium text-white/50 tracking-widest uppercase animate-pulse">Loading ✨</p>
            </div>
        </div>
    );
}

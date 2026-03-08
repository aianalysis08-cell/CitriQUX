import React from "react";

export function AmbientBackground() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Top Left Bloom */}
            <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary-500 rounded-full blur-[150px] animate-bloom-1" />

            {/* Bottom Right Bloom */}
            <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-accent-500 rounded-full blur-[150px] animate-bloom-2" />

            {/* Center Subtle Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-surface-800 rounded-full blur-[120px] opacity-20" />
        </div>
    );
}

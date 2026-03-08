"use client";

import React from "react";
import { AnalysisResult } from "@/components/project/AnalysisResult";

const mockResult = {
    score: 84,
    image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
    summary: "The interface demonstrates strong visual hierarchy and clear call-to-action placement. Navigation is intuitive for mobile users, though some accessibility improvements are needed for text contrast in the footer and touch targets in the sub-menu.",
    feedback: [
        {
            id: "1",
            category: "Usability",
            severity: "medium" as const,
            message: "Navigation sub-menu targets are too close for mobile users.",
            suggestion: "Increase the internal padding of menu items to at least 44x44px to prevent accidental clicks.",
        },
        {
            id: "2",
            category: "Accessibility",
            severity: "high" as const,
            message: "Insufficient contrast ratio for primary button text.",
            suggestion: "Update the button background color to a darker shade of indigo (#4F46E5) or change text to black.",
        },
        {
            id: "3",
            category: "Visual Design",
            severity: "low" as const,
            message: "Inconsistent spacing between feature cards.",
            suggestion: "Ensure all grid items use a consistent 24px (1.5rem) gutter across all viewports.",
        },
        {
            id: "4",
            category: "Cognitive Load",
            severity: "medium" as const,
            message: "Hero section contains too many competing primary actions.",
            suggestion: "Choose one primary action ('Get Started') and make the secondary action ('See Examples') an outline button.",
        },
    ],
};

export default function AnalysisDetailsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <AnalysisResult
                {...mockResult}
                onBack={() => window.history.back()}
            />
        </div>
    );
}

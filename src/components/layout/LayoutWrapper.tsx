"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const aiToolRoutes = [
  "/ai-ux-copilot",
  "/ai-redesign-engine",
  "/heatmap-prediction",
  "/conversion-simulator",
  "/ux-benchmark",
  "/pattern-recognition",
  "/design-system-generator",
  "/behavior-analytics",
  "/prd-generator",
  "/developer-mode"
];

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAIToolPage = aiToolRoutes.some(route => pathname === route);

  // Apply this dashboard layout to all AI Tool pages AND the main marketing page
  // The marketing page acts as the entry to the application.
  const isDashboardLayout = isAIToolPage || pathname === '/';

  if (isDashboardLayout) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-surface-950 text-white selection:bg-primary-500/30">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Scrollable Main Content Area */}
        {/* On desktop we add left margin to account for the fixed sidebar width (64 * 0.25rem = 16rem). */}
        <div className={cn(
          "flex-1 flex flex-col h-screen overflow-y-auto relative transition-all duration-300",
          "lg:ml-[16rem]"
        )}>
          {children}
        </div>
      </div>
    );
  }

  // Dashboard uses a different layout (Sidebar.tsx and Topbar.tsx) 
  // located in app/(dashboard)/layout.tsx
  return <>{children}</>;
}

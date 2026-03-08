"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { LeftPanel } from "@/components/layout/LeftPanel";
import { Navbar } from "@/components/layout/Navbar";

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
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  
  const handleCollapseToggle = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };
  
  if (isAIToolPage) {
    return (
      <div className={`min-h-screen transition-all duration-300 ${isLeftPanelOpen ? 'lg:ml-80' : ''}`}>
        <LeftPanel 
          isOpen={isLeftPanelOpen} 
          isCollapsed={isLeftPanelCollapsed}
          onToggle={() => setIsLeftPanelOpen(!isLeftPanelOpen)} 
          onCollapseToggle={handleCollapseToggle}
        />
        <Navbar />
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
}

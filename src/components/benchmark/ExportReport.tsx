"use client";

import React, { useState } from "react";
import { Download, FileDown, Loader2 } from "lucide-react";
import type { BenchmarkResult } from "@/types";

interface ExportReportProps {
    result: BenchmarkResult | null;
}

export function ExportReport({ result }: ExportReportProps) {
    const [exporting, setExporting] = useState<"json" | "markdown" | null>(null);

    if (!result) return null;

    const handleExportJSON = async () => {
        setExporting("json");
        try {
            const dataStr = JSON.stringify(result, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ux-benchmark-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } finally {
            setTimeout(() => setExporting(null), 1000);
        }
    };

    const handleExportMarkdown = async () => {
        setExporting("markdown");
        try {
            let md = `# Competitor UX Benchmark Report\nDate: ${new Date(result.createdAt).toLocaleDateString()}\n\n`;

            md += `## 🏆 AI Strategic Insight\n${result.aiInsight.positioningStatement}\n\n`;
            md += `### Competitive Advantages\n${result.aiInsight.competitiveAdvantages.map(a => `- ${a}`).join('\n')}\n\n`;
            md += `### Critical Gaps\n${result.aiInsight.criticalGaps.map(g => `- ${g}`).join('\n')}\n\n`;
            md += `### Unique Market Opening\n${result.aiInsight.marketOpening}\n\n`;
            md += `### 30-Day Plan\n- Week 1-2: ${result.aiInsight.thirtyDayPlan.week1_2}\n- Week 3: ${result.aiInsight.thirtyDayPlan.week3}\n- Week 4: ${result.aiInsight.thirtyDayPlan.week4}\n\n`;

            md += `## 📊 Leaderboard\n| Rank | Website | Overall Score |\n|---|---|---|\n`;
            result.sites.forEach(s => {
                md += `| ${s.rank} | ${s.site.domain} ${s.site.isOwn ? '(You)' : ''} | ${s.scores.overall.toFixed(1)} |\n`;
            });
            md += `\n`;

            md += `## 🌊 Blue Ocean Opportunities\n`;
            result.opportunities.forEach(o => {
                md += `### ${o.title} (Impact: ${o.estimatedImpact})\n${o.description}\n*Market Average Score: ${o.averageScore}/10*\n\n`;
            });

            const blob = new Blob([md], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ux-strategic-report-${new Date().toISOString().split('T')[0]}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } finally {
            setTimeout(() => setExporting(null), 1000);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleExportJSON}
                disabled={exporting !== null}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
            >
                {exporting === "json" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                JSON Data
            </button>
            <button
                onClick={handleExportMarkdown}
                disabled={exporting !== null}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-sm text-primary-300 hover:text-primary-200 transition-colors"
            >
                {exporting === "markdown" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Strategic Report
            </button>
        </div>
    );
}

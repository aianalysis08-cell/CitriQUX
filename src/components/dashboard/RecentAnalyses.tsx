import React from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type AnalysisReport = {
    id: string;
    design_id: string;
    analysis_type: string;
    ux_score: number;
    created_at: string;
    designs?: {
        projects?: {
            title: string;
        };
    };
};

export function RecentAnalyses({ analyses }: { analyses: AnalysisReport[] }) {
    if (analyses.length === 0) {
        return (
            <div className="apple-glass-card rounded-[2rem] overflow-hidden">
                <div className="p-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 mx-auto mb-6 flex items-center justify-center">
                        <History className="text-white/20 w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Reports Yet</h3>
                    <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
                        Upload your first design to get a comprehensive UX audit and see it here.
                    </p>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-bold text-sm"
                    >
                        Upload Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="apple-glass-card rounded-[2rem] overflow-hidden">
            <div className="divide-y divide-white/5">
                {analyses.map((analysis) => {
                    const projectName = analysis.designs?.projects?.title || "Unknown Project";
                    const typeLabel = analysis.analysis_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                    return (
                        <div key={analysis.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                                    <span className="font-bold text-xs text-white/60 group-hover:text-primary-400">
                                        {analysis.ux_score || '-'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{projectName}</h4>
                                    <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
                                        <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider text-white/60">
                                            {typeLabel}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={`/analyses/${analysis.id}`}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-primary-500 transition-all border border-white/10"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <Link
                    href="/analyses"
                    className="text-sm font-bold text-primary-400 hover:text-primary-300 w-full flex justify-center items-center gap-2 transition-colors"
                >
                    View All History <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Folder, MoreVertical, Plus, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    description: string;
    analysis_count: number;
    updated_at: string;
}

const mockProjects: Project[] = [
    {
        id: "1",
        title: "Project Alpha",
        description: "Main dashboard redesign for the SaaS platform.",
        analysis_count: 12,
        updated_at: "2 hours ago",
    },
    {
        id: "2",
        title: "Mobile App V2",
        description: "Onboarding flow optimization and A/B test variants.",
        analysis_count: 8,
        updated_at: "Yesterday",
    },
    {
        id: "3",
        title: "E-commerce Checkout",
        description: "Reducing friction in the multi-step checkout process.",
        analysis_count: 5,
        updated_at: "3 days ago",
    },
];

export function ProjectList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card border-dashed border-2 border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 cursor-pointer flex flex-col items-center justify-center p-8 rounded-[2rem] min-h-[220px] transition-all group"
            >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                    <Plus className="w-8 h-8 text-white/30 group-hover:text-primary-400" />
                </div>
                <p className="text-white/50 font-bold text-sm">Create New Project</p>
            </motion.div>

            {mockProjects.map((project) => (
                <motion.div
                    key={project.id}
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between group"
                >
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary-400 group-hover:bg-primary-500/10 transition-all">
                                <Folder className="w-6 h-6" />
                            </div>
                            <button className="p-2 text-white/30 hover:text-white transition-all">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-white/40 text-sm mb-6 line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-white/30">
                                <Clock className="w-3.5 h-3.5" />
                                {project.updated_at}
                            </div>
                            <div className="flex items-center gap-2 text-accent-400">
                                <Plus className="w-3.5 h-3.5" />
                                {project.analysis_count} Reports
                            </div>
                        </div>

                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass hover:bg-white/5 text-white text-xs font-bold border-white/5 group-hover:border-primary-500/30 transition-all"
                        >
                            Open Project
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

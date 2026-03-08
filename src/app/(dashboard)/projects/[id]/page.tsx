"use client";

import React from "react";
import { AnalysisUploader } from "@/components/project/AnalysisUploader";
import { ArrowLeft, Sparkles, MessageSquare, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = React.use(params);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Project Alpha</h1>
            <p className="text-[10px] font-bold text-accent-400 uppercase tracking-widest mt-1">SaaS Dashboard Redesign</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-900 bg-surface-800 flex items-center justify-center text-[10px] font-bold text-white/50">
                U{i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-surface-900 bg-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-400">
              +5
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl glass border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all">
            <Layers className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Upload Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">New Critique</h2>
            <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/5">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-tight">GPT-4o Vision Active</span>
            </div>
          </div>

          <AnalysisUploader
            projectId={projectId}
            onUploadComplete={(id) => console.log("Design uploaded:", id)}
          />
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-bold text-white">Critique <span className="text-white/20">Options</span></h2>

          <div className="space-y-4">
            {[
              { title: "UX Audit", desc: "Full heuristic evaluation", active: true },
              { title: "Accessibility", desc: "WCAG 2.1 compliance check", active: false },
              { title: "Design Tokens", desc: "Extract colors & spacing", active: false },
              { title: "User Stories", desc: "Generate PM requirements", active: false },
            ].map((option) => (
              <div
                key={option.title}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer group",
                  option.active
                    ? "glass-strong border-primary-500/50 glow-primary"
                    : "glass border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={cn("text-sm font-bold", option.active ? "text-white" : "text-white/70 group-hover:text-white")}>
                    {option.title}
                  </h4>
                  {option.active && <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />}
                </div>
                <p className="text-[10px] text-white/40">{option.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl glass border border-white/5 bg-gradient-to-br from-primary-500/5 to-transparent">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-400" />
              Project Context
            </h4>
            <textarea
              placeholder="Add notes about target audience, business goals, or specific concerns..."
              className="w-full h-32 bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary-500/30 transition-all resize-none mb-4"
            />
            <p className="text-[10px] text-white/30 leading-relaxed italic">
              Providing context helps our AI give more relevant and actionable feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

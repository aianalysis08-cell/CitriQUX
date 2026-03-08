import React from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Sparkles, ArrowRight, Play, History } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative glass-card p-10 rounded-[2.5rem] border border-white/10 overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
          <Sparkles className="text-primary-400 w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Ready to <span className="gradient-text">Critique</span> your latest design?
          </h1>
          <p className="text-white/50 text-lg mb-8">
            Upload a screenshot or paste a link to get instant, expert AI feedback based on over 200+ UX heuristics.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl gradient-primary text-white font-bold glow-primary hover:scale-105 transition-all"
            >
              Analyze New Design
              <Play className="w-4 h-4" />
            </Link>
            <Link
              href="/analyses"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass hover:bg-white/5 text-white font-bold border-white/10 transition-all"
            >
              View Recent Reports
              <History className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Performance <span className="text-white/20">Snapshot</span>
          </h2>
          <button className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
            View Analytics <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <StatsCards />
      </section>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Recent <span className="text-white/20">Analyses</span>
          </h2>
          <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
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
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Quick <span className="text-white/20">Tools</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: "A/B Comparison", icon: "AB", desc: "Test two variants side-by-side" },
              { name: "Token Extraction", icon: "TK", desc: "Get design tokens from any URL" },
              { name: "User Stories", icon: "US", desc: "Generate PM requirements" },
            ].map((tool) => (
              <div key={tool.name} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center font-bold text-white shadow-lg">
                  {tool.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{tool.name}</h4>
                  <p className="text-[10px] text-white/40">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

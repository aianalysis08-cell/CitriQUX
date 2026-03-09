import React from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentAnalyses } from "@/components/dashboard/RecentAnalyses";
import { Sparkles, ArrowRight, Play, History, Bot, Palette, Activity } from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let totalProjects = 0;
  let totalAnalyses = 0;
  let creditsLeft = 10;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recentAnalysesList: any[] = [];

  if (user) {
    // Fetch total projects
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);
    totalProjects = projectsCount || 0;

    // Fetch credits
    const { data: creditsData } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();
    if (creditsData) {
      creditsLeft = creditsData.balance;
    }

    // We fetch analyses by looking up designs first, then analysis reports.
    // For simplicity, we assume RLS policies allow us to query analysis_reports directly if we have access.
    const { data: analysesData, count: analysesCount } = await supabase
      .from('analysis_reports')
      .select(`
        id, 
        design_id, 
        analysis_type, 
        ux_score, 
        created_at,
        designs (
          projects (
            title
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    totalAnalyses = analysesCount || 0;
    if (analysesData) {
      recentAnalysesList = analysesData;
    }
  }

  const quickTools = [
    { name: "AI UX Copilot", icon: <Bot className="w-6 h-6" />, desc: "Chat with your AI UX expert", href: "/ai-ux-copilot" },
    { name: "AI Redesign Engine", icon: <Palette className="w-6 h-6" />, desc: "Generate variations instantly", href: "/ai-redesign-engine" },
    { name: "Conversion Simulator", icon: <Activity className="w-6 h-6" />, desc: "Predict uplift before coding", href: "/conversion-simulator" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative apple-glass-card p-10 rounded-[2.5rem] overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
          <Sparkles className="text-primary-400 w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome back, <span className="gradient-text">{user?.user_metadata?.name || 'Designer'}</span> 👋
          </h1>
          <p className="text-white/50 text-lg mb-8">
            Select a project or paste a new link to get instant, expert AI feedback based on over 200+ UX heuristics.
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
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl apple-glass hover:bg-white/5 text-white font-bold transition-all"
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
            📊 Performance <span className="text-white/20">Snapshot</span>
          </h2>
          <Link href="/analyses" className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
            View Analytics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <StatsCards
          totalProjects={totalProjects}
          totalAnalyses={totalAnalyses}
          creditsLeft={creditsLeft}
        />
      </section>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🕰️ Recent <span className="text-white/20">Analyses</span>
          </h2>
          <RecentAnalyses analyses={recentAnalysesList} />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⚡ Quick <span className="text-white/20">Tools</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {quickTools.map((tool) => (
              <Link
                href={tool.href}
                key={tool.name}
                className="apple-glass-card p-4 rounded-2xl transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center font-bold text-white shadow-lg">
                  {tool.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{tool.name}</h4>
                  <p className="text-[10px] text-white/40">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

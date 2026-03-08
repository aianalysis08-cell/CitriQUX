"use client";

import React from "react";
import { ProjectList } from "@/components/project/ProjectList";
import { Search, Filter, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Projects</h1>
          <p className="text-white/50">Manage your designs and organize your workspace</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <Search className="w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none text-xs text-white focus:outline-none w-32" />
          </div>
          <button className="p-2.5 rounded-xl glass border-white/10 text-white/50 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white font-bold glow-primary hover:scale-105 transition-all">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      <ProjectList />
    </div>
  );
}

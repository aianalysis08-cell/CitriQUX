import React from "react";

export default function PRDGeneratorPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          PRD <span className="gradient-text">Generator</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Generate comprehensive Product Requirements Documents with AI-powered analysis and insights.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Generate PRD</h2>
          <p className="text-white/50 mb-6">
            Create detailed product requirements documents with AI assistance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Feature Specifications</h3>
              <p className="text-white/50 text-sm">
                Generate detailed feature descriptions and requirements.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">User Stories</h3>
              <p className="text-white/50 text-sm">
                Create comprehensive user stories and acceptance criteria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

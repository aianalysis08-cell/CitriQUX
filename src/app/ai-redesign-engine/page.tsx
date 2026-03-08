import React from "react";

export default function AIRedesignEnginePage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          AI Redesign <span className="gradient-text">Engine</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Transform your designs with AI-powered redesign suggestions that improve usability and aesthetics.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Upload Your Design</h2>
          <p className="text-white/50 mb-6">
            Let our AI analyze and suggest improvements to your existing designs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Layout Optimization</h3>
              <p className="text-white/50 text-sm">
                Improve spacing, alignment, and visual hierarchy.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Visual Enhancement</h3>
              <p className="text-white/50 text-sm">
                Enhance colors, typography, and visual elements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

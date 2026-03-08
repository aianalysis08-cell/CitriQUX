import React from "react";

export default function DesignSystemGeneratorPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Design System <span className="gradient-text">Generator</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Automatically generate comprehensive design systems from your existing components and styles.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Generate Design System</h2>
          <p className="text-white/50 mb-6">
            Create a complete design system from your existing designs and components.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Component Library</h3>
              <p className="text-white/50 text-sm">
                Generate reusable components with consistent styling.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Style Guide</h3>
              <p className="text-white/50 text-sm">
                Create comprehensive documentation for your design tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

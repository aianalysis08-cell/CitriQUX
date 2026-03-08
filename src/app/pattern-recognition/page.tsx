import React from "react";

export default function PatternRecognitionPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Pattern <span className="gradient-text">Recognition</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Identify and analyze design patterns to ensure consistency and improve user experience.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Pattern Analysis</h2>
          <p className="text-white/50 mb-6">
            Discover design patterns in your interface and ensure consistency across your product.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Pattern Detection</h3>
              <p className="text-white/50 text-sm">
                Automatically identify recurring design patterns in your UI.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Consistency Check</h3>
              <p className="text-white/50 text-sm">
                Ensure consistent application of design patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

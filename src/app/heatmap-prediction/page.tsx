import React from "react";

export default function HeatmapPredictionPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Heatmap <span className="gradient-text">Prediction</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Predict user attention patterns and optimize your designs for maximum engagement.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Analyze User Attention</h2>
          <p className="text-white/50 mb-6">
            Upload your design to generate predictive heatmaps showing where users will focus.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Attention Hotspots</h3>
              <p className="text-white/50 text-sm">
                Identify areas that will attract the most user attention.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Optimization Suggestions</h3>
              <p className="text-white/50 text-sm">
                Get recommendations to improve visual flow and engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

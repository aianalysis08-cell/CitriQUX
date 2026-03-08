import React from "react";

export default function BehaviorAnalyticsPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Behavior <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Gain deep insights into user behavior patterns to make data-driven design decisions.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">User Behavior Analysis</h2>
          <p className="text-white/50 mb-6">
            Analyze how users interact with your designs to optimize their experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Interaction Patterns</h3>
              <p className="text-white/50 text-sm">
                Understand how users navigate and interact with your interface.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">User Journey Mapping</h3>
              <p className="text-white/50 text-sm">
                Visualize and optimize complete user journeys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

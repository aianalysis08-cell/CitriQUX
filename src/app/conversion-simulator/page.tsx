import React from "react";

export default function ConversionSimulatorPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Conversion <span className="gradient-text">Simulator</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Test and simulate conversion scenarios to optimize your user journey and increase conversions.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Simulate Conversions</h2>
          <p className="text-white/50 mb-6">
            Model different scenarios to predict and improve conversion rates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">A/B Testing</h3>
              <p className="text-white/50 text-sm">
                Compare different design variations for optimal performance.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Funnel Analysis</h3>
              <p className="text-white/50 text-sm">
                Identify and optimize conversion bottlenecks in your user flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

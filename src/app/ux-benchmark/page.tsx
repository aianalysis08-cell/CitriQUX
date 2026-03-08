import React from "react";

export default function UXBenchmarkPage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          UX <span className="gradient-text">Benchmark</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Compare your designs against industry standards and best practices to identify improvement areas.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Industry Standards</h2>
          <p className="text-white/50 mb-6">
            Evaluate your designs against established UX benchmarks and best practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Usability Scores</h3>
              <p className="text-white/50 text-sm">
                Compare your usability metrics with industry averages.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Best Practices</h3>
              <p className="text-white/50 text-sm">
                Ensure your designs follow established UX guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

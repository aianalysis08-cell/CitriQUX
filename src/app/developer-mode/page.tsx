import React from "react";

export default function DeveloperModePage() {
  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Developer <span className="gradient-text">Mode</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Access technical implementation tools and developer-focused features for seamless integration.
        </p>
        
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Developer Tools</h2>
          <p className="text-white/50 mb-6">
            Technical tools and resources for implementing your designs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">Code Generation</h3>
              <p className="text-white/50 text-sm">
                Generate production-ready code from your designs.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">API Integration</h3>
              <p className="text-white/50 text-sm">
                Connect your designs with backend services and APIs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

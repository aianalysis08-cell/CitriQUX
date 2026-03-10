import React from "react";
import { Brain, Sparkles, Loader2, Globe, Palette, Layout, Eye, Shield } from "lucide-react";

interface LoadingAnimationProps {
  analysisType: "domain" | "screenshots" | "figma";
}

export default function LoadingAnimation({ analysisType }: LoadingAnimationProps) {
  const analysisTypeText = {
    domain: "Analyzing Website",
    screenshots: "Analyzing Design", 
    figma: "Analyzing Figma Design"
  };

  const analysisTypeIcon = {
    domain: Globe,
    screenshots: Palette,
    figma: Layout
  };

  const AnalysisIcon = analysisTypeIcon[analysisType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-8">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-12">
          {/* Center Icon and Text */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg">
                <AnalysisIcon className="w-10 h-10 text-white/80" />
              </div>
            </div>
            
            <h1 className="text-2xl font-light text-white mb-3">
              {analysisTypeText[analysisType]}
            </h1>
            <p className="text-white/50 text-sm mb-8">
              AI is carefully evaluating your design
            </p>

            {/* Subtle Loading Animation */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-white/10"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-2 border-transparent border-t-purple-400/50 border-r-blue-400/50 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400/60 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="space-y-3">
              {[
                { icon: Brain, text: "Processing visual elements", active: true },
                { icon: Eye, text: "Evaluating user experience", active: false },
                { icon: Shield, text: "Checking accessibility", active: false },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                    step.active 
                      ? 'bg-purple-500/20 border border-purple-500/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <step.icon className={`w-4 h-4 transition-all duration-500 ${
                      step.active ? 'text-purple-400' : 'text-white/30'
                    }`} />
                  </div>
                  <div className={`text-sm transition-all duration-500 ${
                    step.active ? 'text-white/70' : 'text-white/30'
                  }`}>
                    {step.text}
                  </div>
                  {step.active && (
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Subtle Status Message */}
            <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Powered by advanced AI technology</span>
            </div>
          </div>
        </div>

        {/* Floating Glass Elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-pulse animation-delay-1000"></div>
      </div>

      {/* Custom CSS for subtle animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

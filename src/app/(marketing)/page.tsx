import React from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/Hero";
import { SECTION_SPACING } from "@/config/spacing";

// Dynamically import heavy interactive components (Framer Motion, Auth State) below the fold
const Features = dynamic(() => import("@/components/landing/Features").then(mod => mod.Features));
const Pricing = dynamic(() => import("@/components/landing/Pricing").then(mod => mod.Pricing));

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />

      {/* Scroll Marker for How it Works */}
      <section id="how-it-works" className={`${SECTION_SPACING.paddingY} bg-surface-800/30`}>
        <div className={SECTION_SPACING.container}>
          <h2 className={`text-3xl md:text-5xl font-bold text-white ${SECTION_SPACING.marginBottom.xlarge}`}>
            Audit in <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-3 ${SECTION_SPACING.gridGap.xlarge}`}>
            {[
              { step: "01", title: "Upload Design", desc: "Drop your screenshot or Figma link into our uploader." },
              { step: "02", title: "AI Analysis", desc: "Our AI experts scan your UI against 200+ UX heuristics." },
              { step: "03", title: "Expert Report", desc: "Get actionable feedback and scores in under 30 seconds." },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="text-8xl font-black text-white/5 absolute -top-10 left-1/2 -translate-x-1/2 group-hover:text-primary-500/10 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white relative z-10 mb-4">{item.title}</h3>
                <p className="text-white/50 text-sm relative z-10 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      <section className={SECTION_SPACING.paddingY}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-strong p-12 md:p-20 rounded-[3rem] border border-white/10 text-center relative overflow-hidden group">
            <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10 leading-tight">
              Ready to create <br /> a better experience?
            </h2>
            <p className="text-white/60 text-lg mb-12 relative z-10 max-w-xl mx-auto">
              Join 2,000+ designers and PMs who are building better products with CritiqUX.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 rounded-2xl gradient-primary text-white font-bold text-lg glow-primary hover:scale-105 transition-all">
                Get Started for Free
              </button>
              <button className="px-8 py-4 rounded-2xl glass text-white font-bold text-lg border-white/10">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

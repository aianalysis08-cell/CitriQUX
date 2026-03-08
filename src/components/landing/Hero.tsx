"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { SECTION_SPACING, HERO_SPACING } from "@/config/spacing";

export function Hero() {
  return (
    <section className={`relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden`}>
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-500 rounded-full blur-[120px] animate-float" />
      </div>

      <div className={`${SECTION_SPACING.container} relative`}>
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-xs font-bold text-accent-400 mb-4 uppercase tracking-widest glow-accent`}
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered UX Analysis
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-5xl md:text-7xl font-extrabold text-white leading-[1.1] ${HERO_SPACING.titleMargin} tracking-tight`}
          >
            Stop Guessing. <br />
            Start <span className="gradient-text">Critiquing.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`max-w-2xl text-lg md:text-xl text-white/60 ${HERO_SPACING.subtitleMargin} leading-relaxed`}
          >
            Upload your designs and get instant, industry-expert AI feedback.
            From UX audits to A/B testing, CritiqUX helps you build world-class interfaces in seconds.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex flex-col sm:flex-row items-center gap-4 ${HERO_SPACING.buttonsMargin}`}
          >
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-bold text-lg glow-primary hover:scale-105 active:scale-95 transition-all"
            >
              Analyze Your First Design
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl glass hover:bg-white/5 text-white font-bold text-lg border-white/10 transition-all"
            >
              See Examples
            </Link>
          </motion.div>

          
            

            
          
        </div>
      </div>
    </section>
  );
}

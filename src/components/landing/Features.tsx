"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Layers,
  Figma,
  Smartphone,
  Sparkles,
  MessageSquare,
  Search,
  Code2
} from "lucide-react";
import { SECTION_SPACING } from "@/config/spacing";

const features = [
  {
    title: "Instant UX Audit",
    description: "Get a comprehensive 10-point audit of your design across usability, accessibility, and visual hierarchy.",
    icon: Search,
    color: "text-primary-400",
    bg: "bg-primary-500/10",
  },
  {
    title: "A/B Comparison",
    description: "Compare two design variants and get a data-driven recommendation on which one will convert better.",
    icon: Layers,
    color: "text-accent-400",
    bg: "bg-accent-500/10",
  },
  {
    title: "Design Token Extraction",
    description: "Automatically extract colors, typography, and spacing from any screenshot for your design system.",
    icon: Figma,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Mobile Prototype Testing",
    description: "Simulate mobile interactions and identify fat-finger issues and viewport constraints instantly.",
    icon: Smartphone,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "AI Redesign Strategy",
    description: "Not happy with your UI? Let our AI suggest a full layout and color palette overhaul based on best practices.",
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    title: "User Story Generator",
    description: "Transform your screens into detailed Jira-ready user stories with acceptance criteria.",
    icon: Code2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Competitor UX Spy",
    description: "Analyze competitor screens to understand their engagement hooks and pattern choices.",
    icon: BarChart3,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    title: "Contextual Feedback",
    description: "Ask specific questions about your design like 'Is the CTA clear enough?' and get expert answers.",
    icon: MessageSquare,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className={`${SECTION_SPACING.paddingY} relative`}>
      <div className={SECTION_SPACING.container}>
        <div className={`flex flex-col items-center text-center ${SECTION_SPACING.marginBottom.xxlarge}`}>
          <h2 className={`text-3xl md:text-5xl font-bold text-white ${SECTION_SPACING.marginBottom.small}`}>
            Everything you need for <span className="gradient-text">Design Perfection</span>
          </h2>
          <p className="max-w-2xl text-white/50 text-lg mb-10">
            Our specialized AI tools cover every aspect of the design process,
            giving you the insights of a senior UX researcher at your fingertips.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${SECTION_SPACING.gridGap.medium}`}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group glass-card p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 border border-white/5 group-hover:glow-primary transition-all`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Layout, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const aiToolLinks = [
  { name: "AI UX Copilot", href: "/ai-ux-copilot" },
  { name: "AI Redesign Engine", href: "/ai-redesign-engine" },
  { name: "Heatmap Prediction", href: "/heatmap-prediction" },
  { name: "Conversion Simulator", href: "/conversion-simulator" },
  { name: "UX Benchmark", href: "/ux-benchmark" },
  { name: "Pattern Recognition", href: "/pattern-recognition" },
  { name: "Design System Generator", href: "/design-system-generator" },
  { name: "Behavior Analytics", href: "/behavior-analytics" },
  { name: "PRD Generator", href: "/prd-generator" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 border-b border-transparent",
        isScrolled ? "apple-glass py-3 border-white/5 shadow-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Menu side */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary transition-transform group-hover:scale-110">
              <Layout className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Critiq<span className="gradient-text">UX</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}>
            <button className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors py-4">
              AI Tool
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[100%] left-0 w-64 apple-glass border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden"
                >
                  {aiToolLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-primary text-sm font-bold text-white glow-primary hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 apple-glass m-4 rounded-2xl flex flex-col md:hidden overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">AI Tools</div>
              {aiToolLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-white/80 hover:text-white pl-2 border-l border-white/10 hover:border-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-white/10 my-4" />

              <Link
                href="/login"
                className="text-lg font-medium text-white/80 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 py-4 mt-2 rounded-xl gradient-primary text-lg font-bold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

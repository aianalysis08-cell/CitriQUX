"use client";

import React from "react";
import Link from "next/link";
import { Layout, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "AI Tools", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "mailto:hello@critiqux.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                <Layout className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Critiq<span className="gradient-text">UX</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm max-w-xs mb-8 leading-relaxed">
              Empowering designers and product teams with instant, AI-driven UX audits and expert feedback.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg glass border-white/10 text-white/50 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass border-white/10 text-white/50 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass border-white/10 text-white/50 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} CritiqUX Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -z-10 translate-x-1/2 translate-y-1/2" />
    </footer>
  );
}

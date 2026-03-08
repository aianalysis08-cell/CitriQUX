"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";
import { SECTION_SPACING, CARD_SPACING } from "@/config/spacing";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for exploring AI-powered UX feedback.",
    features: [
      "10 Analysis credits per month",
      "Standard GPT-4o analysis",
      "1 Project workspace",
      "Community support",
      "Basic export (Text)",
    ],
    cta: "Sign Up for Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "29",
    description: "Everything you need for serious design audits.",
    features: [
      "200 Analysis credits per month",
      "Priority GPT-4o Vision access",
      "Unlimited Project workspaces",
      "A/B Testing & Redesign tools",
      "PDF & HTML Report exports",
      "Team collaboration (up to 3)",
    ],
    cta: "Get Started with Pro",
    href: "/signup?plan=pro",
    highlight: true,
    action: "checkout",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Advanced controls and unlimited power for teams.",
    features: [
      "Unlimited Analysis credits",
      "Dedicated GPU instances",
      "SSO & Custom authentication",
      "Custom AI prompt engineering",
      "API access for automation",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@critiqux.com",
    highlight: false,
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, profile } = useAuthStore();
  const isPro = profile?.subscription_plan === "pro";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAction = async (plan: any) => {
    if (plan.action === "contact") {
      window.location.href = plan.href;
      return;
    }

    if (!isAuthenticated) {
      router.push(plan.href);
      return;
    }

    if (plan.action === "checkout") {
      if (isPro) {
        router.push("/billing");
        return;
      }

      setLoadingAction(plan.name);
      try {
        const res = await fetch("/api/billing/checkout", { method: "POST" });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else if (data.error) {
          console.error("Checkout error:", data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAction(null);
      }
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section id="pricing" className={`${SECTION_SPACING.paddingY} relative`}>
      <div className={SECTION_SPACING.container}>
        <div className={`flex flex-col items-center text-center ${SECTION_SPACING.marginBottom.xlarge}`}>
          <h2 className={`text-3xl md:text-5xl font-bold text-white ${SECTION_SPACING.marginBottom.small}`}>
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="max-w-2xl text-white/50 text-lg mb-10">
            Choose the plan that fits your design workflow. Upgrade or downgrade anytime.
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-4 bg-surface-800 p-1 rounded-full border border-white/5">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                !isYearly ? "bg-primary-500 text-white shadow-lg" : "text-white/50 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                isYearly ? "bg-primary-500 text-white shadow-lg" : "text-white/50 hover:text-white"
              )}
            >
              Yearly
              <span className="text-[10px] bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${SECTION_SPACING.gridGap.large}`}>
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative group flex flex-col transition-all",
                CARD_SPACING.padding,
                CARD_SPACING.borderRadius,
                plan.highlight
                  ? "glass-strong border-primary-500/50 scale-105 z-10 glow-primary"
                  : "glass border-white/5 hover:border-white/10"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-primary px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className={SECTION_SPACING.marginBottom.medium}>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price === "Custom" ? "" : "$"}
                    {plan.price === "Custom" ? plan.price : isYearly ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-white/50 font-medium">/month</span>
                  )}
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className={`flex-1 space-y-4 ${CARD_SPACING.marginBottom}`}>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleAction(plan)}
                disabled={loadingAction === plan.name}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2",
                  plan.highlight
                    ? "gradient-primary text-white shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    : "glass hover:bg-white/5 text-white border-white/10"
                )}
              >
                {loadingAction === plan.name ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                  isAuthenticated && plan.action === "checkout" && isPro ? "Manage Billing" :
                    isAuthenticated && plan.action === "signup" ? "Go to Dashboard" :
                      plan.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/30 text-xs mt-12">
          Prices are in USD. Tax may be added at checkout depending on your location.
        </p>
      </div>
    </section>
  );
}

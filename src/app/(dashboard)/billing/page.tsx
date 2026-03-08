"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Rocket, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BillingStatus = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription: any | null;
  credits: { balance: number } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  usage: any | null;
};

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch("/api/billing/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setStatus(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const isPro = status?.subscription?.plan === "pro";

  const handleStripeAction = async (endpoint: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Billing & Subscription</h1>
          <p className="text-white/50 mt-2">Manage your plan, credits, and invoices.</p>
        </div>
        {isPro && (
          <button
            onClick={() => handleStripeAction("/api/billing/portal")}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/5 border-white/10 text-white font-bold transition-all disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Customer Portal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan Card */}
        <div className={cn(
          "relative glass-card p-8 rounded-[2rem] border overflow-hidden",
          isPro ? "border-primary-500/50 glow-primary" : "border-white/10"
        )}>
          {isPro && (
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-24 h-24 text-primary-400" />
            </div>
          )}
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              {isPro ? <Zap className="text-primary-400 w-6 h-6" /> : <Rocket className="text-white/50 w-6 h-6" />}
            </div>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">Current Plan</h2>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-3xl font-extrabold text-white">{isPro ? "Pro" : "Free"}</h3>
              <span className="text-white/50 font-medium">/ {isPro ? "month" : "forever"}</span>
            </div>

            <p className="text-white/70 text-sm mb-8">
              {isPro
                ? "You have full access to GPT-4o Vision, unlimited projects, and premium exports."
                : "You are currently on the free tier. Upgrade to unlock GPT-4o Vision and more."}
            </p>

            {!isPro && (
              <button
                onClick={() => handleStripeAction("/api/billing/checkout")}
                disabled={actionLoading}
                className="w-full py-4 rounded-xl gradient-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade to Pro"}
              </button>
            )}
            {isPro && (
              <div className="flex items-center gap-2 text-primary-400 font-bold text-sm bg-primary-500/10 px-4 py-2 rounded-lg inline-flex border border-primary-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Active Subscription
              </div>
            )}
          </div>
        </div>

        {/* Credits Card */}
        <div className="glass-card p-8 rounded-[2rem] border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Zap className="text-accent-400 w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">Available Credits</h2>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-4xl font-extrabold text-white">{status?.credits?.balance || 0}</h3>
            <span className="text-white/50 font-medium text-sm">credits remaining</span>
          </div>

          <p className="text-white/70 text-sm mb-8">
            Credits are used for AI analysis (UX audits, A/B testing, user stories).
            Pro users get 200 credits monthly.
          </p>

          <div className="w-full bg-white/5 rounded-full h-3 max-w-sm overflow-hidden border border-white/10">
            <div
              className={cn("h-full rounded-full", isPro ? "gradient-primary" : "bg-white/20")}
              style={{ width: `${Math.min(((status?.credits?.balance || 0) / (isPro ? 200 : 10)) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between max-w-sm mt-2">
            <span className="text-[10px] text-white/40">0</span>
            <span className="text-[10px] text-white/40">{isPro ? "200" : "10"} MAX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

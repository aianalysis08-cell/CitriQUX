import { createAdminClient } from "@/lib/supabase/server";
import { PLANS, AI_LIMITS } from "@/config/constants";
import type { AnalysisType } from "@/types";

export class CreditError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = "CreditError";
    }
}

/**
 * Ensure user has AI entitlement (correct plan + credits available)
 */
export async function ensureAiEntitlement(
    userId: string,
    toolName: AnalysisType
): Promise<void> {
    const supabase = await createAdminClient();

    // 1. Check subscription plan
    const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_plan")
        .eq("id", userId)
        .single();

    if (!profile) {
        throw new CreditError("User profile not found", "PROFILE_NOT_FOUND");
    }

    const plan = profile.subscription_plan as "free" | "pro";
    const planConfig = PLANS[plan];

    // 2. Check if tool is available on user's plan
    if (!planConfig.tools.includes(toolName as never)) {
        throw new CreditError(
            `Tool "${toolName}" requires Pro plan`,
            "PLAN_INSUFFICIENT"
        );
    }

    // 3. Check credits
    const { data: credits } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (!credits) {
        // Auto-create credit record for new users
        await supabase.from("credits").insert({
            user_id: userId,
            balance: planConfig.maxAnalysesPerMonth,
            daily_used: 0,
            daily_reset_date: new Date().toISOString().split("T")[0],
        });
        return;
    }

    // Reset daily counter if needed
    const today = new Date().toISOString().split("T")[0];
    if (credits.daily_reset_date !== today) {
        await supabase
            .from("credits")
            .update({ daily_used: 0, daily_reset_date: today })
            .eq("id", credits.id);
        credits.daily_used = 0;
    }

    // Check monthly balance
    if (credits.balance <= 0) {
        throw new CreditError("Monthly analysis limit reached", "CREDITS_EXHAUSTED");
    }

    // Check daily limit
    const dailyLimit = AI_LIMITS.maxDailyAnalyses[plan];
    if (credits.daily_used >= dailyLimit) {
        throw new CreditError(
            `Daily analysis limit reached (${dailyLimit}/day)`,
            "DAILY_LIMIT"
        );
    }
}

/**
 * Deduct 1 credit after successful analysis
 */
export async function deductCredit(userId: string): Promise<void> {
    const supabase = await createAdminClient();

    await supabase.rpc("deduct_credit", { p_user_id: userId });
}

/**
 * Log AI usage for analytics
 */
export async function logAiUsage(
    userId: string,
    analysisType: string,
    tokensUsed: number,
    model: string
): Promise<void> {
    const supabase = await createAdminClient();

    // Estimate cost: ~$0.005 per 1K tokens for GPT-4o
    const costUsd = (tokensUsed / 1000) * 0.005;

    await supabase.from("ai_usage_logs").insert({
        user_id: userId,
        analysis_type: analysisType,
        tokens_used: tokensUsed,
        cost_usd: costUsd,
        model,
    });
}

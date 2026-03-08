import { NextResponse } from "next/server";

import { getAuthUser, errorResponse } from "@/utils/api";
import { createAdminClient } from "@/lib/supabase/server";
import { env } from "@/config/env";

export async function GET() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  if (user!.email !== env.ADMIN_EMAIL) {
    return errorResponse("Forbidden", 403);
  }

  const supabase = await createAdminClient();

  const [users, projects, analyses, revenue] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("analysis_reports").select("id", { count: "exact", head: true }),
    supabase.from("ai_usage_logs").select("cost_usd"),
  ]);

  const totalRevenue = revenue.data?.reduce((acc, r) => acc + Number(r.cost_usd), 0) || 0;

  // Plan distribution
  const { data: planDist } = await supabase
    .from("profiles")
    .select("subscription_plan");

  const planCounts = {
    free: planDist?.filter((p) => p.subscription_plan === "free").length || 0,
    pro: planDist?.filter((p) => p.subscription_plan === "pro").length || 0,
  };

  return NextResponse.json({
    data: {
      totalUsers: users.count,
      totalProjects: projects.count,
      totalAnalyses: analyses.count,
      totalAiCostUsd: totalRevenue,
      planDistribution: planCounts,
    },
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user, supabase, error } = await getAuthUser();
    if (error) return error;

    try {
        const { id } = await params;

        if (!id) {
            return errorResponse("Missing benchmark ID", 400);
        }

        const { data: result, error: fetchError } = await supabase
            .from("benchmark_results")
            .select("*")
            .eq("id", id)
            .eq("user_id", user!.id)
            .single();

        if (fetchError || !result) {
            return errorResponse("Benchmark report not found", 404);
        }

        // Map database columns back to camelCase JSON shape
        return NextResponse.json({
            id: result.id,
            userId: result.user_id,
            sites: result.sites,
            categoryWinners: result.category_winners,
            gapAnalysis: result.gap_analysis,
            opportunities: result.opportunities,
            aiInsight: result.ai_insight,
            planUsed: result.plan_used,
            createdAt: result.created_at
        });
    } catch (err) {
        console.error("Benchmark fetch error:", err);
        return errorResponse(err instanceof Error ? err.message : "Failed to fetch benchmark", 500);
    }
}

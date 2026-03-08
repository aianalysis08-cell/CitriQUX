import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, parseBody, errorResponse } from "@/utils/api";
import { uxAnalysisRequestSchema } from "@/schemas";
import { analyzeDesign } from "@/services/ai";
import { ensureAiEntitlement, deductCredit, logAiUsage } from "@/services/ai/creditGuard";
import { CreditError } from "@/services/ai/creditGuard";
import { strictAiLimiter } from "@/utils/rate-limit";

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: body, error: parseError } = await parseBody(request, uxAnalysisRequestSchema);
  if (parseError) return parseError;

  const { designId, analysisType, context } = body!;

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await strictAiLimiter.limit(user?.id || ip);
  if (!success) return errorResponse("Rate limit exceeded for AI tools", 429);

  // Check credits
  try {
    await ensureAiEntitlement(user!.id, analysisType);
  } catch (err) {
    if (err instanceof CreditError) {
      return errorResponse(err.message, 403);
    }
    throw err;
  }

  // Get design image URL
  const { data: design } = await supabase
    .from("designs")
    .select("image_url")
    .eq("id", designId)
    .single();

  if (!design) return errorResponse("Design not found", 404);

  // Run AI analysis
  try {
    const result = await analyzeDesign(design.image_url, analysisType, context);

    // Store report
    const { data: report, error: dbError } = await supabase
      .from("analysis_reports")
      .insert({
        design_id: designId,
        analysis_type: analysisType,
        feedback: result.feedbackItems as unknown as Record<string, unknown>,
        scores: result.categories as unknown as Record<string, unknown>,
        ux_score: result.overallScore,
        ai_model: "gpt-4o",
      })
      .select()
      .single();

    if (dbError) return errorResponse(dbError.message, 500);

    // Deduct credit & log usage
    await deductCredit(user!.id);
    await logAiUsage(user!.id, analysisType, 2000, "gpt-4o");

    return NextResponse.json({ data: { report, analysis: result } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI analysis failed";
    return errorResponse(message, 500);
  }
}

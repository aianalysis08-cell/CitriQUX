import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, parseBody, errorResponse } from "@/utils/api";
import { abTestRequestSchema } from "@/schemas";
import { compareDesigns } from "@/services/ai";
import { ensureAiEntitlement, deductCredit, logAiUsage, CreditError } from "@/services/ai/creditGuard";
import { strictAiLimiter } from "@/utils/rate-limit";

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: body, error: parseError } = await parseBody(request, abTestRequestSchema);
  if (parseError) return parseError;

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await strictAiLimiter.limit(user?.id || ip);
  if (!success) return errorResponse("Rate limit exceeded for AI tools", 429);

  const { projectId, designAId, designBId, objective, targetAudience } = body!;

  try {
    await ensureAiEntitlement(user!.id, "ab-test");
  } catch (err) {
    if (err instanceof CreditError) return errorResponse(err.message, 403);
    throw err;
  }

  // Get both design image URLs
  const { data: designA } = await supabase
    .from("designs")
    .select("image_url")
    .eq("id", designAId)
    .single();

  const { data: designB } = await supabase
    .from("designs")
    .select("image_url")
    .eq("id", designBId)
    .single();

  if (!designA || !designB) return errorResponse("One or both designs not found", 404);

  try {
    const result = await compareDesigns(
      designA.image_url,
      designB.image_url,
      objective ?? undefined,
      targetAudience ?? undefined
    );

    // Store AB test result
    const { data: abTest, error: dbError } = await supabase
      .from("ab_tests")
      .insert({
        project_id: projectId,
        design_a_id: designAId,
        design_b_id: designBId,
        objective,
        target_audience: targetAudience,
        winner: result.winner,
        results: result as unknown as Record<string, unknown>,
      })
      .select()
      .single();

    if (dbError) return errorResponse(dbError.message, 500);

    await deductCredit(user!.id);
    await logAiUsage(user!.id, "ab-test", 2500, "gpt-4o");

    return NextResponse.json({ data: { abTest, analysis: result } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "A/B test analysis failed";
    return errorResponse(message, 500);
  }
}

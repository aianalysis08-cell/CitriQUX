import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { analyzeCompetitor } from "@/services/ai";
import { ensureAiEntitlement, deductCredit, logAiUsage, CreditError } from "@/services/ai/creditGuard";
import { strictAiLimiter } from "@/utils/rate-limit";
import { z } from "zod";

const competitorSchema = z.object({
  screenshotUrl: z.string().url(),
  competitorUrl: z.string().url(),
  context: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await strictAiLimiter.limit(user?.id || ip);
  if (!success) return errorResponse("Rate limit exceeded for AI tools", 429);

  let body;
  try {
    body = competitorSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  try {
    await ensureAiEntitlement(user!.id, "competitor-spy");
  } catch (err) {
    if (err instanceof CreditError) return errorResponse(err.message, 403);
    throw err;
  }

  try {
    const result = await analyzeCompetitor(body.screenshotUrl, body.competitorUrl, body.context);
    await deductCredit(user!.id);
    await logAiUsage(user!.id, "competitor-spy", 2000, "gpt-4o");
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Analysis failed", 500);
  }
}

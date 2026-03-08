import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { analyzeDesign } from "@/services/ai";
import { ensureAiEntitlement, deductCredit, logAiUsage, CreditError } from "@/services/ai/creditGuard";
import { strictAiLimiter } from "@/utils/rate-limit";
import { z } from "zod";

const protoSchema = z.object({
  designId: z.string().uuid(),
  context: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await strictAiLimiter.limit(user?.id || ip);
  if (!success) return errorResponse("Rate limit exceeded for AI tools", 429);

  let body;
  try {
    body = protoSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  try {
    await ensureAiEntitlement(user!.id, "prototype");
  } catch (err) {
    if (err instanceof CreditError) return errorResponse(err.message, 403);
    throw err;
  }

  const { data: design } = await supabase.from("designs").select("image_url").eq("id", body.designId).single();
  if (!design) return errorResponse("Design not found", 404);

  try {
    const result = await analyzeDesign(design.image_url, "prototype", body.context);
    await deductCredit(user!.id);
    await logAiUsage(user!.id, "prototype", 2000, "gpt-4o");
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Prototype analysis failed", 500);
  }
}

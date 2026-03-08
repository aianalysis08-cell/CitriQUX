import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { extractDesignTokens } from "@/services/ai";
import { ensureAiEntitlement, deductCredit, logAiUsage, CreditError } from "@/services/ai/creditGuard";
import { z } from "zod";

const tokensSchema = z.object({
  designId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  let body;
  try {
    body = tokensSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  try {
    await ensureAiEntitlement(user!.id, "tokens");
  } catch (err) {
    if (err instanceof CreditError) return errorResponse(err.message, 403);
    throw err;
  }

  const { data: design } = await supabase.from("designs").select("image_url").eq("id", body.designId).single();
  if (!design) return errorResponse("Design not found", 404);

  try {
    const tokens = await extractDesignTokens(design.image_url);
    await deductCredit(user!.id);
    await logAiUsage(user!.id, "tokens", 1500, "gpt-4o");
    return NextResponse.json({ data: tokens });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Token extraction failed", 500);
  }
}

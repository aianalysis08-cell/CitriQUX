import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { generateUserStories } from "@/services/ai";
import { ensureAiEntitlement, deductCredit, logAiUsage, CreditError } from "@/services/ai/creditGuard";
import { z } from "zod";

const storiesSchema = z.object({
  featureDescription: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  let body;
  try {
    body = storiesSchema.parse(await request.json());
  } catch { return errorResponse("Provide a feature description (10-2000 chars)"); }

  try {
    await ensureAiEntitlement(user!.id, "user-stories");
  } catch (err) {
    if (err instanceof CreditError) return errorResponse(err.message, 403);
    throw err;
  }

  try {
    const stories = await generateUserStories(body.featureDescription);
    await deductCredit(user!.id);
    await logAiUsage(user!.id, "user-stories", 1500, "gpt-4o");
    return NextResponse.json({ data: { stories } });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Story generation failed", 500);
  }
}

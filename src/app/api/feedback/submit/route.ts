import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { submitFeedbackSchema } from "@/schemas";
import { errorResponse } from "@/utils/api";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = submitFeedbackSchema.parse(await request.json());
  } catch {
    return errorResponse("Failed to submit feedback", 500);
  }

  const supabase = await createAdminClient();

  // Find feedback record by token
  const { data: existing, error: findError } = await supabase
    .from("feedback")
    .select("*")
    .eq("link_token", body.linkToken)
    .single();

  if (findError || !existing) return errorResponse("Invalid or expired feedback link", 404);

  // Check if already submitted
  if (existing.rating !== null) return errorResponse("Feedback already submitted", 409);

  // Update with feedback
  const { data: updated, error: updateError } = await supabase
    .from("feedback")
    .update({
      rating: body.rating,
      comment: body.comment ?? null,
      tester_email: body.testerEmail ?? null,
    })
    .eq("id", existing.id)
    .select()
    .single();

  if (updateError) return errorResponse(updateError.message, 500);

  return NextResponse.json({ data: updated, message: "Thank you for your feedback!" });
}

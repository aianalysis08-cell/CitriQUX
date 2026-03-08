import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { z } from "zod";

const linkSchema = z.object({
  projectId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  let body;
  try {
    body = linkSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", body.projectId)
    .eq("owner_id", user!.id)
    .single();

  if (!project) return errorResponse("Project not found", 404);

  // Generate token via RPC
  const { data: token } = await supabase.rpc("generate_feedback_token");

  // Create feedback record with token
  const { data: feedback, error: dbError } = await supabase
    .from("feedback")
    .insert({
      project_id: body.projectId,
      link_token: token || crypto.randomUUID().replace(/-/g, ""),
    })
    .select()
    .single();

  if (dbError) return errorResponse(dbError.message, 500);

  const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback/${feedback.link_token}`;

  return NextResponse.json({ data: { token: feedback.link_token, url: feedbackUrl } }, { status: 201 });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { sendInvitationEmail } from "@/services/email";
import { z } from "zod";

const inviteSchema = z.object({
  projectId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["viewer", "editor", "admin"]).default("viewer"),
});

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  let body;
  try {
    body = inviteSchema.parse(await request.json());
  } catch { return errorResponse("Invalid request body"); }

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id, title")
    .eq("id", body.projectId)
    .eq("owner_id", user!.id)
    .single();

  if (!project) return errorResponse("Project not found or access denied", 403);

  // Find or skip the invited user
  const { data: invitedProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", body.email)
    .single();

  if (invitedProfile) {
    // User exists — add directly
    const { error: teamError } = await supabase.from("team_members").upsert({
      project_id: body.projectId,
      user_id: invitedProfile.id,
      role: body.role,
    });
    if (teamError) return errorResponse(teamError.message, 500);
  }

  // Send invitation email
  const { data: profile } = await supabase.from("profiles").select("name").eq("id", user!.id).single();
  await sendInvitationEmail(body.email, project.title, profile?.name || "A team member");

  return NextResponse.json({ message: `Invitation sent to ${body.email}` }, { status: 201 });
}

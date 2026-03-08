import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  // Verify the requester owns the project
  const { data: member } = await supabase
    .from("team_members")
    .select("project_id")
    .eq("id", memberId)
    .single();

  if (!member) return errorResponse("Team member not found", 404);

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", member.project_id)
    .eq("owner_id", user!.id)
    .single();

  if (!project) return errorResponse("Not authorized to remove this member", 403);

  const { error: deleteError } = await supabase.from("team_members").delete().eq("id", memberId);
  if (deleteError) return errorResponse(deleteError.message, 500);

  return NextResponse.json({ message: "Member removed" });
}

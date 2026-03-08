import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { supabase, error } = await getAuthUser();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("team_members")
    .select("*, profiles(name, email, avatar_url)")
    .eq("project_id", projectId);

  if (dbError) return errorResponse(dbError.message, 500);

  return NextResponse.json({ data });
}

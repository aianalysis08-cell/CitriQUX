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
    .from("designs")
    .select("*")
    .eq("project_id", projectId)
    .order("uploaded_at", { ascending: false });

  if (dbError) return errorResponse(dbError.message, 500);

  return NextResponse.json({ data });
}

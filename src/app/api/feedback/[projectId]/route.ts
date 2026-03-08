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
    .from("feedback")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (dbError) return errorResponse(dbError.message, 500);

  const stats = {
    total: data.length,
    submitted: data.filter((f: { rating: number | null }) => f.rating !== null).length,
    avgRating: data.reduce((acc: number, f: { rating: number | null }) => acc + (f.rating || 0), 0) /
      (data.filter((f: { rating: number | null }) => f.rating !== null).length || 1),
  };

  return NextResponse.json({ data, stats });
}

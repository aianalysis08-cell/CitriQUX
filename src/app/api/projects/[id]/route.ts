import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, error } = await getAuthUser();
  if (error) return error;

  const { data, error: dbError } = await supabase!.from("projects").select("*").eq("id", id).single();
  if (dbError) return errorResponse("Project not found", 404);
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, error } = await getAuthUser();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabase!.from("projects").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (dbError) return errorResponse(dbError.message, 500);
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, error } = await getAuthUser();
  if (error) return error;

  const { error: dbError } = await supabase!.from("projects").delete().eq("id", id);
  if (dbError) return errorResponse(dbError.message, 500);
  return NextResponse.json({ message: "Deleted" });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, parseBody, errorResponse } from "@/utils/api";
import { createProjectSchema } from "@/schemas";

export async function GET() {
  const { supabase, error } = await getAuthUser();
  if (error) return error;

  const { data, error: dbError } = await supabase!.from("projects").select("*").order("updated_at", { ascending: false });
  if (dbError) return errorResponse(dbError.message, 500);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: body, error: parseError } = await parseBody(request, createProjectSchema);
  if (parseError) return parseError;

  const { data, error: dbError } = await supabase!.from("projects").insert({ owner_id: user!.id, ...body! }).select().single();
  if (dbError) return errorResponse(dbError.message, 500);
  return NextResponse.json({ data }, { status: 201 });
}

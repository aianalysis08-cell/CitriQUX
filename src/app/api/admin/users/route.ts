import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser, errorResponse } from "@/utils/api";
import { createAdminClient } from "@/lib/supabase/server";
import { env } from "@/config/env";

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  // Check admin (simple email-based for now)
  if (user!.email !== env.ADMIN_EMAIL) {
    return errorResponse("Forbidden", 403);
  }

  const supabase = await createAdminClient();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = (page - 1) * limit;

  const { data, count, error: dbError } = await supabase
    .from("profiles")
    .select("*, subscriptions(*), credits(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (dbError) return errorResponse(dbError.message, 500);

  return NextResponse.json({ data, pagination: { page, limit, total: count } });
}

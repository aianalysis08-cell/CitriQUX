import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/schemas";
import { errorResponse, parseBody } from "@/utils/api";

export async function POST(request: NextRequest) {
  const { data: body, error: parseError } = await parseBody(request, loginSchema);
  if (parseError) return parseError;

  const { email, password } = body!;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return errorResponse(error.message, 401);
  }

  return NextResponse.json({
    user: data.user,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
}

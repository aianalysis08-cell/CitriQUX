import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signupSchema } from "@/schemas";
import { errorResponse, parseBody } from "@/utils/api";

export async function POST(request: NextRequest) {
  const { data: body, error: parseError } = await parseBody(request, signupSchema);
  if (parseError) return parseError;

  const { name, email, password } = body!;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return errorResponse(error.message, error.status ?? 400);
  }

  return NextResponse.json(
    { message: "Account created successfully.", user: data.user, session: data.session },
    { status: 201 }
  );
}

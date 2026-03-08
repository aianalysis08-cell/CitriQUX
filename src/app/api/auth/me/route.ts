import { NextResponse } from "next/server";

import { getAuthUser, errorResponse } from "@/utils/api";

export async function GET() {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (profileError) {
    return errorResponse("Profile not found", 404);
  }

  const { data: credits } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  return NextResponse.json({
    user: user!,
    profile,
    credits,
    subscription,
  });
}

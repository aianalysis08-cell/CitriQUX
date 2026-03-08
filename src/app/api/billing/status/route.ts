import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/api";

export async function GET() {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: credits } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: usage } = await supabase
    .rpc("get_monthly_usage", { p_user_id: user!.id, p_months: 3 });

  return NextResponse.json({ data: { subscription, credits, usage } });
}

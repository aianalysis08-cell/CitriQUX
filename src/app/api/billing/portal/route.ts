import { NextResponse } from "next/server";

import { getAuthUser, errorResponse } from "@/utils/api";
import { createPortalSession } from "@/services/billing";

export async function POST() {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user!.id)
    .single();

  if (!sub?.stripe_customer_id) {
    return errorResponse("No billing account found. Subscribe to Pro first.", 400);
  }

  try {
    const portalUrl = await createPortalSession(sub.stripe_customer_id);
    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Portal failed", 500);
  }
}

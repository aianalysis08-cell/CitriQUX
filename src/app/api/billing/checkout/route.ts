import { NextResponse } from "next/server";

import { getAuthUser, errorResponse } from "@/utils/api";
import { getOrCreateCustomer, createCheckoutSession } from "@/services/billing";
import { env } from "@/config/env";

export async function POST() {
  const { user, supabase, error } = await getAuthUser();
  if (error) return error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user!.id)
    .single();

  if (!profile) return errorResponse("Profile not found", 404);

  try {
    const customerId = await getOrCreateCustomer(profile.email, user!.id);
    const checkoutUrl = await createCheckoutSession(
      customerId,
      env.STRIPE_PRO_PRICE_ID,
      user!.id
    );
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Checkout failed", 500);
  }
}

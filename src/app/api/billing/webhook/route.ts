import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/services/billing";
import { createAdminClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, sig);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  // Idempotency check
  const { data: existing } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("event_id", event.id)
    .single();

  if (existing) return NextResponse.json({ received: true, duplicate: true });

  // Store event
  await supabase.from("stripe_events").insert({
    event_id: event.id,
    event_type: event.type,
    payload: event.data as unknown as Record<string, unknown>,
  });

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
          plan: "pro",
        });
        await supabase.from("profiles").update({ subscription_plan: "pro" }).eq("id", userId);
        await supabase.from("credits").update({ balance: 200 }).eq("user_id", userId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const { data: dbSub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", sub.id)
        .single();
      if (dbSub) {
        await supabase.from("subscriptions").update({ status: "canceled", plan: "free" }).eq("user_id", dbSub.user_id);
        await supabase.from("profiles").update({ subscription_plan: "free" }).eq("id", dbSub.user_id);
        await supabase.from("credits").update({ balance: 10 }).eq("user_id", dbSub.user_id);
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const { data: dbSub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();
      if (dbSub) {
        await supabase.from("subscriptions").update({ status: "past_due" }).eq("user_id", dbSub.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

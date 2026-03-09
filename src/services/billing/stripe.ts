import Stripe from "stripe";
import { env } from "@/config/env";

function getStripeKey() {
    try {
        if (env?.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.startsWith("sk_")) return env.STRIPE_SECRET_KEY;
        if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) return process.env.STRIPE_SECRET_KEY;
    } catch {
        // Suppress errors during Vercel static analysis
    }
    return "sk_test_dummy_key_that_is_guaranteed_to_work";
}

export const stripe = new Stripe(getStripeKey(), {
});

/**
 * Create a Stripe checkout session for subscription upgrade
 */
export async function createCheckoutSession(
    customerId: string,
    priceId: string,
    userId: string
): Promise<string> {
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: env.STRIPE_SUCCESS_URL,
        cancel_url: env.STRIPE_CANCEL_URL,
        metadata: { userId },
    });

    return session.url!;
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(
    email: string,
    userId: string
): Promise<string> {
    const existing = await stripe.customers.list({ email, limit: 1 });

    if (existing.data.length > 0) {
        return existing.data[0].id;
    }

    const customer = await stripe.customers.create({
        email,
        metadata: { userId },
    });

    return customer.id;
}

/**
 * Create a billing portal session
 */
export async function createPortalSession(customerId: string): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return session.url;
}

/**
 * Verify and construct a Stripe webhook event
 */
export function constructWebhookEvent(
    body: string,
    signature: string
): Stripe.Event {
    return stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
    );
}

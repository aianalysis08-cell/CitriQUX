import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().startsWith("sk-"),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
    STRIPE_PRO_PRICE_ID: z.string().startsWith("price_"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    STRIPE_SUCCESS_URL: z.string().url(),
    STRIPE_CANCEL_URL: z.string().url(),
    RESEND_API_KEY: z.string().optional(),
    ADMIN_EMAIL: z.string().email(),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        // Skip crashing during Next.js static build steps when env vars might be missing
        if (
            process.env.npm_lifecycle_event === "build" ||
            process.env.NEXT_PHASE === "phase-production-build" ||
            process.env.CI
        ) {
            console.warn("⚠️ Bypassing environment variable validation during build.");
            return process.env as unknown as Env;
        }

        console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
        throw new Error("Invalid environment variables");
    }

    return parsed.data;
}

export const env = getEnv();

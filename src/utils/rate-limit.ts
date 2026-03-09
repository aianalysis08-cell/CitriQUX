import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

const _isBuildProcess = process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build" || process.env.CI;

// Initialize Redis client 
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || (_isBuildProcess ? "https://dummy.upstash.io" : ""),
    token: process.env.UPSTASH_REDIS_REST_TOKEN || (_isBuildProcess ? "dummy_token" : ""),
});

/**
 * General API Limiter
 * Used for standard endpoints (e.g., getting project lists, fetching user data)
 * Limit: 60 requests per minute per IP
 */
export const generalApiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/general",
});

/**
 * Strict AI Limiter
 * Used explicitly for expensive endpoints (e.g., GPT-4o Vision analysis, Redesigns)
 * Limit: 10 requests per minute per identifier (usually User ID or IP)
 * Prevents rapid-fire token exhaustion
 */
export const strictAiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/ai",
});

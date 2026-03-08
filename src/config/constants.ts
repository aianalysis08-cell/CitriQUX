/** Site-wide constants */
export const SITE_CONFIG = {
    name: "CritiqUX",
    tagline: "AI-Powered UX Review Platform",
    description: "Get instant, expert-level UX feedback on your designs powered by AI.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

/** Plan definitions */
export const PLANS = {
    free: {
        name: "Free",
        price: 0,
        maxProjects: 3,
        maxAnalysesPerMonth: 10,
        maxTeamMembers: 1,
        tools: ["ux-analysis"] as const,
        features: ["Basic UX Analysis", "1 Project Member", "3 Projects"],
    },
    pro: {
        name: "Pro",
        price: 29,
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "",
        maxProjects: -1, // unlimited
        maxAnalysesPerMonth: 200,
        maxTeamMembers: 10,
        tools: [
            "ux-analysis",
            "ab-test",
            "competitor-spy",
            "redesign",
            "tokens",
            "prototype",
            "user-stories",
        ] as const,
        features: [
            "All AI Tools",
            "200 Analyses/month",
            "Unlimited Projects",
            "10 Team Members",
            "PDF Export",
            "Priority Support",
        ],
    },
} as const;

/** AI rate limits */
export const AI_LIMITS = {
    maxRequestsPerMinute: 10,
    maxDailyAnalyses: {
        free: 5,
        pro: 30,
    },
    maxTokensPerRequest: 4096,
    retryAttempts: 3,
    retryDelayMs: 1000,
} as const;

/** File upload limits */
export const UPLOAD_LIMITS = {
    maxFileSizeMB: 10,
    maxFileSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"] as const,
    avatarMaxSizeMB: 2,
} as const;

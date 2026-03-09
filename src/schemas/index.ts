import { z } from "zod";

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

// ============================================
// Project Schemas
// ============================================

export const createProjectSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(500).optional(),
    tags: z.array(z.string()).max(10).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ============================================
// Design Schemas
// ============================================

export const uploadDesignSchema = z.object({
    projectId: z.string().uuid(),
    sourceType: z.enum(["upload", "url", "figma"]).default("upload"),
    url: z.string().url().optional(),
});

// ============================================
// AI Analysis Schemas
// ============================================

export const uxAnalysisRequestSchema = z.object({
    designId: z.string().uuid(),
    analysisType: z.enum([
        "ux-analysis",
        "redesign",
        "tokens",
        "prototype",
        "user-stories",
        "contextual-questions",
    ]),
    context: z.string().max(1000).optional(),
});

export const abTestRequestSchema = z.object({
    projectId: z.string().uuid(),
    designAId: z.string().uuid(),
    designBId: z.string().uuid(),
    objective: z.string().max(500).optional(),
    targetAudience: z.string().max(500).optional(),
});

export const competitorSpyRequestSchema = z.object({
    url: z.string().url("Must be a valid URL"),
    context: z.string().max(500).optional(),
});

// ============================================
// Feedback Schemas
// ============================================

export const createFeedbackLinkSchema = z.object({
    projectId: z.string().uuid(),
});

export const submitFeedbackSchema = z.object({
    linkToken: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(2000).optional(),
    testerEmail: z.string().email().optional(),
});

// ============================================
// Team Schemas
// ============================================

export const inviteTeamMemberSchema = z.object({
    projectId: z.string().uuid(),
    email: z.string().email(),
    role: z.enum(["viewer", "editor", "admin"]).default("viewer"),
});

// ============================================
// Billing Schemas
// ============================================

export const createCheckoutSchema = z.object({
    plan: z.enum(["pro"]),
});

// ============================================
// AI Response Schemas (for validation)
// ============================================

export const uxScoreSchema = z.object({
    overall: z.number().int().min(0).max(100),
    categories: z.object({
        visualHierarchy: z.number().int().min(0).max(100),
        typography: z.number().int().min(0).max(100),
        colorUsage: z.number().int().min(0).max(100),
        spacing: z.number().int().min(0).max(100),
        accessibility: z.number().int().min(0).max(100),
        ctaEffectiveness: z.number().int().min(0).max(100),
        navigation: z.number().int().min(0).max(100),
        mobileResponsiveness: z.number().int().min(0).max(100),
    }),
});

export const feedbackItemSchema = z.object({
    category: z.string(),
    severity: z.enum(["critical", "warning", "suggestion"]),
    title: z.string(),
    description: z.string(),
    recommendation: z.string(),
});

export const uxAnalysisResponseSchema = z.object({
    overallScore: z.number().int().min(0).max(100),
    categories: uxScoreSchema.shape.categories,
    feedbackItems: z.array(feedbackItemSchema),
    competitiveInsight: z.string(),
    summary: z.string(),
});

export const abTestResponseSchema = z.object({
    designA: uxScoreSchema,
    designB: uxScoreSchema,
    winner: z.enum(["A", "B", "tie"]),
    dimensions: z.array(
        z.object({
            name: z.string(),
            scoreA: z.number(),
            scoreB: z.number(),
            analysis: z.string(),
        })
    ),
    recommendation: z.string(),
});

export const designTokensResponseSchema = z.object({
    colors: z.array(z.object({ name: z.string(), hex: z.string(), usage: z.string() })),
    fonts: z.array(z.object({ name: z.string(), weight: z.string(), size: z.string(), usage: z.string() })),
    spacing: z.array(z.object({ name: z.string(), value: z.string() })),
    borderRadius: z.array(z.object({ name: z.string(), value: z.string() })),
});

// Export types derived from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UXAnalysisRequest = z.infer<typeof uxAnalysisRequestSchema>;
export type ABTestRequest = z.infer<typeof abTestRequestSchema>;
export type CompetitorSpyRequest = z.infer<typeof competitorSpyRequestSchema>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;

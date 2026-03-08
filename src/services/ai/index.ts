import OpenAI from "openai";
import { env } from "@/config/env";
import { AI_LIMITS } from "@/config/constants";
import { sleep } from "@/lib/utils";
import { uxAnalysisResponseSchema, abTestResponseSchema, designTokensResponseSchema } from "@/schemas";
import type { UXAnalysisResult, ABTestResult, DesignTokens, AnalysisType } from "@/types";
import { getPromptForType } from "@/prompts";

const _isBuildProcess = process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build" || process.env.CI;
const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY || (_isBuildProcess ? "dummy_key_for_build" : "")
});

export class AIServiceError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = "AIServiceError";
    }
}

/**
 * Run an AI analysis with retry logic
 */
async function callWithRetry<T>(
    fn: () => Promise<T>,
    retries = AI_LIMITS.retryAttempts
): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error: unknown) {
            if (attempt === retries) throw error;
            const delay = AI_LIMITS.retryDelayMs * Math.pow(2, attempt);
            console.warn(`AI call attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
    throw new AIServiceError("Exhausted retries", "RETRY_EXHAUSTED");
}

/**
 * Run UX visual analysis on a design screenshot
 */
export async function analyzeDesign(
    imageUrl: string,
    analysisType: AnalysisType = "ux-analysis",
    context?: string
): Promise<UXAnalysisResult> {
    const prompt = getPromptForType(analysisType, context);

    const result = await callWithRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt.system },
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt.user },
                        { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: AI_LIMITS.maxTokensPerRequest,
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new AIServiceError("Empty AI response", "EMPTY_RESPONSE");

        const parsed = JSON.parse(content);
        return uxAnalysisResponseSchema.parse(parsed);
    });

    return result;
}

/**
 * Compare two designs in A/B test
 */
export async function compareDesigns(
    imageUrlA: string,
    imageUrlB: string,
    objective?: string,
    targetAudience?: string
): Promise<ABTestResult> {
    const prompt = getPromptForType("ab-test");

    const result = await callWithRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt.system },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `${prompt.user}\n\nObjective: ${objective || "General UX comparison"}\nTarget Audience: ${targetAudience || "General users"}`,
                        },
                        { type: "image_url", image_url: { url: imageUrlA, detail: "high" } },
                        { type: "image_url", image_url: { url: imageUrlB, detail: "high" } },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: AI_LIMITS.maxTokensPerRequest,
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new AIServiceError("Empty AI response", "EMPTY_RESPONSE");

        return abTestResponseSchema.parse(JSON.parse(content));
    });

    return result;
}

/**
 * Extract design tokens from a screenshot
 */
export async function extractDesignTokens(imageUrl: string): Promise<DesignTokens> {
    const prompt = getPromptForType("tokens");

    const result = await callWithRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt.system },
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt.user },
                        { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: AI_LIMITS.maxTokensPerRequest,
            temperature: 0.2,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new AIServiceError("Empty AI response", "EMPTY_RESPONSE");

        return designTokensResponseSchema.parse(JSON.parse(content));
    });

    return result;
}

/**
 * Analyze a competitor's URL (screenshot-based)
 */
export async function analyzeCompetitor(
    screenshotUrl: string,
    competitorUrl: string,
    context?: string
): Promise<UXAnalysisResult> {
    const prompt = getPromptForType("competitor-spy", context);

    const result = await callWithRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt.system },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `${prompt.user}\n\nCompetitor URL: ${competitorUrl}` },
                        { type: "image_url", image_url: { url: screenshotUrl, detail: "high" } },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: AI_LIMITS.maxTokensPerRequest,
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new AIServiceError("Empty AI response", "EMPTY_RESPONSE");

        return uxAnalysisResponseSchema.parse(JSON.parse(content));
    });

    return result;
}

/**
 * Generate user stories from a feature description
 */
export async function generateUserStories(featureDescription: string): Promise<string> {
    const prompt = getPromptForType("user-stories");

    const result = await callWithRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt.system },
                { role: "user", content: `${prompt.user}\n\nFeature: ${featureDescription}` },
            ],
            max_tokens: AI_LIMITS.maxTokensPerRequest,
            temperature: 0.5,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new AIServiceError("Empty AI response", "EMPTY_RESPONSE");
        return content;
    });

    return result;
}

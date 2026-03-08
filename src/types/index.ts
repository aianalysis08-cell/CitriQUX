import type { Tables } from "./database";

// Re-export database types
export type { Database, AnalysisType, Tables, InsertTables, UpdateTables } from "./database";

// Domain type aliases
export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;
export type Design = Tables<"designs">;
export type AnalysisReport = Tables<"analysis_reports">;
export type ABTest = Tables<"ab_tests">;
export type Feedback = Tables<"feedback">;
export type TeamMember = Tables<"team_members">;
export type Subscription = Tables<"subscriptions">;
export type Credit = Tables<"credits">;
export type AIUsageLog = Tables<"ai_usage_logs">;
export type StripeEvent = Tables<"stripe_events">;
export type AIPrompt = Tables<"ai_prompts">;

// UI-specific types
export interface UXScore {
    overall: number;
    categories: {
        visualHierarchy: number;
        typography: number;
        colorUsage: number;
        spacing: number;
        accessibility: number;
        ctaEffectiveness: number;
        navigation: number;
        mobileResponsiveness: number;
    };
}

export interface FeedbackItem {
    category: string;
    severity: "critical" | "warning" | "suggestion";
    title: string;
    description: string;
    recommendation: string;
}

export interface UXAnalysisResult {
    overallScore: number;
    categories: UXScore["categories"];
    feedbackItems: FeedbackItem[];
    competitiveInsight: string;
    summary: string;
}

export interface ABTestResult {
    designA: UXScore;
    designB: UXScore;
    winner: "A" | "B" | "tie";
    dimensions: {
        name: string;
        scoreA: number;
        scoreB: number;
        analysis: string;
    }[];
    recommendation: string;
}

export interface DesignTokens {
    colors: { name: string; hex: string; usage: string }[];
    fonts: { name: string; weight: string; size: string; usage: string }[];
    spacing: { name: string; value: string }[];
    borderRadius: { name: string; value: string }[];
}

// API response types
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Navigation types
export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    badge?: string;
    disabled?: boolean;
    children?: NavItem[];
}

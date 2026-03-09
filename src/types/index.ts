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

// ── Heatmap Annotator ──────────────────────────────────────

export type AnnotationSeverity = 'critical' | 'warning' | 'suggestion'

export type AnnotationCategory =
    | 'Accessibility'
    | 'Navigation'
    | 'Visual Hierarchy'
    | 'Typography'
    | 'CTA'
    | 'Layout'
    | 'Color Contrast'
    | 'Usability'

export interface HeatmapAnnotation {
    id: string                    // unique id, e.g. "ann_001"
    x: number                     // left offset as PERCENTAGE of image width (0-100)
    y: number                     // top offset as PERCENTAGE of image height (0-100)
    width: number                 // box width as PERCENTAGE of image width (0-100)
    height: number                // box height as PERCENTAGE of image height (0-100)
    severity: AnnotationSeverity
    category: AnnotationCategory
    label: string                 // short label shown on the box e.g. "Low Contrast"
    detail: string                // full explanation shown in tooltip
    recommendation: string        // specific fix to apply
    wcagRule?: string             // e.g. "WCAG 2.1 AA — 1.4.3 Contrast (Minimum)"
    heuristicRule?: string        // e.g. "Nielsen #4 — Consistency and Standards"
}

export interface HeatmapResult {
    annotations: HeatmapAnnotation[]
    imageWidth: number            // natural image width in px (from AI response)
    imageHeight: number           // natural image height in px (from AI response)
    summary: {
        critical: number            // count of critical annotations
        warning: number             // count of warning annotations
        suggestion: number          // count of suggestion annotations
        total: number
    }
    generatedAt: string           // ISO timestamp
}

export interface HeatmapState {
    status: 'idle' | 'loading' | 'success' | 'error'
    result: HeatmapResult | null
    error: string | null
    activeAnnotationId: string | null   // which box is hovered/selected
    visibleSeverities: AnnotationSeverity[]  // filter state
    visibleCategories: AnnotationCategory[]  // filter state
}

// ── Competitor Benchmark ──────────────────────────────────────

export interface BenchmarkSite {
    url: string                        // submitted URL
    domain: string                     // extracted domain e.g. "maze.design"
    label: string                      // user-given label e.g. "My Site"
    isOwn: boolean                     // true for the user's own site
    faviconUrl: string                 // google favicon API URL
}

export interface SiteScores {
    overall: number                    // 0-10
    visualDesign: number
    navigation: number
    accessibility: number
    mobileUX: number
    ctaClarity: number
    pageSpeedFeel: number
    trustSignals: number
    contentQuality: number
    conversionFlow: number
}

export interface SiteAnalysis {
    site: BenchmarkSite
    scores: SiteScores
    rank: number                       // 1 = best overall
    strengths: string[]                // top 3 strengths
    weaknesses: string[]               // top 3 weaknesses
    keyFindings: string                // 2-3 sentence narrative
    aboveTheFold: string               // specific above-fold assessment
    ctaAssessment: string              // specific CTA assessment
    trustAssessment: string            // specific trust signals assessment
}

export type BenchmarkCategory =
    | 'visualDesign'
    | 'navigation'
    | 'accessibility'
    | 'mobileUX'
    | 'ctaClarity'
    | 'pageSpeedFeel'
    | 'trustSignals'
    | 'contentQuality'
    | 'conversionFlow'

export interface CategoryWinner {
    category: BenchmarkCategory
    categoryLabel: string
    winningSite: string                // domain of winner
    winningScore: number
    margin: number                     // gap between 1st and 2nd
}

export interface GapItem {
    category: BenchmarkCategory
    categoryLabel: string
    yourScore: number
    marketAverage: number
    gap: number                        // yourScore - marketAverage (negative = behind)
    severity: 'critical' | 'warning' | 'winning'
    recommendation: string
}

export interface OpportunityItem {
    title: string                      // e.g. "Onboarding Flow"
    description: string                // why this is a blue ocean
    averageScore: number               // how poorly ALL competitors score here
    estimatedImpact: 'high' | 'medium' | 'low'
    effort: 'high' | 'medium' | 'low'
}

export interface AIStrategicInsight {
    positioningStatement: string       // 2-3 sentences on where user stands
    competitiveAdvantages: string[]    // top 3 things user wins on
    criticalGaps: string[]             // top 3 things user loses on
    thirtyDayPlan: {
        week1_2: string
        week3: string
        week4: string
    }
    winProbability: {
        description: string              // e.g. "73% conversion advantage over Hotjar"
        details: string[]
    }
    marketOpening: string              // biggest untapped opportunity
}

export interface BenchmarkResult {
    id: string                         // uuid — saved in Supabase
    userId: string
    sites: SiteAnalysis[]              // sorted by rank (1st = index 0)
    categoryWinners: CategoryWinner[]  // who wins each category
    gapAnalysis: GapItem[]             // gaps for user's own site
    opportunities: OpportunityItem[]   // blue ocean items
    aiInsight: AIStrategicInsight      // strategic narrative
    createdAt: string                  // ISO timestamp
    planUsed: 'free' | 'pro' | 'enterprise'
}

export interface BenchmarkState {
    status: 'idle' | 'loading' | 'success' | 'error'
    loadingStep: number                // 0-5, for animated loading UI
    result: BenchmarkResult | null
    error: string | null
    activeTab: BenchmarkTab
    headToHeadSites: [string, string] | null  // two domains for 1v1
}

export type BenchmarkTab =
    | 'ranking'
    | 'categories'
    | 'head-to-head'
    | 'gaps'
    | 'opportunities'

export interface BenchmarkInputForm {
    ownUrl: string
    ownLabel: string
    competitors: { url: string; label: string }[]  // max 3
    industry: string
    primaryGoal: string
}

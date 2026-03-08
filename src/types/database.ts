/** Database type definitions — auto-generated from Supabase schema */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    name: string | null;
                    email: string;
                    avatar_url: string | null;
                    subscription_plan: "free" | "pro";
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name?: string | null;
                    email: string;
                    avatar_url?: string | null;
                    subscription_plan?: "free" | "pro";
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string | null;
                    email?: string;
                    avatar_url?: string | null;
                    subscription_plan?: "free" | "pro";
                    created_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    owner_id: string;
                    title: string;
                    description: string | null;
                    tags: string[] | null;
                    is_archived: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    owner_id: string;
                    title: string;
                    description?: string | null;
                    tags?: string[] | null;
                    is_archived?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    title?: string;
                    description?: string | null;
                    tags?: string[] | null;
                    is_archived?: boolean;
                    updated_at?: string;
                };
            };
            designs: {
                Row: {
                    id: string;
                    project_id: string;
                    image_url: string;
                    source_type: "upload" | "url" | "figma";
                    original_filename: string | null;
                    uploaded_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    image_url: string;
                    source_type?: "upload" | "url" | "figma";
                    original_filename?: string | null;
                    uploaded_at?: string;
                };
                Update: {
                    image_url?: string;
                    original_filename?: string | null;
                };
            };
            analysis_reports: {
                Row: {
                    id: string;
                    design_id: string;
                    analysis_type: AnalysisType;
                    feedback: Json;
                    scores: Json;
                    ux_score: number;
                    ai_model: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    design_id: string;
                    analysis_type: AnalysisType;
                    feedback: Json;
                    scores: Json;
                    ux_score: number;
                    ai_model: string;
                    created_at?: string;
                };
                Update: {
                    feedback?: Json;
                    scores?: Json;
                    ux_score?: number;
                };
            };
            ab_tests: {
                Row: {
                    id: string;
                    project_id: string;
                    design_a_id: string;
                    design_b_id: string;
                    objective: string | null;
                    target_audience: string | null;
                    winner: string | null;
                    results: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    design_a_id: string;
                    design_b_id: string;
                    objective?: string | null;
                    target_audience?: string | null;
                    winner?: string | null;
                    results?: Json;
                    created_at?: string;
                };
                Update: {
                    winner?: string | null;
                    results?: Json;
                };
            };
            feedback: {
                Row: {
                    id: string;
                    project_id: string;
                    link_token: string;
                    rating: number | null;
                    comment: string | null;
                    tester_email: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    link_token: string;
                    rating?: number | null;
                    comment?: string | null;
                    tester_email?: string | null;
                    created_at?: string;
                };
                Update: {
                    rating?: number | null;
                    comment?: string | null;
                    tester_email?: string | null;
                };
            };
            team_members: {
                Row: {
                    id: string;
                    project_id: string;
                    user_id: string;
                    role: "viewer" | "editor" | "admin";
                    invited_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    user_id: string;
                    role?: "viewer" | "editor" | "admin";
                    invited_at?: string;
                };
                Update: {
                    role?: "viewer" | "editor" | "admin";
                };
            };
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    stripe_customer_id: string | null;
                    stripe_subscription_id: string | null;
                    status: "active" | "canceled" | "past_due" | "trialing";
                    plan: "free" | "pro";
                    current_period_start: string | null;
                    current_period_end: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    stripe_customer_id?: string | null;
                    stripe_subscription_id?: string | null;
                    status?: "active" | "canceled" | "past_due" | "trialing";
                    plan?: "free" | "pro";
                    current_period_start?: string | null;
                    current_period_end?: string | null;
                };
                Update: {
                    stripe_customer_id?: string | null;
                    stripe_subscription_id?: string | null;
                    status?: "active" | "canceled" | "past_due" | "trialing";
                    plan?: "free" | "pro";
                    current_period_start?: string | null;
                    current_period_end?: string | null;
                };
            };
            credits: {
                Row: {
                    id: string;
                    user_id: string;
                    balance: number;
                    daily_used: number;
                    daily_reset_date: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    balance?: number;
                    daily_used?: number;
                    daily_reset_date?: string;
                };
                Update: {
                    balance?: number;
                    daily_used?: number;
                    daily_reset_date?: string;
                };
            };
            ai_usage_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    analysis_type: string;
                    tokens_used: number;
                    cost_usd: number;
                    model: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    analysis_type: string;
                    tokens_used: number;
                    cost_usd: number;
                    model: string;
                    created_at?: string;
                };
                Update: Record<string, never>;
            };
            stripe_events: {
                Row: {
                    id: string;
                    event_id: string;
                    event_type: string;
                    payload: Json;
                    processed_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    event_type: string;
                    payload: Json;
                    processed_at?: string;
                };
                Update: Record<string, never>;
            };
            ai_prompts: {
                Row: {
                    id: string;
                    tool_name: string;
                    system_prompt: string;
                    user_prompt_template: string;
                    version: number;
                    is_active: boolean;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    tool_name: string;
                    system_prompt: string;
                    user_prompt_template: string;
                    version?: number;
                    is_active?: boolean;
                    updated_at?: string;
                };
                Update: {
                    system_prompt?: string;
                    user_prompt_template?: string;
                    version?: number;
                    is_active?: boolean;
                    updated_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        CompositeTypes: Record<string, never>;
        Enums: {
            subscription_plan: "free" | "pro";
            source_type: "upload" | "url" | "figma";
            team_role: "viewer" | "editor" | "admin";
            subscription_status: "active" | "canceled" | "past_due" | "trialing";
            analysis_type:
            | "ux-analysis"
            | "ab-test"
            | "competitor-spy"
            | "redesign"
            | "tokens"
            | "prototype"
            | "user-stories"
            | "contextual-questions";
            feedback_severity: "critical" | "warning" | "suggestion";
        };
        Functions: {
            deduct_credit: {
                Args: { p_user_id: string };
                Returns: undefined;
            };
            get_user_stats: {
                Args: { p_user_id: string };
                Returns: {
                    total_projects: number;
                    total_analyses: number;
                    avg_ux_score: number;
                    credits_remaining: number;
                    analyses_today: number;
                }[];
            };
            get_monthly_usage: {
                Args: { p_user_id: string; p_months?: number };
                Returns: {
                    month: string;
                    analysis_count: number;
                    total_tokens: number;
                    total_cost: number;
                }[];
            };
            reset_monthly_credits: {
                Args: Record<string, never>;
                Returns: undefined;
            };
            generate_feedback_token: {
                Args: Record<string, never>;
                Returns: string;
            };
        };
    };
};

export type AnalysisType =
    | "ux-analysis"
    | "ab-test"
    | "competitor-spy"
    | "redesign"
    | "tokens"
    | "prototype"
    | "user-stories"
    | "contextual-questions";

// Convenience type helpers
export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"];

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Standard API error response
 */
export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}

/**
 * Get the authenticated user from the request, or return 401
 */
export async function getAuthUser() {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return { user: null, supabase, error: errorResponse("Unauthorized", 401) };
    }

    return { user, supabase, error: null };
}

/**
 * Validate request body against a Zod schema
 */
export async function parseBody<T>(
    request: NextRequest,
    schema: { parse: (data: unknown) => T }
): Promise<{ data: T | null; error: NextResponse | null }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { data, error: null };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Invalid request body";
        return { data: null, error: errorResponse(message) };
    }
}

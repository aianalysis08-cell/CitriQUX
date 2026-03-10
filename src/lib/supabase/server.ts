import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


export async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createServerClient<any, "public", any>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key",
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setAll(cookiesToSet: any[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}

export async function createAdminClient() {
    const { createClient } = await import("@supabase/supabase-js");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createClient<any, "public", any>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
        process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
    );
}

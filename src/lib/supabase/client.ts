import { createBrowserClient } from "@supabase/ssr";


export function createClient() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createBrowserClient<any, "public", any>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

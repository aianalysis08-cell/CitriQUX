import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generalApiLimiter } from "@/utils/rate-limit";

const PUBLIC_PATHS = [
    "/",
    "/pricing",
    "/login",
    "/signup",
    "/forgot-password",
    "/feedback",
    "/ai-ux-copilot",
    "/ai-redesign-engine",
    "/heatmap-prediction",
    "/conversion-simulator",
    "/ux-benchmark",
    "/pattern-recognition",
    "/design-system-generator",
    "/behavior-analytics",
    "/prd-generator",
    "/developer-mode"
];
const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths, API routes, static files
    if (
        PUBLIC_PATHS.some((p) => pathname === p) ||
        pathname.startsWith("/api/") ||
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/feedback/") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // Rate Limiting for all API routes
    if (pathname.startsWith("/api/")) {
        const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const { success } = await generalApiLimiter.limit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too Many Requests" },
                { status: 429 }
            );
        }
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key",
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setAll(cookiesToSet: any[]) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        });
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect authenticated users away from auth pages
    if (user && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    if (!user && !PUBLIC_PATHS.some((p) => pathname === p)) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const initialize = useAuthStore((s) => s.initialize);

    useEffect(() => {
        setMounted(true);
        initialize();
    }, [initialize]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {mounted && (
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        className: "glass border-white/10",
                        style: {
                            background: "oklch(0.17 0.01 260)",
                            color: "oklch(0.95 0.01 260)",
                            border: "1px solid oklch(1 0 0 / 0.1)",
                        },
                    }}
                />
            )}
        </QueryClientProvider>
    );
}

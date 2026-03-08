"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
    const { user, session, profile, isLoading, isAuthenticated, signOut } = useAuthStore();

    return {
        user,
        session,
        profile,
        isLoading,
        isAuthenticated,
        signOut,
        isPro: profile?.subscription_plan === "pro",
    };
}

export function useRequireAuth() {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            window.location.href = "/login";
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    return auth;
}

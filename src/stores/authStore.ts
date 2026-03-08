import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    initialize: () => Promise<void>;
    setSession: (session: Session | null) => void;
    setProfile: (profile: Profile | null) => void;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,

    initialize: async () => {
        const supabase = createClient();

        // Get initial session
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

            set({
                user: session.user,
                session,
                profile,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            set({ isLoading: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                set({
                    user: session.user,
                    session,
                    profile,
                    isAuthenticated: true,
                });
            } else {
                set({
                    user: null,
                    session: null,
                    profile: null,
                    isAuthenticated: false,
                });
            }
        });
    },

    setSession: (session) => {
        set({
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session,
        });
    },

    setProfile: (profile) => set({ profile }),

    signOut: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
        });
    },
}));

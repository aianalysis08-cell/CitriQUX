"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Design } from "@/types";

export function useDesigns(projectId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ["designs", projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("designs")
                .select("*")
                .eq("project_id", projectId)
                .order("uploaded_at", { ascending: false });

            if (error) throw error;
            return data as Design[];
        },
        enabled: !!projectId,
    });
}

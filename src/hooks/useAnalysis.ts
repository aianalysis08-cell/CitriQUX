"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { AnalysisReport, UXAnalysisResult } from "@/types";

export function useAnalysisReports(designId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ["analysis-reports", designId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("analysis_reports")
                .select("*")
                .eq("design_id", designId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as AnalysisReport[];
        },
        enabled: !!designId,
    });
}

export function useAnalysisHistory() {
    const supabase = createClient();

    return useQuery({
        queryKey: ["analysis-history"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("analysis_reports")
                .select("*, designs(*, projects(*))")
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;
            return data;
        },
    });
}

export function useRunAnalysis() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: {
            designId: string;
            analysisType: string;
            context?: string;
        }) => {
            const response = await fetch("/api/ai/ux-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Analysis failed");
            }

            return response.json() as Promise<UXAnalysisResult>;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["analysis-reports", variables.designId] });
            queryClient.invalidateQueries({ queryKey: ["analysis-history"] });
        },
    });
}

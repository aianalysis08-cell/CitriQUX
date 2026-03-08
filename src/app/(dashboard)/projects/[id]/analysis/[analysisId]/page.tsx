import type { Metadata } from "next";
export const metadata: Metadata = { title: "Analysis Report" };

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string; analysisId: string }> }) {
  const { id, analysisId } = await params;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analysis Report</h1>
      <p className="text-white/50">Analysis {analysisId} for project {id} — Phase 6</p>
    </div>
  );
}

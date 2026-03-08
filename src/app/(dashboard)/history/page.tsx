import type { Metadata } from "next";
export const metadata: Metadata = { title: "Analysis History" };

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analysis History</h1>
      <p className="text-white/50">History list — Phase 6</p>
    </div>
  );
}

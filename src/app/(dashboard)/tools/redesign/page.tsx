import type { Metadata } from "next";
export const metadata: Metadata = { title: "Redesign" };

export default function RedesignPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Redesign</h1>
      {/* TODO: Redesign tool UI */}
      <p className="text-white/50">Redesign tool will be implemented in Phase 6</p>
    </div>
  );
}

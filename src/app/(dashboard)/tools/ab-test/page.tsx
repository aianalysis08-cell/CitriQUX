import type { Metadata } from "next";
export const metadata: Metadata = { title: "Ab Test" };

export default function AbTestPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Ab Test</h1>
      {/* TODO: AbTest tool UI */}
      <p className="text-white/50">Ab Test tool will be implemented in Phase 6</p>
    </div>
  );
}

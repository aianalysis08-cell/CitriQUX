import type { Metadata } from "next";
export const metadata: Metadata = { title: "Tokens" };

export default function TokensPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tokens</h1>
      {/* TODO: Tokens tool UI */}
      <p className="text-white/50">Tokens tool will be implemented in Phase 6</p>
    </div>
  );
}

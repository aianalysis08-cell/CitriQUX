import type { Metadata } from "next";
export const metadata: Metadata = { title: "Prototype" };

export default function PrototypePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Prototype</h1>
      {/* TODO: Prototype tool UI */}
      <p className="text-white/50">Prototype tool will be implemented in Phase 6</p>
    </div>
  );
}

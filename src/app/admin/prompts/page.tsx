import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin — Prompts" };

export default function AdminPromptsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin — Prompts</h1>
      <p className="text-white/50">Admin prompts — Phase 8</p>
    </div>
  );
}

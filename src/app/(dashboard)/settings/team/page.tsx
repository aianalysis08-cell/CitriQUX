import type { Metadata } from "next";
export const metadata: Metadata = { title: "Team Settings" };

export default function TeamSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Team Settings</h1>
      <p className="text-white/50">Team settings — Phase 6</p>
    </div>
  );
}

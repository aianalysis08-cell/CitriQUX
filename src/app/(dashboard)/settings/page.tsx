import type { Metadata } from "next";
export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <p className="text-white/50">Settings page — Phase 6</p>
    </div>
  );
}

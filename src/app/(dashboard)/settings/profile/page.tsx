import type { Metadata } from "next";
export const metadata: Metadata = { title: "Profile Settings" };

export default function ProfileSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <p className="text-white/50">Profile settings — Phase 6</p>
    </div>
  );
}

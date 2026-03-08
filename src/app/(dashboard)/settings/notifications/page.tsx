import type { Metadata } from "next";
export const metadata: Metadata = { title: "Notifications Settings" };

export default function NotificationsSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Notifications Settings</h1>
      <p className="text-white/50">Notifications settings — Phase 6</p>
    </div>
  );
}

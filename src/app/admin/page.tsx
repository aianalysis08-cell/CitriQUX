import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-white/50">Admin dashboard — Phase 8</p>
    </div>
  );
}

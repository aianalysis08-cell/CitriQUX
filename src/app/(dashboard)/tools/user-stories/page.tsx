import type { Metadata } from "next";
export const metadata: Metadata = { title: "User Stories" };

export default function UserStoriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">User Stories</h1>
      {/* TODO: UserStories tool UI */}
      <p className="text-white/50">User Stories tool will be implemented in Phase 6</p>
    </div>
  );
}

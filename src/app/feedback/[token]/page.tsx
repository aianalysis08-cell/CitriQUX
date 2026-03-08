import type { Metadata } from "next";
export const metadata: Metadata = { title: "Give Feedback" };

export default async function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-900">
      <div className="glass rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold gradient-text mb-6">Share Your Feedback</h1>
        <p className="text-white/50">Feedback form — Phase 6 (token: {token})</p>
      </div>
    </div>
  );
}

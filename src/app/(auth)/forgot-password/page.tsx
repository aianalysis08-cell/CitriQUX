import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="glass rounded-2xl p-8">
      <h1 className="text-2xl font-bold gradient-text mb-6">Reset Password</h1>
      {/* TODO: ForgotPasswordForm component */}
      <p className="text-white/50">Reset form will be implemented in Phase 6</p>
    </div>
  );
}

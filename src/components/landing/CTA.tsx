import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
        <h2 className="text-3xl font-bold mb-4">
          <span className="gradient-text">Ready to improve your UX?</span>
        </h2>
        <p className="text-white/60 mb-8">Join thousands of designers getting AI-powered UX feedback</p>
        <Link href="/signup" className="gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold text-lg glow-primary hover:opacity-90 transition-opacity inline-block">
          Start Free — No Credit Card Required
        </Link>
      </div>
    </section>
  );
}

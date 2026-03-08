import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-900">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-white/60 text-lg mb-8">Page not found</p>
      <Link href="/" className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
        Go Home
      </Link>
    </div>
  );
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Now that LayoutWrapper provides a scrollable flex-1 column,
  // Navbar, main content, and Footer simply stack on top of each other!
  return (
    <>
      <Navbar />
      <main className="flex-1 shrink-0">{children}</main>
      <Footer />
    </>
  );
}

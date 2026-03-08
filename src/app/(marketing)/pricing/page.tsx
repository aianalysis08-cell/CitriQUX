import { Pricing } from "@/components/landing/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="py-20">
      <Pricing />
    </div>
  );
}

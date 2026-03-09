import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CritiqUX - AI-Powered UX Analysis",
  description: "Get instant UX feedback with AI-powered design analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface-950 text-white antialiased`}>
        <NextTopLoader
          color="#a855f7"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #a855f7,0 0 5px #a855f7"
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

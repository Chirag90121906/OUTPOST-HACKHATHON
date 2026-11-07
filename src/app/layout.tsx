import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "GRANTLY — Discover Opportunities. Unlock Your Future.", template: "%s | GRANTLY" },
  description:
    "GRANTLY is a unified scholarship discovery and management platform helping students find relevant opportunities, check eligibility, manage applications, organize documents, and track progress.",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "GRANTLY — Discover Opportunities. Unlock Your Future.",
    description: "Unified scholarship discovery and management for students.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

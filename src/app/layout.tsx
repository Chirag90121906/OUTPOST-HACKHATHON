import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

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
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

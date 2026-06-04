import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krypnova | AI Trading Intelligence",
  description: "AI-powered trading intelligence for crypto and stocks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

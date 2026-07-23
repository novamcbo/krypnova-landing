import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = "https://www.krypnova.com";
const siteName = "Krypnova";
const defaultTitle = "Krypnova | AI Trading Intelligence & Market Analysis";
const defaultDescription =
  "Krypnova is an AI-powered trading intelligence platform for crypto, stocks, forex and futures. Analyze markets, evaluate risk, monitor portfolios and make clearer trading decisions with Exion AI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Krypnova",
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "AI trading intelligence",
    "market analysis",
    "crypto analysis",
    "stock analysis",
    "risk intelligence",
    "portfolio intelligence",
    "Exion AI",
    "Krypnova",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/krypnova-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Krypnova AI Trading Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/krypnova-logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

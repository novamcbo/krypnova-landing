import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.krypnova.com";
  const lastModified = new Date();
  const symbolPages = ["btc", "eth", "sol", "xrp", "aapl", "nvda", "tsla"];

  return [
    { url: baseUrl, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/markets`, lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/ai-trading-platform`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/crypto-analysis`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/stock-analysis`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/market-analysis`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    ...symbolPages.map((symbol) => ({
      url: `${baseUrl}/markets/${symbol}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}

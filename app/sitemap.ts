import { MetadataRoute } from "next";
import { localizedLocales, pathForLocale } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.krypnova.com";
  const symbolPages = ["btc", "eth", "sol", "xrp", "aapl", "nvda", "tsla"];
  const staticPages = [
    { path: "/", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/markets", changeFrequency: "hourly" as const, priority: 0.9 },
    { path: "/ai-trading-platform", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/crypto-analysis", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/stock-analysis", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/market-analysis", changeFrequency: "weekly" as const, priority: 0.85 },
  ];

  const english = [
    ...staticPages.map((page) => ({ url: `${baseUrl}${page.path === "/" ? "" : page.path}`, changeFrequency: page.changeFrequency, priority: page.priority })),
    ...symbolPages.map((symbol) => ({ url: `${baseUrl}/markets/${symbol}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];

  const localized = localizedLocales.flatMap((locale) => [
    ...staticPages.map((page) => ({ url: `${baseUrl}${pathForLocale(page.path, locale)}`, changeFrequency: page.changeFrequency, priority: Math.max(0.7, page.priority - 0.05) })),
    ...symbolPages.map((symbol) => ({ url: `${baseUrl}${pathForLocale(`/markets/${symbol}`, locale)}`, changeFrequency: "daily" as const, priority: 0.78 })),
  ]);

  return [...english, ...localized];
}

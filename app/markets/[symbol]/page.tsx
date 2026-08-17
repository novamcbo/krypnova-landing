import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SymbolAnalysisContent, { assetFromSlug, seoTitle, trackedAssets } from "./SymbolAnalysisContent";
import { alternateLanguages } from "@/lib/i18n";

export const revalidate = 60;

const siteUrl = "https://www.krypnova.com";

type PageProps = { params: { symbol: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const asset = assetFromSlug(params.symbol);
  const knownAsset = Boolean(trackedAssets[params.symbol.toLowerCase()]);
  const canonical = `/markets/${params.symbol.toLowerCase()}`;
  const title = seoTitle("en", asset.name, asset.symbol);
  const description = `${asset.name} (${asset.symbol}) price, market analysis, trading signals and market outlook from Krypnova. View live chart context and Exion intelligence refreshed throughout the day.`;

  return {
    title,
    description,
    alternates: { canonical, languages: alternateLanguages(canonical) },
    robots: knownAsset ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { type: "article", url: `${siteUrl}${canonical}`, title: `${title} | Krypnova`, description, images: ["/krypnova-logo.jpeg"] },
    twitter: { card: "summary_large_image", title: `${title} | Krypnova`, description, images: ["/krypnova-logo.jpeg"] },
  };
}

export default function SymbolPage({ params }: PageProps) {
  if (!trackedAssets[params.symbol.toLowerCase()]) notFound();
  return <SymbolAnalysisContent symbolSlug={params.symbol} locale="en" />;
}

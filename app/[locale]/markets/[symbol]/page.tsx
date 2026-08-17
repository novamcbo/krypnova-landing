import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SymbolAnalysisContent, { assetFromSlug, seoTitle, trackedAssets } from "../../../markets/[symbol]/SymbolAnalysisContent";
import { alternateLanguages, isLocalizedLocale, pathForLocale, type LocalizedLocale } from "@/lib/i18n";

export const revalidate = 60;

const siteUrl = "https://www.krypnova.com";

type PageProps = { params: { locale: string; symbol: string } };

function resolveLocale(value: string): LocalizedLocale {
  if (!isLocalizedLocale(value)) notFound();
  return value;
}

function descriptionFor(locale: LocalizedLocale, name: string, symbol: string): string {
  if (locale === "es") return `${name} (${symbol}): precio, análisis de mercado, señales y perspectiva en Krypnova. Consulta el chart y la inteligencia de Exion actualizados durante el día.`;
  if (locale === "pt") return `${name} (${symbol}): preço, análise de mercado, sinais e perspectiva na Krypnova. Veja o gráfico e a inteligência da Exion atualizados ao longo do dia.`;
  return `${name} (${symbol}) : prix, analyse de marché, signaux et perspectives sur Krypnova. Consultez le graphique et l'intelligence Exion mis à jour au cours de la journée.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale(params.locale);
  const asset = assetFromSlug(params.symbol);
  const knownAsset = Boolean(trackedAssets[params.symbol.toLowerCase()]);
  const basePath = `/markets/${params.symbol.toLowerCase()}`;
  const canonical = pathForLocale(basePath, locale);
  const title = seoTitle(locale, asset.name, asset.symbol);
  const description = descriptionFor(locale, asset.name, asset.symbol);

  return {
    title: { absolute: `${title} | Krypnova` },
    description,
    alternates: { canonical, languages: alternateLanguages(basePath) },
    robots: knownAsset ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "article",
      url: `${siteUrl}${canonical}`,
      title: `${title} | Krypnova`,
      description,
      locale: locale === "es" ? "es_ES" : locale === "pt" ? "pt_BR" : "fr_FR",
      images: ["/krypnova-logo.jpeg"],
    },
    twitter: { card: "summary_large_image", title: `${title} | Krypnova`, description, images: ["/krypnova-logo.jpeg"] },
  };
}

export default function LocalizedSymbolPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  if (!trackedAssets[params.symbol.toLowerCase()]) notFound();
  return <SymbolAnalysisContent symbolSlug={params.symbol} locale={locale} />;
}

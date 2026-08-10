import Link from "next/link";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { pathForLocale, type Locale } from "@/lib/i18n";
import styles from "./DailyAnalysisGrid.module.css";

const assets = [
  { slug: "btc", symbol: "BTC", name: "Bitcoin", category: "crypto" },
  { slug: "eth", symbol: "ETH", name: "Ethereum", category: "crypto" },
  { slug: "sol", symbol: "SOL", name: "Solana", category: "crypto" },
  { slug: "xrp", symbol: "XRP", name: "XRP", category: "crypto" },
  { slug: "aapl", symbol: "AAPL", name: "Apple", category: "stock" },
  { slug: "nvda", symbol: "NVDA", name: "NVIDIA", category: "stock" },
  { slug: "tsla", symbol: "TSLA", name: "Tesla", category: "stock" },
] as const;

const copy = {
  en: {
    eyebrow: "Daily Exion AI analysis",
    title: "Daily AI Market Analysis",
    intro: "Open a permanent daily analysis page for the assets Krypnova tracks most closely. These pages remain available even when an asset is not among the latest live signals.",
    crypto: "Crypto",
    stock: "Stock",
    open: "View daily analysis",
    note: "Updated daily",
  },
  es: {
    eyebrow: "Análisis diario de Exion AI",
    title: "Análisis diario de mercado con IA",
    intro: "Abre una página permanente de análisis diario para los activos que Krypnova sigue más de cerca. Estas páginas permanecen disponibles aunque un activo no aparezca entre las señales en vivo más recientes.",
    crypto: "Cripto",
    stock: "Acción",
    open: "Ver análisis diario",
    note: "Actualizado diariamente",
  },
  pt: {
    eyebrow: "Análise diária da Exion AI",
    title: "Análise diária de mercado com IA",
    intro: "Abra uma página permanente de análise diária para os ativos que a Krypnova acompanha mais de perto. Essas páginas continuam disponíveis mesmo quando um ativo não aparece entre os sinais ao vivo mais recentes.",
    crypto: "Cripto",
    stock: "Ação",
    open: "Ver análise diária",
    note: "Atualizado diariamente",
  },
  fr: {
    eyebrow: "Analyse quotidienne Exion AI",
    title: "Analyse quotidienne du marché par IA",
    intro: "Ouvrez une page permanente d'analyse quotidienne pour les actifs suivis de près par Krypnova. Ces pages restent disponibles même lorsqu'un actif ne figure pas parmi les signaux en direct les plus récents.",
    crypto: "Crypto",
    stock: "Action",
    open: "Voir l'analyse quotidienne",
    note: "Mis à jour chaque jour",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function DailyAnalysisGrid({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];

  return (
    <section className={styles.section} aria-labelledby="daily-ai-market-analysis">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}><Sparkles size={15} /> {t.eyebrow}</span>
          <h2 id="daily-ai-market-analysis">{t.title}</h2>
          <p>{t.intro}</p>
        </div>
        <div className={styles.updateNote}><BrainCircuit size={16} /> {t.note}</div>
      </div>

      <div className={styles.grid}>
        {assets.map((asset) => (
          <Link
            key={asset.slug}
            href={pathForLocale(`/markets/${asset.slug}`, locale)}
            className={styles.card}
          >
            <div className={styles.cardTop}>
              <span className={styles.symbol}>{asset.symbol}</span>
              <span className={styles.category}>{asset.category === "crypto" ? t.crypto : t.stock}</span>
            </div>
            <h3>{asset.name}</h3>
            <p>Exion AI</p>
            <span className={styles.linkText}>{t.open} <ArrowRight size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

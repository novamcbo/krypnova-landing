import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { findMarketSnapshot, findSymbolSignal } from "@/lib/live-signals";
import styles from "./symbol.module.css";

export const revalidate = 86_400;

const siteUrl = "https://www.krypnova.com";

const trackedAssets: Record<
  string,
  { symbol: string; name: string; category: "Crypto" | "Stock" }
> = {
  btc: { symbol: "BTC", name: "Bitcoin", category: "Crypto" },
  eth: { symbol: "ETH", name: "Ethereum", category: "Crypto" },
  sol: { symbol: "SOL", name: "Solana", category: "Crypto" },
  xrp: { symbol: "XRP", name: "XRP", category: "Crypto" },
  aapl: { symbol: "AAPL", name: "Apple", category: "Stock" },
  nvda: { symbol: "NVDA", name: "NVIDIA", category: "Stock" },
  tsla: { symbol: "TSLA", name: "Tesla", category: "Stock" },
};

type PageProps = {
  params: { symbol: string };
};

function assetFromSlug(raw: string) {
  const slug = raw.toLowerCase();
  return trackedAssets[slug] ?? {
    symbol: raw.toUpperCase(),
    name: raw.toUpperCase(),
    category: "Crypto" as const,
  };
}

async function loadAsset(symbol: string) {
  try {
    const [signal, snapshot] = await Promise.all([
      findSymbolSignal(symbol),
      findMarketSnapshot(symbol),
    ]);
    return { signal, snapshot };
  } catch {
    return { signal: null, snapshot: null };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const asset = assetFromSlug(params.symbol);
  const knownAsset = Boolean(trackedAssets[params.symbol.toLowerCase()]);
  const { signal } = await loadAsset(asset.symbol);
  const canonical = `/markets/${params.symbol.toLowerCase()}`;
  const signalText = signal
    ? ` Latest Exion AI signal: ${signal.signal}${signal.confidence !== null ? ` with ${Math.round(signal.confidence)}% confidence` : ""}.`
    : "";
  const description = `${asset.name} (${asset.symbol}) AI market analysis from Krypnova. Review signal direction, confidence, expected ROI, risk/reward and risk score, refreshed daily.${signalText}`;

  return {
    title: `${asset.name} (${asset.symbol}) AI Analysis Today`,
    description,
    alternates: { canonical },
    robots: knownAsset ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "article",
      url: `${siteUrl}${canonical}`,
      title: `${asset.name} (${asset.symbol}) AI Analysis Today | Krypnova`,
      description,
      images: ["/krypnova-logo.jpeg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${asset.name} (${asset.symbol}) AI Analysis Today | Krypnova`,
      description,
      images: ["/krypnova-logo.jpeg"],
    },
  };
}

export default async function SymbolAnalysisPage({ params }: PageProps) {
  const slug = params.symbol.toLowerCase();
  const asset = assetFromSlug(slug);
  const { signal, snapshot } = await loadAsset(asset.symbol);
  const updatedAt = signal?.updatedAt ?? snapshot?.updatedAt ?? null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${asset.name} (${asset.symbol}) AI Market Analysis`,
    description: `Daily AI-powered ${asset.name} market analysis from Krypnova and Exion AI.`,
    url: `${siteUrl}/markets/${slug}`,
    dateModified: updatedAt ?? undefined,
    isPartOf: {
      "@type": "WebSite",
      name: "Krypnova",
      url: siteUrl,
    },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <Image src="/krypnova-logo.jpeg" alt="Krypnova" width={42} height={42} priority />
          <span>KRYPNOVA</span>
        </Link>
        <Link className={styles.backLink} href="/markets">
          <ArrowLeft size={16} /> Live Markets
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={15} /> Daily Exion AI Symbol Analysis
        </div>
        <p className={styles.eyebrow}>{asset.category} · {asset.symbol}</p>
        <h1>{asset.name} ({asset.symbol}) AI Analysis Today</h1>
        <p className={styles.lead}>
          Krypnova uses Exion AI to evaluate the latest available market signal, confidence,
          expected return, risk/reward and risk score for {asset.name}. This public page is
          refreshed daily for search and market-intelligence discovery.
        </p>
        <div className={styles.actions}>
          <Link href="https://app.krypnova.com" className={styles.primaryButton}>
            Open Full Exion AI <ArrowRight size={17} />
          </Link>
          <Link href="/markets" className={styles.secondaryButton}>View Live Markets</Link>
        </div>
      </section>

      <section className={styles.signalSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>Latest assessment</span>
            <h2>Exion AI signal for {asset.symbol}</h2>
          </div>
          <span className={styles.updated}>
            {updatedAt ? `Updated ${formatDate(updatedAt)}` : "Awaiting fresh market data"}
          </span>
        </div>

        {signal ? (
          <div className={styles.signalCard}>
            <div className={styles.signalTop}>
              <div>
                <span>{signal.exchange}</span>
                <strong>{formatPair(signal.symbol)}</strong>
              </div>
              <b className={styles.direction}>{signal.signal}</b>
            </div>

            <div className={styles.metrics}>
              <Metric label="Price" value={formatPrice(signal.price ?? snapshot?.price ?? null)} />
              <Metric label="Confidence" value={formatPercent(signal.confidence)} />
              <Metric label="Expected ROI" value={formatSignedPercent(signal.expectedRoi)} />
              <Metric label="Risk / Reward" value={formatRatio(signal.riskReward)} />
              <Metric label="Risk Score" value={formatScore(signal.riskScore)} />
              <Metric label="Market Bias" value={signal.marketBias?.toUpperCase() ?? "—"} />
            </div>
          </div>
        ) : snapshot ? (
          <div className={styles.signalCard}>
            <div className={styles.signalTop}>
              <div>
                <span>{snapshot.exchange}</span>
                <strong>{formatPair(snapshot.symbol)}</strong>
              </div>
              <b className={styles.monitoring}>MONITORING</b>
            </div>
            <div className={styles.metrics}>
              <Metric label="Price" value={formatPrice(snapshot.price)} />
              <Metric label="24h Change" value={formatSignedPercent(snapshot.pctChange)} />
              <Metric label="AI Signal" value="Pending" />
              <Metric label="Confidence" value="—" />
              <Metric label="Risk / Reward" value="—" />
              <Metric label="Risk Score" value="—" />
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BrainCircuit size={36} />
            <h3>Exion AI is monitoring {asset.symbol}</h3>
            <p>A fresh public assessment will appear here when the next scored signal is available.</p>
          </div>
        )}
      </section>

      <section className={styles.explainer}>
        <div>
          <span className={styles.eyebrow}>How to read this page</span>
          <h2>One daily public snapshot, deeper intelligence inside Krypnova.</h2>
        </div>
        <div className={styles.explainerGrid}>
          <article>
            <BrainCircuit size={28} />
            <h3>Signal</h3>
            <p>Exion classifies the latest assessed opportunity as LONG, SHORT, WATCH or REJECT.</p>
          </article>
          <article>
            <Sparkles size={28} />
            <h3>Confidence & return</h3>
            <p>Confidence and expected ROI summarize the strength of the current model assessment.</p>
          </article>
          <article>
            <ShieldCheck size={28} />
            <h3>Risk first</h3>
            <p>Risk/reward and risk score add context before any trading or investing decision.</p>
          </article>
        </div>
      </section>

      <section className={styles.related}>
        <span className={styles.eyebrow}>More daily analysis</span>
        <h2>Explore other assets monitored by Krypnova</h2>
        <div className={styles.relatedGrid}>
          {Object.entries(trackedAssets)
            .filter(([key]) => key !== slug)
            .slice(0, 6)
            .map(([key, item]) => (
              <Link key={key} href={`/markets/${key}`}>
                <span>{item.category}</span>
                <strong>{item.name} ({item.symbol})</strong>
              </Link>
            ))}
        </div>
      </section>

      <section className={styles.disclosure}>
        <ShieldCheck size={18} />
        <p>
          Krypnova provides market intelligence and decision-support tools, not financial advice.
          Trading and investing involve risk. Public signals may be delayed, incomplete or based on paper-mode analysis.
        </p>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

function formatPrice(value: number | null): string {
  if (value === null) return "—";
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: value >= 1000 ? 2 : value >= 1 ? 4 : 6,
  })}`;
}

function formatPercent(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function formatSignedPercent(value: number | null): string {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatRatio(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(2)} : 1`;
}

function formatScore(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)} / 100`;
}

function formatPair(value: string): string {
  if (value.includes("/")) return value;
  if (value.includes("-")) return value.replace("-", "/");
  const quote = ["USDT", "USDC", "USD", "EUR"].find((q) => value.endsWith(q));
  return quote ? `${value.slice(0, -quote.length)}/${quote}` : value;
}

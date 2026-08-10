import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { buildSnapshotSummary, buildSummary, isAssessed } from "@/lib/analyze";
import { findMarketSnapshot, findSymbolSignal } from "@/lib/live-signals";
import styles from "./symbol.module.css";

export const revalidate = 300;

const siteUrl = "https://www.krypnova.com";
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

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
  const description = `${asset.name} (${asset.symbol}) AI market analysis from Krypnova. Review signal direction, confidence, expected ROI, risk/reward and risk score, refreshed throughout the day.${signalText}`;

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
  const assessed = signal ? isAssessed(signal) : false;
  const analysisSummary = signal
    ? buildSummary(signal)
    : snapshot
      ? buildSnapshotSummary(snapshot)
      : null;
  const stale = isStale(updatedAt);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${asset.name} (${asset.symbol}) AI Market Analysis`,
    description: `AI-powered ${asset.name} market analysis from Krypnova and Exion AI.`,
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
          <Sparkles size={15} /> Exion AI Symbol Intelligence
        </div>
        <p className={styles.eyebrow}>{asset.category} · {asset.symbol}</p>
        <h1>{asset.name} ({asset.symbol}) AI Analysis Today</h1>
        <p className={styles.lead}>
          Krypnova uses Exion AI to evaluate the latest public market context for {asset.name}.
          When Exion has a scored setup, this page shows the signal, confidence and risk metrics.
          When no setup is scored, it shows the latest market context without inventing a trade call.
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
            <h2>Exion AI read for {asset.symbol}</h2>
          </div>
          <span className={styles.updated}>
            {updatedAt ? `Updated ${formatDate(updatedAt)}` : "Awaiting market data"}
          </span>
        </div>

        {signal ? (
          <div className={styles.signalCard}>
            <div className={styles.signalTop}>
              <div>
                <span>{signal.exchange}</span>
                <strong>{formatPair(signal.symbol)}</strong>
              </div>
              <b className={assessed ? styles.direction : styles.monitoring}>
                {assessed ? signal.signal : "MONITORING"}
              </b>
            </div>

            {analysisSummary && (
              <div className={styles.analysisSummary}>
                <span>EXION AI READ</span>
                <p>{analysisSummary}</p>
                {stale && (
                  <small>
                    Data note: this is the newest public Exion record currently available for this asset,
                    but it is older than six hours. Treat it as context, not a fresh trade signal.
                  </small>
                )}
              </div>
            )}

            <div className={styles.metrics}>
              <Metric label="Price" value={formatPrice(signal.price ?? snapshot?.price ?? null)} />
              <Metric label="AI State" value={assessed ? signal.signal : "Watching"} />
              <Metric label="Confidence" value={assessed ? formatPercent(signal.confidence) : "Not scored"} />
              <Metric label="Expected ROI" value={signal.expectedRoi !== null ? formatSignedPercent(signal.expectedRoi) : "Not scored"} />
              <Metric label="Risk / Reward" value={signal.riskReward !== null ? formatRatio(signal.riskReward) : "Not scored"} />
              <Metric label="Risk Score" value={signal.riskScore !== null ? formatScore(signal.riskScore) : "Not scored"} />
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

            {analysisSummary && (
              <div className={styles.analysisSummary}>
                <span>EXION AI MARKET CONTEXT</span>
                <p>{analysisSummary}</p>
                <small>
                  No fresh scored LONG/SHORT setup is present in the public Exion feed, so Krypnova
                  does not fabricate confidence, ROI or risk values.
                </small>
                {stale && (
                  <small className={styles.dataNote}>
                    Freshness warning: the newest connected public snapshot is older than six hours.
                  </small>
                )}
              </div>
            )}

            <div className={styles.metrics}>
              <Metric label="Price" value={formatPrice(snapshot.price)} />
              <Metric label="24h Change" value={formatSignedPercent(snapshot.pctChange)} />
              <Metric label="AI State" value="No scored setup" />
              <Metric label="Volume" value={formatVolume(snapshot.volume)} />
              <Metric label="Confidence" value="Not scored" />
              <Metric label="Risk Model" value="Awaiting setup" />
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BrainCircuit size={36} />
            <h3>Exion AI is monitoring {asset.symbol}</h3>
            <p>
              No public market record is available right now. Krypnova will show the next connected
              snapshot or scored Exion assessment here as soon as it becomes available.
            </p>
          </div>
        )}
      </section>

      <section className={styles.explainer}>
        <div>
          <span className={styles.eyebrow}>How to read this page</span>
          <h2>Market context first. Scored trade intelligence only when Exion has enough evidence.</h2>
        </div>
        <div className={styles.explainerGrid}>
          <article>
            <BrainCircuit size={28} />
            <h3>AI state</h3>
            <p>MONITORING means Exion has market context but no fresh scored setup. LONG, SHORT, WATCH or REJECT appear only when a decision record exists.</p>
          </article>
          <article>
            <Sparkles size={28} />
            <h3>Confidence & return</h3>
            <p>Confidence and expected ROI are shown only when Exion has actually scored them. Missing values are never estimated for presentation.</p>
          </article>
          <article>
            <ShieldCheck size={28} />
            <h3>Risk first</h3>
            <p>Risk/reward and risk score remain hidden until the connected Exion assessment provides those values.</p>
          </article>
        </div>
      </section>

      <section className={styles.related}>
        <span className={styles.eyebrow}>More market intelligence</span>
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

function isStale(value: string | null): boolean {
  if (!value) return false;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? false : Date.now() - timestamp > STALE_AFTER_MS;
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
  if (value === null) return "Not available";
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: value >= 1000 ? 2 : value >= 1 ? 4 : 6,
  })}`;
}

function formatPercent(value: number | null): string {
  return value === null ? "Not scored" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function formatSignedPercent(value: number | null): string {
  if (value === null) return "Not available";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatRatio(value: number | null): string {
  return value === null ? "Not scored" : `${value.toFixed(2)} : 1`;
}

function formatScore(value: number | null): string {
  return value === null ? "Not scored" : `${Math.round(value)} / 100`;
}

function formatVolume(value: number | null): string {
  if (value === null) return "Not available";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}

function formatPair(value: string): string {
  if (value.includes("/")) return value;
  if (value.includes("-")) return value.replace("-", "/");
  const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/);
  if (kraken) return `${kraken[1] === "XBT" ? "BTC" : kraken[1]}/${kraken[2]}`;
  const quote = ["USDT", "USDC", "USD", "EUR"].find((q) => value.endsWith(q));
  return quote ? `${value.slice(0, -quote.length)}/${quote}` : value;
}

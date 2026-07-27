"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type {
  PublicMarketSignal,
  PublicSignalsResponse,
} from "@/lib/signal-types";
import styles from "@/app/markets/markets.module.css";

const REFRESH_INTERVAL_MS = 60_000;

export default function LiveSignals() {
  const [data, setData] = useState<PublicSignalsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/public/live-signals?limit=8&mode=paper", {
        cache: "no-store",
      });
      const body = (await response.json()) as PublicSignalsResponse;
      setData(body);
    } catch {
      setData({
        signals: [],
        mode: "Paper",
        generatedAt: new Date().toISOString(),
        stale: true,
        message: "Live market intelligence is temporarily unavailable.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <section className={styles.signalSection} aria-live="polite">
      <div className={styles.signalHeader}>
        <div>
          <span className={styles.eyebrow}>Powered by Exion AI</span>
          <h2>
            Live Market Intelligence
            {!data?.stale && (
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} /> LIVE
              </span>
            )}
          </h2>
          <p>
            Public, explainable market assessments across connected exchanges. Detailed
            entries, exits, sizing, and reasoning remain available inside Krypnova.
          </p>
        </div>

        <button className={styles.refreshButton} onClick={() => void refresh()} disabled={loading}>
          <RefreshCw size={16} className={loading ? styles.spinning : undefined} />
          Refresh
        </button>
      </div>

      {data?.stats && (
        <div className={styles.statsRow}>
          <span>
            <strong>{data.stats.decisionsLast24h.toLocaleString("en")}</strong> AI decisions in the last 24h
          </span>
          <span>
            <strong>{data.stats.assetsMonitored}</strong> assets monitored
          </span>
          {data.stats.lastDecisionAt && (
            <span>
              Last decision <strong>{formatRelative(data.stats.lastDecisionAt)}</strong>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className={styles.signalGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.skeletonCard} key={index} />
          ))}
        </div>
      ) : data?.signals.length ? (
        <div className={styles.signalGrid}>
          {data.signals.map((signal) => (
            <SignalCard signal={signal} key={`${signal.exchange}-${signal.symbol}`} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <BrainCircuit size={34} />
          <h3>Exion AI is monitoring the market</h3>
          <p>{data?.message ?? "No public signals are available at this moment."}</p>
        </div>
      )}

      <div className={styles.disclosureRow}>
        <span>
          <ShieldCheck size={16} /> Paper-mode intelligence for demonstration. Not financial advice.
        </span>
        <span>
          Updated {data ? formatRelative(data.generatedAt) : "now"}
          {data?.stale ? " · Connection delayed" : " · Auto-refreshes every minute"}
        </span>
      </div>
    </section>
  );
}

function SignalCard({ signal }: { signal: PublicMarketSignal }) {
  const directionClass =
    signal.signal === "LONG"
      ? styles.long
      : signal.signal === "SHORT"
        ? styles.short
        : signal.signal === "REJECT"
          ? styles.reject
          : styles.watch;

  // A WAIT decision with zeroed metrics means Exion has not scored this
  // asset yet — dashes plus a "Scanning" state read as activity, while a
  // wall of 0% reads as an outage.
  const assessed = Boolean(
    signal.confidence || signal.alpha || signal.expectedRoi || signal.riskScore !== null,
  );

  return (
    <article className={styles.signalCard}>
      <div className={styles.cardTop}>
        <div>
          <span>{signal.exchange}</span>
          <h3>{formatSymbol(signal.symbol)}</h3>
        </div>
        <strong className={`${styles.direction} ${directionClass}`}>
          {assessed ? signal.signal : "SCANNING"}
        </strong>
      </div>

      {signal.price !== null && (
        <p className={styles.priceRow}>{formatPrice(signal.price)}</p>
      )}

      <div className={styles.metricsGrid}>
        <Metric label="Confidence" value={assessed ? formatPercent(signal.confidence) : "—"} />
        <Metric label="Alpha" value={assessed ? formatPercent(signal.alpha) : "—"} />
        <Metric label="Expected ROI" value={assessed ? formatSignedPercent(signal.expectedRoi) : "—"} />
        <Metric label="Risk / Reward" value={assessed ? formatRatio(signal.riskReward) : "—"} />
        <Metric label="Risk Score" value={formatScore(signal.riskScore)} />
        <Metric
          label="Updated"
          value={formatDateTime(signal.updatedAt)}
          title={formatRelative(signal.updatedAt)}
        />
      </div>

      <Link href="https://app.krypnova.com" className={styles.unlockButton}>
        Unlock Exion AI <ArrowRight size={16} />
      </Link>
    </article>
  );
}

function Metric({
  label,
  value,
  title,
}: {
  label: string;
  value: string;
  title?: string;
}) {
  return (
    <div className={styles.metric} title={title}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatPercent(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function formatSignedPercent(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatRatio(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(2)} : 1`;
}

function formatScore(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)} / 100`;
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

// Visitors asked when a call was made, not how long ago — "Jul 27, 04:14" is
// auditable, "just now" is not. Rendered client-side, so it lands in the
// visitor's own timezone.
function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatPrice(value: number): string {
  const fractionDigits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  })}`;
}

function formatRelative(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatTime(value);
}

function formatSymbol(value: string): string {
  if (value.includes("/")) return value;
  if (value.includes("-")) return value.replace("-", "/");
  // Kraken legacy pairs look like XXLMZUSD (X<base>Z<quote>).
  const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/);
  if (kraken) {
    const base = kraken[1] === "XBT" ? "BTC" : kraken[1];
    return `${base}/${kraken[2]}`;
  }
  const quote = ["USDT", "USDC", "USD", "EUR"].find((q) => value.endsWith(q) && value.length > q.length);
  return quote ? `${value.slice(0, -quote.length)}/${quote}` : value;
}

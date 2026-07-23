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
          <h2>Live Market Intelligence</h2>
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
          Updated {data ? formatTime(data.generatedAt) : "now"}
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

  return (
    <article className={styles.signalCard}>
      <div className={styles.cardTop}>
        <div>
          <span>{signal.exchange}</span>
          <h3>{signal.symbol}</h3>
        </div>
        <strong className={`${styles.direction} ${directionClass}`}>{signal.signal}</strong>
      </div>

      <div className={styles.metricsGrid}>
        <Metric label="Confidence" value={formatPercent(signal.confidence)} />
        <Metric label="Alpha" value={formatPercent(signal.alpha)} />
        <Metric label="Expected ROI" value={formatSignedPercent(signal.expectedRoi)} />
        <Metric label="Risk / Reward" value={formatRatio(signal.riskReward)} />
        <Metric label="Risk Score" value={formatScore(signal.riskScore)} />
        <Metric label="Updated" value={formatTime(signal.updatedAt)} />
      </div>

      <Link href="https://app.krypnova.com" className={styles.unlockButton}>
        Unlock Full Signal <ArrowRight size={16} />
      </Link>
    </article>
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

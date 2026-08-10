import { createHash } from "node:crypto";
import { pool } from "@/lib/db";
import type { MarketSnapshot, PublicMarketSignal } from "@/lib/signal-types";

const QUOTA_WINDOW_HOURS = 24;

const hashSalt =
  process.env.VISITOR_HASH_SALT ?? "krypnova-public-analyze-v1";

export interface QuotaStatus {
  allowed: boolean;
  resetAt: string | null;
}

// Salted hash so raw IPs are never stored and hashes cannot be precomputed.
export function visitorHash(ip: string, userAgent: string): string {
  return createHash("sha256")
    .update(`${ip}|${userAgent}|${hashSalt}`)
    .digest("hex");
}

let tableReady: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      if (!pool) throw new Error("The visitor database is not configured.");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public_analyses (
          id BIGSERIAL PRIMARY KEY,
          visitor_hash TEXT NOT NULL,
          symbol TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_public_analyses_visitor
        ON public_analyses (visitor_hash, created_at DESC)
      `);
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  return tableReady;
}

export async function checkQuota(hash: string): Promise<QuotaStatus> {
  if (!pool) throw new Error("The visitor database is not configured.");
  await ensureTable();

  const result = await pool.query<{ created_at: Date }>(
    `
      SELECT created_at
      FROM public_analyses
      WHERE visitor_hash = $1
        AND created_at > now() - interval '${QUOTA_WINDOW_HOURS} hours'
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [hash],
  );

  const last = result.rows[0]?.created_at;
  if (!last) return { allowed: true, resetAt: null };

  const resetAt = new Date(
    new Date(last).getTime() + QUOTA_WINDOW_HOURS * 3_600_000,
  );
  return { allowed: false, resetAt: resetAt.toISOString() };
}

// Only called after a successful analysis so failed lookups never burn the
// visitor's free query.
export async function recordAnalysis(
  hash: string,
  symbol: string,
): Promise<string> {
  if (!pool) throw new Error("The visitor database is not configured.");
  await ensureTable();

  await pool.query(
    `INSERT INTO public_analyses (visitor_hash, symbol) VALUES ($1, $2)`,
    [hash, symbol],
  );
  return new Date(Date.now() + QUOTA_WINDOW_HOURS * 3_600_000).toISOString();
}

// A signal with real conviction metrics. Bare WAIT rows with zeroed scores
// mean Exion is watching the asset but has not scored a setup yet.
export function isAssessed(signal: PublicMarketSignal): boolean {
  return Boolean(signal.confidence || signal.alpha);
}

function formatPrice(value: number): string {
  const fractionDigits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  })}`;
}

function structureSentence(signal: PublicMarketSignal): string {
  const parts: string[] = [];
  if (signal.marketBias) {
    const bias =
      signal.marketBias === "long"
        ? "bullish"
        : signal.marketBias === "short"
          ? "bearish"
          : "neutral";
    parts.push(`order-flow bias is ${bias}`);
  }
  if (signal.auctionState) {
    parts.push(`the auction is in ${signal.auctionState.replace(/_/g, " ")}`);
  }
  return parts.length > 0 ? ` Market structure: ${parts.join(" and ")}.` : "";
}

export function buildSnapshotSummary(snapshot: MarketSnapshot): string {
  const priceClause =
    snapshot.price !== null ? ` is trading at ${formatPrice(snapshot.price)}` : "";
  const moveClause =
    snapshot.pctChange !== null
      ? `, ${snapshot.pctChange >= 0 ? "up" : "down"} ${Math.abs(snapshot.pctChange).toFixed(2)}% today`
      : "";

  return `${snapshot.symbol} (${snapshot.exchange})${priceClause}${moveClause}. Krypnova is monitoring this market for new Exion setups. Scored entries, exits and risk guidance appear only when Exion publishes a qualifying decision.`;
}

export function buildSummary(signal: PublicMarketSignal): string {
  const priceClause =
    signal.price !== null ? ` is trading at ${formatPrice(signal.price)} and` : "";

  if (!isAssessed(signal)) {
    return `${signal.symbol} (${signal.exchange})${priceClause} is on Exion AI's active watchlist, but no high-conviction setup has formed yet — protecting capital comes first.${structureSentence(signal)} Check back soon, or join Krypnova to see the full market picture the moment conditions change.`;
  }

  const setup =
    signal.signal === "LONG"
      ? "a LONG opportunity"
      : signal.signal === "SHORT"
        ? "a SHORT opportunity"
        : signal.signal === "REJECT"
          ? "a setup it is deliberately rejecting"
          : "an early setup forming";

  const clauses: string[] = [];
  if (signal.confidence) clauses.push(`${signal.confidence}% confidence`);
  if (signal.expectedRoi) {
    const sign = signal.expectedRoi > 0 ? "+" : "";
    clauses.push(`${sign}${signal.expectedRoi}% expected ROI`);
  }
  if (signal.riskReward) {
    clauses.push(`a ${signal.riskReward.toFixed(2)}:1 risk/reward profile`);
  }

  const detail =
    clauses.length > 0
      ? ` with ${clauses.length > 1 ? `${clauses.slice(0, -1).join(", ")} and ${clauses.at(-1)}` : clauses[0]}`
      : "";

  return `Exion AI has identified ${setup} on ${signal.symbol} (${signal.exchange})${detail}.${structureSentence(signal)} Full entry, exit and sizing guidance is available inside Krypnova.`;
}

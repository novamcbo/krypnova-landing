import { createHash } from "node:crypto";
import { pool } from "@/lib/db";
import type { PublicMarketSignal } from "@/lib/signal-types";

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

export function buildSummary(signal: PublicMarketSignal): string {
  const setup =
    signal.signal === "LONG"
      ? "a LONG opportunity"
      : signal.signal === "SHORT"
        ? "a SHORT opportunity"
        : signal.signal === "REJECT"
          ? "conditions it currently rejects"
          : "no actionable setup yet";

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

  return `Exion AI sees ${setup} on ${signal.symbol} (${signal.exchange})${detail}. Full entry, exit and sizing guidance is available inside Krypnova.`;
}

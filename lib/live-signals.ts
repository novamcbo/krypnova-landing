import { Pool, type QueryResultRow } from "pg";
import type {
  MarketSnapshot,
  PublicMarketSignal,
  PublicSignalDirection,
  PublicSignalStats,
} from "@/lib/signal-types";

type JsonRecord = Record<string, unknown>;

type DecisionRow = QueryResultRow & {
  exchange: unknown;
  symbol: unknown;
  action: unknown;
  payload: unknown;
  ts: unknown;
};

declare global {
  // eslint-disable-next-line no-var
  var krypnovaSignalsPool: Pool | undefined;
}

const signalConnectionString =
  process.env.EXION_DATABASE_URL ??
  process.env.KRYPNOVA_CORE_DATABASE_URL ??
  process.env.DATABASE_URL;

const signalsPool = signalConnectionString
  ? global.krypnovaSignalsPool ??
    new Pool({
      connectionString: normalizePostgresUrl(signalConnectionString),
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
      max: 4,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
    })
  : null;

if (process.env.NODE_ENV !== "production" && signalsPool) {
  global.krypnovaSignalsPool = signalsPool;
}

function normalizePostgresUrl(value: string): string {
  return value
    .replace(/^postgresql\+asyncpg:\/\//, "postgresql://")
    .replace(/^postgres\+asyncpg:\/\//, "postgres://");
}

function asRecord(value: unknown): JsonRecord {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return asRecord(parsed);
    } catch {
      return {};
    }
  }
  return {};
}

function nested(record: JsonRecord, ...path: string[]): unknown {
  let current: unknown = record;
  for (const key of path) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as JsonRecord)[key];
  }
  return current;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const normalized = value.replace(/[%,$]/g, "").trim();
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function percentScore(value: number | null): number | null {
  if (value === null) return null;
  const percentage = Math.abs(value) <= 1 ? value * 100 : value;
  return clamp(percentage, 0, 100);
}

function roiPercent(value: number | null): number | null {
  if (value === null) return null;
  const percentage = Math.abs(value) <= 1 ? value * 100 : value;
  return clamp(percentage, -999, 999);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value * 100) / 100));
}

function displayExchange(value: unknown): string {
  const raw = String(value ?? "Unknown").trim();
  const names: Record<string, string> = {
    alpaca: "Alpaca",
    coinbase: "Coinbase",
    coinbase_advanced: "Coinbase",
    kraken: "Kraken",
  };
  return names[raw.toLowerCase()] ?? raw;
}

function publicAction(value: unknown): PublicSignalDirection {
  const action = String(value ?? "WAIT").trim().toUpperCase();
  if (["BUY", "LONG", "BUY_TO_COVER"].includes(action)) return "LONG";
  if (["SELL", "SHORT", "SELL_SHORT"].includes(action)) return "SHORT";
  if (["REJECT", "REJECTED", "BLOCKED"].includes(action)) return "REJECT";
  return "WATCH";
}

function payloadMode(payload: JsonRecord): "Paper" | "Live" | null {
  const candidates = [
    payload.mode,
    payload.trading_mode,
    nested(payload, "metadata", "mode"),
    nested(payload, "metadata", "trading_mode"),
    nested(payload, "execution", "mode"),
  ];

  for (const value of candidates) {
    const normalized = String(value ?? "").toLowerCase();
    if (normalized.includes("paper") || normalized.includes("simulation")) {
      return "Paper";
    }
    if (normalized.includes("live") || normalized.includes("real")) {
      return "Live";
    }
  }
  return null;
}

function modeMatches(payload: JsonRecord, mode: "Paper" | "Live"): boolean {
  const detected = payloadMode(payload);
  return detected === null || detected === mode;
}

function normalizeRow(row: DecisionRow): PublicMarketSignal {
  const payload = asRecord(row.payload);
  const metadata = asRecord(payload.metadata);
  const marketProfile = asRecord(
    nested(metadata, "market_intelligence", "payload", "market_profile"),
  );
  const profileReason = String(marketProfile.reason ?? "");
  const biasMatch = /bias=(long|short|neutral)/i.exec(profileReason);
  const auctionState =
    typeof marketProfile.auction_state === "string" && marketProfile.auction_state
      ? marketProfile.auction_state
      : null;
  const riskPayload = asRecord(
    payload.risk_payload ?? payload.risk ?? payload.risk_analysis,
  );
  const profitMetrics = asRecord(
    nested(payload, "profit_quality", "metrics"),
  );

  return {
    exchange: displayExchange(row.exchange),
    symbol: String(row.symbol ?? "Unknown").trim().toUpperCase(),
    signal: publicAction(row.action),
    marketBias: biasMatch
      ? (biasMatch[1].toLowerCase() as "long" | "short" | "neutral")
      : null,
    auctionState,
    price: firstNumber(
      metadata.market_price,
      nested(payload, "metadata", "risk_payload", "current_price"),
      nested(payload, "metadata", "risk_payload", "entry_price"),
      payload.market_price,
      payload.price,
    ),
    confidence: percentScore(
      firstNumber(
        payload.confidence,
        metadata.confidence,
        profitMetrics.confidence,
      ),
    ),
    alpha: percentScore(firstNumber(payload.final_score, payload.score, metadata.score)),
    expectedRoi: roiPercent(
      firstNumber(
        metadata.expected_roi,
        metadata.expected_net_roi,
        riskPayload.expected_roi,
        riskPayload.expected_net_roi,
        riskPayload.net_roi_expected,
        riskPayload.roi_expected,
        profitMetrics.expected_roi,
      ),
    ),
    riskReward: firstNumber(
      metadata.risk_reward,
      riskPayload.risk_reward,
      riskPayload.reward_risk_ratio,
      profitMetrics.risk_reward,
    ),
    riskScore: percentScore(
      firstNumber(metadata.risk_score, riskPayload.risk_score),
    ),
    updatedAt: new Date(String(row.ts)).toISOString(),
  };
}

export async function loadPublicSignals(options?: {
  limit?: number;
  mode?: "Paper" | "Live";
  userId?: string;
}): Promise<PublicMarketSignal[]> {
  if (!signalsPool) {
    throw new Error("The market intelligence database is not configured.");
  }

  const limit = clamp(Math.trunc(options?.limit ?? 8), 1, 20);
  const mode = options?.mode ?? "Paper";
  const userId = options?.userId ?? process.env.PUBLIC_SIGNALS_USER_ID ?? "";
  const fetchLimit = Math.min(limit * 6, 120);

  const result = await signalsPool.query<DecisionRow>(
    `
      SELECT exchange, symbol, action, payload, ts
      FROM krypnova_decision_events
      WHERE ($1 = '' OR user_id = $1)
      ORDER BY ts DESC
      LIMIT $2
    `,
    [userId, fetchLimit],
  );

  const unique = new Map<string, PublicMarketSignal>();

  for (const row of result.rows) {
    const payload = asRecord(row.payload);
    if (!modeMatches(payload, mode)) continue;

    const normalized = normalizeRow(row);
    const key = `${normalized.exchange}:${normalized.symbol}`;
    if (!unique.has(key)) unique.set(key, normalized);
  }

  // Surface the richest assessments first: cards full of zeros read as
  // "broken" to visitors, so signals with real metrics take priority and
  // recency breaks ties.
  return Array.from(unique.values())
    .sort((a, b) => {
      const richness = signalRichness(b) - signalRichness(a);
      if (richness !== 0) return richness;
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    })
    .slice(0, limit);
}

function signalRichness(signal: PublicMarketSignal): number {
  let score = 0;
  if (signal.confidence) score += 2;
  if (signal.alpha) score += 2;
  if (signal.expectedRoi) score += 1;
  if (signal.riskReward) score += 1;
  if (signal.riskScore !== null) score += 1;
  if (signal.signal === "LONG" || signal.signal === "SHORT") score += 3;
  return score;
}

const QUOTE_SUFFIXES = ["USDT", "USDC", "ZUSD", "USD", "EUR", "GBP", "PERP"];

const BASE_ALIASES: Record<string, string> = {
  XBT: "BTC",
  XDG: "DOGE",
};

// Reduce any pair notation (BTC-USD, XXBTZUSD, ETH/USD, SUIUSD) to its base
// asset so a visitor's "btc" can match every exchange's naming scheme.
export function baseAsset(symbol: string): string {
  let value = symbol.toUpperCase().replace(/[/\-_:]/g, "").trim();
  const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/);
  if (kraken) value = kraken[1] + kraken[2];
  for (const quote of QUOTE_SUFFIXES) {
    if (value.endsWith(quote) && value.length > quote.length) {
      value = value.slice(0, -quote.length);
      break;
    }
  }
  return BASE_ALIASES[value] ?? value;
}

export async function findSymbolSignal(
  query: string,
): Promise<PublicMarketSignal | null> {
  if (!signalsPool) {
    throw new Error("The market intelligence database is not configured.");
  }

  const base = baseAsset(query);
  if (!/^[A-Z0-9]{2,12}$/.test(base)) return null;

  const aliases = [base];
  for (const [alias, canonical] of Object.entries(BASE_ALIASES)) {
    if (canonical === base) aliases.push(alias);
  }
  const patterns = aliases.map((alias) => `%${alias}%`);

  const userId = process.env.PUBLIC_SIGNALS_USER_ID ?? "";
  const result = await signalsPool.query<DecisionRow>(
    `
      SELECT exchange, symbol, action, payload, ts
      FROM krypnova_decision_events
      WHERE ($1 = '' OR user_id = $1)
        AND replace(replace(upper(symbol), '-', ''), '/', '') LIKE ANY($2::text[])
      ORDER BY ts DESC
      LIMIT 40
    `,
    [userId, patterns],
  );

  const matches = result.rows
    .filter((row) => baseAsset(String(row.symbol ?? "")) === base)
    .map((row) => normalizeRow(row));
  if (matches.length === 0) return null;

  // Prefer rich assessments, but only while they are fresh: a stale SHORT
  // next to today's bullish order-flow reads as a contradiction. Beyond the
  // freshness window we fall back to the latest monitoring row.
  const FRESH_WINDOW_MS = 4 * 3_600_000;
  const newest = Math.max(...matches.map((m) => Date.parse(m.updatedAt)));
  const isFresh = (m: PublicMarketSignal) =>
    newest - Date.parse(m.updatedAt) <= FRESH_WINDOW_MS;

  return matches.sort((a, b) => {
    const freshness = Number(isFresh(b)) - Number(isFresh(a));
    if (freshness !== 0) return freshness;
    const richness = signalRichness(b) - signalRichness(a);
    if (richness !== 0) return richness;
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  })[0];
}

// Fallback source when Exion has no decision event for a symbol: the
// top-movers market scanner also covers Alpaca equities, so stock tickers
// like TSLA resolve to live market data instead of a dead end.
export async function findMarketSnapshot(
  query: string,
): Promise<MarketSnapshot | null> {
  if (!signalsPool) {
    throw new Error("The market intelligence database is not configured.");
  }

  const base = baseAsset(query);
  if (!/^[A-Z0-9]{1,12}$/.test(base)) return null;

  type SnapshotRow = QueryResultRow & {
    exchange: unknown;
    symbol: unknown;
    asset_class: unknown;
    last_price: unknown;
    pct_change: unknown;
    volume: unknown;
    ts: unknown;
  };

  const result = await signalsPool.query<SnapshotRow>(
    `
      SELECT exchange, symbol, asset_class, last_price, pct_change, volume, ts
      FROM top_movers_snapshots
      WHERE replace(replace(upper(symbol), '-', ''), '/', '') LIKE $1
      ORDER BY ts DESC
      LIMIT 20
    `,
    [`${base}%`],
  );

  const match = result.rows.find(
    (row) => baseAsset(String(row.symbol ?? "")) === base,
  );
  if (!match) return null;

  const toNumber = (value: unknown): number | null => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    symbol: String(match.symbol ?? "").trim().toUpperCase(),
    exchange: displayExchange(match.exchange),
    assetClass: match.asset_class ? String(match.asset_class) : null,
    price: toNumber(match.last_price),
    pctChange: toNumber(match.pct_change),
    volume: toNumber(match.volume),
    updatedAt: new Date(String(match.ts)).toISOString(),
  };
}

export async function loadSignalStats(options?: {
  userId?: string;
}): Promise<PublicSignalStats> {
  if (!signalsPool) {
    throw new Error("The market intelligence database is not configured.");
  }

  const userId = options?.userId ?? process.env.PUBLIC_SIGNALS_USER_ID ?? "";

  const result = await signalsPool.query<
    QueryResultRow & { decisions: unknown; assets: unknown; latest: unknown }
  >(
    `
      SELECT
        count(*) FILTER (WHERE ts > now() - interval '24 hours')::int AS decisions,
        count(DISTINCT symbol) FILTER (WHERE ts > now() - interval '24 hours')::int AS assets,
        max(ts) AS latest
      FROM krypnova_decision_events
      WHERE ($1 = '' OR user_id = $1)
    `,
    [userId],
  );

  const row = result.rows[0];
  const latest = row?.latest ? new Date(String(row.latest)) : null;

  return {
    decisionsLast24h: Number(row?.decisions ?? 0),
    assetsMonitored: Number(row?.assets ?? 0),
    lastDecisionAt:
      latest && !Number.isNaN(latest.getTime()) ? latest.toISOString() : null,
  };
}

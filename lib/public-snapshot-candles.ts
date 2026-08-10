import { Pool, type QueryResultRow } from "pg";
import { baseAsset } from "@/lib/live-signals";

export type SnapshotCandle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type SnapshotCandleFeed = {
  exchange: string;
  symbol: string;
  candles: SnapshotCandle[];
};

type CandleRow = QueryResultRow & {
  exchange: unknown;
  symbol: unknown;
  bucket: unknown;
  open: unknown;
  high: unknown;
  low: unknown;
  close: unknown;
  volume: unknown;
};

declare global {
  // eslint-disable-next-line no-var
  var krypnovaPublicCandlePool: Pool | undefined;
}

const connectionString =
  process.env.EXION_DATABASE_URL ??
  process.env.KRYPNOVA_CORE_DATABASE_URL ??
  process.env.DATABASE_URL;

const pool = connectionString
  ? global.krypnovaPublicCandlePool ??
    new Pool({
      connectionString: normalizePostgresUrl(connectionString),
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
      max: 2,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
    })
  : null;

if (process.env.NODE_ENV !== "production" && pool) {
  global.krypnovaPublicCandlePool = pool;
}

function normalizePostgresUrl(value: string): string {
  return value
    .replace(/^postgresql\+asyncpg:\/\//, "postgresql://")
    .replace(/^postgres\+asyncpg:\/\//, "postgres://");
}

function finite(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function displayExchange(value: unknown): string {
  const raw = String(value ?? "Krypnova").trim();
  const names: Record<string, string> = {
    alpaca: "Alpaca",
    coinbase: "Coinbase",
    coinbase_advanced: "Coinbase",
    kraken: "Kraken",
    binance: "Binance",
  };
  return names[raw.toLowerCase()] ?? raw;
}

async function queryHistory(
  base: string,
  preferredExchange: string,
): Promise<SnapshotCandleFeed | null> {
  if (!pool) return null;

  const result = await pool.query<CandleRow>(
    `
      WITH raw AS (
        SELECT
          exchange::text AS exchange,
          symbol::text AS symbol,
          ts,
          last_price::double precision AS price,
          COALESCE(volume::double precision, 0) AS volume,
          date_trunc('hour', ts) AS bucket
        FROM top_movers_snapshots
        WHERE replace(replace(replace(replace(upper(symbol::text), '-', ''), '/', ''), '_', ''), ':', '') LIKE $1
          AND ts >= now() - interval '45 days'
          AND last_price IS NOT NULL
          AND ($2 = '' OR lower(exchange::text) = lower($2))
      ),
      ranked AS (
        SELECT
          *,
          row_number() OVER (PARTITION BY exchange, symbol, bucket ORDER BY ts ASC) AS rn_open,
          row_number() OVER (PARTITION BY exchange, symbol, bucket ORDER BY ts DESC) AS rn_close
        FROM raw
      ),
      hourly AS (
        SELECT
          exchange,
          symbol,
          bucket,
          max(price) FILTER (WHERE rn_open = 1) AS open,
          max(price) AS high,
          min(price) AS low,
          max(price) FILTER (WHERE rn_close = 1) AS close,
          max(volume) AS volume
        FROM ranked
        GROUP BY exchange, symbol, bucket
      )
      SELECT exchange, symbol, bucket, open, high, low, close, volume
      FROM hourly
      ORDER BY bucket DESC
      LIMIT 240
    `,
    [`${base}%`, preferredExchange],
  );

  const byExchange = new Map<string, CandleRow[]>();
  for (const row of result.rows) {
    if (baseAsset(String(row.symbol ?? "")) !== base) continue;
    const key = String(row.exchange ?? "").toLowerCase();
    const rows = byExchange.get(key) ?? [];
    rows.push(row);
    byExchange.set(key, rows);
  }

  const selected = Array.from(byExchange.entries())
    .sort((a, b) => b[1].length - a[1].length)[0]?.[1];
  if (!selected?.length) return null;

  const rawCandles = selected
    .map((row): SnapshotCandle | null => {
      const open = finite(row.open);
      const high = finite(row.high);
      const low = finite(row.low);
      const close = finite(row.close);
      const volume = finite(row.volume) ?? 0;
      const time = new Date(String(row.bucket));
      if (
        Number.isNaN(time.getTime()) ||
        open === null ||
        high === null ||
        low === null ||
        close === null ||
        open <= 0 ||
        close <= 0
      ) {
        return null;
      }
      return {
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume,
      };
    })
    .filter((item): item is SnapshotCandle => Boolean(item))
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
    .slice(-120);

  if (rawCandles.length < 4) return null;

  // top_movers_snapshots usually stores session/cumulative volume. Convert it
  // into a per-interval approximation so the fallback chart does not repeat
  // the same cumulative total on every hourly bar. If the counter resets, the
  // current value becomes the first interval volume for the new session.
  const candles = rawCandles.map((candle, index) => {
    if (index === 0) return { ...candle, volume: 0 };
    const previous = rawCandles[index - 1];
    const delta = candle.volume >= previous.volume
      ? candle.volume - previous.volume
      : candle.volume;
    return { ...candle, volume: Math.max(0, delta) };
  });

  return {
    exchange: displayExchange(selected[0]?.exchange),
    symbol: String(selected[0]?.symbol ?? base).trim().toUpperCase(),
    candles,
  };
}

export async function findSnapshotCandleFeed(
  query: string,
  preferredExchange?: string | null,
): Promise<SnapshotCandleFeed | null> {
  const base = baseAsset(query);
  if (!/^[A-Z0-9]{1,12}$/.test(base)) return null;

  const preferred = String(preferredExchange ?? "").trim();
  try {
    if (preferred) {
      const preferredFeed = await queryHistory(base, preferred);
      if (preferredFeed) return preferredFeed;
    }
    return await queryHistory(base, "");
  } catch (error) {
    console.warn(
      `[public-candles] snapshot history unavailable for ${base}:`,
      error instanceof Error ? error.message : "unknown error",
    );
    return null;
  }
}

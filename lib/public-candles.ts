import { baseAsset } from "@/lib/live-signals";
import type { MarketSnapshot } from "@/lib/signal-types";

export type PublicCandle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type PublicCandleFeed = {
  exchange: "Kraken" | "Alpaca" | "Coinbase";
  symbol: string;
  candles: PublicCandle[];
};

const KRAKEN_URL = "https://api.kraken.com";
const ALPACA_DATA_URL = "https://data.alpaca.markets";
const COINBASE_URL = "https://api.exchange.coinbase.com";
const CRYPTO = new Set(["BTC", "ETH", "SOL", "XRP"]);
const STOCKS = new Set(["AAPL", "NVDA", "TSLA"]);
const TIMEOUT_MS = 5_000;

function finite(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function validCandle(candle: PublicCandle): boolean {
  return [candle.open, candle.high, candle.low, candle.close, candle.volume].every(Number.isFinite)
    && candle.high >= candle.low
    && candle.open > 0
    && candle.close > 0;
}

async function fetchJson(
  url: string,
  options?: { headers?: Record<string, string>; revalidate?: number },
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", ...(options?.headers ?? {}) },
      next: { revalidate: options?.revalidate ?? 60 },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function parseKrakenOhlc(data: unknown): PublicCandle[] {
  if (!data || typeof data !== "object") return [];
  const payload = data as Record<string, unknown>;
  if (Array.isArray(payload.error) && payload.error.length > 0) return [];
  if (!payload.result || typeof payload.result !== "object") return [];
  const result = payload.result as Record<string, unknown>;
  const pairKey = Object.keys(result).find((key) => key !== "last" && Array.isArray(result[key]));
  if (!pairKey) return [];
  const rows = result[pairKey];
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row): PublicCandle | null => {
      if (!Array.isArray(row) || row.length < 7) return null;
      const epoch = finite(row[0]);
      const open = finite(row[1]);
      const high = finite(row[2]);
      const low = finite(row[3]);
      const close = finite(row[4]);
      const volume = finite(row[6]);
      if ([epoch, open, high, low, close, volume].some((value) => value === null)) return null;
      const candle: PublicCandle = {
        time: new Date(epoch! * 1000).toISOString(),
        open: open!,
        high: high!,
        low: low!,
        close: close!,
        volume: volume!,
      };
      return validCandle(candle) ? candle : null;
    })
    .filter((item): item is PublicCandle => Boolean(item))
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
    .slice(-120);
}

async function krakenCryptoFeed(symbol: string): Promise<PublicCandleFeed | null> {
  const pair = symbol === "BTC" ? "XBTUSD" : `${symbol}USD`;
  const data = await fetchJson(
    `${KRAKEN_URL}/0/public/OHLC?pair=${encodeURIComponent(pair)}&interval=60`,
  );
  const candles = parseKrakenOhlc(data);
  if (candles.length < 12) return null;
  return { exchange: "Kraken", symbol: `${symbol}/USD`, candles };
}

type KrakenAssetPair = {
  altname?: unknown;
  wsname?: unknown;
};

async function krakenTokenizedPair(symbol: string): Promise<{ pair: string; display: string } | null> {
  const data = await fetchJson(`${KRAKEN_URL}/0/public/AssetPairs`, { revalidate: 3_600 });
  if (!data || typeof data !== "object") return null;
  const payload = data as Record<string, unknown>;
  if (Array.isArray(payload.error) && payload.error.length > 0) return null;
  if (!payload.result || typeof payload.result !== "object") return null;

  const base = symbol.toUpperCase();
  const candidates = Object.entries(payload.result as Record<string, KrakenAssetPair>)
    .map(([key, value]) => {
      const altname = String(value?.altname ?? "").toUpperCase();
      const wsname = String(value?.wsname ?? "").toUpperCase();
      const combined = `${key.toUpperCase()} ${altname} ${wsname}`;
      let score = 0;
      if (altname.startsWith(`${base}X`)) score += 6;
      if (wsname.startsWith(`${base}X/`)) score += 6;
      if (key.toUpperCase().startsWith(`${base}X`)) score += 5;
      if (combined.includes(base)) score += 2;
      if (combined.includes("USD")) score += 2;
      if (combined.includes("X")) score += 1;
      return { key, altname, wsname, score };
    })
    .filter((item) => item.score >= 5)
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];
  if (!best) return null;
  const pair = best.altname || best.key;
  const display = best.wsname || `${base}X/USD`;
  return { pair, display };
}

async function krakenTokenizedStockFeed(symbol: string): Promise<PublicCandleFeed | null> {
  const resolved = await krakenTokenizedPair(symbol);
  if (!resolved) return null;
  const data = await fetchJson(
    `${KRAKEN_URL}/0/public/OHLC?pair=${encodeURIComponent(resolved.pair)}&interval=60`,
  );
  const candles = parseKrakenOhlc(data);
  if (candles.length < 12) return null;
  return { exchange: "Kraken", symbol: resolved.display, candles };
}

function alpacaCredentials(): { key: string; secret: string } | null {
  const key =
    process.env.ALPACA_API_KEY ??
    process.env.APCA_API_KEY_ID ??
    process.env.ALPACA_LIVE_KEY;
  const secret =
    process.env.ALPACA_SECRET_KEY ??
    process.env.APCA_API_SECRET_KEY ??
    process.env.ALPACA_LIVE_SECRET;
  if (!key || !secret) return null;
  return { key, secret };
}

async function alpacaStockFeed(symbol: string): Promise<PublicCandleFeed | null> {
  const credentials = alpacaCredentials();
  if (!credentials) return null;

  const url = new URL(`${ALPACA_DATA_URL}/v2/stocks/${symbol}/bars`);
  url.searchParams.set("timeframe", "1Hour");
  url.searchParams.set("limit", "120");
  url.searchParams.set("feed", "iex");
  url.searchParams.set("adjustment", "raw");

  const data = await fetchJson(url.toString(), {
    headers: {
      "APCA-API-KEY-ID": credentials.key,
      "APCA-API-SECRET-KEY": credentials.secret,
    },
  });
  if (!data || typeof data !== "object") return null;
  const bars = (data as Record<string, unknown>).bars;
  if (!Array.isArray(bars)) return null;

  const candles = bars
    .map((row): PublicCandle | null => {
      if (!row || typeof row !== "object") return null;
      const bar = row as Record<string, unknown>;
      const open = finite(bar.o);
      const high = finite(bar.h);
      const low = finite(bar.l);
      const close = finite(bar.c);
      const volume = finite(bar.v);
      const time = typeof bar.t === "string" ? bar.t : null;
      if (!time || [open, high, low, close, volume].some((value) => value === null)) return null;
      const candle: PublicCandle = {
        time: new Date(time).toISOString(),
        open: open!,
        high: high!,
        low: low!,
        close: close!,
        volume: volume!,
      };
      return validCandle(candle) ? candle : null;
    })
    .filter((item): item is PublicCandle => Boolean(item))
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
    .slice(-120);

  if (candles.length < 12) return null;
  return { exchange: "Alpaca", symbol, candles };
}

async function coinbaseCryptoFeed(symbol: string): Promise<PublicCandleFeed | null> {
  const product = `${symbol}-USD`;
  const data = await fetchJson(
    `${COINBASE_URL}/products/${product.toLowerCase()}/candles?granularity=3600`,
  );
  if (!Array.isArray(data)) return null;

  const candles = data
    .map((row): PublicCandle | null => {
      if (!Array.isArray(row) || row.length < 6) return null;
      const [epoch, low, high, open, close, volume] = row;
      const values = [low, high, open, close, volume].map(finite);
      if (values.some((value) => value === null)) return null;
      const candle: PublicCandle = {
        time: new Date(Number(epoch) * 1000).toISOString(),
        low: values[0]!,
        high: values[1]!,
        open: values[2]!,
        close: values[3]!,
        volume: values[4]!,
      };
      return validCandle(candle) ? candle : null;
    })
    .filter((item): item is PublicCandle => Boolean(item))
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
    .slice(-120);

  if (candles.length < 12) return null;
  return { exchange: "Coinbase", symbol: `${symbol}/USD`, candles };
}

async function firstFeed(loaders: Array<() => Promise<PublicCandleFeed | null>>): Promise<PublicCandleFeed | null> {
  for (const loader of loaders) {
    const feed = await loader();
    if (feed) return feed;
  }
  return null;
}

export async function findPublicCandleFeed(
  query: string,
  preferredExchange?: string | null,
): Promise<PublicCandleFeed | null> {
  const symbol = baseAsset(query);
  const preferred = String(preferredExchange ?? "").trim().toLowerCase();

  if (CRYPTO.has(symbol)) {
    if (preferred.includes("coinbase")) {
      return firstFeed([
        () => coinbaseCryptoFeed(symbol),
        () => krakenCryptoFeed(symbol),
      ]);
    }
    return firstFeed([
      () => krakenCryptoFeed(symbol),
      () => coinbaseCryptoFeed(symbol),
    ]);
  }

  if (STOCKS.has(symbol)) {
    if (preferred.includes("kraken")) {
      return firstFeed([
        () => krakenTokenizedStockFeed(symbol),
        () => alpacaStockFeed(symbol),
      ]);
    }
    return firstFeed([
      () => alpacaStockFeed(symbol),
      () => krakenTokenizedStockFeed(symbol),
    ]);
  }

  return null;
}

function newYorkDate(value: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

export function snapshotFromCandleFeed(
  feed: PublicCandleFeed,
  assetClass: "Crypto" | "Stock",
): MarketSnapshot | null {
  if (!feed.candles.length) return null;
  const candles = feed.candles;
  const last = candles.at(-1)!;

  let referenceOpen: number | null = null;
  let volume: number | null = null;

  if (assetClass === "Crypto") {
    const window = candles.slice(-24);
    referenceOpen = window[0]?.open ?? null;
    volume = window.reduce((sum, candle) => sum + candle.volume, 0);
  } else {
    const latestSession = newYorkDate(last.time);
    const session = candles.filter((candle) => newYorkDate(candle.time) === latestSession);
    referenceOpen = session[0]?.open ?? last.open;
    volume = session.reduce((sum, candle) => sum + candle.volume, 0);
  }

  const pctChange =
    referenceOpen && referenceOpen !== 0
      ? Math.round((((last.close - referenceOpen) / referenceOpen) * 100) * 100) / 100
      : null;

  return {
    symbol: feed.symbol,
    exchange: feed.exchange,
    assetClass,
    price: last.close,
    pctChange,
    volume,
    updatedAt: last.time,
  };
}

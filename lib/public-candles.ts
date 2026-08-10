import { baseAsset } from "@/lib/live-signals";

export type PublicCandle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

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

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
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

async function coinbaseCandles(symbol: string): Promise<PublicCandle[]> {
  const product = `${symbol}-USD`;
  const data = await fetchJson(
    `${COINBASE_URL}/products/${product.toLowerCase()}/candles?granularity=3600`,
  );
  if (!Array.isArray(data)) return [];

  return data
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
}

async function alphaVantageCandles(symbol: string): Promise<PublicCandle[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "TIME_SERIES_INTRADAY");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", "60min");
  url.searchParams.set("outputsize", "compact");
  url.searchParams.set("apikey", apiKey);

  const data = await fetchJson(url.toString());
  if (!data || typeof data !== "object") return [];
  const series = (data as Record<string, unknown>)["Time Series (60min)"];
  if (!series || typeof series !== "object") return [];

  return Object.entries(series as Record<string, Record<string, string>>)
    .map(([time, row]): PublicCandle | null => {
      const open = finite(row["1. open"]);
      const high = finite(row["2. high"]);
      const low = finite(row["3. low"]);
      const close = finite(row["4. close"]);
      const volume = finite(row["5. volume"]);
      if ([open, high, low, close, volume].some((value) => value === null)) return null;
      const candle: PublicCandle = {
        time: new Date(`${time.replace(" ", "T")}-04:00`).toISOString(),
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

export async function findPublicCandles(query: string): Promise<PublicCandle[]> {
  const symbol = baseAsset(query);
  if (CRYPTO.has(symbol)) return coinbaseCandles(symbol);
  if (STOCKS.has(symbol)) return alphaVantageCandles(symbol);
  return [];
}

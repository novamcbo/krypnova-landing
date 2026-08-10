import type { MarketSnapshot } from "@/lib/signal-types";
import { baseAsset } from "@/lib/live-signals";

const COINBASE_EXCHANGE_URL = "https://api.exchange.coinbase.com";
const SUPPORTED_CRYPTO = new Set(["BTC", "ETH", "SOL", "XRP"]);
const REQUEST_TIMEOUT_MS = 4_500;

type CoinbaseTicker = {
  price?: string;
  time?: string;
  volume?: string;
};

type CoinbaseStats = {
  open?: string;
  last?: string;
  volume?: string;
};

function finiteNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function findPublicCryptoSnapshot(
  query: string,
): Promise<MarketSnapshot | null> {
  const base = baseAsset(query);
  if (!SUPPORTED_CRYPTO.has(base)) return null;

  const productId = `${base}-USD`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const [tickerResponse, statsResponse] = await Promise.all([
      fetch(`${COINBASE_EXCHANGE_URL}/products/${productId.toLowerCase()}/ticker`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      }),
      fetch(`${COINBASE_EXCHANGE_URL}/products/${productId.toLowerCase()}/stats`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      }),
    ]);

    if (!tickerResponse.ok) return null;

    const ticker = (await tickerResponse.json()) as CoinbaseTicker;
    const stats = statsResponse.ok
      ? ((await statsResponse.json()) as CoinbaseStats)
      : null;

    const price = finiteNumber(ticker.price ?? stats?.last);
    if (price === null) return null;

    const open = finiteNumber(stats?.open);
    const pctChange =
      open !== null && open !== 0
        ? Math.round((((price - open) / open) * 100) * 100) / 100
        : null;

    const volume = finiteNumber(ticker.volume ?? stats?.volume);
    const tickerTime = ticker.time ? new Date(ticker.time) : null;
    const updatedAt =
      tickerTime && !Number.isNaN(tickerTime.getTime())
        ? tickerTime.toISOString()
        : new Date().toISOString();

    return {
      symbol: productId,
      exchange: "Coinbase",
      assetClass: "Crypto",
      price,
      pctChange,
      volume,
      updatedAt,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

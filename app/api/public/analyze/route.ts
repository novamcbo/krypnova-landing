import { NextRequest, NextResponse } from "next/server";
import {
  buildSnapshotSummary,
  buildSummary,
  checkQuota,
  isAssessed,
  recordAnalysis,
  visitorHash,
} from "@/lib/analyze";
import {
  findMarketSnapshot,
  findSymbolSignal,
  loadPublicSignals,
} from "@/lib/live-signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SYMBOL_PATTERN = /^[A-Za-z0-9/\-_.:]{2,15}$/;

export async function POST(request: NextRequest) {
  let symbol = "";
  try {
    const body: unknown = await request.json();
    symbol =
      typeof body === "object" && body !== null && "symbol" in body
        ? String((body as { symbol: unknown }).symbol ?? "").trim()
        : "";
  } catch {
    // fall through to validation below
  }

  if (!SYMBOL_PATTERN.test(symbol)) {
    return NextResponse.json(
      { message: "Please enter a valid symbol, e.g. BTC or ETH/USD." },
      { status: 400 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const hash = visitorHash(ip, userAgent);

  // Creator/staff bypass: unlimited analyses with a private token.
  const bypassToken = process.env.ANALYZE_BYPASS_TOKEN;
  const isCreator = Boolean(
    bypassToken && request.headers.get("x-analyze-key") === bypassToken,
  );

  try {
    const quota = isCreator
      ? { allowed: true, resetAt: null }
      : await checkQuota(hash);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          resetAt: quota.resetAt,
          message:
            "That's today's complimentary assessment — a fresh one unlocks within 24 hours, and Beta members enjoy unlimited access.",
        },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    let signal = await findSymbolSignal(symbol);

    if (!signal) {
      // No scored decision yet (common for equities): fall back to the
      // top-movers market scanner so tickers like TSLA still resolve.
      const snapshot = await findMarketSnapshot(symbol);
      if (snapshot) {
        return NextResponse.json(
          {
            allowed: true,
            found: true,
            counted: false,
            kind: "snapshot",
            symbol: snapshot.symbol,
            exchange: snapshot.exchange,
            signal: "WATCH",
            price: snapshot.price,
            todayChange: snapshot.pctChange,
            volume: snapshot.volume,
            updatedAt: snapshot.updatedAt,
            mode: "Paper",
            summary: buildSnapshotSummary(snapshot),
          },
          { status: 200, headers: { "Cache-Control": "no-store" } },
        );
      }

      // Do not burn the visitor's free query on a miss.
      const available = await loadPublicSignals({ limit: 4 });
      return NextResponse.json(
        {
          allowed: true,
          found: false,
          symbol: symbol.toUpperCase(),
          message: `No public assessment is currently available for ${symbol.toUpperCase()}.`,
          suggestions: available.map((item) => item.symbol),
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    // A directional call next to a contradicting order-flow bias reads as an
    // error to visitors — suppress the structure context in that case.
    if (
      (signal.signal === "SHORT" && signal.marketBias === "long") ||
      (signal.signal === "LONG" && signal.marketBias === "short")
    ) {
      signal = { ...signal, marketBias: null, auctionState: null };
    }

    // Only a real, scored assessment consumes the free query. Monitoring
    // answers ("no setup yet") are free so a thin result never burns the
    // visitor's daily analysis.
    const assessed = isAssessed(signal);
    const counted = !isCreator && assessed;
    const resetAt = counted ? await recordAnalysis(hash, signal.symbol) : null;

    return NextResponse.json(
      {
        allowed: true,
        found: true,
        counted,
        symbol: signal.symbol,
        exchange: signal.exchange,
        signal: signal.signal,
        price: signal.price,
        marketBias: signal.marketBias,
        auctionState: signal.auctionState,
        confidence: signal.confidence,
        alpha: signal.alpha,
        expectedRoi: signal.expectedRoi,
        riskReward: signal.riskReward,
        riskScore: signal.riskScore,
        updatedAt: signal.updatedAt,
        mode: "Paper",
        summary: buildSummary(signal),
        resetAt,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[public/analyze]", error);
    return NextResponse.json(
      { message: "Analysis is temporarily unavailable. Please try again soon." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

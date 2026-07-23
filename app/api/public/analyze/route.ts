import { NextRequest, NextResponse } from "next/server";
import { buildSummary, checkQuota, recordAnalysis, visitorHash } from "@/lib/analyze";
import { findSymbolSignal, loadPublicSignals } from "@/lib/live-signals";

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

  try {
    const quota = await checkQuota(hash);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          resetAt: quota.resetAt,
          message: "Free analysis used. Join the beta for unlimited access.",
        },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const signal = await findSymbolSignal(symbol);

    if (!signal) {
      // Do not burn the visitor's free query on a miss.
      const available = await loadPublicSignals({ limit: 4 });
      return NextResponse.json(
        {
          allowed: true,
          found: false,
          message: `Exion AI hasn't analyzed ${symbol.toUpperCase()} recently. Try one of the assets it is watching right now.`,
          suggestions: available.map((item) => item.symbol),
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    const resetAt = await recordAnalysis(hash, signal.symbol);

    return NextResponse.json(
      {
        allowed: true,
        found: true,
        symbol: signal.symbol,
        exchange: signal.exchange,
        signal: signal.signal,
        price: signal.price,
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

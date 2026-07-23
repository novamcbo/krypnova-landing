import { NextRequest, NextResponse } from "next/server";
import { loadPublicSignals, loadSignalStats } from "@/lib/live-signals";
import type { PublicSignalsResponse } from "@/lib/signal-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const requestedMode = request.nextUrl.searchParams.get("mode");
  const mode = requestedMode?.toLowerCase() === "live" ? "Live" : "Paper";
  const rawLimit = Number(request.nextUrl.searchParams.get("limit") ?? 8);
  const limit = Number.isFinite(rawLimit) ? rawLimit : 8;

  try {
    const [signals, stats] = await Promise.all([
      loadPublicSignals({ limit, mode }),
      loadSignalStats(),
    ]);
    const response: PublicSignalsResponse = {
      signals,
      mode,
      generatedAt: new Date().toISOString(),
      stale: false,
      stats,
      ...(signals.length === 0
        ? { message: "Exion AI is monitoring the market. No public signals are available yet." }
        : {}),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[public/live-signals]", error);

    const response: PublicSignalsResponse = {
      signals: [],
      mode,
      generatedAt: new Date().toISOString(),
      stale: true,
      message: "Live market intelligence is temporarily unavailable.",
    };

    return NextResponse.json(response, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PublicSignalsResponse } from "@/lib/signal-types";

const registerUrl = "https://app.krypnova.com/register";

const FALLBACK_CHIPS = ["BTC/USD", "ETH/USD", "SOL/USD", "DOGE/USD", "ADA/USD", "LINK/USD"];

const CONSENT_KEY = "krypnova-analyze-consent-v1";

interface AnalyzeResult {
  allowed: boolean;
  found?: boolean;
  message?: string;
  suggestions?: string[];
  symbol?: string;
  exchange?: string;
  signal?: string;
  price?: number | null;
  confidence?: number | null;
  expectedRoi?: number | null;
  riskReward?: number | null;
  summary?: string;
  resetAt?: string | null;
}

export default function AnalyzeBox() {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<string[]>(FALLBACK_CHIPS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const [pendingSymbol, setPendingSymbol] = useState<string | null>(null);

  useEffect(() => {
    try {
      setConsented(window.localStorage.getItem(CONSENT_KEY) === "1");
    } catch {
      // storage unavailable: fall back to asking each session
    }
  }, []);

  useEffect(() => {
    // Offer symbols Exion is actually watching right now.
    fetch("/api/public/live-signals?limit=6")
      .then((response) => response.json() as Promise<PublicSignalsResponse>)
      .then((body) => {
        const symbols = body.signals?.map((signal) => formatPair(signal.symbol)) ?? [];
        if (symbols.length >= 3) setChips(symbols.slice(0, 6));
      })
      .catch(() => undefined);
  }, []);

  const analyze = async (symbol: string) => {
    const trimmed = symbol.trim();
    if (!trimmed || loading) return;
    if (!consented) {
      // First use: require the educational-purpose acknowledgement.
      setPendingSymbol(trimmed);
      return;
    }
    await runAnalysis(trimmed);
  };

  const acceptConsent = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "1");
    } catch {
      // ignore storage failures; consent still applies this session
    }
    setConsented(true);
    const symbol = pendingSymbol;
    setPendingSymbol(null);
    if (symbol) void runAnalysis(symbol);
  };

  const runAnalysis = async (trimmed: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/public/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: trimmed }),
        cache: "no-store",
      });
      const body = (await response.json()) as AnalyzeResult & { message?: string };

      if (response.status === 429) {
        setResult({ allowed: false, resetAt: body.resetAt, message: body.message });
      } else if (!response.ok) {
        setError(body.message ?? "Analysis is temporarily unavailable.");
      } else {
        setResult(body);
      }
    } catch {
      setError("Analysis is temporarily unavailable. Please try again soon.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void analyze(query);
  };

  return (
    <>
      <label htmlFor="analyze-symbol">Analyze any symbol with Exion AI — free</label>

      <form className="symbols" onSubmit={onSubmit}>
        <input
          id="analyze-symbol"
          className="analyzeInput"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="BTC, ETH, SOL…"
          maxLength={15}
          autoComplete="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      <p className="analyzeDisclaimer">
        <strong>Educational AI Market Assessment.</strong> Exion analyzes market
        conditions, momentum, liquidity, and risk to help users better understand the
        market. The information displayed is provided for educational and informational
        purposes only and is not financial, investment, legal, or tax advice. Trading
        and investing involve substantial risk, including the possible loss of capital.
      </p>

      {pendingSymbol && !consented && (
        <div className="analyzeResult analyzeConsent">
          <label>
            <input type="checkbox" onChange={acceptConsent} />
            <span>
              I understand this analysis is provided for educational purposes only and
              is not financial advice.
            </span>
          </label>
        </div>
      )}

      <div className="symbols analyzeChips">
        {chips.map((chip) => (
          <span
            key={chip}
            role="button"
            tabIndex={0}
            onClick={() => {
              setQuery(chip);
              void analyze(chip);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setQuery(chip);
                void analyze(chip);
              }
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      {error && <p className="analyzeError">{error}</p>}

      {result && !result.allowed && (
        <div className="analyzeResult analyzeLimit">
          <p>
            <Sparkles size={16} /> {result.message ?? "Free analysis used."}
            {result.resetAt ? ` Next free analysis ${formatReset(result.resetAt)}.` : ""}
          </p>
          <a href={registerUrl} className="button small">
            Start Free Beta for unlimited analyses <ArrowRight size={15} />
          </a>
        </div>
      )}

      {result?.allowed && result.found === false && (
        <div className="analyzeResult">
          <p>{result.message}</p>
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="symbols analyzeChips">
              {result.suggestions.map((suggestion) => (
                <span
                  key={suggestion}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setQuery(formatPair(suggestion));
                    void analyze(suggestion);
                  }}
                >
                  {formatPair(suggestion)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {result?.allowed && result.found && (
        <div className="analyzeResult">
          <div className="analyzeResultTop">
            <div>
              <strong>{formatPair(result.symbol ?? "")}</strong>
              <small>{result.exchange} · Paper mode</small>
            </div>
            <b className={`analyzeSignal analyze${result.signal}`}>{result.signal}</b>
          </div>
          {typeof result.price === "number" && (
            <p className="analyzePrice">{formatPrice(result.price)}</p>
          )}
          <p>{result.summary}</p>
          <a href={registerUrl} className="button small">
            Unlock Full Signal <ArrowRight size={15} />
          </a>
          <p className="analyzeDisclaimer">
            This assessment is generated for informational and educational purposes
            only. It is not a recommendation to buy, sell, or hold any financial asset.
            Trading and investing involve risk, including the possible loss of
            principal.
          </p>
        </div>
      )}
    </>
  );
}

function formatPair(value: string): string {
  if (!value || value.includes("/")) return value;
  if (value.includes("-")) return value.replace("-", "/");
  const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/);
  if (kraken) {
    const base = kraken[1] === "XBT" ? "BTC" : kraken[1];
    return `${base}/${kraken[2]}`;
  }
  const quote = ["USDT", "USDC", "USD", "EUR"].find(
    (item) => value.endsWith(item) && value.length > item.length,
  );
  return quote ? `${value.slice(0, -quote.length)}/${quote}` : value;
}

function formatPrice(value: number): string {
  const fractionDigits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  })}`;
}

function formatReset(value: string): string {
  const ms = new Date(value).getTime() - Date.now();
  if (Number.isNaN(ms) || ms <= 0) return "soon";
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.round((ms % 3_600_000) / 60_000);
  if (hours <= 0) return `in ${minutes}m`;
  return `in ${hours}h ${minutes}m`;
}

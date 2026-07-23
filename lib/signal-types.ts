export type PublicSignalDirection = "LONG" | "SHORT" | "WATCH" | "REJECT";

export interface PublicMarketSignal {
  exchange: string;
  symbol: string;
  signal: PublicSignalDirection;
  confidence: number | null;
  alpha: number | null;
  expectedRoi: number | null;
  riskReward: number | null;
  riskScore: number | null;
  updatedAt: string;
}

export interface PublicSignalStats {
  decisionsLast24h: number;
  assetsMonitored: number;
  lastDecisionAt: string | null;
}

export interface PublicSignalsResponse {
  signals: PublicMarketSignal[];
  mode: "Paper" | "Live";
  generatedAt: string;
  stale: boolean;
  message?: string;
  stats?: PublicSignalStats;
}

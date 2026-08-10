import type { PublicCandle } from "@/lib/public-candles";
import type { PublicMarketSignal } from "@/lib/signal-types";
import styles from "./public-smart-chart.module.css";

type Props = {
  symbol: string;
  exchange: string;
  candles: PublicCandle[];
  signal: PublicMarketSignal | null;
};

type Point = { x: number; y: number };

const WIDTH = 1200;
const HEIGHT = 560;
const PRICE_TOP = 58;
const PRICE_BOTTOM = 420;
const VOL_TOP = 446;
const VOL_BOTTOM = 530;
const LEFT = 48;
const RIGHT = 40;
const MIN_RENDERABLE_CANDLES = 4;

function ema(values: number[], period: number): number[] {
  if (!values.length) return [];
  const multiplier = 2 / (period + 1);
  let current = values[0];
  return values.map((value, index) => {
    if (index === 0) return current;
    current = (value - current) * multiplier + current;
    return current;
  });
}

function money(value: number): string {
  const digits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: digits })}`;
}

function signalLabel(signal: PublicMarketSignal | null): string {
  if (!signal || (!signal.confidence && !signal.alpha)) return "EXION · MONITORING";
  return `EXION · ${signal.signal}`;
}

function linePath(points: Point[]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

export default function PublicSmartChart({ symbol, exchange, candles, signal }: Props) {
  if (candles.length < MIN_RENDERABLE_CANDLES) {
    return (
      <section className={styles.shell} aria-label={`${symbol} public smart chart`}>
        <div className={styles.header}>
          <div>
            <strong>{exchange.toUpperCase()} · {symbol}</strong>
            <span>Krypnova Smart Candles · Exion Intelligence</span>
          </div>
          <b>{signalLabel(signal)}</b>
        </div>
        <div className={styles.empty}>
          <strong>Market chart is synchronizing.</strong>
          <span>Exion intelligence remains available while Krypnova reconnects the market candle feed.</span>
        </div>
      </section>
    );
  }

  const view = candles.slice(-96);
  const lows = view.map((c) => c.low);
  const highs = view.map((c) => c.high);
  const closes = view.map((c) => c.close);
  const volumes = view.map((c) => c.volume);
  const minPrice = Math.min(...lows);
  const maxPrice = Math.max(...highs);
  const padding = Math.max((maxPrice - minPrice) * 0.08, maxPrice * 0.001);
  const yMin = minPrice - padding;
  const yMax = maxPrice + padding;
  const maxVolume = Math.max(...volumes, 1);
  const plotWidth = WIDTH - LEFT - RIGHT;
  const candleGap = plotWidth / Math.max(view.length - 1, 1);
  const candleWidth = Math.max(3, Math.min(10, candleGap * 0.58));

  const x = (index: number) => LEFT + (index / Math.max(view.length - 1, 1)) * plotWidth;
  const y = (price: number) => PRICE_BOTTOM - ((price - yMin) / Math.max(yMax - yMin, 1e-9)) * (PRICE_BOTTOM - PRICE_TOP);
  const yVol = (volume: number) => VOL_BOTTOM - (volume / maxVolume) * (VOL_BOTTOM - VOL_TOP);

  const ema21 = ema(closes, 21).map((value, index) => ({ x: x(index), y: y(value) }));
  const recent = view.slice(-Math.min(24, view.length));
  const support = Math.min(...recent.map((c) => c.low));
  const resistance = Math.max(...recent.map((c) => c.high));
  const last = view.at(-1)!;
  const assessed = Boolean(signal && (signal.confidence || signal.alpha));
  const label = signalLabel(signal);
  const signalClass = assessed && signal?.signal === "LONG"
    ? styles.long
    : assessed && signal?.signal === "SHORT"
      ? styles.short
      : assessed && signal?.signal === "REJECT"
        ? styles.reject
        : styles.monitoring;

  return (
    <section className={styles.shell} aria-label={`${symbol} public smart chart`}>
      <div className={styles.header}>
        <div>
          <strong>{exchange.toUpperCase()} · {symbol} · 1H</strong>
          <span>Krypnova Smart Candles · Exion Intelligence</span>
        </div>
        <b className={signalClass}>{label}</b>
      </div>

      <div className={styles.chartWrap}>
        <svg className={styles.chart} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${symbol} candlestick chart with EMA 21, volume, support and resistance`}>
          {[0, 1, 2, 3, 4].map((row) => {
            const yy = PRICE_TOP + ((PRICE_BOTTOM - PRICE_TOP) / 4) * row;
            const price = yMax - ((yMax - yMin) / 4) * row;
            return (
              <g key={row}>
                <line x1={LEFT} x2={WIDTH - RIGHT} y1={yy} y2={yy} className={styles.gridLine} />
                <text x={WIDTH - RIGHT - 4} y={yy - 7} textAnchor="end" className={styles.axisText}>{money(price)}</text>
              </g>
            );
          })}

          <rect x={LEFT} y={Math.min(y(resistance * 1.0015), y(resistance * 0.9985))} width={plotWidth} height={Math.abs(y(resistance * 1.0015) - y(resistance * 0.9985))} className={styles.resistanceZone} />
          <text x={LEFT + 8} y={Math.max(PRICE_TOP + 15, y(resistance) - 8)} className={styles.resistanceText}>Resistance · {money(resistance)}</text>

          <rect x={LEFT} y={Math.min(y(support * 1.0015), y(support * 0.9985))} width={plotWidth} height={Math.abs(y(support * 1.0015) - y(support * 0.9985))} className={styles.supportZone} />
          <text x={LEFT + 8} y={Math.min(PRICE_BOTTOM - 8, y(support) + 18)} className={styles.supportText}>Support · {money(support)}</text>

          {view.map((candle, index) => {
            const xx = x(index);
            const bullish = candle.close >= candle.open;
            const bodyTop = y(Math.max(candle.open, candle.close));
            const bodyBottom = y(Math.min(candle.open, candle.close));
            const volumeTop = yVol(candle.volume);
            return (
              <g key={candle.time}>
                <line x1={xx} x2={xx} y1={y(candle.high)} y2={y(candle.low)} className={bullish ? styles.up : styles.down} />
                <rect x={xx - candleWidth / 2} y={bodyTop} width={candleWidth} height={Math.max(1.5, bodyBottom - bodyTop)} rx="1" className={bullish ? styles.upFill : styles.downFill} />
                <rect x={xx - candleWidth / 2} y={volumeTop} width={candleWidth} height={Math.max(1, VOL_BOTTOM - volumeTop)} className={bullish ? styles.volumeUp : styles.volumeDown} />
              </g>
            );
          })}

          <path d={linePath(ema21)} className={styles.ema} />
          <text x={WIDTH - RIGHT - 6} y={Math.max(PRICE_TOP + 15, Math.min(PRICE_BOTTOM - 10, ema21.at(-1)!.y - 8))} textAnchor="end" className={styles.emaText}>EMA 21</text>

          <line x1={LEFT} x2={WIDTH - RIGHT} y1={y(last.close)} y2={y(last.close)} className={styles.currentLine} />
          <text x={WIDTH - RIGHT - 6} y={Math.max(PRICE_TOP + 14, y(last.close) - 8)} textAnchor="end" className={styles.currentText}>Current · {money(last.close)}</text>

          <text x={LEFT} y={VOL_TOP - 9} className={styles.volumeLabel}>Volume</text>
        </svg>
      </div>

      <div className={styles.readout}>
        <div><span>Exion state</span><strong>{assessed ? signal!.signal : "MONITORING"}</strong></div>
        <div><span>Current price</span><strong>{money(last.close)}</strong></div>
        <div><span>Support</span><strong>{money(support)}</strong></div>
        <div><span>Resistance</span><strong>{money(resistance)}</strong></div>
      </div>
      <p className={styles.note}>Chart structure is public market context. The Exion state shown here comes from Krypnova&apos;s published Exion decision record and is not generated by support/resistance heuristics.</p>
    </section>
  );
}

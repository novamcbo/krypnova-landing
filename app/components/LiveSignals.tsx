"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, RefreshCw, ShieldCheck } from "lucide-react";
import DailyAnalysisGrid from "@/app/components/DailyAnalysisGrid";
import type { PublicMarketSignal, PublicSignalsResponse } from "@/lib/signal-types";
import { pathForLocale, type Locale } from "@/lib/i18n";
import styles from "@/app/markets/markets.module.css";

const REFRESH_INTERVAL_MS = 60_000;

const copy = {
  en: { powered: "Powered by Exion AI", title: "Live Market Intelligence", intro: "Public, explainable market assessments across connected exchanges. Detailed entries, exits, sizing, and reasoning remain available inside Krypnova.", refresh: "Refresh", decisions: "AI decisions in the last 24h", assets: "assets monitored", last: "Last decision", monitoring: "Exion AI is monitoring the market", none: "No public signals are available at this moment.", paper: "Paper-mode intelligence for demonstration. Not financial advice.", updated: "Updated", delayed: "Connection delayed", auto: "Auto-refreshes every minute", view: "View Daily Analysis", scanning: "SCANNING", confidence: "Confidence", alpha: "Alpha", roi: "Expected ROI", rr: "Risk / Reward", risk: "Risk Score", metricUpdated: "Updated" },
  es: { powered: "Impulsado por Exion AI", title: "Inteligencia de Mercado en Vivo", intro: "Evaluaciones públicas y explicables en los mercados conectados. Las entradas, salidas, tamaño y razonamiento detallado permanecen dentro de Krypnova.", refresh: "Actualizar", decisions: "decisiones de IA en las últimas 24 h", assets: "activos monitoreados", last: "Última decisión", monitoring: "Exion AI está monitoreando el mercado", none: "No hay señales públicas disponibles en este momento.", paper: "Inteligencia en modo paper para demostración. No es asesoría financiera.", updated: "Actualizado", delayed: "Conexión demorada", auto: "Se actualiza cada minuto", view: "Ver análisis diario", scanning: "ANALIZANDO", confidence: "Confianza", alpha: "Alpha", roi: "ROI esperado", rr: "Riesgo / Retorno", risk: "Puntuación de riesgo", metricUpdated: "Actualizado" },
  pt: { powered: "Desenvolvido por Exion AI", title: "Inteligência de Mercado ao Vivo", intro: "Avaliações públicas e explicáveis nos mercados conectados. Entradas, saídas, dimensionamento e raciocínio detalhado permanecem dentro da Krypnova.", refresh: "Atualizar", decisions: "decisões de IA nas últimas 24 h", assets: "ativos monitorados", last: "Última decisão", monitoring: "Exion AI está monitorando o mercado", none: "Não há sinais públicos disponíveis neste momento.", paper: "Inteligência em modo paper para demonstração. Não é aconselhamento financeiro.", updated: "Atualizado", delayed: "Conexão atrasada", auto: "Atualiza a cada minuto", view: "Ver análise diária", scanning: "ANALISANDO", confidence: "Confiança", alpha: "Alpha", roi: "ROI esperado", rr: "Risco / Retorno", risk: "Pontuação de risco", metricUpdated: "Atualizado" },
  fr: { powered: "Propulsé par Exion AI", title: "Intelligence de Marché en Direct", intro: "Évaluations publiques et explicables sur les marchés connectés. Les entrées, sorties, dimensionnements et raisonnements détaillés restent disponibles dans Krypnova.", refresh: "Actualiser", decisions: "décisions IA au cours des dernières 24 h", assets: "actifs surveillés", last: "Dernière décision", monitoring: "Exion AI surveille le marché", none: "Aucun signal public n'est disponible pour le moment.", paper: "Intelligence en mode paper à des fins de démonstration. Ceci n'est pas un conseil financier.", updated: "Mis à jour", delayed: "Connexion retardée", auto: "Actualisation chaque minute", view: "Voir l'analyse quotidienne", scanning: "ANALYSE", confidence: "Confiance", alpha: "Alpha", roi: "ROI attendu", rr: "Risque / Rendement", risk: "Score de risque", metricUpdated: "Mis à jour" },
} satisfies Record<Locale, Record<string, string>>;

export default function LiveSignals({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  const [data, setData] = useState<PublicSignalsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/public/live-signals?limit=8&mode=paper", { cache: "no-store" });
      const body = (await response.json()) as PublicSignalsResponse;
      setData(body);
    } catch {
      setData({ signals: [], mode: "Paper", generatedAt: new Date().toISOString(), stale: true, message: t.none });
    } finally {
      setLoading(false);
    }
  }, [t.none]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <>
      <DailyAnalysisGrid locale={locale} />
      <section className={styles.signalSection} aria-live="polite">
        <div className={styles.signalHeader}>
          <div>
            <span className={styles.eyebrow}>{t.powered}</span>
            <h2>{t.title}{!data?.stale && <span className={styles.liveBadge}><span className={styles.liveDot} /> LIVE</span>}</h2>
            <p>{t.intro}</p>
          </div>
          <button className={styles.refreshButton} onClick={() => void refresh()} disabled={loading}><RefreshCw size={16} className={loading ? styles.spinning : undefined} /> {t.refresh}</button>
        </div>

        {data?.stats && (
          <div className={styles.statsRow}>
            <span><strong>{data.stats.decisionsLast24h.toLocaleString(locale)}</strong> {t.decisions}</span>
            <span><strong>{data.stats.assetsMonitored}</strong> {t.assets}</span>
            {data.stats.lastDecisionAt && <span>{t.last} <strong>{formatRelative(data.stats.lastDecisionAt, locale)}</strong></span>}
          </div>
        )}

        {loading ? (
          <div className={styles.signalGrid}>{Array.from({ length: 4 }).map((_, index) => <div className={styles.skeletonCard} key={index} />)}</div>
        ) : data?.signals.length ? (
          <div className={styles.signalGrid}>{data.signals.map((signal) => <SignalCard signal={signal} locale={locale} key={`${signal.exchange}-${signal.symbol}`} />)}</div>
        ) : (
          <div className={styles.emptyState}><BrainCircuit size={34} /><h3>{t.monitoring}</h3><p>{data?.message ?? t.none}</p></div>
        )}

        <div className={styles.disclosureRow}>
          <span><ShieldCheck size={16} /> {t.paper}</span>
          <span>{t.updated} {data ? formatRelative(data.generatedAt, locale) : "now"}{data?.stale ? ` · ${t.delayed}` : ` · ${t.auto}`}</span>
        </div>
      </section>
    </>
  );
}

function SignalCard({ signal, locale }: { signal: PublicMarketSignal; locale: Locale }) {
  const t = copy[locale];
  const directionClass = signal.signal === "LONG" ? styles.long : signal.signal === "SHORT" ? styles.short : signal.signal === "REJECT" ? styles.reject : styles.watch;
  const assessed = Boolean(signal.confidence || signal.alpha || signal.expectedRoi || signal.riskScore !== null);
  const analysisHref = pathForLocale(`/markets/${symbolPageSlug(signal.symbol)}`, locale);

  return (
    <article className={styles.signalCard}>
      <div className={styles.cardTop}>
        <div><span>{signal.exchange}</span><h3><Link href={analysisHref} style={{ color: "inherit", textDecoration: "none" }}>{formatSymbol(signal.symbol)}</Link></h3></div>
        <strong className={`${styles.direction} ${directionClass}`}>{assessed ? signal.signal : t.scanning}</strong>
      </div>
      {signal.price !== null && <p className={styles.priceRow}>{formatPrice(signal.price, locale)}</p>}
      <div className={styles.metricsGrid}>
        <Metric label={t.confidence} value={assessed ? formatPercent(signal.confidence) : "—"} />
        <Metric label={t.alpha} value={assessed ? formatPercent(signal.alpha) : "—"} />
        <Metric label={t.roi} value={assessed ? formatSignedPercent(signal.expectedRoi) : "—"} />
        <Metric label={t.rr} value={assessed ? formatRatio(signal.riskReward) : "—"} />
        <Metric label={t.risk} value={formatScore(signal.riskScore)} />
        <Metric label={t.metricUpdated} value={formatDateTime(signal.updatedAt, locale)} title={formatRelative(signal.updatedAt, locale)} />
      </div>
      <Link href={analysisHref} className={styles.unlockButton}>{t.view} <ArrowRight size={16} /></Link>
    </article>
  );
}

function Metric({ label, value, title }: { label: string; value: string; title?: string }) {
  return <div className={styles.metric} title={title}><span>{label}</span><strong>{value}</strong></div>;
}
function formatPercent(value: number | null) { return value === null ? "—" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`; }
function formatSignedPercent(value: number | null) { if (value === null) return "—"; return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`; }
function formatRatio(value: number | null) { return value === null ? "—" : `${value.toFixed(2)} : 1`; }
function formatScore(value: number | null) { return value === null ? "—" : `${Math.round(value)} / 100`; }
function intlLocale(locale: Locale) { return locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : locale; }
function formatDateTime(value: string, locale: Locale) { const date = new Date(value); if (Number.isNaN(date.getTime())) return "—"; return new Intl.DateTimeFormat(intlLocale(locale), { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(date); }
function formatPrice(value: number, locale: Locale) { const digits = value >= 1000 ? 2 : value >= 1 ? 4 : 6; return `$${value.toLocaleString(intlLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: digits })}`; }
function formatRelative(value: string, locale: Locale) { const date = new Date(value); if (Number.isNaN(date.getTime())) return "—"; const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000)); const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: "auto" }); if (seconds < 60) return rtf.format(-seconds, "second"); const minutes = Math.round(seconds / 60); if (minutes < 60) return rtf.format(-minutes, "minute"); const hours = Math.round(minutes / 60); if (hours < 24) return rtf.format(-hours, "hour"); return rtf.format(-Math.round(hours / 24), "day"); }
function formatSymbol(value: string) { if (value.includes("/")) return value; if (value.includes("-")) return value.replace("-", "/"); const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/); if (kraken) return `${kraken[1] === "XBT" ? "BTC" : kraken[1]}/${kraken[2]}`; const quote = ["USDT", "USDC", "USD", "EUR"].find((q) => value.endsWith(q) && value.length > q.length); return quote ? `${value.slice(0, -quote.length)}/${quote}` : value; }
function symbolPageSlug(value: string) { let normalized = value.toUpperCase().replace(/[/\-_:]/g, "").trim(); const kraken = normalized.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/); if (kraken) normalized = kraken[1] + kraken[2]; for (const quote of ["USDT", "USDC", "ZUSD", "USD", "EUR", "GBP", "PERP"]) { if (normalized.endsWith(quote) && normalized.length > quote.length) { normalized = normalized.slice(0, -quote.length); break; } } if (normalized === "XBT") normalized = "BTC"; if (normalized === "XDG") normalized = "DOGE"; return normalized.toLowerCase(); }

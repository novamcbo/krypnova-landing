import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { buildSnapshotSummary, buildSummary, isAssessed } from "@/lib/analyze";
import { findMarketSnapshot, findSymbolSignal } from "@/lib/live-signals";
import { findPublicCandleFeed, snapshotFromCandleFeed } from "@/lib/public-candles";
import { findPublicCryptoSnapshot } from "@/lib/public-market-fallback";
import { pathForLocale, type Locale } from "@/lib/i18n";
import PublicSmartChart, { type PublicSmartChartLabels } from "./PublicSmartChart";
import AutoRefresh from "./AutoRefresh";
import styles from "./symbol.module.css";

const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

export const trackedAssets: Record<string, { symbol: string; name: string; category: "Crypto" | "Stock" }> = {
  btc: { symbol: "BTC", name: "Bitcoin", category: "Crypto" },
  eth: { symbol: "ETH", name: "Ethereum", category: "Crypto" },
  sol: { symbol: "SOL", name: "Solana", category: "Crypto" },
  xrp: { symbol: "XRP", name: "XRP", category: "Crypto" },
  aapl: { symbol: "AAPL", name: "Apple", category: "Stock" },
  nvda: { symbol: "NVDA", name: "NVIDIA", category: "Stock" },
  tsla: { symbol: "TSLA", name: "Tesla", category: "Stock" },
};

export function assetFromSlug(raw: string) {
  const slug = raw.toLowerCase();
  return trackedAssets[slug] ?? { symbol: raw.toUpperCase(), name: raw.toUpperCase(), category: "Crypto" as const };
}

export function seoTitle(locale: Locale, name: string, symbol: string): string {
  const label = name === symbol ? symbol : `${name} (${symbol})`;
  if (locale === "es") return `${label} Análisis Hoy – Precio, Señales y Perspectiva del Mercado`;
  if (locale === "pt") return `${label} Análise Hoje – Preço, Sinais e Perspectiva de Mercado`;
  if (locale === "fr") return `${label} Analyse Aujourd’hui – Prix, Signaux et Perspectives du Marché`;
  if (symbol === "XRP") return "XRP Analysis Today – Signals, Sentiment & Market Outlook";
  return `${label} Analysis Today – Price, Signals & Market Outlook`;
}

const xrpInsightCopy: Record<Locale, {
  eyebrow: string; title: string;
  signalsTitle: string; signalsText: string;
  insightsTitle: string; insightsText: string;
  sentimentTitle: string; sentimentText: string;
}> = {
  en: {
    eyebrow: "XRP market intelligence",
    title: "XRP signals, insights and sentiment analysis",
    signalsTitle: "XRP signals",
    signalsText: "Krypnova separates live XRP market context from a scored Exion decision. MONITORING is not presented as a buy or sell signal; LONG, SHORT, WATCH or REJECT appears only when a decision record exists.",
    insightsTitle: "XRP insights",
    insightsText: "Price action, momentum, volatility, liquidity and the latest available Exion assessment are shown together so you can evaluate the current XRP market environment with clearer context.",
    sentimentTitle: "XRP sentiment analysis",
    sentimentText: "Sentiment is interpreted alongside market structure and risk. A positive or negative move alone does not create a trade call, and confidence metrics appear only when Exion publishes a scored setup.",
  },
  es: {
    eyebrow: "Inteligencia de mercado de XRP",
    title: "Señales, perspectivas y análisis de sentimiento de XRP",
    signalsTitle: "Señales de XRP",
    signalsText: "Krypnova separa el contexto de mercado de XRP de una decisión puntuada de Exion. MONITOREANDO no se presenta como una señal de compra o venta; LONG, SHORT, WATCH o REJECT solo aparece cuando existe un registro de decisión.",
    insightsTitle: "Perspectivas de XRP",
    insightsText: "El precio, el momentum, la volatilidad, la liquidez y la evaluación disponible de Exion se muestran juntos para analizar el entorno actual de XRP con mayor contexto.",
    sentimentTitle: "Análisis de sentimiento de XRP",
    sentimentText: "El sentimiento se interpreta junto con la estructura y el riesgo del mercado. Un movimiento positivo o negativo por sí solo no genera una operación, y la confianza aparece únicamente cuando Exion publica un setup puntuado.",
  },
  pt: {
    eyebrow: "Inteligência de mercado de XRP",
    title: "Sinais, insights e análise de sentimento de XRP",
    signalsTitle: "Sinais de XRP",
    signalsText: "A Krypnova separa o contexto de mercado de XRP de uma decisão pontuada pela Exion. MONITORANDO não é apresentado como sinal de compra ou venda; LONG, SHORT, WATCH ou REJECT só aparece quando existe um registro de decisão.",
    insightsTitle: "Insights de XRP",
    insightsText: "Preço, momentum, volatilidade, liquidez e a avaliação disponível da Exion aparecem juntos para analisar o ambiente atual de XRP com mais contexto.",
    sentimentTitle: "Análise de sentimento de XRP",
    sentimentText: "O sentimento é interpretado junto com a estrutura e o risco do mercado. Um movimento positivo ou negativo isolado não gera uma operação, e a confiança só aparece quando a Exion publica um setup pontuado.",
  },
  fr: {
    eyebrow: "Intelligence de marché XRP",
    title: "Signaux, perspectives et analyse du sentiment XRP",
    signalsTitle: "Signaux XRP",
    signalsText: "Krypnova sépare le contexte de marché XRP d'une décision notée par Exion. SURVEILLANCE n'est pas présenté comme un signal d'achat ou de vente ; LONG, SHORT, WATCH ou REJECT apparaît uniquement lorsqu'une décision existe.",
    insightsTitle: "Perspectives XRP",
    insightsText: "Le prix, le momentum, la volatilité, la liquidité et la dernière évaluation Exion disponible sont réunis pour analyser l'environnement actuel de XRP avec davantage de contexte.",
    sentimentTitle: "Analyse du sentiment XRP",
    sentimentText: "Le sentiment est interprété avec la structure et le risque du marché. Un mouvement positif ou négatif ne suffit pas à générer une opération, et la confiance apparaît uniquement lorsqu'Exion publie un setup noté.",
  },
};

const copy: Record<Locale, {
  badge: string; latest: string; read: (s: string) => string; lead: (n: string) => string;
  open: string; markets: string; updated: string; waiting: string; monitoring: string;
  marketContext: string; exionRead: string; chartSource: string; decisionSource: string;
  noSetup: string; stale: string; price: string; change: string; aiState: string; volume: string;
  confidence: string; riskModel: string; awaiting: string; expectedRoi: string; rr: string; riskScore: string;
  how: string; howTitle: string; stateTitle: string; stateText: string; confTitle: string; confText: string;
  riskTitle: string; riskText: string; related: string; relatedTitle: string; disclosure: string;
  chart: Partial<PublicSmartChartLabels>; numberLocale: string;
}> = {
  en: {
    badge: "Exion AI Symbol Intelligence", latest: "Latest assessment", read: s => `Exion AI read for ${s}`,
    lead: n => `Krypnova uses Exion AI to evaluate the latest public market context for ${n}. When Exion has a scored setup, this page shows the signal, confidence and risk metrics. When no setup is scored, it shows the latest market context without inventing a trade call.`,
    open: "Open Full Exion AI", markets: "View Live Markets", updated: "Updated", waiting: "Awaiting market data", monitoring: "MONITORING",
    marketContext: "MARKET CONTEXT", exionRead: "EXION AI READ", chartSource: "Market chart source", decisionSource: "Exion decision source",
    noSetup: "Exion has not published a fresh scored LONG/SHORT setup for this asset.", stale: "Freshness warning: the newest connected public record is older than six hours.",
    price: "Price", change: "24h Change", aiState: "AI State", volume: "Volume", confidence: "Confidence", riskModel: "Risk Model", awaiting: "Awaiting setup", expectedRoi: "Expected ROI", rr: "Risk / Reward", riskScore: "Risk Score",
    how: "How to read this page", howTitle: "Market context first. Scored trade intelligence only when Exion has enough evidence.", stateTitle: "AI state", stateText: "MONITORING means Exion has market context but no fresh scored setup. LONG, SHORT, WATCH or REJECT appear only when a decision record exists.", confTitle: "Confidence & return", confText: "Confidence and expected ROI are shown only when Exion has actually scored them.", riskTitle: "Risk first", riskText: "Risk/reward and risk score remain hidden until the connected Exion assessment provides those values.", related: "More market intelligence", relatedTitle: "Explore other assets monitored by Krypnova", disclosure: "Krypnova provides market intelligence and decision-support tools, not financial advice. Trading and investing involve risk. Public signals may be delayed, incomplete or based on paper-mode analysis.",
    chart: {}, numberLocale: "en-US",
  },
  es: {
    badge: "Inteligencia de símbolo con Exion AI", latest: "Evaluación más reciente", read: s => `Lectura de Exion AI para ${s}`,
    lead: n => `Krypnova utiliza Exion AI para evaluar el contexto público más reciente de ${n}. Cuando existe un setup puntuado, esta página muestra la señal, confianza y métricas de riesgo. Cuando no existe, muestra el contexto de mercado sin inventar una operación.`,
    open: "Abrir Exion AI completo", markets: "Ver mercados en vivo", updated: "Actualizado", waiting: "Esperando datos de mercado", monitoring: "MONITOREANDO",
    marketContext: "CONTEXTO DE MERCADO", exionRead: "LECTURA DE EXION AI", chartSource: "Fuente del chart", decisionSource: "Fuente de decisión de Exion",
    noSetup: "Exion no ha publicado un setup LONG/SHORT reciente y puntuado para este activo.", stale: "Advertencia de frescura: el registro público conectado más reciente tiene más de seis horas.",
    price: "Precio", change: "Cambio 24h", aiState: "Estado de IA", volume: "Volumen", confidence: "Confianza", riskModel: "Modelo de riesgo", awaiting: "Esperando setup", expectedRoi: "ROI esperado", rr: "Riesgo / Retorno", riskScore: "Puntuación de riesgo",
    how: "Cómo leer esta página", howTitle: "Contexto de mercado primero. Inteligencia de trading puntuada solo cuando Exion tiene evidencia suficiente.", stateTitle: "Estado de IA", stateText: "MONITOREANDO significa que hay contexto de mercado pero no un setup puntuado reciente. LONG, SHORT, WATCH o REJECT aparecen cuando existe una decisión de Exion.", confTitle: "Confianza y retorno", confText: "La confianza y el ROI esperado solo se muestran cuando Exion realmente los ha calculado.", riskTitle: "Riesgo primero", riskText: "El riesgo/retorno y la puntuación de riesgo permanecen sin puntuar hasta que Exion proporcione esos valores.", related: "Más inteligencia de mercado", relatedTitle: "Explora otros activos monitoreados por Krypnova", disclosure: "Krypnova ofrece inteligencia de mercado y herramientas de apoyo a decisiones, no asesoría financiera. Operar e invertir implica riesgo. Las señales públicas pueden estar retrasadas, incompletas o basadas en análisis paper-mode.",
    chart: { subtitle: "Krypnova Smart Candles · Inteligencia Exion", monitoring: "MONITOREANDO", emptyTitle: "El chart de mercado se está sincronizando.", emptyText: "La inteligencia de Exion sigue disponible mientras Krypnova reconecta el feed de candles.", resistance: "Resistencia", support: "Soporte", current: "Actual", volume: "Volumen", exionState: "Estado Exion", currentPrice: "Precio actual", note: "La estructura del chart es contexto público de mercado. El estado de Exion proviene del registro de decisiones publicado por Krypnova y no se genera mediante heurísticas de soporte/resistencia.", ariaDescription: "gráfico de velas con EMA 21, volumen, soporte y resistencia" }, numberLocale: "es-US",
  },
  pt: {
    badge: "Inteligência de símbolo com Exion AI", latest: "Avaliação mais recente", read: s => `Leitura da Exion AI para ${s}`,
    lead: n => `A Krypnova usa a Exion AI para avaliar o contexto público mais recente de ${n}. Quando existe um setup pontuado, esta página mostra sinal, confiança e métricas de risco. Quando não existe, mostra o contexto de mercado sem inventar uma operação.`,
    open: "Abrir Exion AI completo", markets: "Ver mercados ao vivo", updated: "Atualizado", waiting: "Aguardando dados de mercado", monitoring: "MONITORANDO",
    marketContext: "CONTEXTO DE MERCADO", exionRead: "LEITURA DA EXION AI", chartSource: "Fonte do gráfico", decisionSource: "Fonte da decisão Exion",
    noSetup: "A Exion não publicou um setup LONG/SHORT recente e pontuado para este ativo.", stale: "Aviso de atualidade: o registro público conectado mais recente tem mais de seis horas.",
    price: "Preço", change: "Variação 24h", aiState: "Estado da IA", volume: "Volume", confidence: "Confiança", riskModel: "Modelo de risco", awaiting: "Aguardando setup", expectedRoi: "ROI esperado", rr: "Risco / Retorno", riskScore: "Pontuação de risco",
    how: "Como ler esta página", howTitle: "Contexto de mercado primeiro. Inteligência de trading pontuada somente quando a Exion tem evidência suficiente.", stateTitle: "Estado da IA", stateText: "MONITORANDO significa que há contexto de mercado, mas não um setup recente pontuado. LONG, SHORT, WATCH ou REJECT aparecem quando existe uma decisão da Exion.", confTitle: "Confiança e retorno", confText: "Confiança e ROI esperado aparecem apenas quando a Exion realmente os calculou.", riskTitle: "Risco primeiro", riskText: "Risco/retorno e pontuação de risco permanecem sem pontuação até a avaliação da Exion fornecer esses valores.", related: "Mais inteligência de mercado", relatedTitle: "Explore outros ativos monitorados pela Krypnova", disclosure: "A Krypnova fornece inteligência de mercado e ferramentas de apoio à decisão, não aconselhamento financeiro. Negociar e investir envolve riscos. Sinais públicos podem estar atrasados, incompletos ou baseados em análise paper-mode.",
    chart: { subtitle: "Krypnova Smart Candles · Inteligência Exion", monitoring: "MONITORANDO", emptyTitle: "O gráfico de mercado está sincronizando.", emptyText: "A inteligência da Exion continua disponível enquanto a Krypnova reconecta o feed de candles.", resistance: "Resistência", support: "Suporte", current: "Atual", volume: "Volume", exionState: "Estado Exion", currentPrice: "Preço atual", note: "A estrutura do gráfico é contexto público de mercado. O estado da Exion vem do registro de decisões publicado pela Krypnova e não é gerado por heurísticas de suporte/resistência.", ariaDescription: "gráfico de velas com EMA 21, volume, suporte e resistência" }, numberLocale: "pt-BR",
  },
  fr: {
    badge: "Intelligence de symbole avec Exion AI", latest: "Dernière évaluation", read: s => `Lecture Exion AI pour ${s}`,
    lead: n => `Krypnova utilise Exion AI pour évaluer le contexte public le plus récent de ${n}. Lorsqu'un setup est noté, cette page affiche le signal, la confiance et les métriques de risque. Sinon, elle affiche le contexte de marché sans inventer de transaction.`,
    open: "Ouvrir Exion AI complet", markets: "Voir les marchés en direct", updated: "Mis à jour", waiting: "En attente de données de marché", monitoring: "SURVEILLANCE",
    marketContext: "CONTEXTE DE MARCHÉ", exionRead: "LECTURE EXION AI", chartSource: "Source du graphique", decisionSource: "Source de décision Exion",
    noSetup: "Exion n'a pas publié de setup LONG/SHORT récent et noté pour cet actif.", stale: "Avertissement de fraîcheur : le dernier enregistrement public connecté date de plus de six heures.",
    price: "Prix", change: "Variation 24h", aiState: "État de l'IA", volume: "Volume", confidence: "Confiance", riskModel: "Modèle de risque", awaiting: "En attente d'un setup", expectedRoi: "ROI attendu", rr: "Risque / Rendement", riskScore: "Score de risque",
    how: "Comment lire cette page", howTitle: "Le contexte de marché d'abord. Une intelligence de trading notée uniquement lorsque Exion dispose de suffisamment d'éléments.", stateTitle: "État de l'IA", stateText: "SURVEILLANCE signifie qu'un contexte de marché existe mais qu'aucun setup récent n'est noté. LONG, SHORT, WATCH ou REJECT apparaissent lorsqu'une décision Exion existe.", confTitle: "Confiance et rendement", confText: "La confiance et le ROI attendu ne sont affichés que lorsqu'Exion les a réellement calculés.", riskTitle: "Le risque d'abord", riskText: "Le risque/rendement et le score de risque restent non notés jusqu'à ce que l'évaluation Exion fournisse ces valeurs.", related: "Plus d'intelligence de marché", relatedTitle: "Explorez d'autres actifs surveillés par Krypnova", disclosure: "Krypnova fournit de l'intelligence de marché et des outils d'aide à la décision, pas de conseil financier. Le trading et l'investissement comportent des risques. Les signaux publics peuvent être retardés, incomplets ou basés sur une analyse paper-mode.",
    chart: { subtitle: "Krypnova Smart Candles · Intelligence Exion", monitoring: "SURVEILLANCE", emptyTitle: "Le graphique de marché se synchronise.", emptyText: "L'intelligence Exion reste disponible pendant que Krypnova reconnecte le flux de bougies.", resistance: "Résistance", support: "Support", current: "Actuel", volume: "Volume", exionState: "État Exion", currentPrice: "Prix actuel", note: "La structure du graphique est un contexte public de marché. L'état Exion provient du registre de décisions publié par Krypnova et n'est pas généré par des heuristiques de support/résistance.", ariaDescription: "graphique en chandeliers avec EMA 21, volume, support et résistance" }, numberLocale: "fr-FR",
  },
};

async function loadSignal(symbol: string) {
  try { return await findSymbolSignal(symbol); } catch { return null; }
}

async function loadFallbackSnapshot(symbol: string) {
  try {
    const internal = await findMarketSnapshot(symbol);
    if (internal) return internal;
  } catch {}
  try { return await findPublicCryptoSnapshot(symbol); } catch { return null; }
}

export default async function SymbolAnalysisContent({ symbolSlug, locale }: { symbolSlug: string; locale: Locale }) {
  const slug = symbolSlug.toLowerCase();
  const asset = assetFromSlug(slug);
  const t = copy[locale];
  const signal = await loadSignal(asset.symbol);
  const feed = await findPublicCandleFeed(asset.symbol, signal?.exchange ?? null);
  const feedSnapshot = feed ? snapshotFromCandleFeed(feed, asset.category) : null;
  const snapshot = feedSnapshot ?? (await loadFallbackSnapshot(asset.symbol));
  const candles = feed?.candles ?? [];
  const assessed = signal ? isAssessed(signal) : false;
  const updatedAt = assessed ? signal?.updatedAt ?? snapshot?.updatedAt ?? null : snapshot?.updatedAt ?? signal?.updatedAt ?? null;
  const summary = assessed && signal ? buildSummary(signal) : snapshot ? buildSnapshotSummary(snapshot) : signal ? buildSummary(signal) : null;
  const chartExchange = feed?.exchange ?? snapshot?.exchange ?? signal?.exchange ?? "Market";
  const chartSymbol = feed?.symbol ?? asset.symbol;
  const title = seoTitle(locale, asset.name, asset.symbol);
  const marketsHref = pathForLocale("/markets", locale);
  const homeHref = pathForLocale("/", locale);

  return (
    <main className={styles.page}>
      <AutoRefresh intervalMs={60_000} />
      <nav className={styles.nav}>
        <Link className={styles.brand} href={homeHref}><Image src="/krypnova-logo.jpeg" alt="Krypnova" width={42} height={42} priority /><span>KRYPNOVA</span></Link>
        <Link className={styles.backLink} href={marketsHref}><ArrowLeft size={16} /> {t.markets}</Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}><Sparkles size={15} /> {t.badge}</div>
        <p className={styles.eyebrow}>{asset.category} · {asset.symbol}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{t.lead(asset.name)}</p>
        <div className={styles.actions}>
          <Link href="https://app.krypnova.com" className={styles.primaryButton}>{t.open} <ArrowRight size={17} /></Link>
          <Link href={marketsHref} className={styles.secondaryButton}>{t.markets}</Link>
        </div>
      </section>

      <section className={styles.signalSection}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>{t.latest}</span><h2>{t.read(asset.symbol)}</h2></div><span className={styles.updated}>{updatedAt ? `${t.updated} ${formatDate(updatedAt, t.numberLocale)}` : t.waiting}</span></div>
        <PublicSmartChart symbol={chartSymbol} exchange={chartExchange} candles={candles} signal={signal} labels={t.chart} numberLocale={t.numberLocale} />

        {snapshot ? (
          <div className={styles.signalCard}>
            <div className={styles.signalTop}><div><span>{assessed && signal ? `Exion decision · ${signal.exchange}` : snapshot.exchange}</span><strong>{formatPair(assessed && signal ? signal.symbol : snapshot.symbol)}</strong></div><b className={assessed ? styles.direction : styles.monitoring}>{assessed && signal ? signal.signal : t.monitoring}</b></div>
            {summary && <div className={styles.analysisSummary}><span>{assessed ? t.exionRead : t.marketContext}</span><p>{summary}</p><small>{t.chartSource}: {snapshot.exchange}.{assessed && signal ? ` ${t.decisionSource}: ${signal.exchange}.` : ` ${t.noSetup}`}</small>{isStale(updatedAt) && <small className={styles.dataNote}>{t.stale}</small>}</div>}
            <div className={styles.metrics}>
              <Metric label={t.price} value={formatPrice(snapshot.price, t.numberLocale)} />
              <Metric label={t.change} value={formatSignedPercent(snapshot.pctChange)} />
              <Metric label={t.aiState} value={assessed && signal ? signal.signal : t.monitoring} />
              <Metric label={t.volume} value={formatVolume(snapshot.volume, t.numberLocale)} />
              <Metric label={t.confidence} value={assessed && signal ? formatPercent(signal.confidence) : "—"} />
              <Metric label={t.riskModel} value={assessed && signal && signal.riskScore !== null ? `${Math.round(signal.riskScore)} / 100` : t.awaiting} />
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}><BrainCircuit size={36} /><h3>{t.read(asset.symbol)}</h3><p>{t.waiting}</p></div>
        )}
      </section>

      <section className={styles.explainer}><div><span className={styles.eyebrow}>{t.how}</span><h2>{t.howTitle}</h2></div><div className={styles.explainerGrid}><article><BrainCircuit size={28} /><h3>{t.stateTitle}</h3><p>{t.stateText}</p></article><article><Sparkles size={28} /><h3>{t.confTitle}</h3><p>{t.confText}</p></article><article><ShieldCheck size={28} /><h3>{t.riskTitle}</h3><p>{t.riskText}</p></article></div></section>
      {slug === "xrp" ? <XrpInsights locale={locale} /> : null}
      <section className={styles.related}><span className={styles.eyebrow}>{t.related}</span><h2>{t.relatedTitle}</h2><div className={styles.relatedGrid}>{Object.entries(trackedAssets).filter(([key]) => key !== slug).slice(0, 6).map(([key, item]) => <Link key={key} href={pathForLocale(`/markets/${key}`, locale)}><span>{item.category}</span><strong>{item.name} ({item.symbol})</strong></Link>)}</div></section>
      <section className={styles.disclosure}><ShieldCheck size={18} /><p>{t.disclosure}</p></section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className={styles.metric}><span>{label}</span><strong>{value}</strong></div>; }
function XrpInsights({ locale }: { locale: Locale }) {
  const insight = xrpInsightCopy[locale];
  return (
    <section className={styles.explainer}>
      <div><span className={styles.eyebrow}>{insight.eyebrow}</span><h2>{insight.title}</h2></div>
      <div className={styles.explainerGrid}>
        <article><BrainCircuit size={28} /><h3>{insight.signalsTitle}</h3><p>{insight.signalsText}</p></article>
        <article><Sparkles size={28} /><h3>{insight.insightsTitle}</h3><p>{insight.insightsText}</p></article>
        <article><ShieldCheck size={28} /><h3>{insight.sentimentTitle}</h3><p>{insight.sentimentText}</p></article>
      </div>
    </section>
  );
}
function isStale(value: string | null) { if (!value) return false; const ts = Date.parse(value); return !Number.isNaN(ts) && Date.now() - ts > STALE_AFTER_MS; }
function formatDate(value: string, locale: string) { const d = new Date(value); return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(d); }
function formatPrice(value: number | null, locale: string) { if (value === null) return "—"; return `$${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: value >= 1000 ? 2 : value >= 1 ? 4 : 6 })}`; }
function formatPercent(value: number | null) { return value === null ? "—" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`; }
function formatSignedPercent(value: number | null) { if (value === null) return "—"; return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`; }
function formatVolume(value: number | null, locale: string) { if (value === null) return "—"; return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 }).format(value); }
function formatPair(value: string) { if (value.includes("/")) return value; if (value.includes("-")) return value.replace("-", "/"); const quote = ["USDT", "USDC", "USD", "EUR"].find(q => value.endsWith(q)); return quote ? `${value.slice(0, -quote.length)}/${quote}` : value; }

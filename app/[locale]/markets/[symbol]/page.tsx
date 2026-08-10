import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { isAssessed } from "@/lib/analyze";
import { findMarketSnapshot, findSymbolSignal } from "@/lib/live-signals";
import { findPublicCryptoSnapshot } from "@/lib/public-market-fallback";
import {
  commonCopy,
  isLocalizedLocale,
  pathForLocale,
  type LocalizedLocale,
} from "@/lib/i18n";
import type { MarketSnapshot, PublicMarketSignal } from "@/lib/signal-types";
import styles from "../../../markets/[symbol]/symbol.module.css";

export const revalidate = 300;

const siteUrl = "https://www.krypnova.com";
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

const trackedAssets: Record<
  string,
  { symbol: string; name: string; category: "Crypto" | "Stock" }
> = {
  btc: { symbol: "BTC", name: "Bitcoin", category: "Crypto" },
  eth: { symbol: "ETH", name: "Ethereum", category: "Crypto" },
  sol: { symbol: "SOL", name: "Solana", category: "Crypto" },
  xrp: { symbol: "XRP", name: "XRP", category: "Crypto" },
  aapl: { symbol: "AAPL", name: "Apple", category: "Stock" },
  nvda: { symbol: "NVDA", name: "NVIDIA", category: "Stock" },
  tsla: { symbol: "TSLA", name: "Tesla", category: "Stock" },
};

type PageProps = {
  params: { locale: string; symbol: string };
};

function resolveLocale(value: string): LocalizedLocale {
  if (!isLocalizedLocale(value)) notFound();
  return value;
}

function assetFromSlug(raw: string) {
  const slug = raw.toLowerCase();
  return trackedAssets[slug] ?? {
    symbol: raw.toUpperCase(),
    name: raw.toUpperCase(),
    category: "Crypto" as const,
  };
}

async function loadAsset(symbol: string) {
  try {
    const [signal, internalSnapshot] = await Promise.all([
      findSymbolSignal(symbol),
      findMarketSnapshot(symbol),
    ]);
    if (internalSnapshot) return { signal, snapshot: internalSnapshot };
    const publicSnapshot = await findPublicCryptoSnapshot(symbol);
    return { signal, snapshot: publicSnapshot };
  } catch {
    try {
      return { signal: null, snapshot: await findPublicCryptoSnapshot(symbol) };
    } catch {
      return { signal: null, snapshot: null };
    }
  }
}

function copy(locale: LocalizedLocale, assetName: string, symbol: string) {
  if (locale === "es") {
    return {
      badge: "Inteligencia de símbolo con Exion AI",
      title: `Análisis de ${assetName} (${symbol}) con IA hoy`,
      lead: `Krypnova utiliza Exion AI para evaluar el contexto público más reciente de ${assetName}. Cuando existe un setup puntuado, muestra señal, confianza y métricas de riesgo. Cuando no existe, muestra el contexto de mercado sin inventar una operación.`,
      open: "Abrir Exion AI completo",
      latest: "Evaluación más reciente",
      read: `Lectura de Exion AI para ${symbol}`,
      waiting: "Esperando datos de mercado",
      monitoring: "MONITOREANDO",
      context: "CONTEXTO DE MERCADO",
      aiRead: "LECTURA DE EXION AI",
      price: "Precio",
      change: "Cambio 24h",
      volume: "Volumen",
      aiState: "Estado de IA",
      confidence: "Confianza",
      roi: "ROI esperado",
      rr: "Riesgo / Retorno",
      risk: "Puntuación de riesgo",
      riskModel: "Modelo de riesgo",
      noScored: "Sin setup puntuado",
      watching: "En observación",
      notScored: "No puntuado",
      awaitingSetup: "Esperando setup",
      noSetupNote: "Exion no ha publicado un setup LONG/SHORT puntuado y reciente para este activo. Krypnova no inventa confianza, ROI ni métricas de riesgo.",
      stale: "Advertencia de frescura: el registro público conectado más reciente tiene más de seis horas.",
      empty: `Exion AI está monitoreando ${symbol}`,
      emptyText: "No hay un registro público de mercado disponible en este momento. La próxima instantánea conectada o evaluación puntuada aparecerá aquí cuando esté disponible.",
      how: "Cómo leer esta página",
      howTitle: "Contexto de mercado primero. Inteligencia de trading puntuada solo cuando Exion tiene evidencia suficiente.",
      stateTitle: "Estado de IA",
      stateText: "MONITOREANDO significa que hay contexto de mercado pero no un setup puntuado reciente. LONG, SHORT, WATCH o REJECT aparecen cuando existe una decisión de Exion.",
      confidenceTitle: "Confianza y retorno",
      confidenceText: "La confianza y el ROI esperado solo se muestran cuando Exion realmente los ha calculado.",
      riskTitle: "Riesgo primero",
      riskText: "El riesgo/retorno y la puntuación de riesgo permanecen sin puntuar hasta que la evaluación conectada de Exion proporcione esos valores.",
      related: "Más inteligencia de mercado",
      relatedTitle: "Explora otros activos monitoreados por Krypnova",
      disclosure: "Krypnova ofrece inteligencia de mercado y herramientas de apoyo a decisiones, no asesoría financiera. Operar e invertir implica riesgo. Las señales públicas pueden estar retrasadas, incompletas o basadas en análisis paper-mode.",
      up: "sube",
      down: "baja",
      scanner: "Está en el escáner de mercado conectado de Krypnova.",
      activeWatch: "está en la lista activa de seguimiento de Exion AI, pero todavía no se ha formado un setup de alta convicción.",
      identified: "Exion AI ha identificado",
      setup: "setup",
    };
  }

  if (locale === "pt") {
    return {
      badge: "Inteligência de símbolo com Exion AI",
      title: `Análise de ${assetName} (${symbol}) com IA hoje`,
      lead: `A Krypnova usa a Exion AI para avaliar o contexto público mais recente de ${assetName}. Quando existe um setup pontuado, mostra sinal, confiança e métricas de risco. Quando não existe, mostra o contexto de mercado sem inventar uma operação.`,
      open: "Abrir Exion AI completo",
      latest: "Avaliação mais recente",
      read: `Leitura da Exion AI para ${symbol}`,
      waiting: "Aguardando dados de mercado",
      monitoring: "MONITORANDO",
      context: "CONTEXTO DE MERCADO",
      aiRead: "LEITURA DA EXION AI",
      price: "Preço",
      change: "Variação 24h",
      volume: "Volume",
      aiState: "Estado da IA",
      confidence: "Confiança",
      roi: "ROI esperado",
      rr: "Risco / Retorno",
      risk: "Pontuação de risco",
      riskModel: "Modelo de risco",
      noScored: "Sem setup pontuado",
      watching: "Em observação",
      notScored: "Não pontuado",
      awaitingSetup: "Aguardando setup",
      noSetupNote: "A Exion não publicou um setup LONG/SHORT recente e pontuado para este ativo. A Krypnova não inventa confiança, ROI ou métricas de risco.",
      stale: "Aviso de atualidade: o registro público conectado mais recente tem mais de seis horas.",
      empty: `A Exion AI está monitorando ${symbol}`,
      emptyText: "Não há um registro público de mercado disponível neste momento. O próximo snapshot conectado ou avaliação pontuada aparecerá aqui quando estiver disponível.",
      how: "Como ler esta página",
      howTitle: "Contexto de mercado primeiro. Inteligência de trading pontuada somente quando a Exion tem evidência suficiente.",
      stateTitle: "Estado da IA",
      stateText: "MONITORANDO significa que existe contexto de mercado, mas não um setup recente pontuado. LONG, SHORT, WATCH ou REJECT aparecem quando existe uma decisão da Exion.",
      confidenceTitle: "Confiança e retorno",
      confidenceText: "A confiança e o ROI esperado só aparecem quando a Exion realmente os calculou.",
      riskTitle: "Risco primeiro",
      riskText: "Risco/retorno e pontuação de risco permanecem sem pontuação até que a avaliação conectada da Exion forneça esses valores.",
      related: "Mais inteligência de mercado",
      relatedTitle: "Explore outros ativos monitorados pela Krypnova",
      disclosure: "A Krypnova fornece inteligência de mercado e ferramentas de apoio à decisão, não aconselhamento financeiro. Negociar e investir envolve riscos. Sinais públicos podem estar atrasados, incompletos ou baseados em análise paper-mode.",
      up: "sobe",
      down: "cai",
      scanner: "Está no scanner de mercado conectado da Krypnova.",
      activeWatch: "está na lista ativa de monitoramento da Exion AI, mas ainda não se formou um setup de alta convicção.",
      identified: "A Exion AI identificou",
      setup: "setup",
    };
  }

  return {
    badge: "Intelligence de symbole avec Exion AI",
    title: `Analyse IA de ${assetName} (${symbol}) aujourd'hui`,
    lead: `Krypnova utilise Exion AI pour évaluer le contexte public le plus récent de ${assetName}. Lorsqu'un setup est noté, la page affiche le signal, la confiance et les métriques de risque. Sinon, elle affiche le contexte de marché sans inventer de transaction.`,
    open: "Ouvrir Exion AI complet",
    latest: "Dernière évaluation",
    read: `Lecture Exion AI pour ${symbol}`,
    waiting: "En attente de données de marché",
    monitoring: "SURVEILLANCE",
    context: "CONTEXTE DE MARCHÉ",
    aiRead: "LECTURE EXION AI",
    price: "Prix",
    change: "Variation 24h",
    volume: "Volume",
    aiState: "État de l'IA",
    confidence: "Confiance",
    roi: "ROI attendu",
    rr: "Risque / Rendement",
    risk: "Score de risque",
    riskModel: "Modèle de risque",
    noScored: "Aucun setup noté",
    watching: "Sous surveillance",
    notScored: "Non noté",
    awaitingSetup: "En attente d'un setup",
    noSetupNote: "Exion n'a pas publié de setup LONG/SHORT récent et noté pour cet actif. Krypnova n'invente ni confiance, ni ROI, ni métriques de risque.",
    stale: "Avertissement de fraîcheur : le dernier enregistrement public connecté date de plus de six heures.",
    empty: `Exion AI surveille ${symbol}`,
    emptyText: "Aucun enregistrement public de marché n'est disponible pour le moment. Le prochain instantané connecté ou la prochaine évaluation notée apparaîtra ici dès qu'il sera disponible.",
    how: "Comment lire cette page",
    howTitle: "Le contexte de marché d'abord. Une intelligence de trading notée uniquement lorsque Exion dispose de suffisamment d'éléments.",
    stateTitle: "État de l'IA",
    stateText: "SURVEILLANCE signifie qu'un contexte de marché existe mais qu'aucun setup récent n'est noté. LONG, SHORT, WATCH ou REJECT apparaissent lorsqu'une décision Exion existe.",
    confidenceTitle: "Confiance et rendement",
    confidenceText: "La confiance et le ROI attendu ne sont affichés que lorsqu'Exion les a réellement calculés.",
    riskTitle: "Le risque d'abord",
    riskText: "Le risque/rendement et le score de risque restent non notés jusqu'à ce que l'évaluation Exion connectée fournisse ces valeurs.",
    related: "Plus d'intelligence de marché",
    relatedTitle: "Explorez d'autres actifs surveillés par Krypnova",
    disclosure: "Krypnova fournit de l'intelligence de marché et des outils d'aide à la décision, pas de conseil financier. Le trading et l'investissement comportent des risques. Les signaux publics peuvent être retardés, incomplets ou basés sur une analyse paper-mode.",
    up: "progresse de",
    down: "recule de",
    scanner: "Il figure dans le scanner de marché connecté de Krypnova.",
    activeWatch: "figure sur la liste de surveillance active d'Exion AI, mais aucun setup à forte conviction ne s'est encore formé.",
    identified: "Exion AI a identifié",
    setup: "setup",
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale(params.locale);
  const asset = assetFromSlug(params.symbol);
  const knownAsset = Boolean(trackedAssets[params.symbol.toLowerCase()]);
  const t = copy(locale, asset.name, asset.symbol);
  const canonical = pathForLocale(`/markets/${params.symbol.toLowerCase()}`, locale);

  return {
    title: { absolute: `${t.title} | Krypnova` },
    description: t.lead,
    alternates: { canonical },
    robots: knownAsset ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "article",
      url: `${siteUrl}${canonical}`,
      title: `${t.title} | Krypnova`,
      description: t.lead,
      locale: locale === "es" ? "es_ES" : locale === "pt" ? "pt_BR" : "fr_FR",
      images: ["/krypnova-logo.jpeg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} | Krypnova`,
      description: t.lead,
      images: ["/krypnova-logo.jpeg"],
    },
  };
}

export default async function LocalizedSymbolPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const slug = params.symbol.toLowerCase();
  const asset = assetFromSlug(slug);
  const t = copy(locale, asset.name, asset.symbol);
  const { signal, snapshot } = await loadAsset(asset.symbol);
  const assessed = signal ? isAssessed(signal) : false;
  const updatedAt = signal?.updatedAt ?? snapshot?.updatedAt ?? null;
  const stale = isStale(updatedAt);
  const marketsHref = pathForLocale("/markets", locale);
  const homeHref = pathForLocale("/", locale);
  const analysisSummary = signal
    ? localizedSignalSummary(signal, locale, t)
    : snapshot
      ? localizedSnapshotSummary(snapshot, locale, t)
      : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.title,
    description: t.lead,
    url: `${siteUrl}${pathForLocale(`/markets/${slug}`, locale)}`,
    dateModified: updatedAt ?? undefined,
    inLanguage: locale,
    isPartOf: { "@type": "WebSite", name: "Krypnova", url: siteUrl },
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav className={styles.nav}>
        <Link className={styles.brand} href={homeHref}>
          <Image src="/krypnova-logo.jpeg" alt="Krypnova" width={42} height={42} priority />
          <span>KRYPNOVA</span>
        </Link>
        <Link className={styles.backLink} href={marketsHref}>
          <ArrowLeft size={16} /> {commonCopy[locale].liveMarkets}
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}><Sparkles size={15} /> {t.badge}</div>
        <p className={styles.eyebrow}>{localizedCategory(asset.category, locale)} · {asset.symbol}</p>
        <h1>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>
        <div className={styles.actions}>
          <Link href="https://app.krypnova.com" className={styles.primaryButton}>
            {t.open} <ArrowRight size={17} />
          </Link>
          <Link href={marketsHref} className={styles.secondaryButton}>{commonCopy[locale].viewLiveMarkets}</Link>
        </div>
      </section>

      <section className={styles.signalSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>{t.latest}</span>
            <h2>{t.read}</h2>
          </div>
          <span className={styles.updated}>
            {updatedAt ? formatDate(updatedAt, locale) : t.waiting}
          </span>
        </div>

        {signal ? (
          <div className={styles.signalCard}>
            <div className={styles.signalTop}>
              <div><span>{signal.exchange}</span><strong>{formatPair(signal.symbol)}</strong></div>
              <b className={assessed ? styles.direction : styles.monitoring}>
                {assessed ? signal.signal : t.monitoring}
              </b>
            </div>

            {analysisSummary && (
              <div className={styles.analysisSummary}>
                <span>{t.aiRead}</span>
                <p>{analysisSummary}</p>
                {!assessed && <small>{t.noSetupNote}</small>}
                {stale && <small className={styles.dataNote}>{t.stale}</small>}
              </div>
            )}

            <div className={styles.metrics}>
              <Metric label={t.price} value={formatPrice(signal.price ?? snapshot?.price ?? null, locale)} />
              <Metric label={t.aiState} value={assessed ? signal.signal : t.watching} />
              <Metric label={t.confidence} value={assessed ? formatPercent(signal.confidence, locale, t.notScored) : t.notScored} />
              <Metric label={t.roi} value={signal.expectedRoi !== null ? formatSignedPercent(signal.expectedRoi, locale) : t.notScored} />
              <Metric label={t.rr} value={signal.riskReward !== null ? formatRatio(signal.riskReward, locale) : t.notScored} />
              <Metric label={t.risk} value={signal.riskScore !== null ? formatScore(signal.riskScore, locale) : t.notScored} />
            </div>
          </div>
        ) : snapshot ? (
          <div className={styles.signalCard}>
            <div className={styles.signalTop}>
              <div><span>{snapshot.exchange}</span><strong>{formatPair(snapshot.symbol)}</strong></div>
              <b className={styles.monitoring}>{t.monitoring}</b>
            </div>

            {analysisSummary && (
              <div className={styles.analysisSummary}>
                <span>{t.context}</span>
                <p>{analysisSummary}</p>
                <small>{t.noSetupNote}</small>
                {stale && <small className={styles.dataNote}>{t.stale}</small>}
              </div>
            )}

            <div className={styles.metrics}>
              <Metric label={t.price} value={formatPrice(snapshot.price, locale)} />
              <Metric label={t.change} value={formatSignedPercent(snapshot.pctChange, locale)} />
              <Metric label={t.aiState} value={t.noScored} />
              <Metric label={t.volume} value={formatVolume(snapshot.volume, locale)} />
              <Metric label={t.confidence} value={t.notScored} />
              <Metric label={t.riskModel} value={t.awaitingSetup} />
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BrainCircuit size={36} />
            <h3>{t.empty}</h3>
            <p>{t.emptyText}</p>
          </div>
        )}
      </section>

      <section className={styles.explainer}>
        <div><span className={styles.eyebrow}>{t.how}</span><h2>{t.howTitle}</h2></div>
        <div className={styles.explainerGrid}>
          <article><BrainCircuit size={28} /><h3>{t.stateTitle}</h3><p>{t.stateText}</p></article>
          <article><Sparkles size={28} /><h3>{t.confidenceTitle}</h3><p>{t.confidenceText}</p></article>
          <article><ShieldCheck size={28} /><h3>{t.riskTitle}</h3><p>{t.riskText}</p></article>
        </div>
      </section>

      <section className={styles.related}>
        <span className={styles.eyebrow}>{t.related}</span>
        <h2>{t.relatedTitle}</h2>
        <div className={styles.relatedGrid}>
          {Object.entries(trackedAssets)
            .filter(([key]) => key !== slug)
            .slice(0, 6)
            .map(([key, item]) => (
              <Link key={key} href={pathForLocale(`/markets/${key}`, locale)}>
                <span>{localizedCategory(item.category, locale)}</span>
                <strong>{item.name} ({item.symbol})</strong>
              </Link>
            ))}
        </div>
      </section>

      <section className={styles.disclosure}><ShieldCheck size={18} /><p>{t.disclosure}</p></section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className={styles.metric}><span>{label}</span><strong>{value}</strong></div>;
}

function localizedSignalSummary(
  signal: PublicMarketSignal,
  locale: LocalizedLocale,
  t: ReturnType<typeof copy>,
): string {
  const pair = formatPair(signal.symbol);
  const price = signal.price !== null ? ` ${formatPrice(signal.price, locale)}` : "";
  if (!isAssessed(signal)) return `${pair} (${signal.exchange})${price} ${t.activeWatch}`;

  const details: string[] = [];
  if (signal.confidence !== null) details.push(`${formatPercent(signal.confidence, locale, t.notScored)} ${t.confidence.toLowerCase()}`);
  if (signal.expectedRoi !== null) details.push(`${formatSignedPercent(signal.expectedRoi, locale)} ${t.roi}`);
  if (signal.riskReward !== null) details.push(`${formatRatio(signal.riskReward, locale)} ${t.rr.toLowerCase()}`);
  return `${t.identified} ${signal.signal} ${t.setup} en ${pair} (${signal.exchange})${details.length ? `: ${details.join(" · ")}` : "."}`;
}

function localizedSnapshotSummary(
  snapshot: MarketSnapshot,
  locale: LocalizedLocale,
  t: ReturnType<typeof copy>,
): string {
  const price = snapshot.price !== null ? formatPrice(snapshot.price, locale) : null;
  const change = snapshot.pctChange;
  const move = change !== null
    ? `${change >= 0 ? t.up : t.down} ${Math.abs(change).toLocaleString(intlLocale(locale), { maximumFractionDigits: 2 })}%`
    : null;
  const pieces = [
    `${formatPair(snapshot.symbol)} (${snapshot.exchange})`,
    price ? `${locale === "fr" ? "se négocie à" : locale === "pt" ? "está cotado a" : "cotiza a"} ${price}` : null,
    move,
  ].filter(Boolean);
  return `${pieces.join(", ")}. ${t.scanner}`;
}

function localizedCategory(category: "Crypto" | "Stock", locale: LocalizedLocale): string {
  if (category === "Crypto") return locale === "es" ? "Cripto" : locale === "pt" ? "Cripto" : "Crypto";
  return locale === "es" ? "Acción" : locale === "pt" ? "Ação" : "Action";
}

function intlLocale(locale: LocalizedLocale): string {
  return locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "fr-FR";
}

function isStale(value: string | null): boolean {
  if (!value) return false;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? false : Date.now() - timestamp > STALE_AFTER_MS;
}

function formatDate(value: string, locale: LocalizedLocale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

function formatPrice(value: number | null, locale: LocalizedLocale): string {
  if (value === null) return "—";
  const digits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return `$${value.toLocaleString(intlLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  })}`;
}

function formatPercent(value: number | null, locale: LocalizedLocale, fallback: string): string {
  if (value === null) return fallback;
  return `${value.toLocaleString(intlLocale(locale), { maximumFractionDigits: 1 })}%`;
}

function formatSignedPercent(value: number | null, locale: LocalizedLocale): string {
  if (value === null) return "—";
  const formatted = Math.abs(value).toLocaleString(intlLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatted}%`;
}

function formatRatio(value: number | null, locale: LocalizedLocale): string {
  if (value === null) return "—";
  return `${value.toLocaleString(intlLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} : 1`;
}

function formatScore(value: number | null, locale: LocalizedLocale): string {
  if (value === null) return "—";
  return `${Math.round(value).toLocaleString(intlLocale(locale))} / 100`;
}

function formatVolume(value: number | null, locale: LocalizedLocale): string {
  if (value === null) return "—";
  return new Intl.NumberFormat(intlLocale(locale), {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPair(value: string): string {
  if (!value || value.includes("/")) return value;
  if (value.includes("-")) return value.replace("-", "/");
  const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/);
  if (kraken) return `${kraken[1] === "XBT" ? "BTC" : kraken[1]}/${kraken[2]}`;
  const quote = ["USDT", "USDC", "USD", "EUR"].find(
    (item) => value.endsWith(item) && value.length > item.length,
  );
  return quote ? `${value.slice(0, -quote.length)}/${quote}` : value;
}

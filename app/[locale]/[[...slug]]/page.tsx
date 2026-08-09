import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, Globe2, Lock, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import AnalyzeBox from "@/app/components/AnalyzeBox";
import LiveSignals from "@/app/components/LiveSignals";
import SeoLanding from "@/app/components/SeoLanding";
import { findMarketSnapshot, findSymbolSignal } from "@/lib/live-signals";
import { alternateLanguages, commonCopy, isLocalizedLocale, pathForLocale, type LocalizedLocale } from "@/lib/i18n";
import { homeCopy, marketsCopy, seoCopy } from "@/lib/i18n-content";
import homeStyles from "../../beta-upgrade.module.css";
import marketStyles from "../../markets/markets.module.css";
import symbolStyles from "../../markets/[symbol]/symbol.module.css";

export const revalidate = 86_400;

const siteUrl = "https://www.krypnova.com";
const contactEmail = "PedroV@krypnova.com";
const loginUrl = "https://app.krypnova.com/login";
const registerUrl = "https://app.krypnova.com/register";
const seoRoutes = new Set(["ai-trading-platform", "crypto-analysis", "stock-analysis", "market-analysis"]);

const trackedAssets: Record<string, { symbol: string; name: string; category: "Crypto" | "Stock" }> = {
  btc: { symbol: "BTC", name: "Bitcoin", category: "Crypto" },
  eth: { symbol: "ETH", name: "Ethereum", category: "Crypto" },
  sol: { symbol: "SOL", name: "Solana", category: "Crypto" },
  xrp: { symbol: "XRP", name: "XRP", category: "Crypto" },
  aapl: { symbol: "AAPL", name: "Apple", category: "Stock" },
  nvda: { symbol: "NVDA", name: "NVIDIA", category: "Stock" },
  tsla: { symbol: "TSLA", name: "Tesla", category: "Stock" },
};

type PageProps = { params: { locale: string; slug?: string[] } };

function resolveLocale(value: string): LocalizedLocale {
  if (!isLocalizedLocale(value)) notFound();
  return value;
}

function canonicalPath(locale: LocalizedLocale, slug: string[]) {
  return slug.length ? `/${locale}/${slug.join("/")}` : `/${locale}`;
}

function titleForRoute(locale: LocalizedLocale, slug: string[]) {
  if (!slug.length) {
    return locale === "es" ? "Krypnova | Inteligencia de Trading con IA" : locale === "pt" ? "Krypnova | Inteligência de Trading com IA" : "Krypnova | Intelligence de Trading par IA";
  }
  if (slug[0] === "markets" && slug[1]) {
    const asset = trackedAssets[slug[1].toLowerCase()] ?? { symbol: slug[1].toUpperCase(), name: slug[1].toUpperCase() };
    return locale === "es" ? `Análisis de ${asset.name} (${asset.symbol}) con IA Hoy` : locale === "pt" ? `Análise de ${asset.name} (${asset.symbol}) com IA Hoje` : `Analyse IA de ${asset.name} (${asset.symbol}) Aujourd'hui`;
  }
  if (slug[0] === "markets") return marketsCopy[locale].title;
  if (seoRoutes.has(slug[0])) {
    const page = seoCopy[locale][slug[0]];
    return `${page.title} ${page.highlight}`;
  }
  return "Krypnova";
}

function descriptionForRoute(locale: LocalizedLocale, slug: string[]) {
  if (!slug.length) return homeCopy[locale].lead;
  if (slug[0] === "markets" && slug[1]) {
    const asset = trackedAssets[slug[1].toLowerCase()] ?? { symbol: slug[1].toUpperCase(), name: slug[1].toUpperCase() };
    return locale === "es" ? `Análisis diario de ${asset.name} (${asset.symbol}) con Exion AI: señal, confianza, ROI esperado, riesgo/retorno y puntuación de riesgo.` : locale === "pt" ? `Análise diária de ${asset.name} (${asset.symbol}) com Exion AI: sinal, confiança, ROI esperado, risco/retorno e pontuação de risco.` : `Analyse quotidienne de ${asset.name} (${asset.symbol}) avec Exion AI : signal, confiance, ROI attendu, risque/rendement et score de risque.`;
  }
  if (slug[0] === "markets") return marketsCopy[locale].description;
  if (seoRoutes.has(slug[0])) return seoCopy[locale][slug[0]].description;
  return homeCopy[locale].lead;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale(params.locale);
  const slug = params.slug ?? [];
  const supported = !slug.length || slug[0] === "markets" || (slug.length === 1 && seoRoutes.has(slug[0]));
  const canonical = canonicalPath(locale, slug);
  const basePath = slug.length ? `/${slug.join("/")}` : "/";
  const title = titleForRoute(locale, slug);
  const description = descriptionForRoute(locale, slug);

  return {
    title,
    description,
    alternates: { canonical, languages: alternateLanguages(basePath) },
    robots: supported ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: slug[0] === "markets" && slug[1] ? "article" : "website",
      url: `${siteUrl}${canonical}`,
      title: `${title} | Krypnova`,
      description,
      locale: locale === "es" ? "es_ES" : locale === "pt" ? "pt_BR" : "fr_FR",
      images: ["/krypnova-logo.jpeg"],
    },
    twitter: { card: "summary_large_image", title: `${title} | Krypnova`, description, images: ["/krypnova-logo.jpeg"] },
  };
}

export default async function LocalizedPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const slug = params.slug ?? [];

  if (!slug.length) return <LocalizedHome locale={locale} />;
  if (slug.length === 1 && slug[0] === "markets") return <LocalizedMarkets locale={locale} />;
  if (slug.length === 2 && slug[0] === "markets") return <LocalizedSymbol locale={locale} symbolSlug={slug[1]} />;
  if (slug.length === 1 && seoRoutes.has(slug[0])) return <LocalizedSeo locale={locale} route={slug[0]} />;
  notFound();
}

function LocalizedHome({ locale }: { locale: LocalizedLocale }) {
  const t = homeCopy[locale];
  const marketsHref = pathForLocale("/markets", locale);
  const featureIcons = [BrainCircuit, Target, ShieldCheck, Sparkles, Zap, Globe2, BrainCircuit, Target, Lock];
  const navHrefs = ["#product", "#features", "#how-it-works", "#beta", marketsHref, "#roadmap", `mailto:${contactEmail}`];

  return (
    <main className="site">
      <div className="orb orbOne" /><div className="orb orbTwo" />
      <nav className={`nav ${homeStyles.nav}`}>
        <a className={`brand ${homeStyles.brand}`} href="#product"><Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={44} height={44} priority /><span>KRYPNOVA</span></a>
        <div className="navLinks">{t.nav.map((label: string, i: number) => <a key={label} href={navHrefs[i]}>{label}</a>)}</div>
        <div className={`navActions ${homeStyles.navActions}`}>
          <Link href={marketsHref} className={homeStyles.mobileLiveLink}><span className={homeStyles.mobileLiveDot} /> {t.live}</Link>
          <a href={loginUrl} className={`login ${homeStyles.login}`}>{t.login}</a>
          <a href={registerUrl} className={`button small ${homeStyles.betaButton}`}>{t.start} <ArrowRight size={16} /></a>
        </div>
      </nav>

      <section className={`hero ${homeStyles.hero}`} id="product">
        <div className="heroCopy">
          <div className="pill"><Sparkles size={16} /> {t.pill}</div>
          <h1>{t.title1}<br />{t.title2}<br /><span>{t.title3}</span></h1>
          <p className="lead">{t.lead}</p>
          <div className="heroButtons"><a href={registerUrl} className="button">{t.start} <ArrowRight size={18} /></a><a href="#how-it-works" className="button outline">{t.seeHow}</a></div>
          <p className={homeStyles.betaNote}><Check size={16} /> {t.betaNote}</p>
          <div className="integrations"><p>{t.early} <span /></p><div className="marketTabs"><strong>Crypto</strong><i /><strong>Stocks</strong></div><div className="marketLogos"><div className="marketLogo purple"><span />AI Confidence</div><div className="marketLogo blue"><span />Risk Intelligence</div><div className="marketLogo green"><span />Markets 24/7</div></div><div className="trustLine">{t.trust.map((item: string) => <span key={item}><Check size={16} /> {item}</span>)}</div></div>
        </div>
        <LocalizedDashboard locale={locale} />
      </section>

      <section className="copilot" id="features">
        <div className="copilotIntro"><div className="copilotIcon"><BrainCircuit size={46} /></div><div><p className="eyebrow">{t.why}</p><h2>{t.different}</h2><p>{t.differentText}</p></div></div>
        <div className="symbolBox"><AnalyzeBox locale={locale} /><div className="miniBenefits">{t.mini.map((item: string, i: number) => { const Icon = [Target, Zap, BrainCircuit, Sparkles][i]; return <span key={item}><Icon size={18} /> {item}</span>; })}</div></div>
        <div className="copilotResult"><div><p>{t.symbol}</p><strong>BTC/USDT</strong><small>{t.intelligence}</small></div><b>{t.watch}</b><ul>{t.signalList.map((item: string) => <li key={item}><Check size={15} /> {item}</li>)}</ul><span>{t.clear}</span></div>
      </section>

      <section className="features">{t.features.map((item: string[], i: number) => { const Icon = featureIcons[i]; return <article key={item[0]}><Icon size={38} /><h3>{item[0]}</h3><p>{item[1]}</p></article>; })}</section>

      <section className={homeStyles.howItWorks} id="how-it-works"><div className={homeStyles.sectionHeading}><p className="eyebrow">{t.howEyebrow}</p><h2>{t.howTitle}</h2><p>{t.howText}</p></div><div className={homeStyles.stepsGrid}>{t.steps.map((step: string[], i: number) => <article key={step[0]}><span>0{i + 1}</span><h3>{step[0]}</h3><p>{step[1]}</p></article>)}</div></section>

      <section className="roadmap" id="roadmap"><div className="sectionHeader"><p className="eyebrow">{t.roadmap}</p><h2>{t.roadmapTitle}</h2><p>{t.roadmapText}</p></div><div className="roadmapGrid">{t.roadmapItems.map((item: string[]) => <article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div></section>

      <section className={homeStyles.betaSection} id="beta"><div className={homeStyles.betaGlow} /><div className={homeStyles.betaContent}><div className={homeStyles.betaBadge}><Sparkles size={16} /> {t.betaBadge}</div><p className="eyebrow">{t.betaEyebrow}</p><h2>{t.betaTitle}</h2><p>{t.betaText}</p><div className={homeStyles.betaBenefits}>{t.betaBenefits.map((item: string) => <span key={item}><Check size={17} /> {item}</span>)}</div><div className={homeStyles.betaActions}><a href={registerUrl} className="button">{t.start} <ArrowRight size={18} /></a><a href={loginUrl} className="button outline">{t.already}</a></div><small>{t.betaSmall}</small></div></section>

      <footer><a className="brand" href="#product"><Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={36} height={36} /><span>KRYPNOVA</span></a><p>© 2026 Krypnova. {t.rights}</p><div className="footerLinks"><a href={`mailto:${contactEmail}`}>{t.nav[6]}</a><a href="https://www.instagram.com/krypnovaofficial" target="_blank" rel="noopener noreferrer" className="socialLink"><FaInstagram size={18} /><span>Instagram</span></a><a href="https://www.tiktok.com/@krypnovaofficial" target="_blank" rel="noopener noreferrer" className="socialLink"><FaTiktok size={18} /><span>TikTok</span></a></div></footer>
    </main>
  );
}

function LocalizedDashboard({ locale }: { locale: LocalizedLocale }) {
  const labels = locale === "es" ? ["Resumen", "Mercados", "Cartera", "AI Copilot", "Riesgo", "Reportes", "Ajustes"] : locale === "pt" ? ["Visão geral", "Mercados", "Carteira", "AI Copilot", "Risco", "Relatórios", "Configurações"] : ["Vue d'ensemble", "Marchés", "Portefeuille", "AI Copilot", "Risque", "Rapports", "Paramètres"];
  const health = locale === "es" ? "Salud de cartera" : locale === "pt" ? "Saúde da carteira" : "Santé du portefeuille";
  return <div className="dashboard"><aside><div className="dashBrand"><Image src="/krypnova-logo.jpeg" alt="" width={28} height={28} /><strong>KRYPNOVA</strong></div>{labels.map((item, index) => <span className={index === 0 ? "active" : ""} key={item}>{item}</span>)}</aside><div className="dashMain"><div className="dashHeader"><h3>{labels[0]}</h3><div><button>1D</button><button>7D</button><button>30D</button><button>90D</button></div></div><div className="metrics"><DashMetric label={health} value="Strong" change="Real-time" /><DashMetric label="AI Confidence" value="89%" change="High" /><DashMetric label="Risk Score" value="42 / 100" change="Moderate" /><DashMetric label="Markets Monitored" value="24/7" change="Multi-market" /></div><div className="chartCard"><div className="chartTop"><strong>Market Intelligence</strong><small>All Assets</small></div><div className="chartLine" /></div><div className="bottomDash"><div className="signals"><strong>Market Signals</strong>{["BTC/USDT", "AAPL", "TSLA", "NVDA"].map((s) => <p key={s}><span>{s}</span><em>Watch</em><b>Strong</b></p>)}</div><div className="outlook"><strong>AI Market Outlook</strong><div className="ring">78%<small>Bullish</small></div></div></div></div></div>;
}
function DashMetric({ label, value, change }: { label: string; value: string; change: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{change}</small></div>; }

function LocalizedMarkets({ locale }: { locale: LocalizedLocale }) {
  const t = marketsCopy[locale]; const common = commonCopy[locale]; const homeHref = pathForLocale("/", locale);
  return <main className={marketStyles.page}><div className={marketStyles.glowOne} /><div className={marketStyles.glowTwo} /><nav className={marketStyles.nav}><Link className={marketStyles.brand} href={homeHref}><Image src="/krypnova-logo.jpeg" alt="Krypnova" width={42} height={42} priority /><span>KRYPNOVA</span></Link><Link className={marketStyles.backLink} href={homeHref}><ArrowLeft size={16} /> {common.backToKrypnova}</Link></nav><section className={marketStyles.hero}><div className={marketStyles.heroBadge}><Sparkles size={15} /> {t.badge}</div><h1>{t.heroA}<span> {t.heroB}</span></h1><p>{t.intro}</p><div className={marketStyles.heroActions}><a href="#live-signals" className={marketStyles.primaryButton}>{t.live} <ArrowRight size={17} /></a><Link href="https://app.krypnova.com" className={marketStyles.secondaryButton}>{common.openKrypnova}</Link></div><div className={marketStyles.trustBar}><span><BrainCircuit size={18} /> {t.trust[0]}</span><span><ShieldCheck size={18} /> {t.trust[1]}</span><span><Sparkles size={18} /> {t.trust[2]}</span></div></section><div id="live-signals"><LiveSignals locale={locale} /></div><section className={marketStyles.privateLayer}><div><span className={marketStyles.eyebrow}>{t.inside}</span><h2>{t.privateTitle}</h2><p>{t.privateText}</p></div><Link href="https://app.krypnova.com" className={marketStyles.primaryButton}>{t.unlock} <ArrowRight size={17} /></Link></section></main>;
}

function LocalizedSeo({ locale, route }: { locale: LocalizedLocale; route: string }) {
  const page = seoCopy[locale][route];
  const faqs = page.faqs.map((item: string[]) => ({ question: item[0], answer: item[1] }));
  const sections = page.sections.map((item: string[]) => ({ title: item[0], text: item[1] }));
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f: any) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><SeoLanding locale={locale} eyebrow="Exion AI" title={page.title} highlight={page.highlight} description={page.description} bullets={page.bullets} sections={sections} faqs={faqs} /></>;
}

async function loadAsset(symbol: string) { try { const [signal, snapshot] = await Promise.all([findSymbolSignal(symbol), findMarketSnapshot(symbol)]); return { signal, snapshot }; } catch { return { signal: null, snapshot: null }; } }

async function LocalizedSymbol({ locale, symbolSlug }: { locale: LocalizedLocale; symbolSlug: string }) {
  const slug = symbolSlug.toLowerCase(); const asset = trackedAssets[slug] ?? { symbol: symbolSlug.toUpperCase(), name: symbolSlug.toUpperCase(), category: "Crypto" as const }; const { signal, snapshot } = await loadAsset(asset.symbol); const updatedAt = signal?.updatedAt ?? snapshot?.updatedAt ?? null; const marketsHref = pathForLocale("/markets", locale); const homeHref = pathForLocale("/", locale);
  const t = locale === "es" ? { badge: "Análisis diario de símbolo con Exion AI", title: `Análisis de ${asset.name} (${asset.symbol}) con IA hoy`, lead: `Krypnova utiliza Exion AI para evaluar la señal más reciente, confianza, retorno esperado, riesgo/retorno y puntuación de riesgo de ${asset.name}. Esta página pública se actualiza diariamente.`, open: "Abrir Exion AI completo", latest: "Evaluación más reciente", signal: `Señal Exion AI para ${asset.symbol}`, waiting: "Esperando datos frescos del mercado", price: "Precio", confidence: "Confianza", roi: "ROI esperado", rr: "Riesgo / Retorno", risk: "Puntuación de riesgo", bias: "Sesgo de mercado", monitoring: "MONITOREANDO", pending: "Pendiente", change: "Cambio 24h", empty: `Exion AI está monitoreando ${asset.symbol}`, emptyText: "Una nueva evaluación pública aparecerá cuando esté disponible la próxima señal puntuada.", how: "Cómo leer esta página", howTitle: "Una instantánea pública diaria, inteligencia más profunda dentro de Krypnova.", related: "Más análisis diarios", relatedTitle: "Explora otros activos monitoreados por Krypnova", disclosure: "Krypnova ofrece inteligencia de mercado y herramientas de apoyo a decisiones, no asesoría financiera. Operar e invertir implica riesgo." } : locale === "pt" ? { badge: "Análise diária de símbolo com Exion AI", title: `Análise de ${asset.name} (${asset.symbol}) com IA hoje`, lead: `A Krypnova usa Exion AI para avaliar o sinal mais recente, confiança, retorno esperado, risco/retorno e pontuação de risco de ${asset.name}. Esta página pública é atualizada diariamente.`, open: "Abrir Exion AI completo", latest: "Avaliação mais recente", signal: `Sinal Exion AI para ${asset.symbol}`, waiting: "Aguardando dados recentes do mercado", price: "Preço", confidence: "Confiança", roi: "ROI esperado", rr: "Risco / Retorno", risk: "Pontuação de risco", bias: "Viés de mercado", monitoring: "MONITORANDO", pending: "Pendente", change: "Variação 24h", empty: `Exion AI está monitorando ${asset.symbol}`, emptyText: "Uma nova avaliação pública aparecerá quando o próximo sinal pontuado estiver disponível.", how: "Como ler esta página", howTitle: "Uma visão pública diária, com inteligência mais profunda dentro da Krypnova.", related: "Mais análises diárias", relatedTitle: "Explore outros ativos monitorados pela Krypnova", disclosure: "A Krypnova fornece inteligência de mercado e suporte à decisão, não aconselhamento financeiro. Negociar e investir envolve riscos." } : { badge: "Analyse quotidienne de symbole avec Exion AI", title: `Analyse IA de ${asset.name} (${asset.symbol}) aujourd'hui`, lead: `Krypnova utilise Exion AI pour évaluer le dernier signal, la confiance, le rendement attendu, le risque/rendement et le score de risque de ${asset.name}. Cette page publique est actualisée quotidiennement.`, open: "Ouvrir Exion AI complet", latest: "Dernière évaluation", signal: `Signal Exion AI pour ${asset.symbol}`, waiting: "En attente de nouvelles données de marché", price: "Prix", confidence: "Confiance", roi: "ROI attendu", rr: "Risque / Rendement", risk: "Score de risque", bias: "Biais de marché", monitoring: "SURVEILLANCE", pending: "En attente", change: "Variation 24h", empty: `Exion AI surveille ${asset.symbol}`, emptyText: "Une nouvelle évaluation publique apparaîtra lors du prochain signal noté.", how: "Comment lire cette page", howTitle: "Un aperçu public quotidien, avec une intelligence plus profonde dans Krypnova.", related: "Plus d'analyses quotidiennes", relatedTitle: "Explorez d'autres actifs surveillés par Krypnova", disclosure: "Krypnova fournit de l'intelligence de marché et des outils d'aide à la décision, pas de conseil financier. Le trading et l'investissement comportent des risques." };
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: t.title, description: t.lead, url: `${siteUrl}${pathForLocale(`/markets/${slug}`, locale)}`, dateModified: updatedAt ?? undefined, inLanguage: locale };
  return <main className={symbolStyles.page}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><nav className={symbolStyles.nav}><Link className={symbolStyles.brand} href={homeHref}><Image src="/krypnova-logo.jpeg" alt="Krypnova" width={42} height={42} priority /><span>KRYPNOVA</span></Link><Link className={symbolStyles.backLink} href={marketsHref}><ArrowLeft size={16} /> {commonCopy[locale].liveMarkets}</Link></nav><section className={symbolStyles.hero}><div className={symbolStyles.badge}><Sparkles size={15} /> {t.badge}</div><p className={symbolStyles.eyebrow}>{asset.category} · {asset.symbol}</p><h1>{t.title}</h1><p className={symbolStyles.lead}>{t.lead}</p><div className={symbolStyles.actions}><Link href="https://app.krypnova.com" className={symbolStyles.primaryButton}>{t.open} <ArrowRight size={17} /></Link><Link href={marketsHref} className={symbolStyles.secondaryButton}>{commonCopy[locale].viewLiveMarkets}</Link></div></section><section className={symbolStyles.signalSection}><div className={symbolStyles.sectionHeader}><div><span className={symbolStyles.eyebrow}>{t.latest}</span><h2>{t.signal}</h2></div><span className={symbolStyles.updated}>{updatedAt ? formatDate(updatedAt, locale) : t.waiting}</span></div>{signal ? <div className={symbolStyles.signalCard}><div className={symbolStyles.signalTop}><div><span>{signal.exchange}</span><strong>{formatPair(signal.symbol)}</strong></div><b className={symbolStyles.direction}>{signal.signal}</b></div><div className={symbolStyles.metrics}><SymbolMetric label={t.price} value={formatPrice(signal.price ?? snapshot?.price ?? null, locale)} /><SymbolMetric label={t.confidence} value={formatPercent(signal.confidence)} /><SymbolMetric label={t.roi} value={formatSignedPercent(signal.expectedRoi)} /><SymbolMetric label={t.rr} value={formatRatio(signal.riskReward)} /><SymbolMetric label={t.risk} value={formatScore(signal.riskScore)} /><SymbolMetric label={t.bias} value={signal.marketBias?.toUpperCase() ?? "—"} /></div></div> : snapshot ? <div className={symbolStyles.signalCard}><div className={symbolStyles.signalTop}><div><span>{snapshot.exchange}</span><strong>{formatPair(snapshot.symbol)}</strong></div><b className={symbolStyles.monitoring}>{t.monitoring}</b></div><div className={symbolStyles.metrics}><SymbolMetric label={t.price} value={formatPrice(snapshot.price, locale)} /><SymbolMetric label={t.change} value={formatSignedPercent(snapshot.pctChange)} /><SymbolMetric label="AI Signal" value={t.pending} /><SymbolMetric label={t.confidence} value="—" /><SymbolMetric label={t.rr} value="—" /><SymbolMetric label={t.risk} value="—" /></div></div> : <div className={symbolStyles.emptyState}><BrainCircuit size={36} /><h3>{t.empty}</h3><p>{t.emptyText}</p></div>}</section><section className={symbolStyles.explainer}><div><span className={symbolStyles.eyebrow}>{t.how}</span><h2>{t.howTitle}</h2></div><div className={symbolStyles.explainerGrid}><article><BrainCircuit size={28} /><h3>Signal</h3><p>LONG · SHORT · WATCH · REJECT</p></article><article><Sparkles size={28} /><h3>{t.confidence} & ROI</h3><p>{t.roi}</p></article><article><ShieldCheck size={28} /><h3>{t.risk}</h3><p>{t.rr}</p></article></div></section><section className={symbolStyles.related}><span className={symbolStyles.eyebrow}>{t.related}</span><h2>{t.relatedTitle}</h2><div className={symbolStyles.relatedGrid}>{Object.entries(trackedAssets).filter(([key]) => key !== slug).slice(0, 6).map(([key, item]) => <Link key={key} href={pathForLocale(`/markets/${key}`, locale)}><span>{item.category}</span><strong>{item.name} ({item.symbol})</strong></Link>)}</div></section><section className={symbolStyles.disclosure}><ShieldCheck size={18} /><p>{t.disclosure}</p></section></main>;
}

function SymbolMetric({ label, value }: { label: string; value: string }) { return <div className={symbolStyles.metric}><span>{label}</span><strong>{value}</strong></div>; }
function intlLocale(locale: LocalizedLocale) { return locale === "pt" ? "pt-BR" : locale; }
function formatDate(value: string, locale: LocalizedLocale) { const date = new Date(value); if (Number.isNaN(date.getTime())) return "—"; return new Intl.DateTimeFormat(intlLocale(locale), { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date); }
function formatPrice(value: number | null, locale: LocalizedLocale) { if (value === null) return "—"; const digits = value >= 1000 ? 2 : value >= 1 ? 4 : 6; return `$${value.toLocaleString(intlLocale(locale), { minimumFractionDigits: 2, maximumFractionDigits: digits })}`; }
function formatPercent(value: number | null) { return value === null ? "—" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`; }
function formatSignedPercent(value: number | null) { if (value === null) return "—"; return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`; }
function formatRatio(value: number | null) { return value === null ? "—" : `${value.toFixed(2)} : 1`; }
function formatScore(value: number | null) { return value === null ? "—" : `${Math.round(value)} / 100`; }
function formatPair(value: string) { if (!value || value.includes("/")) return value; if (value.includes("-")) return value.replace("-", "/"); const kraken = value.match(/^X([A-Z0-9]{2,})Z(USD|EUR|GBP|JPY|CAD)$/); if (kraken) return `${kraken[1] === "XBT" ? "BTC" : kraken[1]}/${kraken[2]}`; const quote = ["USDT", "USDC", "USD", "EUR"].find((item) => value.endsWith(item) && value.length > item.length); return quote ? `${value.slice(0, -quote.length)}/${quote}` : value; }

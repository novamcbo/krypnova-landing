export const locales = ["en", "es", "pt", "fr"] as const;
export const localizedLocales = ["es", "pt", "fr"] as const;

export type Locale = (typeof locales)[number];
export type LocalizedLocale = (typeof localizedLocales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
};

export const localeShortNames: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  pt: "PT",
  fr: "FR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isLocalizedLocale(value: string): value is LocalizedLocale {
  return (localizedLocales as readonly string[]).includes(value);
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = normalized.split("/");
  if (parts[1] && isLocalizedLocale(parts[1])) {
    const stripped = `/${parts.slice(2).join("/")}`.replace(/\/$/, "");
    return stripped || "/";
  }
  return normalized || "/";
}

export function pathForLocale(pathname: string, locale: Locale): string {
  const base = stripLocalePrefix(pathname);
  if (locale === "en") return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

export function alternateLanguages(pathname: string): Record<string, string> {
  const base = stripLocalePrefix(pathname);
  return {
    "en-US": pathForLocale(base, "en"),
    es: pathForLocale(base, "es"),
    pt: pathForLocale(base, "pt"),
    fr: pathForLocale(base, "fr"),
    "x-default": pathForLocale(base, "en"),
  };
}

export const commonCopy = {
  en: {
    home: "Home",
    liveMarkets: "Live Markets",
    backToKrypnova: "Back to Krypnova",
    startBeta: "Start Free Beta",
    openKrypnova: "Open Krypnova",
    viewLiveMarkets: "View Live Markets",
    faqEyebrow: "Frequently Asked Questions",
    faqTitle: "Understand Krypnova before you use it.",
    exionEyebrow: "Exion AI inside Krypnova",
    exionTitle: "Turn market noise into clearer decisions.",
    exionText: "Analyze opportunities, understand risk and review market context from one intelligent platform.",
    footerRisk: "Trading and investing involve risk. Krypnova does not provide financial advice.",
  },
  es: {
    home: "Inicio",
    liveMarkets: "Mercados en vivo",
    backToKrypnova: "Volver a Krypnova",
    startBeta: "Comenzar Beta gratis",
    openKrypnova: "Abrir Krypnova",
    viewLiveMarkets: "Ver mercados en vivo",
    faqEyebrow: "Preguntas frecuentes",
    faqTitle: "Conoce Krypnova antes de usarlo.",
    exionEyebrow: "Exion AI dentro de Krypnova",
    exionTitle: "Convierte el ruido del mercado en decisiones más claras.",
    exionText: "Analiza oportunidades, comprende el riesgo y revisa el contexto del mercado desde una sola plataforma inteligente.",
    footerRisk: "Operar e invertir implica riesgo. Krypnova no ofrece asesoría financiera.",
  },
  pt: {
    home: "Início",
    liveMarkets: "Mercados ao vivo",
    backToKrypnova: "Voltar para Krypnova",
    startBeta: "Começar Beta grátis",
    openKrypnova: "Abrir Krypnova",
    viewLiveMarkets: "Ver mercados ao vivo",
    faqEyebrow: "Perguntas frequentes",
    faqTitle: "Entenda a Krypnova antes de usar.",
    exionEyebrow: "Exion AI dentro da Krypnova",
    exionTitle: "Transforme o ruído do mercado em decisões mais claras.",
    exionText: "Analise oportunidades, entenda o risco e revise o contexto do mercado em uma única plataforma inteligente.",
    footerRisk: "Negociar e investir envolve riscos. A Krypnova não oferece aconselhamento financeiro.",
  },
  fr: {
    home: "Accueil",
    liveMarkets: "Marchés en direct",
    backToKrypnova: "Retour à Krypnova",
    startBeta: "Commencer la bêta gratuite",
    openKrypnova: "Ouvrir Krypnova",
    viewLiveMarkets: "Voir les marchés en direct",
    faqEyebrow: "Questions fréquentes",
    faqTitle: "Comprenez Krypnova avant de l'utiliser.",
    exionEyebrow: "Exion AI dans Krypnova",
    exionTitle: "Transformez le bruit du marché en décisions plus claires.",
    exionText: "Analysez les opportunités, comprenez le risque et examinez le contexte du marché depuis une seule plateforme intelligente.",
    footerRisk: "Le trading et l'investissement comportent des risques. Krypnova ne fournit pas de conseil financier.",
  },
} satisfies Record<Locale, Record<string, string>>;

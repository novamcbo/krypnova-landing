import type { Metadata } from "next";
import SeoLanding from "../components/SeoLanding";

const canonical = "https://www.krypnova.com/ai-trading-platform";

export const metadata: Metadata = {
  title: "AI Trading Platform for Crypto & Stocks",
  description: "Explore Krypnova, an AI trading intelligence platform for crypto, stocks, forex and futures with market analysis, risk intelligence, portfolio context and Exion AI.",
  alternates: { canonical },
  openGraph: { title: "AI Trading Platform for Crypto & Stocks | Krypnova", description: "AI-powered trading intelligence, market analysis and risk context with Exion AI.", url: canonical, type: "website" },
};

const faqs = [
  { question: "What is an AI trading platform?", answer: "An AI trading platform uses machine learning, quantitative signals and structured market data to help users interpret conditions, opportunities and risk. Krypnova focuses on decision support rather than promising guaranteed returns." },
  { question: "Does Krypnova trade automatically for me?", answer: "Krypnova is built around market intelligence, explainable analysis and risk-aware decision support. Features can evolve, but users remain responsible for their own trading and investment decisions." },
  { question: "Which markets can Krypnova analyze?", answer: "Krypnova is designed for multi-market analysis across crypto, stocks, forex and futures, bringing market context and risk intelligence into one experience." },
  { question: "What is Exion AI?", answer: "Exion AI is Krypnova's intelligence layer for evaluating market structure, momentum, liquidity, risk, confidence and portfolio context before presenting an assessment." },
];

export default function Page() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /><SeoLanding eyebrow="AI Trading Intelligence" title="AI Trading Platform for" highlight="Clearer Market Decisions" description="Krypnova combines AI market analysis, risk intelligence, smart signals and portfolio context to help traders understand crypto, stocks, forex and futures without drowning in market noise." bullets={["Multi-market intelligence", "Risk-aware analysis", "Explainable Exion AI", "Portfolio context"]} sections={[{ title: "AI market intelligence beyond simple signals", text: "Krypnova evaluates more than direction. Exion AI looks at market structure, momentum, liquidity, volatility and transaction context to produce a more complete assessment." },{ title: "Risk first, not hype first", text: "Every opportunity should be understood alongside downside, uncertainty and portfolio exposure. Krypnova is designed to make risk visible before a user acts." },{ title: "Crypto and stock analysis in one platform", text: "Move between digital assets and equities while keeping a consistent framework for confidence, market regime, volatility and opportunity strength." },{ title: "Built for decision support", text: "Instead of replacing judgment, Krypnova organizes complex data into clearer explanations so users can make their own informed decisions." }]} faqs={faqs} /></>;
}

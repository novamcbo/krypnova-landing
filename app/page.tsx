import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Globe2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import LeadForm from "./components/LeadForm";
import RiskDisclosureModal from "./components/RiskDisclosureModal";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import TermsOfServiceModal from "./components/TermsOfServiceModal";

const contactEmail = "PedroV@krypnova.com";

const featureCards = [
  {
    icon: BrainCircuit,
    title: "Market Intelligence",
    text: "Monitor market conditions across multiple asset classes.",
  },
  {
    icon: Target,
    title: "Opportunity Discovery",
    text: "Identify emerging opportunities before they become obvious.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Intelligence",
    text: "Understand exposure, drawdowns, and portfolio risk.",
  },
  {
    icon: Sparkles,
    title: "AI Copilot",
    text: "Receive explanations, insights, and decision support.",
  },
  {
    icon: Zap,
    title: "Portfolio Analytics",
    text: "Track performance and portfolio health in real time.",
  },
  {
    icon: Globe2,
    title: "Multi-Market Coverage",
    text: "Analyze crypto, stocks, forex, and futures from one platform.",
  },
  {
    icon: BrainCircuit,
    title: "AI Symbol Analysis",
    text: "BTC/USDT · LONG · +12.4% Expected ROI · 89% Confidence · Bullish Regime · Moderate Volatility · Risk Score 42/100.",
  },
  {
    icon: Target,
    title: "Stock Intelligence",
    text: "TSLA · LONG · +8.7% Expected ROI · 84% Confidence · Bullish Regime · High Volatility · Risk Score 55/100.",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    text: "Built with a security-first architecture to help protect sensitive financial data and workflows.",
  },
];

const symbols = ["BTC/USDT", "AAPL", "TSLA", "ETH/USDT", "NVDA", "SPY"];

export default function Page() {
  return (
    <main className="site">
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <nav className="nav">
        <a className="brand" href="#">
          <Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={44} height={44} priority />
          <span>KRYPNOVA</span>
        </a>

        <div className="navLinks">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#integrations">Integrations</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#pricing">Waitlist</a>
          <a href={`mailto:${contactEmail}`}>Contact</a>
        </div>

        <div className="navActions">
          <a href="#login" className="login">Login</a>
          <a href="#pricing" className="button small">
            Join Waitlist <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section className="hero" id="product">
        <div className="heroCopy">
          <div className="pill">
            <Sparkles size={16} />
            AI-Powered Market Intelligence
          </div>

          <h1>
            Understand Markets.
            <br />
            Manage Risk.
            <br />
            <span>Invest With Confidence.</span>
          </h1>

          <p className="lead">
            Krypnova combines artificial intelligence, market intelligence, and risk analysis to help
            investors make smarter decisions across crypto, stocks, forex, and futures.
          </p>

          <div className="heroButtons">
            <a href="#pricing" className="button">
              Join Waitlist <ArrowRight size={18} />
            </a>
            <a href={`mailto:${contactEmail}?subject=Request Krypnova Demo`} className="button outline">
              Request a Demo
            </a>
          </div>

          <div className="integrations" id="integrations">
            <p>Early Access • Founding Members • Platform Updates <span /></p>
            <div className="marketTabs">
              <strong>Crypto</strong><i /><strong>Stocks</strong>
            </div>
            <div className="marketLogos">
              <div className="marketLogo purple"><span />AI Confidence 89%</div>
              <div className="marketLogo blue"><span />Risk Intelligence</div>
              <div className="marketLogo green"><span />Markets 24/7</div>
            </div>
            <div className="trustLine">
              <span><Check size={16} /> Market Conditions</span>
              <span><Check size={16} /> Risk Environment</span>
              <span><Check size={16} /> Opportunities</span>
              <span><Check size={16} /> Portfolio Exposure</span>
            </div>
          </div>
        </div>

        <DashboardMockup />
      </section>

      <section className="copilot" id="features">
        <div className="copilotIntro">
          <div className="copilotIcon"><BrainCircuit size={46} /></div>
          <div>
            <p className="eyebrow">Why We Built Krypnova</p>
            <h2>The challenge is not finding information. The challenge is knowing what matters.</h2>
            <p>
              Markets produce more information than any investor can process. News. Price action.
              Volume. Sentiment. Macro events. Krypnova was built to help investors identify
              opportunities, understand risk, and gain visibility into changing market conditions.
              Not by replacing human judgment, but by enhancing it.
            </p>
          </div>
        </div>

        <div className="symbolBox">
          <label>Analyze any symbol...</label>
          <div className="symbols">
            {symbols.map((symbol) => <span key={symbol}>{symbol}</span>)}
            <button>Analyze</button>
          </div>

          <div className="miniBenefits">
            <span><Target size={18} /> Market Conditions</span>
            <span><Zap size={18} /> Risk Environment</span>
            <span><BrainCircuit size={18} /> Opportunity Strength</span>
            <span><Sparkles size={18} /> Portfolio Exposure</span>
          </div>
        </div>

        <div className="copilotResult">
          <div>
            <p>AI Symbol Analysis</p>
            <strong>BTC/USDT</strong>
            <small>Crypto market intelligence</small>
          </div>

          <b>LONG · +12.4%</b>

          <ul>
            <li><Check size={15} /> Confidence 89%</li>
            <li><Check size={15} /> Market Regime: Bullish</li>
            <li><Check size={15} /> Volatility: Moderate</li>
            <li><Check size={15} /> Risk Score: 42/100</li>
          </ul>

          <span>Signal example generated by Krypnova Intelligence.</span>
        </div>

        <div className="copilotResult">
          <div>
            <p>Stock Intelligence</p>
            <strong>TSLA</strong>
            <small>Equity market intelligence</small>
          </div>

          <b>LONG · +8.7%</b>

          <ul>
            <li><Check size={15} /> Confidence 84%</li>
            <li><Check size={15} /> Market Regime: Bullish</li>
            <li><Check size={15} /> Volatility: High</li>
            <li><Check size={15} /> Risk Score: 55/100</li>
          </ul>

          <span>Multi-asset analysis across crypto, stocks, forex, and futures.</span>
        </div>
      </section>

      <section className="features">
        {featureCards.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={38} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="valueProp">
        <p className="eyebrow">See What Most Investors Miss</p>
        <h2>Every investor sees the market. Not every investor sees the same opportunity.</h2>
        <p>
          Markets generate more information than ever before. Prices move. News breaks. Sentiment
          shifts. Risk evolves. Yet opportunities are missed every day. Not because investors lack
          information, but because understanding what matters has never been more difficult.
        </p>
        <p>
          Krypnova was built to help investors transform complex market data into actionable
          intelligence. By analyzing market conditions, risk factors, and emerging opportunities,
          Krypnova helps bring greater clarity to the decision-making process.
        </p>
        <p>
          The goal is not to provide more information. The goal is to help investors understand what
          matters. Because confidence doesn&apos;t come from having more data. It comes from
          understanding it. And when investors understand markets more clearly, they can make
          decisions with greater confidence, discipline, and conviction.
        </p>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="sectionHeader">
          <p className="eyebrow">Roadmap</p>
          <h2>Building the Future of Intelligent Investing</h2>
          <p>
            Our roadmap focuses on market intelligence, decision support, portfolio intelligence,
            mobile access, and institutional-grade capabilities.
          </p>
        </div>

        <div className="roadmapGrid">
          <article>
            <span>Q3 2026</span>
            <h3>Market Intelligence Platform</h3>
            <p>
              Beta release of Krypnova&apos;s core platform with AI Copilot, market intelligence,
              portfolio tracking, and real-time monitoring.
            </p>
          </article>

          <article>
            <span>Q4 2026</span>
            <h3>Decision Support & Automation</h3>
            <p>
              Expanded intelligence tools, automated workflows, decision support, and enhanced risk
              management capabilities.
            </p>
          </article>

          <article>
            <span>Q1 2027</span>
            <h3>Portfolio Intelligence</h3>
            <p>
              Portfolio optimization, diversification analysis, exposure monitoring, and advanced risk
              assessment.
            </p>
          </article>

          <article>
            <span>Q2 2027</span>
            <h3>Mobile Experience</h3>
            <p>
              Native mobile applications with real-time alerts, portfolio monitoring, and AI Copilot
              access anywhere.
            </p>
          </article>

          <article>
            <span>Q3 2027</span>
            <h3>Institutional Suite</h3>
            <p>
              Advanced reporting, multi-account intelligence, deeper risk controls, and institutional
              analytics.
            </p>
          </article>
        </div>
      </section>

      <section className="valueProp">
        <p className="eyebrow">Our Mission</p>
        <h2>The future belongs to investors who can turn information into intelligence.</h2>
        <p>
          Our mission is simple: help investors better understand markets, identify opportunities,
          manage risk intelligently, and make better decisions. That&apos;s Krypnova.
        </p>
      </section>

      <section className="waitlist" id="pricing">
        <div className="mailIcon"><Mail size={32} /></div>
        <div>
          <h2>Be Among the First to Experience Krypnova.</h2>
          <p>
            Join the waitlist to receive priority access, early feature releases, platform development
            updates, exclusive market insights, and founding member status.
          </p>
        </div>

        <LeadForm />
      </section>

      <footer>
        <a className="brand" href="#">
          <Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={36} height={36} />
          <span>KRYPNOVA</span>
        </a>

        <p>© 2026 Krypnova. All rights reserved.</p>

        <div className="footerLinks">
          <a href={`mailto:${contactEmail}`}>Contact</a>

          <a
            href="https://www.instagram.com/krypnovaofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="socialLink"
          >
            <FaInstagram size={18} />
            <span>Instagram</span>
          </a>

          <a
            href="https://www.tiktok.com/@krypnovaofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="socialLink"
          >
            <FaTiktok size={18} />
            <span>TikTok</span>
          </a>

          <RiskDisclosureModal />
          <PrivacyPolicyModal />
          <TermsOfServiceModal />
        </div>
      </footer>
    </main>
  );
}

function DashboardMockup() {
  return (
    <div className="dashboard">
      <aside>
        <div className="dashBrand">
          <Image src="/krypnova-logo.jpeg" alt="" width={28} height={28} />
          <strong>KRYPNOVA</strong>
        </div>
        {["Overview", "Markets", "Portfolio", "AI Copilot", "Risk", "Reports", "Settings"].map((item, index) => (
          <span className={index === 0 ? "active" : ""} key={item}>{item}</span>
        ))}
      </aside>

      <div className="dashMain">
        <div className="dashHeader">
          <h3>Overview</h3>
          <div><button>1D</button><button>7D</button><button>30D</button><button>90D</button></div>
        </div>

        <div className="metrics">
          <Metric label="Portfolio Value" value="$2.84M" change="+12.4%" />
          <Metric label="AI Confidence" value="89%" change="High" />
          <Metric label="Risk Score" value="42 / 100" change="Moderate" />
          <Metric label="Markets Monitored" value="24/7" change="Crypto • Stocks • Forex" />
        </div>

        <div className="chartCard">
          <div className="chartTop">
            <strong>Market Intelligence</strong>
            <small>All Assets</small>
          </div>
          <div className="chartLine" />
        </div>

        <div className="bottomDash">
          <div className="signals">
            <strong>Market Signals</strong>
            {["BTC/USDT", "AAPL", "TSLA", "NVDA"].map((s, i) => (
              <p key={s}><span>{s}</span><em>Watch</em><b>+{[12.45, 8.32, 6.18, 5.28][i]}%</b></p>
            ))}
          </div>

          <div className="outlook">
            <strong>AI Market Outlook</strong>
            <div className="ring">78%<small>Bullish</small></div>
            <p>Krypnova detects improving momentum while market risk remains moderate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change}</small>
    </div>
  );
}
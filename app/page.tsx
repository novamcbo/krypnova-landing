import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Globe2,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import RiskDisclosureModal from "./components/RiskDisclosureModal";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import TermsOfServiceModal from "./components/TermsOfServiceModal";
import styles from "./beta-upgrade.module.css";

const contactEmail = "PedroV@krypnova.com";
const loginUrl = "https://app.krypnova.com/login";
const registerUrl = "https://app.krypnova.com/register";

const featureCards = [
  { icon: BrainCircuit, title: "Market Intelligence", text: "Understand changing market conditions without getting lost in endless charts and indicators." },
  { icon: Target, title: "Opportunity Discovery", text: "Find potential opportunities across multiple markets before they become obvious." },
  { icon: ShieldCheck, title: "Risk Intelligence", text: "See risk, volatility, exposure and market conditions before making a decision." },
  { icon: Sparkles, title: "AI Copilot", text: "Ask questions and receive clear explanations, insights and decision support." },
  { icon: Zap, title: "Smart Signals", text: "Receive signals with confidence, context and risk—not just a buy or sell alert." },
  { icon: Globe2, title: "Multi-Market Coverage", text: "Analyze crypto, stocks, forex and futures from one intelligent platform." },
  { icon: BrainCircuit, title: "AI Symbol Analysis", text: "Analyze any supported asset and understand direction, opportunity strength and market regime." },
  { icon: Target, title: "Portfolio Intelligence", text: "Track portfolio health, performance, concentration and exposure in one place." },
  { icon: Lock, title: "Security-First", text: "Built with a security-first architecture for sensitive financial data and workflows." },
];

const symbols = ["BTC/USDT", "AAPL", "TSLA", "ETH/USDT", "NVDA", "SPY"];

export default function Page() {
  return (
    <main className="site">
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <nav className={`nav ${styles.nav}`}>
        <a className={`brand ${styles.brand}`} href="#product">
          <Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={44} height={44} priority />
          <span>KRYPNOVA</span>
        </a>

        <div className="navLinks">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#beta">Beta Access</a>
          <a href="#roadmap">Roadmap</a>
          <a href={`mailto:${contactEmail}`}>Contact</a>
        </div>

        <div className={`navActions ${styles.navActions}`}>
          <a href={loginUrl} className={`login ${styles.login}`}>Login</a>
          <a href={registerUrl} className={`button small ${styles.betaButton}`}>
            <span className={styles.desktopCta}>Start Free Beta</span>
            <span className={styles.mobileCta}>Start Beta</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section className={`hero ${styles.hero}`} id="product">
        <div className="heroCopy">
          <div className="pill"><Sparkles size={16} /> AI-Powered Market Intelligence</div>
          <h1>Understand Markets.<br />Manage Risk.<br /><span>Invest With Confidence.</span></h1>
          <p className="lead">
            Krypnova turns complex market data into clear opportunities, risk insights and simple explanations across crypto, stocks, forex and futures.
          </p>
          <div className="heroButtons">
            <a href={registerUrl} className="button">Start Your Free Beta <ArrowRight size={18} /></a>
            <a href="#how-it-works" className="button outline">See How It Works</a>
          </div>
          <p className={styles.betaNote}><Check size={16} /> Free during beta · No credit card required · Limited early access</p>

          <div className="integrations" id="integrations">
            <p>Early Access • Founding Members • Platform Updates <span /></p>
            <div className="marketTabs"><strong>Crypto</strong><i /><strong>Stocks</strong></div>
            <div className="marketLogos">
              <div className="marketLogo purple"><span />AI Confidence</div>
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
            <p className="eyebrow">Why Krypnova Is Different</p>
            <h2>More than charts, alerts or another trading signal.</h2>
            <p>Krypnova combines market intelligence, opportunity discovery, risk analysis, portfolio insights, smart signals and an AI Copilot in one place.</p>
          </div>
        </div>
        <div className="symbolBox">
          <label>Analyze any symbol...</label>
          <div className="symbols">{symbols.map((symbol) => <span key={symbol}>{symbol}</span>)}<button>Analyze</button></div>
          <div className="miniBenefits">
            <span><Target size={18} /> Market Conditions</span>
            <span><Zap size={18} /> Risk Environment</span>
            <span><BrainCircuit size={18} /> Opportunity Strength</span>
            <span><Sparkles size={18} /> Portfolio Exposure</span>
          </div>
        </div>
        <div className="copilotResult">
          <div><p>AI Symbol Analysis</p><strong>BTC/USDT</strong><small>Market intelligence</small></div>
          <b>WATCH</b>
          <ul>
            <li><Check size={15} /> Confidence and direction</li>
            <li><Check size={15} /> Market regime</li>
            <li><Check size={15} /> Volatility</li>
            <li><Check size={15} /> Risk score</li>
          </ul>
          <span>Clear context before you act.</span>
        </div>
      </section>

      <section className="features">
        {featureCards.map(({ icon: Icon, title, text }) => (
          <article key={title}><Icon size={38} /><h3>{title}</h3><p>{text}</p></article>
        ))}
      </section>

      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionHeading}>
          <p className="eyebrow">How It Works</p>
          <h2>From market noise to clearer decisions.</h2>
          <p>Krypnova organizes complex information into a simple experience built for everyday investors and active traders.</p>
        </div>
        <div className={styles.stepsGrid}>
          <article><span>01</span><h3>Choose a market or asset</h3><p>Search crypto, stocks and other supported markets from one dashboard.</p></article>
          <article><span>02</span><h3>Understand the opportunity</h3><p>See direction, confidence, market conditions and the factors that matter.</p></article>
          <article><span>03</span><h3>Review the risk</h3><p>Evaluate volatility, exposure and risk before making your own decision.</p></article>
        </div>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="sectionHeader">
          <p className="eyebrow">Roadmap</p>
          <h2>Building the Future of Intelligent Investing</h2>
          <p>Our roadmap focuses on market intelligence, decision support, portfolio intelligence, mobile access and institutional-grade capabilities.</p>
        </div>
        <div className="roadmapGrid">
          <article><span>Q3 2026</span><h3>Market Intelligence Platform</h3><p>Core beta platform with AI Copilot, market intelligence, portfolio tracking and monitoring.</p></article>
          <article><span>Q4 2026</span><h3>Decision Support & Automation</h3><p>Expanded intelligence tools, automated workflows and enhanced risk controls.</p></article>
          <article><span>Q1 2027</span><h3>Portfolio Intelligence</h3><p>Portfolio optimization, diversification analysis and advanced risk assessment.</p></article>
          <article><span>Q2 2027</span><h3>Mobile Experience</h3><p>Native mobile access with real-time alerts and AI Copilot anywhere.</p></article>
          <article><span>Q3 2027</span><h3>Institutional Suite</h3><p>Advanced reporting, multi-account intelligence and deeper risk controls.</p></article>
        </div>
      </section>

      <section className={styles.betaSection} id="beta">
        <div className={styles.betaGlow} />
        <div className={styles.betaContent}>
          <div className={styles.betaBadge}><Sparkles size={16} /> Limited Beta Access</div>
          <p className="eyebrow">Join the Krypnova Beta</p>
          <h2>Be one of the first to experience a clearer way to understand the market.</h2>
          <p>Get early access to AI-powered market intelligence, smart signals, risk insights, portfolio analytics and the AI Copilot.</p>
          <div className={styles.betaBenefits}>
            <span><Check size={17} /> Free during beta</span>
            <span><Check size={17} /> No credit card required</span>
            <span><Check size={17} /> Early access to new features</span>
            <span><Check size={17} /> Help shape the product</span>
          </div>
          <div className={styles.betaActions}>
            <a href={registerUrl} className="button">Start Free Beta <ArrowRight size={18} /></a>
            <a href={loginUrl} className="button outline">Already a member? Login</a>
          </div>
          <small>Beta access is limited. Trading and investing involve risk. Krypnova does not provide financial advice.</small>
        </div>
      </section>

      <footer>
        <a className="brand" href="#product"><Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={36} height={36} /><span>KRYPNOVA</span></a>
        <p>© 2026 Krypnova. All rights reserved.</p>
        <div className="footerLinks">
          <a href={`mailto:${contactEmail}`}>Contact</a>
          <a href="https://www.instagram.com/krypnovaofficial" target="_blank" rel="noopener noreferrer" className="socialLink"><FaInstagram size={18} /><span>Instagram</span></a>
          <a href="https://www.tiktok.com/@krypnovaofficial" target="_blank" rel="noopener noreferrer" className="socialLink"><FaTiktok size={18} /><span>TikTok</span></a>
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
        <div className="dashBrand"><Image src="/krypnova-logo.jpeg" alt="" width={28} height={28} /><strong>KRYPNOVA</strong></div>
        {["Overview", "Markets", "Portfolio", "AI Copilot", "Risk", "Reports", "Settings"].map((item, index) => <span className={index === 0 ? "active" : ""} key={item}>{item}</span>)}
      </aside>
      <div className="dashMain">
        <div className="dashHeader"><h3>Overview</h3><div><button>1D</button><button>7D</button><button>30D</button><button>90D</button></div></div>
        <div className="metrics">
          <Metric label="Portfolio Health" value="Strong" change="Real-time" />
          <Metric label="AI Confidence" value="89%" change="High" />
          <Metric label="Risk Score" value="42 / 100" change="Moderate" />
          <Metric label="Markets Monitored" value="24/7" change="Multi-market" />
        </div>
        <div className="chartCard"><div className="chartTop"><strong>Market Intelligence</strong><small>All Assets</small></div><div className="chartLine" /></div>
        <div className="bottomDash">
          <div className="signals"><strong>Market Signals</strong>{["BTC/USDT", "AAPL", "TSLA", "NVDA"].map((s, i) => <p key={s}><span>{s}</span><em>Watch</em><b>{["Strong", "Moderate", "Watch", "Strong"][i]}</b></p>)}</div>
          <div className="outlook"><strong>AI Market Outlook</strong><div className="ring">78%<small>Bullish</small></div><p>Krypnova detects improving momentum while market risk remains moderate.</p></div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{change}</small></div>;
}

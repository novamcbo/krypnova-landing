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
import LeadForm from "./components/LeadForm";

const contactEmail = "PedroV@krypnova.com";

const featureCards = [
  {
    icon: BrainCircuit,
    title: "Intelligent Market Intelligence",
    text: "Analyze market conditions, identify emerging opportunities, and uncover actionable insights in real time.",
  },
  {
    icon: Zap,
    title: "Automated Strategy Execution",
    text: "Monitor markets, manage risk, and execute approved strategies with intelligent automation.",
  },
  {
    icon: Sparkles,
    title: "Adaptive Decision Engine",
    text: "Our technology evaluates multiple market perspectives simultaneously, helping identify high-probability opportunities while filtering noise and uncertainty.",
  },
  {
    icon: Target,
    title: "Portfolio Intelligence",
    text: "Gain a deeper understanding of portfolio performance, diversification, and risk exposure.",
  },
  {
    icon: Globe2,
    title: "Multi-Market Coverage",
    text: "Track and analyze opportunities across crypto, equities, forex, and futures from a unified platform.",
  },
  {
    icon: ShieldCheck,
    title: "Advanced Risk Controls",
    text: "Protect capital with institutional-grade risk monitoring, adaptive controls, and exposure management.",
  },
  {
    icon: Zap,
    title: "Real-Time Signals & Alerts",
    text: "Receive timely insights and alerts designed to help you react faster to changing market conditions.",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    text: "Built with a security-first architecture to protect sensitive financial data and workflows.",
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
            Smarter Decisions.
            <br />
            Faster Execution.
            <br />
            <span>Built for What’s Next.</span>
          </h1>

          <p className="lead">
            Krypnova continuously analyzes market conditions, identifies opportunities, evaluates risk,
            and adapts to changing environments to help traders make more informed decisions across
            crypto, equities, forex, and futures.
          </p>

          <div className="heroButtons">
            <a href="#pricing" className="button">
              Join the Waitlist <ArrowRight size={18} />
            </a>
            <a href={`mailto:${contactEmail}?subject=Request Krypnova Demo`} className="button outline">
              Request a Demo
            </a>
          </div>

          <div className="integrations" id="integrations">
            <p>Connected to global markets <span /></p>
            <div className="marketTabs">
              <strong>Crypto</strong><i /><strong>Stocks</strong>
            </div>
            <div className="marketLogos">
              <div className="marketLogo purple"><span />kraken</div>
              <div className="marketLogo blue"><span />coinbase</div>
              <div className="marketLogo green"><span />alpaca</div>
            </div>
            <div className="trustLine">
              <span><Check size={16} /> Real-Time Data</span>
              <span><Check size={16} /> Secure Connections</span>
              <span><Check size={16} /> Unified Portfolio</span>
              <span><Check size={16} /> Automated Monitoring</span>
            </div>
          </div>
        </div>

        <DashboardMockup />
      </section>

      <section className="copilot" id="features">
        <div className="copilotIntro">
          <div className="copilotIcon"><BrainCircuit size={46} /></div>
          <div>
            <p className="eyebrow">AI Copilot</p>
            <h2>Analyze Any Symbol in Seconds. Get Insights. Get an Edge.</h2>
            <p>
              Krypnova’s AI Copilot evaluates market conditions, identifies emerging opportunities,
              assesses risk, and delivers actionable insights in seconds to help traders stay ahead
              of changing market dynamics.
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
            <span><Target size={18} /> Any Symbol</span>
            <span><Zap size={18} /> Seconds</span>
            <span><BrainCircuit size={18} /> Smart Insights</span>
            <span><Sparkles size={18} /> Actionable Edge</span>
          </div>
        </div>

        <div className="copilotResult">
          <div>
            <p>AI Copilot Example</p>
            <strong>SOL/USDT</strong>
            <small>High probability opportunity</small>
          </div>
          <b>Bullish</b>
          <ul>
            <li><Check size={15} /> Strong momentum detected</li>
            <li><Check size={15} /> Increasing volume</li>
            <li><Check size={15} /> Favorable risk/reward</li>
          </ul>
          <span>Suggested Action: Consider Long</span>
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
        <p className="eyebrow">From Insight to Action</p>
        <h2>Transform Market Intelligence Into Strategy-Driven Execution</h2>
        <p>
          Transform insights into action with intelligent automation designed to monitor markets,
          manage risk, and execute approved strategies.
        </p>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="sectionHeader">
          <p className="eyebrow">Roadmap</p>
          <h2>Building the Future of AI-Powered Trading</h2>
          <p>
            Our roadmap focuses on delivering institutional-grade intelligence, automated execution,
            portfolio optimization, and next-generation trading tools.
          </p>
        </div>

        <div className="roadmapGrid">
          <article>
            <span>Q3 2026</span>
            <h3>Beta Release</h3>
            <p>
              Initial platform launch with AI Copilot, market intelligence, portfolio tracking,
              and real-time signal generation.
            </p>
          </article>

          <article>
            <span>Q4 2026</span>
            <h3>Automated Strategy Execution</h3>
            <p>
              Strategy-driven execution workflows with risk controls, user permissions,
              and continuous market monitoring.
            </p>
          </article>

          <article>
            <span>Q1 2027</span>
            <h3>Portfolio Optimizer & Risk Intelligence</h3>
            <p>
              Portfolio construction, diversification, risk-adjusted allocation,
              and intelligent optimization tools.
            </p>
          </article>

          <article>
            <span>Q2 2027</span>
            <h3>Mobile App & AI Copilot</h3>
            <p>
              Native iOS and Android applications with real-time alerts, portfolio monitoring,
              and AI Copilot access on the go.
            </p>
          </article>
        </div>
      </section>

      <section className="waitlist" id="pricing">
        <div className="mailIcon"><Mail size={32} /></div>
        <div>
          <h2>Be the first to experience the future of AI-powered trading.</h2>
          <p>Join our waitlist and get early access to Krypnova’s intelligent market platform.</p>
        </div>

        <LeadForm />
      </section>

      <section className="disclaimer">
        <h3>Disclaimer</h3>
        <p>
          Krypnova is not a financial advisor, broker-dealer, investment firm, or registered investment adviser.
          All information, analytics, signals, AI-generated insights, and platform features are provided for
          informational and educational purposes only and should not be considered financial, investment,
          trading, tax, or legal advice. Trading cryptocurrencies, stocks, options, forex, and futures involves
          substantial risk, including the possible loss of capital. Users are solely responsible for their own
          trading and investment decisions. Past performance does not guarantee future results.
        </p>
      </section>

      <footer>
        <a className="brand" href="#">
          <Image src="/krypnova-logo.jpeg" alt="Krypnova logo" width={36} height={36} />
          <span>KRYPNOVA</span>
        </a>
        <p>© 2026 Krypnova. All rights reserved.</p>
        <div>
          <a href={`mailto:${contactEmail}`}>Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
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
        {["Overview", "Markets", "Portfolio", "Signals", "AI Copilot", "Backtesting", "Risk Management", "Settings"].map((item, index) => (
          <span className={index === 0 ? "active" : ""} key={item}>{item}</span>
        ))}
      </aside>

      <div className="dashMain">
        <div className="dashHeader">
          <h3>Overview</h3>
          <div><button>1D</button><button>7D</button><button>30D</button><button>90D</button></div>
        </div>

        <div className="metrics">
          <Metric label="Total Portfolio" value="$2,842,621" change="+8.45% (24h)" />
          <Metric label="Total Return" value="$842.65" change="+12.35% (24h)" />
          <Metric label="Sharpe Ratio" value="2.35" change="+0.15 (30d)" />
          <Metric label="Win Rate" value="68.4%" change="+3.2% (30d)" />
        </div>

        <div className="chartCard">
          <div className="chartTop">
            <strong>Performance</strong>
            <small>All Assets</small>
          </div>
          <div className="chartLine" />
        </div>

        <div className="bottomDash">
          <div className="signals">
            <strong>Top Signals</strong>
            {["BTC/USDT", "AAPL", "TSLA", "NVDA"].map((s, i) => (
              <p key={s}><span>{s}</span><em>Long</em><b>+{[12.45, 8.32, 6.18, 5.28][i]}%</b></p>
            ))}
          </div>

          <div className="outlook">
            <strong>AI Market Outlook</strong>
            <div className="ring">78%<small>Bullish</small></div>
            <p>AI models detect high probability upward momentum in the short term.</p>
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

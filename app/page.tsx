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
    title: "AI-Powered Analysis",
    text: "Advanced models scan market structure, momentum, volatility, and risk signals in real time.",
  },
  {
    icon: Globe2,
    title: "Multi-Market Access",
    text: "Analyze crypto and stocks from one unified intelligence layer.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    text: "Institutional-grade risk controls designed to protect capital before chasing returns.",
  },
  {
    icon: Zap,
    title: "Real-Time Signals",
    text: "Actionable market insights, alerts, and trading context when seconds matter.",
  },
  {
    icon: Lock,
    title: "Secure & Reliable",
    text: "Built with a security-first mindset for sensitive financial workflows.",
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
          <a href="#pricing">Pricing</a>
          <a href="#roadmap">Roadmap</a>
          <a href={`mailto:${contactEmail}`}>Contact</a>
        </div>

        <div className="navActions">
          <a href="#login" className="login">Login</a>
          <a href={`mailto:${contactEmail}?subject=Krypnova Waitlist`} className="button small">
            Join Waitlist <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section className="hero" id="product">
        <div className="heroCopy">
          <div className="pill">
            <Sparkles size={16} />
            AI-Powered Trading Intelligence
          </div>

          <h1>
            Smarter Decisions.
            <br />
            Stronger Returns.
            <br />
            <span>Built for What’s Next.</span>
          </h1>

          <p className="lead">
            Krypnova combines institutional-grade AI, quantitative models, and real-time market data to help you trade and invest with confidence across crypto and stocks.
          </p>

          <div className="heroButtons">
            <a href={`mailto:${contactEmail}?subject=Join Krypnova Waitlist`} className="button">
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
              <span><Check size={16} /> 24/7 Monitoring</span>
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
              Our AI Copilot scans any crypto or stock symbol in seconds, analyzes market conditions, and suggests high-probability opportunities with clear reasoning.
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

      <section className="waitlist" id="pricing">
        <div className="mailIcon"><Mail size={32} /></div>
        <div>
          <h2>Be the first to experience the future of trading.</h2>
          <p>Join our waitlist and get early access.</p>
        </div>

        <LeadForm />
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

"use client";

import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

export default function TermsOfServiceModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" className="legalLink" onClick={() => setOpen(true)}>
                Terms of Service
            </button>

            {open && (
                <div className="legalOverlay" role="dialog" aria-modal="true">
                    <div className="legalModal">
                        <button className="legalClose" onClick={() => setOpen(false)} aria-label="Close">
                            <X size={20} />
                        </button>

                        <div className="legalHeader">
                            <ShieldCheck size={34} />
                            <div>
                                <h2>Terms of Service</h2>
                                <p>Last updated: June 2026</p>
                            </div>
                        </div>

                        <div className="legalContent">
                            <p>
                                These Terms of Service govern your access to and use of Krypnova, including the
                                website, waitlist, dashboard, AI Copilot, market intelligence, portfolio analytics,
                                exchange integrations, automation tools, signal tools, and related services.
                            </p>

                            <h3>1. Acceptance of Terms</h3>
                            <p>
                                By accessing or using Krypnova, you agree to these Terms. If you do not agree, do
                                not use the platform.
                            </p>

                            <h3>2. Krypnova Is Software, Not a Broker or Advisor</h3>
                            <p>
                                Krypnova provides software, analytics, automation tools, AI-generated insights,
                                market intelligence, portfolio tools, and decision-support features. Krypnova is not
                                a broker-dealer, futures commission merchant, forex dealer, commodity trading
                                advisor, investment adviser, financial adviser, tax adviser, legal adviser, bank, or
                                exchange.
                            </p>

                            <h3>3. No Financial Advice</h3>
                            <p>
                                Information, signals, forecasts, AI outputs, expected ROI, confidence scores,
                                strategies, alerts, dashboards, and examples are for informational and educational
                                purposes only. They do not constitute financial, investment, legal, tax, accounting,
                                or trading advice. You are solely responsible for all investment and trading
                                decisions.
                            </p>

                            <h3>4. No Guarantee of Profits</h3>
                            <p>
                                Krypnova does not guarantee profits, returns, performance, accuracy, signal success,
                                risk reduction, or any financial outcome. Trading and investing involve risk, and
                                you may lose some or all of your capital.
                            </p>

                            <h3>5. Market Risk</h3>
                            <p>
                                Crypto, stocks, ETFs, forex, futures, options, commodities, margin products,
                                leveraged products, and derivatives can be volatile and risky. Futures, options,
                                leveraged trading, and forex may involve substantial risk of loss and may not be
                                suitable for all users.
                            </p>

                            <h3>6. AI and Automated Tools</h3>
                            <p>
                                Krypnova may use artificial intelligence, predictive analytics, algorithms, models,
                                and automated workflows. AI outputs may be inaccurate, incomplete, delayed,
                                misleading, or unsuitable for your situation. You must independently review all
                                outputs before relying on them.
                            </p>

                            <h3>7. Autopilot and Automated Execution</h3>
                            <p>
                                If you enable Autopilot, Semi-Auto, Full Autopilot, automated execution, or similar
                                features, you authorize Krypnova to transmit, modify, manage, or close orders
                                according to your selected settings, connected accounts, available balances, risk
                                controls, and platform configuration.
                            </p>
                            <p>
                                You remain solely responsible for all trades, orders, losses, fees, slippage,
                                tax consequences, and outcomes resulting from automation. You should monitor
                                automated systems actively and use kill switches, limits, and risk controls.
                            </p>

                            <h3>8. Exchange and Third-Party Services</h3>
                            <p>
                                Krypnova may connect with third-party exchanges, brokers, data providers, wallet
                                providers, payment providers, or infrastructure providers. Krypnova is not
                                responsible for third-party outages, delays, API errors, rejected orders, incorrect
                                data, account restrictions, liquidity issues, or exchange failures.
                            </p>

                            <h3>9. API Credentials</h3>
                            <p>
                                You are responsible for safeguarding API keys, passwords, 2FA devices, accounts,
                                permissions, and connected exchange credentials. You should use least-privilege API
                                permissions and disable withdrawals where supported. Krypnova is not responsible for
                                losses caused by compromised credentials, user negligence, third-party breaches, or
                                unsafe account settings.
                            </p>

                            <h3>10. User Eligibility</h3>
                            <p>
                                You may use Krypnova only if you are legally permitted to do so in your jurisdiction
                                and meet all age, residency, regulatory, and account requirements. You are
                                responsible for compliance with local laws and exchange rules.
                            </p>

                            <h3>11. User Responsibilities</h3>
                            <ul>
                                <li>You must evaluate your own risk tolerance and financial situation.</li>
                                <li>You must verify all orders before approving or enabling automation.</li>
                                <li>You must maintain sufficient funds, margin, and account permissions.</li>
                                <li>You must monitor open positions and connected accounts.</li>
                                <li>You must comply with tax, reporting, trading, and regulatory obligations.</li>
                            </ul>

                            <h3>12. Platform Availability</h3>
                            <p>
                                Krypnova may experience downtime, errors, latency, bugs, maintenance, cyberattacks,
                                data-feed interruptions, model failures, or infrastructure outages. We do not
                                guarantee uninterrupted, accurate, secure, or error-free operation.
                            </p>

                            <h3>13. Examples and Simulations</h3>
                            <p>
                                Any examples, simulated trades, backtests, expected ROI, confidence scores,
                                performance illustrations, forecasts, screenshots, or demo results are illustrative
                                only and do not guarantee future performance.
                            </p>

                            <h3>14. Prohibited Uses</h3>
                            <p>
                                You may not use Krypnova for unlawful trading, market manipulation, fraud,
                                unauthorized account access, credential theft, sanctions evasion, abusive scraping,
                                reverse engineering, or any activity that violates law, exchange rules, or third-party
                                rights.
                            </p>

                            <h3>15. Limitation of Liability</h3>
                            <p>
                                To the maximum extent permitted by law, Krypnova and its owners, employees,
                                contractors, affiliates, and partners are not liable for trading losses, lost profits,
                                missed opportunities, loss of data, exchange outages, API failures, order errors,
                                slippage, liquidation, margin calls, tax liabilities, business interruption, or
                                indirect, incidental, consequential, special, or punitive damages.
                            </p>

                            <h3>16. Indemnification</h3>
                            <p>
                                You agree to defend, indemnify, and hold harmless Krypnova from claims, losses,
                                damages, liabilities, costs, and expenses arising from your use of the platform,
                                your trading activity, your connected accounts, your violation of these Terms, or
                                your violation of law or third-party rights.
                            </p>

                            <h3>17. Changes to Terms</h3>
                            <p>
                                Krypnova may update these Terms from time to time. Continued use of the platform
                                after updates means you accept the revised Terms.
                            </p>

                            <h3>18. Contact</h3>
                            <p>
                                For questions, contact us at <a href="mailto:PedroV@krypnova.com">PedroV@krypnova.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
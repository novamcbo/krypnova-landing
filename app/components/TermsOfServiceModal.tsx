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
                        <button
                            className="legalClose"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="legalHeader">
                            <ShieldCheck size={34} />
                            <div>
                                <h2>Terms of Service</h2>
                                <p>Last updated: July 2026</p>
                            </div>
                        </div>

                        <div className="legalContent">
                            <p>
                                These Terms of Service govern your access to and use of Krypnova,
                                including the website, waitlist, dashboard, AI Copilot, market
                                intelligence, portfolio analytics, exchange integrations,
                                automation tools, signal tools, subscription features, beta
                                features, and related services. Please read these Terms carefully
                                before using Krypnova.
                            </p>

                            <h3>1. Acceptance of Terms</h3>
                            <p>
                                By accessing or using Krypnova, creating an account, joining the
                                waitlist, submitting information, connecting an exchange account,
                                enabling automation, purchasing a subscription, or using any
                                Krypnova feature, you agree to these Terms. If you do not agree
                                to these Terms, do not use Krypnova.
                            </p>

                            <h3>2. Krypnova Is Software, Not a Broker or Advisor</h3>
                            <p>
                                Krypnova provides software, analytics, automation tools,
                                AI-generated insights, market intelligence, portfolio tools,
                                educational content, and decision-support features. Krypnova is
                                not a broker-dealer, futures commission merchant, forex dealer,
                                commodity trading advisor, investment adviser, financial adviser,
                                tax adviser, legal adviser, bank, custodian, wallet provider, or
                                exchange.
                            </p>
                            <p>
                                Krypnova does not custody your assets, hold customer funds,
                                execute trades as a broker, make investment decisions for you, or
                                provide personalized investment advice.
                            </p>

                            <h3>3. No Financial, Investment, Legal, or Tax Advice</h3>
                            <p>
                                Information, signals, forecasts, AI outputs, expected ROI,
                                confidence scores, strategies, alerts, dashboards, risk metrics,
                                model outputs, examples, and educational content are provided for
                                informational and educational purposes only. They do not
                                constitute financial, investment, legal, tax, accounting, or
                                trading advice.
                            </p>
                            <p>
                                You are solely responsible for all investment, trading, tax,
                                legal, and financial decisions. You should consult qualified
                                professionals before making decisions based on your personal
                                circumstances.
                            </p>

                            <h3>4. No Guarantee of Profits or Performance</h3>
                            <p>
                                Krypnova does not guarantee profits, returns, performance,
                                accuracy, signal success, risk reduction, loss prevention, model
                                reliability, execution quality, or any financial outcome. Trading
                                and investing involve substantial risk, and you may lose some or
                                all of your capital.
                            </p>

                            <h3>5. Market Risk</h3>
                            <p>
                                Crypto, stocks, ETFs, forex, futures, options, commodities,
                                margin products, leveraged products, and derivatives can be
                                volatile and risky. Futures, options, leveraged trading, margin
                                trading, and forex may involve substantial risk of loss and may
                                not be suitable for all users.
                            </p>
                            <p>
                                Market conditions can change rapidly. Liquidity, spreads,
                                slippage, exchange outages, rejected orders, latency, volatility,
                                data errors, and API failures may affect execution and results.
                            </p>

                            <h3>6. AI and Algorithmic Risk</h3>
                            <p>
                                Krypnova may use artificial intelligence, predictive analytics,
                                machine learning, algorithms, automated workflows, statistical
                                models, backtests, simulations, and ranking systems. AI outputs
                                may be inaccurate, incomplete, delayed, biased, misleading, or
                                unsuitable for your situation.
                            </p>
                            <p>
                                You must independently review all outputs before relying on them.
                                Krypnova does not guarantee that any AI model, strategy, signal,
                                risk score, forecast, or automation will be correct or profitable.
                            </p>

                            <h3>7. Autopilot and Automated Execution</h3>
                            <p>
                                If you enable Autopilot, Semi-Auto, Full Autopilot, automated
                                execution, order management, portfolio automation, API-connected
                                trading, or similar features, you authorize Krypnova to transmit,
                                modify, manage, cancel, reduce, or close orders according to your
                                selected settings, connected accounts, available balances, risk
                                controls, and platform configuration.
                            </p>
                            <p>
                                You remain solely responsible for all trades, orders, losses,
                                gains, fees, spreads, slippage, taxes, rejected orders, partial
                                fills, liquidations, margin calls, and outcomes resulting from
                                automation. You should actively monitor automated systems and use
                                kill switches, limits, account permissions, and risk controls.
                            </p>

                            <h3>8. Automated Execution Acknowledgement</h3>
                            <p>
                                Before enabling automated execution, semi-automated execution,
                                full autopilot, trade automation, or connected exchange
                                functionality, you acknowledge that:
                            </p>
                            <ul>
                                <li>
                                    Markets can move rapidly and orders may execute at prices
                                    different from expected.
                                </li>
                                <li>
                                    Automation may generate losses, fees, slippage, rejected
                                    orders, partial fills, missed opportunities, or unintended
                                    results.
                                </li>
                                <li>
                                    AI models, signals, risk controls, stop losses, take profits,
                                    trailing stops, portfolio tools, and execution logic may fail,
                                    lag, or behave unexpectedly.
                                </li>
                                <li>
                                    You are solely responsible for enabling, monitoring, pausing,
                                    disabling, overriding, or disconnecting automation.
                                </li>
                                <li>
                                    Krypnova does not guarantee that automation will prevent losses
                                    or achieve profits.
                                </li>
                            </ul>

                            <h3>9. Exchange and Third-Party Services</h3>
                            <p>
                                Krypnova may connect with third-party exchanges, brokers, data
                                providers, wallet providers, payment providers, cloud providers,
                                analytics providers, or infrastructure providers. Krypnova is not
                                responsible for third-party outages, delays, API errors, rejected
                                orders, incorrect data, account restrictions, liquidity issues,
                                custody issues, exchange failures, pricing errors, or service
                                interruptions.
                            </p>
                            <p>
                                Your use of third-party services is governed by their own terms,
                                policies, fees, restrictions, and risk disclosures.
                            </p>

                            <h3>10. API Credentials and Account Security</h3>
                            <p>
                                You are responsible for safeguarding API keys, passwords, 2FA
                                devices, exchange accounts, broker accounts, permissions, and
                                connected credentials. You should use least-privilege API
                                permissions and disable withdrawals where supported.
                            </p>
                            <p>
                                Krypnova is not responsible for losses caused by compromised
                                credentials, unsafe account settings, user negligence, malware,
                                phishing, third-party breaches, device compromise, or
                                unauthorized access not caused by Krypnova.
                            </p>

                            <h3>11. User Eligibility</h3>
                            <p>
                                You may use Krypnova only if you are legally permitted to do so in
                                your jurisdiction and meet all age, residency, regulatory,
                                exchange, broker, and account requirements. You are responsible
                                for compliance with local laws, regulations, tax obligations,
                                exchange rules, and broker requirements.
                            </p>
                            <p>
                                You may not use Krypnova if you are located in a jurisdiction
                                where such use is prohibited or if you are subject to sanctions,
                                restrictions, or laws that prohibit your use of the platform.
                            </p>

                            <h3>12. User Responsibilities</h3>
                            <ul>
                                <li>
                                    You must evaluate your own risk tolerance and financial
                                    situation.
                                </li>
                                <li>
                                    You must verify all orders before approving or enabling
                                    automation.
                                </li>
                                <li>
                                    You must maintain sufficient funds, margin, and account
                                    permissions.
                                </li>
                                <li>
                                    You must monitor open positions and connected accounts.
                                </li>
                                <li>
                                    You must comply with tax, reporting, trading, and regulatory
                                    obligations.
                                </li>
                                <li>
                                    You must not rely on Krypnova as your sole source of market,
                                    financial, or risk information.
                                </li>
                            </ul>

                            <h3>13. Beta, Testing, and Early Access</h3>
                            <p>
                                Krypnova may be offered as a beta, preview, waitlist,
                                early-access, demo, paper-trading, or experimental product. Beta
                                and early-access features may be incomplete, unstable,
                                inaccurate, unavailable, or changed at any time.
                            </p>
                            <p>
                                You understand that beta features may contain bugs, data errors,
                                model errors, dashboard errors, latency, missing data, incorrect
                                calculations, execution errors, or inaccurate outputs. You should
                                not rely on beta features as your sole basis for any financial,
                                trading, investment, tax, legal, or business decision.
                            </p>

                            <h3>14. Paper Trading, Simulations, and Backtests</h3>
                            <p>
                                Paper trading, demo results, backtests, simulations, expected
                                ROI, confidence scores, screenshots, hypothetical performance,
                                and model examples are illustrative only. They may not reflect
                                actual market conditions, fees, liquidity, spreads, slippage,
                                latency, taxes, execution quality, or real-world results.
                            </p>
                            <p>
                                Past performance, simulated performance, or backtested
                                performance does not guarantee future results.
                            </p>

                            <h3>15. Platform Availability</h3>
                            <p>
                                Krypnova may experience downtime, errors, latency, bugs,
                                maintenance, cyberattacks, data-feed interruptions, model
                                failures, API outages, exchange outages, infrastructure outages,
                                or other service disruptions. We do not guarantee uninterrupted,
                                accurate, secure, timely, or error-free operation.
                            </p>

                            <h3>16. Subscriptions, Trials, Fees, and Cancellation</h3>
                            <p>
                                Krypnova may offer free trials, paid subscriptions, usage-based
                                credits, AI credits, premium features, or other paid services.
                                Prices, billing periods, trial terms, credit limits, renewal
                                terms, and feature access may be displayed at checkout or inside
                                your account.
                            </p>
                            <p>
                                Unless otherwise stated at checkout, subscriptions may renew
                                automatically until canceled. You are responsible for reviewing
                                all pricing, renewal, trial, and cancellation terms before
                                purchasing. You may cancel according to the cancellation method
                                provided by Krypnova or the applicable payment provider.
                            </p>
                            <p>
                                Fees are non-refundable except where required by law or expressly
                                stated by Krypnova. Krypnova may change pricing, plans, included
                                features, usage limits, and billing terms with notice where
                                required by law.
                            </p>

                            <h3>17. Taxes</h3>
                            <p>
                                You are solely responsible for determining, reporting, and paying
                                any taxes, duties, or governmental charges related to your use of
                                Krypnova, your subscriptions, your trading activity, your
                                investments, or your connected accounts.
                            </p>

                            <h3>18. Prohibited Uses</h3>
                            <p>
                                You may not use Krypnova for unlawful trading, market
                                manipulation, fraud, unauthorized account access, credential
                                theft, sanctions evasion, money laundering, abusive scraping,
                                reverse engineering, attacks on infrastructure, interference with
                                platform security, or any activity that violates law, exchange
                                rules, broker rules, or third-party rights.
                            </p>

                            <h3>19. Intellectual Property</h3>
                            <p>
                                Krypnova, including its website, dashboard, software, source
                                code, models, algorithms, AI workflows, designs, branding,
                                logos, names, databases, documentation, trade secrets, and
                                related materials, is owned by Krypnova or its licensors and is
                                protected by intellectual property laws.
                            </p>
                            <p>
                                You may not copy, reproduce, modify, distribute, sell, lease,
                                reverse engineer, decompile, scrape, or create derivative works
                                from Krypnova except as expressly permitted in writing.
                            </p>

                            <h3>20. User Content and Feedback</h3>
                            <p>
                                If you submit feedback, suggestions, ideas, bug reports,
                                comments, or other content to Krypnova, you grant Krypnova a
                                non-exclusive, worldwide, royalty-free license to use, reproduce,
                                modify, and incorporate that feedback for improving or developing
                                Krypnova without compensation to you.
                            </p>

                            <h3>21. Privacy</h3>
                            <p>
                                Krypnova may collect and process information as described in its
                                Privacy Policy. By using Krypnova, you acknowledge that your
                                information may be processed in accordance with that policy.
                            </p>

                            <h3>22. Disclaimer of Warranties</h3>
                            <p>
                                Krypnova is provided on an “as is” and “as available” basis. To
                                the maximum extent permitted by law, Krypnova disclaims all
                                warranties, express or implied, including warranties of
                                merchantability, fitness for a particular purpose,
                                non-infringement, accuracy, availability, security, reliability,
                                and uninterrupted operation.
                            </p>

                            <h3>23. Limitation of Liability</h3>
                            <p>
                                To the maximum extent permitted by law, Krypnova and its owners,
                                officers, employees, contractors, affiliates, licensors,
                                suppliers, and partners are not liable for trading losses, lost
                                profits, missed opportunities, loss of data, exchange outages,
                                API failures, order errors, slippage, liquidation, margin calls,
                                tax liabilities, business interruption, unauthorized access,
                                indirect damages, incidental damages, consequential damages,
                                special damages, exemplary damages, or punitive damages.
                            </p>
                            <p>
                                To the maximum extent permitted by law, Krypnova’s total
                                liability for any claim arising out of or relating to the platform
                                will not exceed the greater of: (a) the amount you paid to
                                Krypnova during the three months before the event giving rise to
                                the claim; or (b) one hundred U.S. dollars.
                            </p>

                            <h3>24. Indemnification</h3>
                            <p>
                                You agree to defend, indemnify, and hold harmless Krypnova and
                                its owners, officers, employees, contractors, affiliates,
                                licensors, suppliers, and partners from claims, losses, damages,
                                liabilities, costs, and expenses, including reasonable attorneys’
                                fees, arising from your use of the platform, your trading
                                activity, your connected accounts, your API credentials, your
                                violation of these Terms, your violation of law, or your
                                violation of third-party rights.
                            </p>

                            <h3>25. Informal Dispute Resolution First</h3>
                            <p>
                                Before filing arbitration or bringing any claim, you agree to
                                first contact Krypnova at{" "}
                                <a href="mailto:PedroV@krypnova.com">PedroV@krypnova.com</a>{" "}
                                and describe your claim, the relief requested, and your contact
                                information. You and Krypnova agree to try to resolve the dispute
                                informally for at least 30 days before either party starts
                                arbitration, except for claims seeking emergency injunctive
                                relief.
                            </p>

                            <h3>26. Dispute Resolution; Binding Arbitration</h3>
                            <p>
                                Please read this section carefully. It requires you and Krypnova
                                to resolve most disputes through binding individual arbitration
                                instead of in court, except as stated below.
                            </p>
                            <p>
                                You and Krypnova agree that any dispute, claim, or controversy
                                arising out of or relating to these Terms, Krypnova, the website,
                                dashboard, AI Copilot, market intelligence, automation tools,
                                subscriptions, billing, connected accounts, APIs, data, signals,
                                models, or any related services will be resolved by final and
                                binding arbitration on an individual basis.
                            </p>
                            <p>
                                The arbitration will be administered by the American Arbitration
                                Association under its Consumer Arbitration Rules, unless another
                                arbitration provider is mutually agreed upon by the parties. If
                                AAA is unavailable or refuses to administer the arbitration, the
                                parties will work in good faith to select another neutral
                                arbitration provider.
                            </p>
                            <p>
                                The arbitrator will have exclusive authority to resolve disputes
                                regarding the interpretation, applicability, enforceability,
                                formation, or scope of this arbitration agreement, except that
                                only a court may decide disputes about the class action waiver
                                below.
                            </p>

                            <h3>27. Class Action Waiver</h3>
                            <p>
                                You and Krypnova agree that each party may bring claims against
                                the other only in an individual capacity and not as a plaintiff,
                                class member, representative, or private attorney general in any
                                class action, collective action, consolidated action,
                                representative action, or mass action.
                            </p>
                            <p>
                                The arbitrator may not consolidate more than one person’s claims
                                and may not preside over any class, collective, consolidated,
                                representative, or mass proceeding unless both you and Krypnova
                                agree in writing.
                            </p>

                            <h3>28. Small Claims Court</h3>
                            <p>
                                Either party may bring an individual claim in small claims court
                                if the claim qualifies and remains in small claims court. This
                                section does not prevent either party from seeking relief in
                                small claims court where permitted.
                            </p>

                            <h3>29. Injunctive Relief and Intellectual Property</h3>
                            <p>
                                Nothing in these Terms prevents Krypnova from seeking injunctive
                                or equitable relief in court to protect its intellectual
                                property, confidential information, trade secrets, platform
                                security, systems, users, brand, domain names, source code,
                                models, data, APIs, or infrastructure.
                            </p>

                            <h3>30. Governing Law</h3>
                            <p>
                                These Terms and any dispute will be governed by the laws of the
                                State of Texas, without regard to conflict-of-law principles,
                                except that the Federal Arbitration Act governs the
                                interpretation and enforcement of the arbitration agreement.
                            </p>

                            <h3>31. Venue for Court Proceedings</h3>
                            <p>
                                For any dispute that is not subject to arbitration or cannot be
                                heard in small claims court, you and Krypnova consent to the
                                exclusive jurisdiction and venue of the state and federal courts
                                located in Harris County, Texas, unless another venue is required
                                by applicable law.
                            </p>

                            <h3>32. Severability</h3>
                            <p>
                                If any part of these Terms is found invalid or unenforceable, the
                                remaining provisions will remain in full force and effect. If the
                                class action waiver is found invalid or unenforceable as to a
                                particular claim, then that claim must proceed in court and not
                                in arbitration, but the remaining claims will remain subject to
                                arbitration where permitted by law.
                            </p>

                            <h3>33. Changes to Terms</h3>
                            <p>
                                Krypnova may update these Terms from time to time. Continued use
                                of the platform after updates means you accept the revised Terms.
                                If required by law, Krypnova will provide additional notice of
                                material changes.
                            </p>

                            <h3>34. Contact</h3>
                            <p>
                                For questions, contact us at{" "}
                                <a href="mailto:PedroV@krypnova.com">PedroV@krypnova.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
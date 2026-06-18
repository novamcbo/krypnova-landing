"use client";

import { useState } from "react";
import { X, Lock } from "lucide-react";

export default function PrivacyPolicyModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" className="legalLink" onClick={() => setOpen(true)}>
                Privacy Policy
            </button>

            {open && (
                <div className="legalOverlay" role="dialog" aria-modal="true">
                    <div className="legalModal">
                        <button className="legalClose" onClick={() => setOpen(false)} aria-label="Close">
                            <X size={20} />
                        </button>

                        <div className="legalHeader">
                            <Lock size={32} />
                            <div>
                                <h2>Privacy Policy</h2>
                                <p>Last updated: June 2026</p>
                            </div>
                        </div>

                        <div className="legalContent">
                            <p>
                                Krypnova respects your privacy. This Privacy Policy explains how we collect, use,
                                store, protect, and disclose information when you use our website, waitlist,
                                dashboard, AI tools, market intelligence features, portfolio analytics, exchange
                                integrations, and related services.
                            </p>

                            <h3>1. Information We Collect</h3>
                            <p>We may collect the following categories of information:</p>
                            <ul>
                                <li>Account information such as name, email address, login credentials, and preferences.</li>
                                <li>Waitlist and contact information submitted through forms.</li>
                                <li>Usage data, device data, browser data, pages viewed, and interaction history.</li>
                                <li>Portfolio, trading, balance, position, order, execution, and market data you connect or provide.</li>
                                <li>Exchange API credentials or tokens if you choose to connect third-party accounts.</li>
                                <li>AI Copilot prompts, messages, feedback, and configuration settings.</li>
                                <li>Risk settings, autopilot settings, goal settings, and trading preferences.</li>
                            </ul>

                            <h3>2. How We Use Information</h3>
                            <p>We use information to:</p>
                            <ul>
                                <li>Provide Krypnova services, dashboards, market intelligence, and AI Copilot features.</li>
                                <li>Analyze portfolio exposure, risk, performance, and market conditions.</li>
                                <li>Connect to supported exchanges and third-party services when authorized by you.</li>
                                <li>Improve platform reliability, security, fraud prevention, and user experience.</li>
                                <li>Send platform updates, waitlist communications, alerts, and service notices.</li>
                                <li>Comply with legal, regulatory, tax, security, and operational obligations.</li>
                            </ul>

                            <h3>3. API Keys and Exchange Credentials</h3>
                            <p>
                                If you connect exchange accounts, Krypnova may process API keys, tokens, or other
                                credentials. We aim to store sensitive credentials using encryption and security
                                controls. You are responsible for configuring permissions safely, limiting API
                                access where possible, disabling withdrawal permissions when supported, and revoking
                                credentials if you suspect unauthorized access.
                            </p>

                            <h3>4. Trading and Financial Data</h3>
                            <p>
                                Krypnova may process balances, positions, orders, fills, portfolio values, PnL,
                                transaction history, watchlists, signals, and risk metrics. This data is used to
                                provide analytics, automation, reporting, and decision-support features.
                            </p>

                            <h3>5. AI Data</h3>
                            <p>
                                Krypnova may process user prompts, Copilot conversations, system outputs, signal
                                explanations, and feedback to operate and improve AI-powered features. AI outputs
                                may be inaccurate, incomplete, delayed, or unsuitable for your circumstances.
                            </p>

                            <h3>6. Cookies and Analytics</h3>
                            <p>
                                We may use cookies, local storage, analytics, and similar technologies for security,
                                session management, performance, product improvement, and usage measurement.
                            </p>

                            <h3>7. Sharing of Information</h3>
                            <p>
                                Krypnova does not sell your personal information. We may share information with
                                service providers, hosting providers, analytics providers, security vendors,
                                exchange integrations, payment processors, professional advisors, or authorities
                                when required by law or necessary to operate the service.
                            </p>

                            <h3>8. Data Security</h3>
                            <p>
                                We use reasonable administrative, technical, and organizational safeguards designed
                                to protect information. However, no system is completely secure. Krypnova cannot
                                guarantee that unauthorized access, cyberattacks, data loss, exchange failures, or
                                third-party incidents will never occur.
                            </p>

                            <h3>9. Data Retention</h3>
                            <p>
                                We retain information for as long as needed to provide services, comply with legal
                                obligations, resolve disputes, improve security, and maintain business records. You
                                may request deletion of certain information, subject to legal, operational, and
                                security limitations.
                            </p>

                            <h3>10. Your Choices</h3>
                            <p>
                                You may unsubscribe from marketing emails, request access or deletion, disconnect
                                integrations, revoke API keys directly through your exchange, or contact us about
                                privacy requests.
                            </p>

                            <h3>11. Children</h3>
                            <p>
                                Krypnova is not intended for children or minors. Users must meet the age of majority
                                and legal eligibility requirements in their jurisdiction.
                            </p>

                            <h3>12. Contact</h3>
                            <p>
                                For privacy questions, contact us at <a href="mailto:PedroV@krypnova.com">PedroV@krypnova.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
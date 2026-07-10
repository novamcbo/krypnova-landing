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
                        <button
                            className="legalClose"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="legalHeader">
                            <Lock size={32} />
                            <div>
                                <h2>Privacy Policy</h2>
                                <p>Last updated: July 2026</p>
                            </div>
                        </div>

                        <div className="legalContent">
                            <p>
                                Krypnova respects your privacy. This Privacy Policy explains how
                                we collect, use, store, protect, disclose, and process
                                information when you use our website, waitlist, dashboard, AI
                                tools, market intelligence features, portfolio analytics,
                                exchange integrations, automation tools, subscription features,
                                beta features, and related services.
                            </p>

                            <p>
                                By using Krypnova, submitting information, joining the waitlist,
                                creating an account, connecting third-party accounts, enabling
                                automation, or using our services, you acknowledge this Privacy
                                Policy.
                            </p>

                            <h3>1. Information We Collect</h3>
                            <p>We may collect the following categories of information:</p>
                            <ul>
                                <li>
                                    <strong>Account information:</strong> name, email address,
                                    login credentials, preferences, account settings, and user
                                    profile details.
                                </li>
                                <li>
                                    <strong>Waitlist and contact information:</strong> first name,
                                    last name, email, phone number, company, job title, country,
                                    trading experience, selected markets, trading styles,
                                    portfolio size, main goals, and form submissions.
                                </li>
                                <li>
                                    <strong>Usage and device data:</strong> IP address, browser
                                    type, device type, operating system, pages viewed, clicks,
                                    session information, referral source, timestamps, and
                                    interaction history.
                                </li>
                                <li>
                                    <strong>Trading and portfolio data:</strong> balances,
                                    positions, orders, fills, executions, order history, PnL,
                                    portfolio value, watchlists, risk settings, alerts, trading
                                    preferences, and connected account data.
                                </li>
                                <li>
                                    <strong>Exchange and broker integration data:</strong> API
                                    keys, API tokens, permissions, exchange identifiers, broker
                                    identifiers, account metadata, and connection status when you
                                    choose to connect third-party accounts.
                                </li>
                                <li>
                                    <strong>AI and Copilot data:</strong> prompts, questions,
                                    messages, AI outputs, feedback, generated explanations, model
                                    configuration settings, signal explanations, and automation
                                    preferences.
                                </li>
                                <li>
                                    <strong>Payment and subscription data:</strong> plan type,
                                    subscription status, billing events, payment provider
                                    identifiers, invoices, usage credits, AI credits, transaction
                                    references, and payment-related metadata. We do not directly
                                    store full card numbers unless expressly stated and handled by
                                    an authorized payment provider.
                                </li>
                                <li>
                                    <strong>Security and compliance data:</strong> logs, audit
                                    records, fraud prevention data, abuse detection signals,
                                    consent records, communication records, and support requests.
                                </li>
                            </ul>

                            <h3>2. How We Use Information</h3>
                            <p>We use information to:</p>
                            <ul>
                                <li>
                                    Provide, operate, maintain, and improve Krypnova services,
                                    dashboards, market intelligence, AI Copilot, and automation
                                    features.
                                </li>
                                <li>
                                    Process waitlist registrations, account requests, early-access
                                    requests, beta participation, and user communications.
                                </li>
                                <li>
                                    Analyze portfolio exposure, risk, performance, market
                                    conditions, signals, model outputs, and trading activity.
                                </li>
                                <li>
                                    Connect to supported exchanges, brokers, data providers, and
                                    third-party services when authorized by you.
                                </li>
                                <li>
                                    Provide alerts, notifications, reports, educational content,
                                    market summaries, product updates, and service messages.
                                </li>
                                <li>
                                    Personalize product experiences, risk settings, dashboards,
                                    AI responses, and workflow configuration.
                                </li>
                                <li>
                                    Improve platform reliability, debugging, uptime, security,
                                    fraud prevention, abuse prevention, and user experience.
                                </li>
                                <li>
                                    Process subscriptions, payments, usage limits, trials,
                                    credits, and billing-related operations.
                                </li>
                                <li>
                                    Comply with legal, regulatory, tax, security, fraud
                                    prevention, contractual, and operational obligations.
                                </li>
                            </ul>

                            <h3>3. API Keys and Exchange Credentials</h3>
                            <p>
                                If you connect exchange or broker accounts, Krypnova may process
                                API keys, API tokens, account identifiers, permissions, and other
                                credentials required to provide connected-account functionality.
                                We aim to store sensitive credentials using encryption and
                                access controls.
                            </p>
                            <p>
                                You are responsible for configuring permissions safely, limiting
                                API access where possible, disabling withdrawal permissions when
                                supported, using least-privilege access, rotating credentials
                                when appropriate, and revoking credentials if you suspect
                                unauthorized access.
                            </p>
                            <p>
                                Krypnova does not need withdrawal permissions for standard
                                analytics or trading-intelligence features. You should not grant
                                withdrawal permissions unless a feature expressly requires them
                                and you understand the risk.
                            </p>

                            <h3>4. Trading, Financial, and Portfolio Data</h3>
                            <p>
                                Krypnova may process balances, positions, orders, fills,
                                executions, portfolio values, PnL, transaction history,
                                watchlists, symbols, signals, strategy metadata, risk metrics,
                                automation settings, and connected-account information. This
                                data is used to provide analytics, reporting, automation,
                                decision-support features, and product improvements.
                            </p>
                            <p>
                                Krypnova is not a broker, exchange, custodian, bank, investment
                                adviser, tax adviser, or financial adviser. Trading and portfolio
                                data is processed to provide software functionality and does not
                                constitute financial advice.
                            </p>

                            <h3>5. AI Data</h3>
                            <p>
                                Krypnova may process user prompts, Copilot conversations, AI
                                outputs, signal explanations, user feedback, model settings,
                                strategy configuration, and related metadata to operate,
                                maintain, secure, and improve AI-powered features.
                            </p>
                            <p>
                                AI outputs may be inaccurate, incomplete, delayed, misleading, or
                                unsuitable for your circumstances. You should not submit
                                sensitive personal information, passwords, seed phrases,
                                withdrawal keys, private wallet keys, or confidential third-party
                                information into AI prompts.
                            </p>

                            <h3>6. Cookies, Analytics, and Tracking Technologies</h3>
                            <p>
                                We may use cookies, local storage, pixels, server logs, analytics
                                tools, and similar technologies for security, session management,
                                product analytics, performance measurement, debugging,
                                attribution, fraud prevention, and user experience improvement.
                            </p>
                            <p>
                                These technologies may collect information such as device type,
                                browser type, IP address, pages viewed, referrers, approximate
                                location, session duration, and interaction events.
                            </p>

                            <h3>7. Service Providers and Third Parties</h3>
                            <p>
                                We may share information with service providers and third parties
                                that help us operate Krypnova, including hosting providers,
                                database providers, analytics providers, email providers,
                                payment processors, customer support tools, security vendors,
                                cloud infrastructure providers, exchange integrations, broker
                                integrations, professional advisors, and legal or regulatory
                                authorities where required.
                            </p>
                            <p>
                                These providers are expected to process information only as
                                needed to provide services to Krypnova or comply with applicable
                                obligations.
                            </p>

                            <h3>8. No Sale of Personal Information</h3>
                            <p>
                                Krypnova does not sell your personal information. We also do not
                                sell your API keys, exchange credentials, portfolio data, trading
                                history, or Copilot conversations.
                            </p>
                            <p>
                                If our data-sharing practices change in a way that constitutes a
                                sale or sharing under applicable privacy laws, we will update
                                this Privacy Policy and provide any required notices or choices.
                            </p>

                            <h3>9. Sensitive Information</h3>
                            <p>
                                Some information processed by Krypnova may be sensitive, such as
                                exchange credentials, trading activity, financial account
                                metadata, portfolio information, IP addresses, and security logs.
                                We use this information to provide requested features, secure the
                                platform, prevent abuse, operate integrations, and comply with
                                legal or operational obligations.
                            </p>
                            <p>
                                We do not use sensitive information for purposes that are
                                unrelated to providing, securing, maintaining, or improving
                                Krypnova unless permitted by law or authorized by you.
                            </p>

                            <h3>10. Data Security</h3>
                            <p>
                                We use reasonable administrative, technical, and organizational
                                safeguards designed to protect information, including access
                                controls, encryption where appropriate, logging, monitoring, and
                                security practices designed to reduce unauthorized access.
                            </p>
                            <p>
                                However, no system is completely secure. Krypnova cannot
                                guarantee that unauthorized access, cyberattacks, data loss,
                                credential compromise, exchange failures, third-party incidents,
                                or security breaches will never occur.
                            </p>

                            <h3>11. Data Retention</h3>
                            <p>
                                We retain information for as long as needed to provide services,
                                maintain accounts, operate integrations, comply with legal
                                obligations, resolve disputes, enforce agreements, prevent fraud,
                                improve security, maintain business records, and support product
                                development.
                            </p>
                            <p>
                                You may request deletion of certain information, subject to
                                legal, operational, security, billing, fraud-prevention,
                                regulatory, backup, and legitimate business limitations.
                            </p>

                            <h3>12. Your Choices</h3>
                            <p>
                                Depending on your location and applicable law, you may have the
                                right to request access, correction, deletion, portability,
                                restriction, objection, or information about how your personal
                                information is processed.
                            </p>
                            <p>You may also:</p>
                            <ul>
                                <li>Unsubscribe from marketing emails.</li>
                                <li>Disconnect exchange or broker integrations.</li>
                                <li>Revoke API keys directly through your exchange or broker.</li>
                                <li>Request deletion of certain account information.</li>
                                <li>Adjust browser cookie settings where available.</li>
                                <li>Contact us about privacy requests.</li>
                            </ul>

                            <h3>13. California Privacy Rights</h3>
                            <p>
                                If you are a California resident, you may have rights under
                                California privacy laws, including the right to know what
                                personal information we collect, use, disclose, or share; the
                                right to request deletion; the right to correct inaccurate
                                personal information; the right to limit certain uses of
                                sensitive personal information; and the right not to be
                                discriminated against for exercising privacy rights.
                            </p>
                            <p>
                                Krypnova does not sell personal information. To submit a
                                California privacy request, contact us using the email address
                                listed below.
                            </p>

                            <h3>14. European Economic Area, United Kingdom, and Similar Rights</h3>
                            <p>
                                If you are located in the European Economic Area, United Kingdom,
                                or another jurisdiction with similar privacy rights, you may have
                                rights to access, correct, delete, restrict, object to, or
                                request portability of your personal data, subject to applicable
                                limitations.
                            </p>
                            <p>
                                Where required, we process personal data based on legal bases
                                such as performance of a contract, legitimate interests, consent,
                                compliance with legal obligations, and protection of the platform
                                and users.
                            </p>

                            <h3>15. International Data Transfers</h3>
                            <p>
                                Krypnova may process and store information in the United States
                                and other countries where we or our service providers operate.
                                These countries may have data protection laws different from
                                those in your jurisdiction.
                            </p>
                            <p>
                                Where required, we use appropriate safeguards for international
                                transfers of personal information.
                            </p>

                            <h3>16. Payment Information</h3>
                            <p>
                                If Krypnova offers paid services, subscriptions, AI credits, or
                                usage-based features, payment information may be processed by
                                third-party payment providers. Krypnova may receive payment
                                status, subscription status, transaction identifiers, invoice
                                metadata, and billing-related information.
                            </p>
                            <p>
                                Payment providers process payment information according to their
                                own privacy policies and security practices.
                            </p>

                            <h3>17. Communications</h3>
                            <p>
                                We may send you service messages, waitlist updates, onboarding
                                emails, security notices, product updates, billing notices, and
                                marketing communications. You may unsubscribe from marketing
                                emails where available, but we may still send transactional,
                                legal, billing, or security-related messages.
                            </p>

                            <h3>18. Data Accuracy</h3>
                            <p>
                                You are responsible for providing accurate and current
                                information. Krypnova is not responsible for service issues,
                                failed communications, incorrect analytics, or account problems
                                caused by inaccurate, outdated, or incomplete information
                                provided by you or third parties.
                            </p>

                            <h3>19. Children and Minors</h3>
                            <p>
                                Krypnova is not intended for children or minors. Users must meet
                                the age of majority and legal eligibility requirements in their
                                jurisdiction. We do not knowingly collect personal information
                                from children under 13. If you believe a child has provided
                                personal information to Krypnova, please contact us so we can
                                review and take appropriate action.
                            </p>

                            <h3>20. Business Transfers</h3>
                            <p>
                                If Krypnova is involved in a merger, acquisition, financing,
                                reorganization, bankruptcy, sale of assets, corporate
                                transaction, or transfer of business operations, information may
                                be disclosed or transferred as part of that transaction, subject
                                to applicable law.
                            </p>

                            <h3>21. Legal Compliance and Safety</h3>
                            <p>
                                We may access, preserve, use, or disclose information if we
                                believe it is reasonably necessary to comply with law, regulation,
                                legal process, governmental request, tax obligations, security
                                obligations, fraud prevention, enforcement of our Terms, or
                                protection of Krypnova, users, third parties, or the public.
                            </p>

                            <h3>22. Changes to This Privacy Policy</h3>
                            <p>
                                Krypnova may update this Privacy Policy from time to time. If we
                                make material changes, we may provide notice through the website,
                                dashboard, email, or other reasonable means. Continued use of
                                Krypnova after updates means you acknowledge the revised Privacy
                                Policy.
                            </p>

                            <h3>23. Contact</h3>
                            <p>
                                For privacy questions, data requests, deletion requests, or
                                security concerns, contact us at{" "}
                                <a href="mailto:PedroV@krypnova.com">PedroV@krypnova.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
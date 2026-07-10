"use client";

import { useState } from "react";

export default function RiskDisclosureModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" className="footerLink" onClick={() => setOpen(true)}>
                Risk Disclosure
            </button>

            {open && (
                <div className="modalOverlay" onClick={() => setOpen(false)}>
                    <div className="modalContent" onClick={(event) => event.stopPropagation()}>
                        <button
                            className="modalClose"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h2>Risk Disclosure</h2>

                        <p>
                            Last updated: July 2026
                        </p>

                        <p>
                            Krypnova provides software, analytics, AI-generated insights,
                            market intelligence, portfolio tools, signal tools, automation
                            features, and educational information. Krypnova is not a
                            broker-dealer, investment adviser, financial adviser, commodity
                            trading advisor, futures commission merchant, forex dealer, bank,
                            custodian, wallet provider, or exchange.
                        </p>

                        <h3>1. No Financial Advice</h3>
                        <p>
                            Nothing provided by Krypnova should be considered financial,
                            investment, trading, legal, tax, accounting, or professional
                            advice. All information, analytics, signals, forecasts, AI outputs,
                            scores, strategies, alerts, dashboards, and examples are provided
                            for informational and educational purposes only.
                        </p>

                        <p>
                            You are solely responsible for evaluating your financial situation,
                            risk tolerance, trading objectives, tax obligations, and legal
                            obligations before making any decision.
                        </p>

                        <h3>2. Trading and Investing Risk</h3>
                        <p>
                            Trading and investing involve substantial risk. You may lose some
                            or all of your capital. Crypto assets, stocks, ETFs, options,
                            futures, forex, commodities, margin products, leveraged products,
                            and derivatives can be highly volatile and may not be suitable for
                            all users.
                        </p>

                        <p>
                            Market prices can move rapidly and unpredictably. Liquidity,
                            spreads, volatility, slippage, fees, rejected orders, partial fills,
                            exchange outages, data delays, and API failures may materially
                            affect results.
                        </p>

                        <h3>3. Crypto Asset Risk</h3>
                        <p>
                            Crypto assets involve unique risks, including extreme volatility,
                            liquidity shortages, exchange failures, network disruptions, smart
                            contract vulnerabilities, regulatory uncertainty, stablecoin
                            depegging, custody risk, wallet risk, hacking, forks, and loss of
                            access to accounts or credentials.
                        </p>

                        <h3>4. Options, Futures, Forex, Margin, and Leverage Risk</h3>
                        <p>
                            Options, futures, forex, leveraged products, short selling, and
                            margin trading involve elevated risk and may result in losses
                            greater than your initial investment. Margin calls, liquidations,
                            financing costs, funding fees, borrow fees, and forced position
                            closures may occur.
                        </p>

                        <h3>5. AI and Model Risk</h3>
                        <p>
                            Krypnova may use artificial intelligence, machine learning,
                            algorithms, statistical models, forecasts, simulations, ranking
                            systems, and automated workflows. AI outputs may be inaccurate,
                            incomplete, delayed, biased, misleading, or unsuitable for your
                            circumstances.
                        </p>

                        <p>
                            Confidence scores, expected ROI, risk scores, forecasts, signals,
                            backtests, and model outputs are estimates only. They do not
                            guarantee future performance or successful trading outcomes.
                        </p>

                        <h3>6. Automation and Autopilot Risk</h3>
                        <p>
                            If you enable automated execution, semi-automated execution,
                            Autopilot, Full Autopilot, order management, or connected exchange
                            functionality, orders may be created, modified, canceled, reduced,
                            or closed based on your settings and system logic.
                        </p>

                        <p>
                            Automation may produce losses, missed opportunities, unintended
                            trades, duplicate orders, rejected orders, partial fills, slippage,
                            fees, liquidation, or other unexpected outcomes. You are solely
                            responsible for monitoring automation, using risk controls, and
                            disabling automation when appropriate.
                        </p>

                        <h3>7. Exchange, Broker, API, and Third-Party Risk</h3>
                        <p>
                            Krypnova may connect to third-party exchanges, brokers, data
                            providers, payment providers, cloud providers, and infrastructure
                            providers. Krypnova is not responsible for third-party outages,
                            API errors, incorrect data, delayed data, order rejections,
                            exchange restrictions, liquidity issues, account freezes, custody
                            failures, or service interruptions.
                        </p>

                        <p>
                            You are responsible for configuring API permissions safely,
                            disabling withdrawal permissions where supported, protecting your
                            credentials, monitoring connected accounts, and revoking access if
                            needed.
                        </p>

                        <h3>8. Fees, Slippage, and Execution Costs</h3>
                        <p>
                            Trading results may be affected by fees, commissions, spreads,
                            slippage, funding rates, borrow costs, financing charges, network
                            fees, exchange fees, and taxes. A trade that appears profitable
                            before costs may be unprofitable after costs.
                        </p>

                        <p>
                            Krypnova may estimate costs, but actual costs may differ depending
                            on the exchange, broker, asset, liquidity, order type, timing, and
                            market conditions.
                        </p>

                        <h3>9. Paper Trading, Backtests, and Simulations</h3>
                        <p>
                            Paper trading, demo results, simulations, backtests, screenshots,
                            hypothetical examples, expected ROI, model scores, and historical
                            performance are illustrative only. They may not reflect real market
                            conditions, real liquidity, real fees, slippage, latency, taxes,
                            rejected orders, or emotional decision-making.
                        </p>

                        <p>
                            Past performance, simulated performance, and backtested performance
                            do not guarantee future results.
                        </p>

                        <h3>10. Data and System Risk</h3>
                        <p>
                            Krypnova may experience bugs, latency, missing data, incorrect
                            calculations, model failures, dashboard errors, stale prices,
                            orderbook errors, database errors, outages, cyberattacks, or
                            infrastructure failures. We do not guarantee uninterrupted,
                            accurate, timely, secure, or error-free operation.
                        </p>

                        <h3>11. User Responsibility</h3>
                        <p>
                            You are solely responsible for all trades, orders, approvals,
                            automation settings, API connections, account permissions, tax
                            reporting, compliance obligations, investment decisions, and
                            financial outcomes. You should independently verify all information
                            before acting on it.
                        </p>

                        <h3>12. No Guarantee</h3>
                        <p>
                            Krypnova does not guarantee profits, returns, performance,
                            accuracy, risk reduction, loss prevention, signal success, model
                            reliability, execution quality, or any financial outcome.
                        </p>

                        <p>
                            By using Krypnova, you acknowledge and accept these risks.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
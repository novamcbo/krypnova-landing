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
                        <button className="modalClose" onClick={() => setOpen(false)}>
                            ×
                        </button>

                        <h2>Risk Disclosure</h2>

                        <p>
                            Krypnova is not a financial advisor, broker-dealer, investment firm, or registered investment adviser.
                            All information, analytics, signals, AI-generated insights, and platform features are provided for
                            informational and educational purposes only.
                        </p>

                        <p>
                            Nothing on this platform should be considered financial, investment, trading, tax, or legal advice.
                            Trading cryptocurrencies, stocks, options, forex, and futures involves substantial risk, including
                            the possible loss of capital.
                        </p>

                        <p>
                            Users are solely responsible for their own trading and investment decisions. Past performance does
                            not guarantee future results.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
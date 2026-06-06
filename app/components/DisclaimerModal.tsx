"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className="disclaimerLink" onClick={() => setOpen(true)}>
        Disclaimer
      </button>

      {open && (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="disclaimer-title"
          onClick={() => setOpen(false)}
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modalClose"
              aria-label="Close disclaimer"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 id="disclaimer-title">Disclaimer</h3>
            <p>
              Krypnova is not a financial advisor, broker-dealer, investment firm, or registered investment adviser.
              All information, analytics, signals, AI-generated insights, and platform features are provided for
              informational and educational purposes only and should not be considered financial, investment,
              trading, tax, or legal advice. Trading cryptocurrencies, stocks, options, forex, and futures involves
              substantial risk, including the possible loss of capital. Users are solely responsible for their own
              trading and investment decisions. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

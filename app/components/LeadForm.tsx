"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const markets = ["Crypto", "Stocks", "Options", "Forex", "Futures", "Multi-Asset"];

const tradingStyles = [
  "Day Trading",
  "Swing Trading",
  "Position Trading",
  "Scalping",
  "Algorithmic Trading",
  "Long-Term Investing",
];

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);

    const payload = {
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      jobTitle: String(form.get("jobTitle") || ""),
      country: String(form.get("country") || ""),
      tradingExperience: String(form.get("tradingExperience") || ""),
      markets: form.getAll("markets").map(String),
      tradingStyles: form.getAll("tradingStyles").map(String),
      portfolioSize: String(form.get("portfolioSize") || ""),
      mainGoal: String(form.get("mainGoal") || ""),
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data.message || "Something went wrong.");
      return;
    }

    setStatus("success");
    setMessage(data.message || "Welcome to Krypnova.");
    event.currentTarget.reset();
  }

  return (
    <form className="leadForm" onSubmit={handleSubmit}>
      <div className="formGrid">
        <input name="firstName" placeholder="First name" required />
        <input name="lastName" placeholder="Last name" />
      </div>

      <div className="formGrid">
        <input name="email" type="email" placeholder="Business email" required />
        <input name="phone" type="tel" placeholder="Phone number" />
      </div>

      <div className="formGrid">
        <input name="company" placeholder="Company / Fund / Project" />
        <input name="jobTitle" placeholder="Job title" />
      </div>

      <input name="country" placeholder="Country" />

      <select name="tradingExperience" defaultValue="">
        <option value="" disabled>
          Trading experience
        </option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Professional Trader">Professional Trader</option>
        <option value="Fund Manager">Fund Manager</option>
        <option value="Institutional Investor">Institutional Investor</option>
      </select>

      <fieldset>
        <legend>Markets of interest</legend>
        <div className="checkboxGrid">
          {markets.map((market) => (
            <label key={market}>
              <input type="checkbox" name="markets" value={market} />
              <span>{market}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Trading style</legend>
        <div className="checkboxGrid">
          {tradingStyles.map((style) => (
            <label key={style}>
              <input type="checkbox" name="tradingStyles" value={style} />
              <span>{style}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <select name="portfolioSize" defaultValue="">
        <option value="" disabled>
          Portfolio size
        </option>
        <option value="Under $10,000">Under $10,000</option>
        <option value="$10,000 - $50,000">$10,000 - $50,000</option>
        <option value="$50,000 - $250,000">$50,000 - $250,000</option>
        <option value="$250,000 - $1M">$250,000 - $1M</option>
        <option value="$1M+">$1M+</option>
      </select>

      <select name="mainGoal" defaultValue="">
        <option value="" disabled>
          Main goal
        </option>
        <option value="Early Access">Early Access</option>
        <option value="Active Trading">Active Trading</option>
        <option value="Portfolio Management">Portfolio Management</option>
        <option value="Algorithmic Trading">Algorithmic Trading</option>
        <option value="Risk Management">Risk Management</option>
        <option value="Investment / Partnership">Investment / Partnership</option>
        <option value="Institutional Research">Institutional Research</option>
      </select>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="spin" size={18} /> Sending...
          </>
        ) : (
          <>
            Join Waitlist <ArrowRight size={18} />
          </>
        )}
      </button>

      {message && (
        <p className={`formMessage ${status}`}>
          {status === "success" && <CheckCircle2 size={18} />}
          {message}
        </p>
      )}

      <small>Lead records are securely saved in Krypnova&apos;s PostgreSQL database.</small>
    </form>
  );
}

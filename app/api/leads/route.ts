import { NextResponse } from "next/server";
import { Resend } from "resend";
import { pool } from "@/lib/db";

const resendApiKey = process.env.RESEND_API_KEY;
const leadNotificationEmail = process.env.LEAD_NOTIFICATION_EMAIL || "PedroV@krypnova.com";
const fromEmail = process.env.RESEND_FROM_EMAIL || "Krypnova <onboarding@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const allowedMarkets = new Set([
  "Crypto",
  "Stocks",
  "Options",
  "Forex",
  "Futures",
  "Multi-Asset",
]);

const allowedTradingStyles = new Set([
  "Day Trading",
  "Swing Trading",
  "Position Trading",
  "Scalping",
  "Algorithmic Trading",
  "Long-Term Investing",
]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanArray(value: unknown, allowed: Set<string>) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clean(item))
    .filter((item) => allowed.has(item));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const company = clean(body.company);
    const jobTitle = clean(body.jobTitle);
    const country = clean(body.country);
    const tradingExperience = clean(body.tradingExperience);
    const markets = cleanArray(body.markets, allowedMarkets);
    const tradingStyles = cleanArray(body.tradingStyles, allowedTradingStyles);
    const portfolioSize = clean(body.portfolioSize);
    const mainGoal = clean(body.mainGoal);

    if (!firstName || !email) {
      return NextResponse.json(
        { message: "First name and email are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent");

    const result = await pool.query(
      `
      insert into leads
        (
          first_name,
          last_name,
          email,
          phone,
          company,
          job_title,
          country,
          trading_experience,
          markets,
          trading_styles,
          portfolio_size,
          main_goal,
          source,
          ip_address,
          user_agent
        )
      values
        ($1, $2, $3, $4, $5, $6, $7, $8, $9::text[], $10::text[], $11, $12, 'krypnova_landing', $13, $14)
      on conflict (email)
      do update set
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        phone = excluded.phone,
        company = excluded.company,
        job_title = excluded.job_title,
        country = excluded.country,
        trading_experience = excluded.trading_experience,
        markets = excluded.markets,
        trading_styles = excluded.trading_styles,
        portfolio_size = excluded.portfolio_size,
        main_goal = excluded.main_goal,
        user_agent = excluded.user_agent,
        updated_at = now()
      returning id, created_at, updated_at
      `,
      [
        firstName,
        lastName || null,
        email,
        phone || null,
        company || null,
        jobTitle || null,
        country || null,
        tradingExperience || null,
        markets,
        tradingStyles,
        portfolioSize || null,
        mainGoal || null,
        ipAddress,
        userAgent,
      ]
    );

    const lead = result.rows[0];

    if (resend) {
      await resend.emails.send({
        from: fromEmail,
        to: leadNotificationEmail,
        subject: "New Krypnova Lead",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2>New Krypnova Lead</h2>
            <p>A new contact joined the Krypnova waitlist.</p>
            <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
              <tr><td><strong>Name</strong></td><td>${firstName} ${lastName}</td></tr>
              <tr><td><strong>Email</strong></td><td>${email}</td></tr>
              <tr><td><strong>Phone</strong></td><td>${phone || "N/A"}</td></tr>
              <tr><td><strong>Company</strong></td><td>${company || "N/A"}</td></tr>
              <tr><td><strong>Job Title</strong></td><td>${jobTitle || "N/A"}</td></tr>
              <tr><td><strong>Country</strong></td><td>${country || "N/A"}</td></tr>
              <tr><td><strong>Trading Experience</strong></td><td>${tradingExperience || "N/A"}</td></tr>
              <tr><td><strong>Markets</strong></td><td>${markets.length ? markets.join(", ") : "N/A"}</td></tr>
              <tr><td><strong>Trading Styles</strong></td><td>${tradingStyles.length ? tradingStyles.join(", ") : "N/A"}</td></tr>
              <tr><td><strong>Portfolio Size</strong></td><td>${portfolioSize || "N/A"}</td></tr>
              <tr><td><strong>Main Goal</strong></td><td>${mainGoal || "N/A"}</td></tr>
              <tr><td><strong>Lead ID</strong></td><td>${lead.id}</td></tr>
              <tr><td><strong>Date</strong></td><td>${lead.created_at}</td></tr>
            </table>
          </div>
        `,
      });

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Welcome to Krypnova",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2>Welcome to Krypnova</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining the Krypnova waitlist.</p>
            <p>We are building AI-powered trading intelligence for crypto and stock markets, designed to help users analyze opportunities, manage risk, and make smarter decisions.</p>
            <p>We will keep you updated as early access becomes available.</p>
            <p><strong>The Krypnova Team</strong></p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      message: "Welcome to Krypnova. Your registration was received.",
    });
  } catch (error) {
    console.error("Lead API error:", error);

    return NextResponse.json(
      { message: "Unable to process your request. Please try again." },
      { status: 500 }
    );
  }
}

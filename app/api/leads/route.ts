```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { pool } from "@/lib/db";

const resendApiKey = process.env.RESEND_API_KEY;
const leadNotificationEmail =
  process.env.LEAD_NOTIFICATION_EMAIL || "novagroupca@gmail.com";
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Krypnova <onboarding@resend.dev>";

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
  return value.map((item) => clean(item)).filter((item) => allowed.has(item));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    if (!pool) {
      return NextResponse.json(
        { message: "Database is not configured." },
        { status: 503 }
      );
    }

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
  ($1, $2, $3, $4, $5, $6, $7, $8, $9:: text[], $10:: text[], $11, $12, 'krypnova_landing', $13, $14)
      on conflict(email)
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

    const safeFirstName = escapeHtml(firstName);
    const safeLastName = escapeHtml(lastName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "N/A");
    const safeCompany = escapeHtml(company || "N/A");
    const safeJobTitle = escapeHtml(jobTitle || "N/A");
    const safeCountry = escapeHtml(country || "N/A");
    const safeTradingExperience = escapeHtml(tradingExperience || "N/A");
    const safeMarkets = escapeHtml(markets.length ? markets.join(", ") : "N/A");
    const safeTradingStyles = escapeHtml(
      tradingStyles.length ? tradingStyles.join(", ") : "N/A"
    );
    const safePortfolioSize = escapeHtml(portfolioSize || "N/A");
    const safeMainGoal = escapeHtml(mainGoal || "N/A");

    if (resend) {
      try {
        console.log("Sending lead notification to:", leadNotificationEmail);

        const notificationResult = await resend.emails.send({
          from: fromEmail,
          to: [leadNotificationEmail],
          replyTo: email,
          subject: `New Krypnova Lead: ${ firstName } ${ lastName } `.trim(),
          html: `
  < div style = "font-family:Arial,sans-serif;line-height:1.6;color:#111827" >
    <h2>New Krypnova Lead </h2>
      < p > A new contact joined the Krypnova waitlist.</p>
        < table cellpadding = "8" cellspacing = "0" style = "border-collapse:collapse" >
          <tr><td><strong>Name < /strong></td > <td>${ safeFirstName } ${ safeLastName } </td></tr >
            <tr><td><strong>Email < /strong></td > <td>${ safeEmail } </td></tr >
              <tr><td><strong>Phone < /strong></td > <td>${ safePhone } </td></tr >
                <tr><td><strong>Company < /strong></td > <td>${ safeCompany } </td></tr >
                  <tr><td><strong>Job Title < /strong></td > <td>${ safeJobTitle } </td></tr >
                    <tr><td><strong>Country < /strong></td > <td>${ safeCountry } </td></tr >
                      <tr><td><strong>Trading Experience < /strong></td > <td>${ safeTradingExperience } </td></tr >
                        <tr><td><strong>Markets < /strong></td > <td>${ safeMarkets } </td></tr >
                          <tr><td><strong>Trading Styles < /strong></td > <td>${ safeTradingStyles } </td></tr >
                            <tr><td><strong>Portfolio Size < /strong></td > <td>${ safePortfolioSize } </td></tr >
                              <tr><td><strong>Main Goal < /strong></td > <td>${ safeMainGoal } </td></tr >
                                <tr><td><strong>Lead ID < /strong></td > <td>${ lead.id } </td></tr >
                                  <tr><td><strong>Date < /strong></td > <td>${ lead.created_at } </td></tr >
                                    </table>
                                    </div>
                                      `,
        });

        console.log("Lead notification result:", notificationResult);
      } catch (emailError) {
        console.error("Lead notification email failed:", emailError);
      }

      try {
        console.log("Sending welcome email to:", email);

        const welcomeResult = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: "Welcome to Krypnova",
          html: `
                                    < div style = "font-family:Arial,sans-serif;line-height:1.6;color:#111827" >
                                      <h2>Welcome to Krypnova </h2>
                                        < p > Hi ${ safeFirstName }, </p>
                                          < p > Thank you for joining the Krypnova waitlist.</p>
                                            < p > We are building AI - powered trading intelligence for crypto and stock markets, designed to help users analyze opportunities, manage risk, and make smarter decisions.</p>
                                              < p > We will keep you updated as early access becomes available.</p>
                                                < p > <strong>The Krypnova Team < /strong></p >
                                                  </div>
                                                    `,
        });

        console.log("Welcome email result:", welcomeResult);
      } catch (emailError) {
        console.error("Welcome email failed:", emailError);
      }
    } else {
      console.warn("Resend is not configured. Skipping emails.");
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
```

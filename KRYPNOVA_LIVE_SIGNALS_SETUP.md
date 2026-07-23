# Krypnova Live Signals Integration

## What was added

- `/markets` public market-intelligence page.
- `/api/public/live-signals` public JSON endpoint.
- Exion AI payload normalization equivalent to the Streamlit `load_latest_decisions()` flow.
- Public fields only: exchange, symbol, signal, confidence, alpha, expected ROI, risk/reward, risk score, and updated time.
- Full entry, stop-loss, take-profit, position sizing, raw payload, execution plan, and private reasoning are intentionally excluded.

## Required Vercel environment variables

Set these in **Vercel → Project Settings → Environment Variables**:

```text
DATABASE_URL=<landing/waitlist PostgreSQL URL>
EXION_DATABASE_URL=<PostgreSQL URL containing krypnova_decision_events>
PUBLIC_SIGNALS_USER_ID=<optional Krypnova user id>
```

If the landing and Exion use the same PostgreSQL database, `EXION_DATABASE_URL` can be omitted and the API will use `DATABASE_URL`.

The PostgreSQL URL must be usable by Node `pg`, for example:

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

`postgresql+asyncpg://` is also accepted and normalized automatically.

## Public endpoint

```text
GET /api/public/live-signals?limit=8&mode=paper
```

- `limit`: 1–20
- `mode`: `paper` or `live`
- The page currently uses paper mode for a safe public demonstration.
- Results refresh automatically every 60 seconds.

## Validation performed

TypeScript strict validation passed with:

```text
node node_modules/typescript/bin/tsc --noEmit
```

A full Next.js production build could not complete in the isolated environment because the Linux SWC package download returned HTTP 503. No TypeScript errors were found.

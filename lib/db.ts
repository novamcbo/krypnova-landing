import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var krypnovaPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

export const pool =
  connectionString
    ? global.krypnovaPool ??
    new Pool({
      connectionString,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
    })
    : null;

if (process.env.NODE_ENV !== "production" && pool) {
  global.krypnovaPool = pool;
}
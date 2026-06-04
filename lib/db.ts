import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var krypnovaPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

export const pool =
  global.krypnovaPool ??
  new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  global.krypnovaPool = pool;
}

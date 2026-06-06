import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function check() {
  const result = await pool.query(
    "SELECT id, first_name, last_name, email, trading_experience, created_at FROM leads ORDER BY created_at DESC LIMIT 5",
  )
  console.log("Total leads recientes:")
  console.table(result.rows)
  await pool.end()
}

check().catch((e) => {
  console.error("Error:", e.message)
  process.exit(1)
})

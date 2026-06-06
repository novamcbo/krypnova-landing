import { pool } from "../lib/db";

async function setupDatabase() {
  console.log("Creating leads table...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100),
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      company VARCHAR(255),
      job_title VARCHAR(255),
      country VARCHAR(100),
      trading_experience VARCHAR(100),
      markets TEXT[],
      trading_styles TEXT[],
      portfolio_size VARCHAR(100),
      main_goal TEXT,
      source VARCHAR(100) DEFAULT 'krypnova_landing',
      ip_address VARCHAR(50),
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log("Leads table created successfully!");
  await pool.end();
}

setupDatabase().catch((err) => {
  console.error("Error setting up database:", err);
  process.exit(1);
});

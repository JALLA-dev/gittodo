import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const isRenderConnection =
  databaseUrl.includes("render.com") || databaseUrl.includes("sslmode=require");

export const pool = new Pool({
  connectionString: databaseUrl,
  ...(isRenderConnection
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

// Test connection on startup
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

export default pool;

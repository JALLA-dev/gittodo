import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pool from "./index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  try {
    const schemaPath = join(__dirname, "schema.sql");
    const sql = readFileSync(schemaPath, "utf-8");
    await pool.query(sql);
    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Database migration failed:", error.message);
    throw error;
  }
}

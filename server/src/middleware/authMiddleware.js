import pool from "../db/index.js";

export async function requireAuth(req, res, next) {
  // Authentication completely removed as requested
  // We mock the user so foreign keys don't break
  req.user = { id: "default_user", name: "Local User", email: "local@example.com" };
  next();
}

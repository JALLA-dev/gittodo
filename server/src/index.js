import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { runMigrations } from "./db/migrate.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = parseInt(process.env.PORT || process.env.EXPRESS_PORT || "5000", 10);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      const allowed = origin.startsWith('http://localhost') || 
                     origin.endsWith('.vercel.app') || 
                     origin === process.env.CLIENT_URL;
                     
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, server: "Express with Node.js & PostgreSQL" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
async function start() {
  try {
    await runMigrations();

    // Ensure default user exists since we removed authentication
    const { default: pool } = await import("./db/index.js");
    await pool.query(`
      INSERT INTO users (id, email, password, name)
      VALUES ('default_user', 'local@example.com', 'none', 'Local User')
      ON CONFLICT (id) DO NOTHING;
    `);

    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 TaskFlow Express server running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

start();

export default app;

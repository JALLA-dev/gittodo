import crypto from "crypto";
import pool from "../db/index.js";
import { hashPassword } from "./auth.js";

const DEMO_EMAIL = "demo@taskflow.dev";
const DEMO_PASSWORD = "Password123!";

export async function seedDemoUserIfNeeded() {
  // Check if demo user exists
  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [DEMO_EMAIL]
  );

  let userId;

  if (existing.rows.length > 0) {
    userId = existing.rows[0].id;
    // Check if tasks exist
    const userTasks = await pool.query(
      "SELECT id FROM tasks WHERE user_id = $1 LIMIT 1",
      [userId]
    );
    if (userTasks.rows.length > 0) {
      return existing.rows[0];
    }
  } else {
    userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(DEMO_PASSWORD);
    await pool.query(
      `INSERT INTO users (id, name, email, password, avatar, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        userId,
        "Alex Morgan",
        DEMO_EMAIL,
        hashedPassword,
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      ]
    );
  }

  // Seed demo tasks
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const overdueDate = new Date(today);
  overdueDate.setDate(overdueDate.getDate() - 2);
  const inThreeDays = new Date(today);
  inThreeDays.setDate(inThreeDays.getDate() + 3);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const demoTasks = [
    {
      title: "Design System & Dark Mode Overhaul",
      description: "Implement unified tokens for primary, accent, and surface colors. Ensure WCAG AAA contrast ratio compliance across both light and dark themes.",
      dueDate: today,
      priority: "urgent",
      status: "in_progress",
      category: "work",
      subtasks: [
        { id: crypto.randomUUID(), title: "Audit existing component styles and color variables", completed: true },
        { id: crypto.randomUUID(), title: "Configure Tailwind CSS dark theme class variant", completed: true },
        { id: crypto.randomUUID(), title: "Test high contrast mode on mobile viewport", completed: false },
      ],
      tags: ["design", "ui", "accessibility"],
      orderIndex: 0,
    },
    {
      title: "Q2 Financial Budget & Cash Flow Forecast",
      description: "Review software subscriptions, contractor expenses, and project revenue milestones for the upcoming quarter.",
      dueDate: inThreeDays,
      priority: "high",
      status: "pending",
      category: "finance",
      subtasks: [
        { id: crypto.randomUUID(), title: "Export Stripe & QuickBooks revenue summaries", completed: true },
        { id: crypto.randomUUID(), title: "Categorize recurring operational expenditures", completed: false },
        { id: crypto.randomUUID(), title: "Prepare 3-scenario cash projection slide deck", completed: false },
        { id: crypto.randomUUID(), title: "Schedule budget review call with stakeholders", completed: false },
      ],
      tags: ["finance", "planning", "quarterly"],
      orderIndex: 1,
    },
    {
      title: "Weekly Organic Grocery Restock",
      description: "Pick up fresh produce, cold-pressed olive oil, Greek yogurt, sourdough loaf, and almond milk for meal prep.",
      dueDate: overdueDate,
      priority: "medium",
      status: "completed",
      category: "shopping",
      subtasks: [
        { id: crypto.randomUUID(), title: "Avocados, spinach, and bell peppers", completed: true },
        { id: crypto.randomUUID(), title: "Wild salmon fillets & organic chicken breast", completed: true },
        { id: crypto.randomUUID(), title: "Sourdough bread & rolled oats", completed: true },
      ],
      tags: ["groceries", "health", "errands"],
      orderIndex: 2,
    },
    {
      title: "Full-Body Strength Session & 5k Recovery Run",
      description: "Focus on deadlifts, overhead press, and core stability, followed by an easy zone-2 pace run in the park.",
      dueDate: today,
      priority: "medium",
      status: "in_progress",
      category: "health",
      subtasks: [
        { id: crypto.randomUUID(), title: "10-minute dynamic hip and shoulder mobility warmup", completed: true },
        { id: crypto.randomUUID(), title: "Compound lifts: 4 sets of deadlifts & 3 sets of OHP", completed: true },
        { id: crypto.randomUUID(), title: "5km outdoor run at comfortable conversational pace", completed: false },
      ],
      tags: ["fitness", "wellness", "running"],
      orderIndex: 3,
    },
    {
      title: "Refactor User Authentication & JWT Refresh Tokens",
      description: "Implement httpOnly cookie based session management with rotating refresh tokens and rate-limited login endpoints.",
      dueDate: overdueDate,
      priority: "high",
      status: "completed",
      category: "work",
      subtasks: [
        { id: crypto.randomUUID(), title: "Write bcrypt salt generation and password verification", completed: true },
        { id: crypto.randomUUID(), title: "Set Secure, HttpOnly, SameSite=Lax cookie headers", completed: true },
        { id: crypto.randomUUID(), title: "Verify token expiration and renewal route", completed: true },
      ],
      tags: ["security", "auth", "backend"],
      orderIndex: 4,
    },
    {
      title: "Renew SSL Certificates & Primary Domain Names",
      description: "Ensure auto-renewal is active on DNS registrar and Cloudflare edge certificates are not expiring.",
      dueDate: overdueDate,
      priority: "urgent",
      status: "pending",
      category: "other",
      subtasks: [
        { id: crypto.randomUUID(), title: "Verify credit card on registrar billing portal", completed: false },
        { id: crypto.randomUUID(), title: "Check Let's Encrypt bot cert renewals across servers", completed: false },
      ],
      tags: ["devops", "domains", "maintenance"],
      orderIndex: 5,
    },
    {
      title: "Plan Weekend Mountain Trail Hiking Trip",
      description: "Check weather forecast, pack 10 essentials, check topographic map, and book park trail parking pass.",
      dueDate: nextWeek,
      priority: "low",
      status: "pending",
      category: "personal",
      subtasks: [
        { id: crypto.randomUUID(), title: "Download offline trail map on AllTrails", completed: true },
        { id: crypto.randomUUID(), title: "Check weather window for clear summits", completed: false },
        { id: crypto.randomUUID(), title: "Pack water filtration kit, hydration pack, and first aid", completed: false },
      ],
      tags: ["outdoors", "hiking", "weekend"],
      orderIndex: 6,
    },
    {
      title: "Security Header Review & Rate Limiter Implementation",
      description: "Add Helmet-equivalent headers (X-Frame-Options, CSP, X-Content-Type-Options) and configure in-memory sliding window rate limiter.",
      dueDate: tomorrow,
      priority: "high",
      status: "in_progress",
      category: "work",
      subtasks: [
        { id: crypto.randomUUID(), title: "Define rate limit threshold of 60 req/min per IP", completed: true },
        { id: crypto.randomUUID(), title: "Set Content-Security-Policy headers", completed: false },
      ],
      tags: ["infosec", "performance", "api"],
      orderIndex: 7,
    },
  ];

  for (const t of demoTasks) {
    await pool.query(
      `INSERT INTO tasks (id, user_id, title, description, due_date, priority, status, category, subtasks, tags, order_index, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
      [
        crypto.randomUUID(),
        userId,
        t.title,
        t.description,
        t.dueDate,
        t.priority,
        t.status,
        t.category,
        JSON.stringify(t.subtasks),
        JSON.stringify(t.tags),
        t.orderIndex,
      ]
    );
  }

  const fetched = await pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [userId]);
  return fetched.rows[0];
}

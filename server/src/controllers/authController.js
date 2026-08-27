import crypto from "crypto";
import pool from "../db/index.js";
import { hashPassword, comparePassword, generateTokens } from "../lib/auth.js";
import { seedDemoUserIfNeeded } from "../lib/seedDemo.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ success: false, error: "Name must be at least 2 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: "Please provide a valid email address" });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [trimmedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: "An account with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    await pool.query(
      `INSERT INTO users (id, name, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, trimmedName, trimmedEmail, hashedPassword]
    );

    const tokens = generateTokens({ userId, email: trimmedEmail });

    res.cookie("auth_token", tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: userId,
        name: trimmedName,
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, error: "Internal server error during registration" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedEmail || !password) {
      return res.status(400).json({ success: false, error: "Please provide both email and password" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [trimmedEmail]
    );

    if (!result.rows.length) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordValid = await comparePassword(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const tokens = generateTokens({ userId: user.id, email: user.email });

    res.cookie("auth_token", tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Internal server error during login" });
  }
}

export async function demo(req, res) {
  try {
    const user = await seedDemoUserIfNeeded();
    const tokens = generateTokens({ userId: user.id, email: user.email });

    res.cookie("auth_token", tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Signed in as Demo User",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return res.status(500).json({ success: false, error: "Failed to initiate demo session" });
  }
}

export function logout(req, res) {
  res.clearCookie("auth_token");
  return res.json({ success: true, message: "Logged out successfully" });
}

export function getMe(req, res) {
  return res.json({
    success: true,
    data: req.user,
  });
}

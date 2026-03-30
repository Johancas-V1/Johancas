import { Router } from "express";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import db from "../db/connection.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  const id = crypto.randomUUID().replace(/-/g, "");

  db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").run(id, name, email, hash);

  const user = db.prepare("SELECT id, name, email, subscription, created_at FROM users WHERE id = ?").get(id) as Record<string, unknown>;
  const token = signToken({ id: user.id as string, email: user.email as string, subscription: user.subscription as string });

  res.status(201).json({ token, user });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as Record<string, unknown> | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash as string)) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = signToken({ id: user.id as string, email: user.email as string, subscription: user.subscription as string });
  const { password_hash, ...safeUser } = user;

  res.json({ token, user: safeUser });
});

// POST /api/auth/forgot-password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const user = db.prepare("SELECT id, email FROM users WHERE email = ?").get(email) as Record<string, unknown> | undefined;
  if (!user) {
    res.status(404).json({ message: "No account found with that email" });
    return;
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?").run(token, expires, user.id);

  const resetUrl = `${FRONTEND_URL}/es/reset-password?token=${token}`;

  resend.emails.send({
    from: "JCM <onboarding@resend.dev>",
    to: email,
    subject: "Restablecer contraseña - JCM",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a2744;">Restablecer Contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el enlace de abajo:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #1a2744; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Restablecer Contraseña</a>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  }).catch((err) => console.error("Resend error:", err));

  res.json({ message: "If the email exists, a reset link has been generated" });
});

// POST /api/auth/reset-password
router.post("/reset-password", (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400).json({ message: "Token and new password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  const user = db.prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > datetime('now')").get(token) as Record<string, unknown> | undefined;
  if (!user) {
    res.status(400).json({ message: "Invalid or expired reset token" });
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  db.prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?").run(hash, user.id);

  res.json({ message: "Password updated successfully" });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT id, name, email, subscription, created_at FROM users WHERE id = ?").get(req.user!.id);
  res.json({ user });
});

export default router;

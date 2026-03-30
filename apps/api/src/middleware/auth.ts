import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";

const JWT_SECRET = process.env.JWT_SECRET || "johancas-dev-secret";

export interface AuthUser {
  id: string;
  email: string;
  subscription: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ id: user.id, email: user.email, subscription: user.subscription }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as AuthUser;
    // Refresh subscription from DB in case it changed
    const row = db.prepare("SELECT id, email, subscription FROM users WHERE id = ?").get(payload.id) as AuthUser | undefined;
    if (!row) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    req.user = row;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as AuthUser;
    const row = db.prepare("SELECT id, email, subscription FROM users WHERE id = ?").get(payload.id) as AuthUser | undefined;
    if (row) req.user = row;
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
}

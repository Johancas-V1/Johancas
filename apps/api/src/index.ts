import "dotenv/config";
import express from "express";
import cors from "cors";
import { initSchema } from "./db/schema.js";
import { autoSeed } from "./auto-seed.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import userRoutes from "./routes/users.js";
import highlightRoutes from "./routes/highlights.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize DB schema and seed if empty
initSchema();
autoSeed();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://johancas.com",
  "https://www.johancas.com",
  "https://johancas-memos.vercel.app",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users/me", userRoutes);
app.use("/api/users/me/highlights", highlightRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

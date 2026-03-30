import { Router } from "express";
import db from "../db/connection.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All routes require auth
router.use(requireAuth);

// PUT /api/users/me
router.put("/", (req, res) => {
  const { name, email } = req.body;
  const userId = req.user!.id;

  if (email) {
    const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, userId);
    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }
  }

  if (name) db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, userId);
  if (email) db.prepare("UPDATE users SET email = ? WHERE id = ?").run(email, userId);

  const user = db.prepare("SELECT id, name, email, subscription, created_at FROM users WHERE id = ?").get(userId);
  res.json({ user });
});

// PUT /api/users/me/subscription
router.put("/subscription", (req, res) => {
  const userId = req.user!.id;
  db.prepare("UPDATE users SET subscription = 'premium' WHERE id = ?").run(userId);
  const user = db.prepare("SELECT id, name, email, subscription, created_at FROM users WHERE id = ?").get(userId);
  res.json({ user });
});

// GET /api/users/me/progress
router.get("/progress", (req, res) => {
  const rows = db.prepare(`
    SELECT rp.*, b.title as book_title, b.slug as book_slug,
           (SELECT COUNT(*) FROM chapters WHERE book_id = b.id) as total_chapters
    FROM reading_progress rp
    JOIN books b ON b.id = rp.book_id
    WHERE rp.user_id = ?
  `).all(req.user!.id);
  res.json({ progress: rows });
});

// PUT /api/users/me/progress/:bookSlug
router.put("/progress/:bookSlug", (req, res) => {
  const { current_chapter, progress_percent } = req.body;
  const userId = req.user!.id;

  const book = db.prepare("SELECT id FROM books WHERE slug = ?").get(req.params.bookSlug) as { id: string } | undefined;
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  db.prepare(`
    INSERT INTO reading_progress (id, user_id, book_id, current_chapter, progress_percent)
    VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)
    ON CONFLICT(user_id, book_id) DO UPDATE SET
      current_chapter = excluded.current_chapter,
      progress_percent = excluded.progress_percent,
      updated_at = datetime('now')
  `).run(userId, book.id, current_chapter, progress_percent);

  res.json({ success: true });
});

export default router;

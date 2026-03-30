import { Router } from "express";
import db from "../db/connection.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// GET /api/users/me/highlights
router.get("/", (req, res) => {
  const chapterId = req.query.chapterId as string | undefined;
  let rows;

  if (chapterId) {
    rows = db.prepare(
      "SELECT * FROM highlights WHERE user_id = ? AND chapter_id = ? ORDER BY start_offset"
    ).all(req.user!.id, chapterId);
  } else {
    rows = db.prepare(
      `SELECT h.*, c.number as chapter_number, c.title as chapter_title, b.title as book_title, b.slug as book_slug
       FROM highlights h
       JOIN chapters c ON c.id = h.chapter_id
       JOIN books b ON b.id = c.book_id
       WHERE h.user_id = ?
       ORDER BY h.created_at DESC`
    ).all(req.user!.id);
  }

  res.json({ highlights: rows });
});

// POST /api/users/me/highlights
router.post("/", (req, res) => {
  const { chapter_id, text, start_offset, end_offset, note } = req.body;

  if (!chapter_id || !text || start_offset === undefined || end_offset === undefined) {
    res.status(400).json({ message: "chapter_id, text, start_offset, end_offset are required" });
    return;
  }

  const id = crypto.randomUUID().replace(/-/g, "");
  db.prepare(
    "INSERT INTO highlights (id, user_id, chapter_id, text, start_offset, end_offset, note) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, req.user!.id, chapter_id, text, start_offset, end_offset, note || "");

  const highlight = db.prepare("SELECT * FROM highlights WHERE id = ?").get(id);
  res.status(201).json({ highlight });
});

// PUT /api/users/me/highlights/:id
router.put("/:id", (req, res) => {
  const { note } = req.body;
  const highlight = db.prepare("SELECT * FROM highlights WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id);

  if (!highlight) {
    res.status(404).json({ message: "Highlight not found" });
    return;
  }

  db.prepare("UPDATE highlights SET note = ? WHERE id = ?").run(note ?? "", req.params.id);
  const updated = db.prepare("SELECT * FROM highlights WHERE id = ?").get(req.params.id);
  res.json({ highlight: updated });
});

// DELETE /api/users/me/highlights/:id
router.delete("/:id", (req, res) => {
  const highlight = db.prepare("SELECT * FROM highlights WHERE id = ? AND user_id = ?").get(req.params.id, req.user!.id);

  if (!highlight) {
    res.status(404).json({ message: "Highlight not found" });
    return;
  }

  db.prepare("DELETE FROM highlights WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;

import { Router } from "express";
import db from "../db/connection.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/books
router.get("/", (_req, res) => {
  const books = db.prepare(`
    SELECT b.*, COUNT(c.id) as chapter_count
    FROM books b LEFT JOIN chapters c ON c.book_id = b.id
    GROUP BY b.id ORDER BY b.created_at
  `).all();
  res.json({ books });
});

// GET /api/books/:slug
router.get("/:slug", (_req, res) => {
  const book = db.prepare("SELECT * FROM books WHERE slug = ?").get(_req.params.slug) as Record<string, unknown> | undefined;
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  const chapters = db.prepare(
    "SELECT id, number, title, is_free FROM chapters WHERE book_id = ? ORDER BY number"
  ).all(book.id);

  res.json({ book, chapters });
});

// GET /api/books/:slug/chapters/:number
router.get("/:slug/chapters/:number", optionalAuth, (req, res) => {
  const book = db.prepare("SELECT id FROM books WHERE slug = ?").get(req.params.slug) as { id: string } | undefined;
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  const chapter = db.prepare(
    "SELECT * FROM chapters WHERE book_id = ? AND number = ?"
  ).get(book.id, Number(req.params.number)) as Record<string, unknown> | undefined;
  if (!chapter) {
    res.status(404).json({ message: "Chapter not found" });
    return;
  }

  const isFree = chapter.is_free === 1;
  const isPremium = req.user?.subscription === "premium";

  if (isFree || isPremium) {
    res.json({ chapter: { ...chapter, locked: false } });
  } else {
    // Return preview (first 300 chars) for locked chapters
    const preview = (chapter.content as string).slice(0, 300) + "...";
    res.json({
      chapter: { ...chapter, content: preview, locked: true },
    });
  }
});

export default router;

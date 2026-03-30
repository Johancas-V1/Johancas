import db from "./connection.js";

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      subscription TEXT NOT NULL DEFAULT 'free' CHECK(subscription IN ('free', 'premium')),
      reset_token TEXT,
      reset_token_expires TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      cover_image TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      book_id TEXT NOT NULL REFERENCES books(id),
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_free INTEGER NOT NULL DEFAULT 0,
      UNIQUE(book_id, number)
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL REFERENCES users(id),
      book_id TEXT NOT NULL REFERENCES books(id),
      current_chapter INTEGER NOT NULL DEFAULT 1,
      progress_percent REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, book_id)
    );

    CREATE TABLE IF NOT EXISTS highlights (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL REFERENCES users(id),
      chapter_id TEXT NOT NULL REFERENCES chapters(id),
      text TEXT NOT NULL,
      start_offset INTEGER NOT NULL,
      end_offset INTEGER NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

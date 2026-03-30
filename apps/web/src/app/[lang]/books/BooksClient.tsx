"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Book } from "@/lib/api";
import { BookMarked, Home } from "lucide-react";

interface BooksDict {
  title: string;
  backToHome: string;
  chapters: string;
  readNow: string;
  loading: string;
}

export default function BooksClient({ dict, lang }: { dict: BooksDict; lang: string }) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    api.books.list().then((r) => setBooks(r.books));
  }, []);

  return (
    <main className="flex flex-col min-h-full">
      <section className="bg-[var(--bg-light)] px-6 md:px-16 py-16 flex-1">
        <div className="max-w-5xl mx-auto">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-gray)] hover:text-[var(--navy-dark)] transition-colors mb-6"
          >
            <Home className="w-4 h-4" />
            {dict.backToHome}
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--navy-dark)] mb-10">{dict.title}</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/${lang}/books/${book.slug}`}
                className="bg-white rounded-2xl border border-[var(--border-light)] p-8 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-20 bg-[var(--navy-dark)] rounded-lg flex items-center justify-center shrink-0">
                    <BookMarked className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--navy-dark)] group-hover:text-[var(--blue-accent)] transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{book.chapter_count} {dict.chapters}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-gray)] leading-relaxed">{book.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Book, Chapter } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { BookMarked, Lock, Crown, ArrowLeft } from "lucide-react";

interface BooksDict {
  readNow: string;
  chaptersTitle: string;
  free: string;
  premium: string;
  read: string;
  backToBooks: string;
  loading: string;
}

export default function BookDetailClient({ dict, lang, slug }: { dict: BooksDict; lang: string; slug: string }) {
  const { isPremium } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    api.books.get(slug).then((r) => {
      setBook(r.book);
      setChapters(r.chapters);
    });
  }, [slug]);

  if (!book) return <div className="min-h-screen flex items-center justify-center text-[var(--text-gray)]">{dict.loading}</div>;

  return (
    <main className="min-h-screen bg-[var(--bg-light)]">
      {/* Hero */}
      <div className="relative bg-[var(--navy-dark)] text-white px-6 md:px-16 pt-8 pb-16">
        <div className="max-w-4xl mx-auto mb-6">
          <Link
            href={`/${lang}/books`}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.backToBooks}
          </Link>
        </div>
        <div className="max-w-4xl mx-auto flex items-center gap-8">
          <div className="w-24 h-32 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <BookMarked className="w-12 h-12 text-white/80" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{book.title}</h1>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl">{book.description}</p>
            <Link
              href={`/${lang}/books/${slug}/read/1`}
              className="inline-block mt-5 bg-white text-[var(--navy-dark)] text-sm font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              {dict.readNow}
            </Link>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-4xl mx-auto px-6 md:px-16 py-10">
        <h2 className="text-xl font-bold text-[var(--navy-dark)] mb-6">{dict.chaptersTitle}</h2>
        <div className="flex flex-col gap-3">
          {chapters.map((ch) => {
            const unlocked = ch.is_free === 1 || isPremium;
            return (
              <div
                key={ch.id}
                className="bg-white rounded-xl border border-[var(--border-light)] p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-light)] flex items-center justify-center text-sm font-bold text-[var(--navy-dark)]">
                    {ch.number}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${unlocked ? "text-[var(--navy-dark)]" : "text-[var(--text-muted)]"}`}>
                      {ch.title}
                    </p>
                    {ch.is_free === 1 && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{dict.free}</span>
                    )}
                    {ch.is_free === 0 && !isPremium && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <Crown className="w-2.5 h-2.5" /> {dict.premium}
                      </span>
                    )}
                  </div>
                </div>
                {unlocked ? (
                  <Link
                    href={`/${lang}/books/${slug}/read/${ch.number}`}
                    className="text-xs font-semibold text-[var(--navy-dark)] border border-[var(--navy-dark)] px-4 py-2 rounded-lg hover:bg-[var(--navy-dark)] hover:text-white transition-colors"
                  >
                    {dict.read}
                  </Link>
                ) : (
                  <Link
                    href={`/${lang}/book/paywall`}
                    className="text-[var(--text-muted)] hover:text-amber-500 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

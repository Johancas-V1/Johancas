"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Book, Chapter, ChapterContent } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { BookMarked, CircleCheck, Lock, CircleUser, Crown } from "lucide-react";
import BookReaderContent from "./BookReaderContent";

interface ReaderDict {
  tableOfContents: string;
  ch: string;
  backToBook: string;
  upgradeToPremium: string;
  read: string;
  chapter: string;
  premiumContent: string;
  upgradeToRead: string;
  upgradeNow: string;
  previousChapter: string;
  nextChapter: string;
  loading: string;
  highlight: string;
  addNote: string;
  editNote: string;
  delete: string;
  notePlaceholder: string;
  cancel: string;
  save: string;
  notes: string;
  noHighlights: string;
}

export default function ReaderClient({ dict, lang, slug, chapterNum }: { dict: ReaderDict; lang: string; slug: string; chapterNum: string }) {
  const { user, isPremium } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [content, setContent] = useState<ChapterContent | null>(null);

  useEffect(() => {
    api.books.get(slug).then((r) => {
      setBook(r.book);
      setChapters(r.chapters);
    });
  }, [slug]);

  useEffect(() => {
    api.books.chapter(slug, Number(chapterNum)).then((r) => setContent(r.chapter));
  }, [slug, chapterNum, isPremium]);

  if (!book || !content) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--text-gray)]">{dict.loading}</div>;
  }

  const num = Number(chapterNum);
  const progress = Math.round((num / chapters.length) * 100);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 bg-[#f8f6f1] border-r border-[var(--border-light)] p-6 flex flex-col hidden md:flex">
        <div className="mb-6">
          <BookMarked className="w-8 h-8 text-[var(--navy-dark)] mb-4" />
          <h1 className="text-2xl font-extrabold text-[var(--navy-dark)] leading-tight">{book.title}</h1>
        </div>

        <h3 className="text-sm font-bold text-[var(--navy-dark)] mb-3">{dict.tableOfContents}</h3>
        <nav className="flex flex-col gap-1 flex-1">
          {chapters.map((ch) => {
            const active = ch.number === num;
            const unlocked = ch.is_free === 1 || isPremium;
            return (
              <div key={ch.id} className={`flex items-center justify-between py-2 px-2.5 rounded-lg text-sm transition-colors ${active ? "bg-white shadow-sm font-semibold text-[var(--navy-dark)]" : ""}`}>
                {unlocked ? (
                  <Link href={`/${lang}/books/${slug}/read/${ch.number}`} className={unlocked ? "text-[var(--text-dark)]" : "text-[var(--text-muted)]"}>
                    {dict.ch} {ch.number}: {ch.title}
                  </Link>
                ) : (
                  <span className="text-[var(--text-muted)]">{dict.ch} {ch.number}: {ch.title}</span>
                )}
                {ch.number < num && <CircleCheck className="w-4 h-4 text-[var(--green-check)] shrink-0" />}
                {!unlocked && <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />}
              </div>
            );
          })}
        </nav>

        <Link href={`/${lang}/books/${slug}`} className="text-sm text-[var(--text-gray)] hover:text-[var(--navy-dark)] mt-4 transition-colors">
          &larr; {dict.backToBook}
        </Link>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[var(--border-light)]">
          <div className="md:hidden">
            <Link href={`/${lang}/books/${slug}`} className="text-sm font-bold text-[var(--navy-dark)]">JCM</Link>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            {user && <CircleUser className="w-6 h-6 text-[var(--navy-dark)]" />}
            {!isPremium && (
              <Link href={`/${lang}/book/paywall`} className="text-xs font-semibold text-[var(--navy-dark)] border border-[var(--navy-dark)] px-4 py-2 rounded-lg hover:bg-[var(--navy-dark)] hover:text-white transition-colors">
                {dict.upgradeToPremium}
              </Link>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 md:px-10 py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-[var(--navy-dark)]">{progress}% {dict.read}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[var(--navy-dark)] h-2.5 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Chapter Title */}
        <div className="px-6 md:px-16 lg:px-24 pt-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--navy-dark)] mb-2">
            {dict.chapter} {num}: {content.title}
          </h2>
        </div>

        {/* Content */}
        {content.locked ? (
          <div className="px-6 md:px-16 lg:px-24 py-6 flex-1">
            <p className="text-lg text-[var(--text-gray)] leading-relaxed font-serif mb-8">{content.content}</p>
            <div className="bg-[#f8f6f1] rounded-2xl p-8 text-center">
              <Crown className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-2">{dict.premiumContent}</h3>
              <p className="text-sm text-[var(--text-gray)] mb-4">{dict.upgradeToRead}</p>
              <Link href={`/${lang}/book/paywall`} className="inline-block bg-[var(--blue-accent)] text-white text-sm font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                {dict.upgradeNow}
              </Link>
            </div>
          </div>
        ) : (
          <BookReaderContent
            chapterContent={content.content}
            chapterId={content.id}
            lang={lang}
            dict={dict}
          />
        )}

        {/* Navigation */}
        {!content.locked && (
          <div className="px-6 md:px-16 lg:px-24 py-6 border-t border-[var(--border-light)] flex justify-between">
            {num > 1 && (
              <Link href={`/${lang}/books/${slug}/read/${num - 1}`} className="text-sm font-semibold text-[var(--navy-dark)] hover:underline">
                &larr; {dict.previousChapter}
              </Link>
            )}
            <div />
            {num < chapters.length && (
              <Link href={`/${lang}/books/${slug}/read/${num + 1}`} className="text-sm font-semibold text-[var(--navy-dark)] hover:underline">
                {dict.nextChapter} &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

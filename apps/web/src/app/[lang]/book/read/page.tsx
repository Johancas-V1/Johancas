import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../../dictionaries";
import { BookMarked, CircleUser, CircleCheck, Lock } from "lucide-react";
import BookReaderClient from "./BookReaderClient";

export default async function BookReaderPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const r = dict.bookReader;

  const chapters = [
    { name: r.introduction, read: true, locked: false },
    { name: `${dict.dashboard.chapter} 1: ${r.chapter1}`, read: true, locked: false },
    { name: `${dict.dashboard.chapter} 2: ${r.chapter2}`, read: true, locked: false },
    { name: `${dict.dashboard.chapter} 3: ${r.chapter3}`, read: true, locked: false, active: true },
    { name: `${dict.dashboard.chapter} 4: ${r.chapter4}`, read: false, locked: true },
    { name: `${dict.dashboard.chapter} 5: ${r.chapter5}`, read: false, locked: true },
    { name: `${dict.dashboard.chapter} 6: ${r.chapter6}`, read: false, locked: true },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 bg-[#f8f6f1] border-r border-[var(--border-light)] p-6 flex flex-col hidden md:flex">
        <div className="mb-6">
          <BookMarked className="w-8 h-8 text-[var(--navy-dark)] mb-4" />
          <h1 className="text-2xl font-extrabold text-[var(--navy-dark)] leading-tight">The Great Famine</h1>
        </div>

        <h3 className="text-sm font-bold text-[var(--navy-dark)] mb-3">{r.tableOfContents}</h3>
        <nav className="flex flex-col gap-1 flex-1">
          {chapters.map((ch, i) => (
            <div key={i} className={`flex items-center justify-between py-2 px-2.5 rounded-lg text-sm transition-colors ${ch.active ? "bg-white shadow-sm font-semibold text-[var(--navy-dark)]" : ""}`}>
              <span className={ch.locked ? "text-[var(--text-muted)]" : "text-[var(--text-dark)]"}>
                {ch.name}
              </span>
              {ch.read && <CircleCheck className="w-4 h-4 text-[var(--green-check)] shrink-0" />}
              {ch.locked && (
                <Link href={`/${lang}/book/paywall`}>
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 hover:text-amber-500 transition-colors" />
                </Link>
              )}
            </div>
          ))}
        </nav>

        <Link href={`/${lang}/dashboard`} className="text-sm text-[var(--text-gray)] hover:text-[var(--navy-dark)] mt-4 transition-colors">
          &larr; {dict.dashboard.myLibrary}
        </Link>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[var(--border-light)]">
          <div className="md:hidden">
            <Link href={`/${lang}/dashboard`} className="text-sm font-bold text-[var(--navy-dark)]">JCM</Link>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <CircleUser className="w-6 h-6 text-[var(--navy-dark)]" />
            <Link
              href={`/${lang}/book/paywall`}
              className="text-xs font-semibold text-[var(--navy-dark)] border border-[var(--navy-dark)] px-4 py-2 rounded-lg hover:bg-[var(--navy-dark)] hover:text-white transition-colors"
            >
              {r.upgradeToPremium}
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 md:px-10 py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-[var(--navy-dark)]">45% {r.read}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[var(--navy-dark)] h-2.5 rounded-full" style={{ width: "45%" }} />
          </div>
        </div>

        {/* Chapter Title */}
        <div className="px-6 md:px-16 lg:px-24 pt-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--navy-dark)] mb-2">
            {dict.dashboard.chapter} 3: {r.chapter3}
          </h2>
        </div>

        {/* Interactive Reader Content */}
        <BookReaderClient
          chapterContent={r.chapterContent}
          chapterIndex={3}
          dict={{
            highlight: r.highlight,
            addNote: r.addNote,
            deleteHighlight: r.deleteHighlight,
            editNote: r.editNote,
            saveNote: r.saveNote,
            cancelNote: r.cancelNote,
            notePlaceholder: r.notePlaceholder,
            noHighlights: r.noHighlights,
            highlightsPanel: r.highlightsPanel,
          }}
        />
      </div>
    </div>
  );
}

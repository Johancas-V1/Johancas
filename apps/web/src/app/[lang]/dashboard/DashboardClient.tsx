"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, Book, ReadingProgress, Highlight } from "@/lib/api";
import { BookMarked, User, Settings, Highlighter, LogOut, Crown, Bell, Globe, Moon } from "lucide-react";

interface DashboardDict {
  myLibrary: string;
  highlightsNotes: string;
  settings: string;
  completed: string;
  readingProgress: string;
  chapter: string;
  of: string;
  resumeReading: string;
  profileSettings: string;
  subscription: string;
  freePlan: string;
  upgradePremium: string;
  accountDetails: string;
  emailPreferences: string;
  logOut: string;
  premium: string;
  upgrade: string;
  notStarted: string;
  readNow: string;
  noHighlights: string;
  note: string;
  name: string;
  email: string;
  memberSince: string;
  save: string;
  cancel: string;
  editProfile: string;
  upgradeDescription: string;
  preferences: string;
  language: string;
  darkMode: string;
  saved: string;
  loading: string;
}

export default function DashboardClient({ dict, lang }: { dict: DashboardDict; lang: string }) {
  const { user, isLoading, isAuthenticated, isPremium, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"library" | "highlights" | "settings">("library");
  const [books, setBooks] = useState<Book[]>([]);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${lang}/signin`);
    }
  }, [isLoading, isAuthenticated, router, lang]);

  useEffect(() => {
    api.books.list().then((r) => setBooks(r.books)).catch(() => {});
    if (isAuthenticated) {
      api.users.progress().then((r) => setProgress(r.progress)).catch(() => {});
      api.highlights.list().then((r) => setHighlights(r.highlights)).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await api.users.update({ name: editName, email: editEmail });
      await refreshUser();
      setEditing(false);
      setSaveMsg(dict.saved);
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Error");
    }
  };

  const handleUpgrade = async () => {
    try {
      await api.users.upgradeSubscription();
      await refreshUser();
    } catch {}
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--text-gray)]">{dict.loading}</div>;
  }

  const getProgress = (bookId: string) => progress.find((p) => p.book_id === bookId);

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 bg-white border-r border-[var(--border-light)] p-6 flex flex-col hidden md:flex">
        <Link href={`/${lang}`} className="text-2xl font-extrabold text-[var(--navy-dark)] mb-8">JCM</Link>

        <div className="flex items-center gap-3 mb-6 p-3 bg-[var(--bg-light)] rounded-xl">
          <div className="w-10 h-10 rounded-full bg-[var(--navy-dark)] flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--navy-dark)]">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {isPremium ? (
                <span className="text-amber-600 flex items-center gap-1"><Crown className="w-3 h-3" /> {dict.premium}</span>
              ) : dict.freePlan}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { key: "library" as const, icon: BookMarked, label: dict.myLibrary },
            { key: "highlights" as const, icon: Highlighter, label: dict.highlightsNotes },
            { key: "settings" as const, icon: Settings, label: dict.settings },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                tab === item.key
                  ? "bg-[var(--navy-dark)] text-white font-semibold"
                  : "text-[var(--text-gray)] hover:bg-[var(--bg-light)]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => { logout(); router.push(`/${lang}`); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-2"
        >
          <LogOut className="w-4 h-4" />
          {dict.logOut}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        {/* Library Tab */}
        {tab === "library" && (
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--navy-dark)] mb-6">{dict.myLibrary}</h1>

            {!isPremium && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">{dict.upgradePremium}</span>
                </div>
                <button onClick={handleUpgrade} className="text-xs font-bold text-white bg-amber-600 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                  {dict.upgrade}
                </button>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {books.map((book) => {
                const p = getProgress(book.id);
                return (
                  <div key={book.id} className="bg-white rounded-2xl border border-[var(--border-light)] p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-20 bg-[var(--navy-dark)] rounded-lg flex items-center justify-center shrink-0">
                        <BookMarked className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--navy-dark)]">{book.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{book.chapter_count} {dict.chapter}s</p>
                      </div>
                    </div>

                    {p ? (
                      <>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-[var(--text-gray)]">{dict.readingProgress}</span>
                          <span className="font-semibold text-[var(--navy-dark)]">{Math.round(p.progress_percent)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div className="bg-[var(--navy-dark)] h-2 rounded-full" style={{ width: `${p.progress_percent}%` }} />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-4">
                          {dict.chapter} {p.current_chapter} {dict.of} {p.total_chapters}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] mb-4">{dict.notStarted}</p>
                    )}

                    <Link
                      href={`/${lang}/books/${book.slug}`}
                      className="block w-full text-center bg-[var(--navy-dark)] text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {p ? dict.resumeReading : dict.readNow}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Highlights Tab */}
        {tab === "highlights" && (
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--navy-dark)] mb-6">{dict.highlightsNotes}</h1>
            {highlights.length === 0 ? (
              <p className="text-[var(--text-gray)]">{dict.noHighlights}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {highlights.map((h) => (
                  <div key={h.id} className="bg-white rounded-xl border border-[var(--border-light)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">
                        {h.book_title} &mdash; {h.chapter_title}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-dark)] border-l-2 border-amber-400 pl-3">
                      &ldquo;{h.text}&rdquo;
                    </p>
                    {h.note && (
                      <p className="text-xs text-[var(--text-gray)] mt-2 pl-3">{dict.note}: {h.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--navy-dark)] mb-6">{dict.profileSettings}</h1>

            {/* Account Details Table */}
            <div className="bg-white rounded-2xl border border-[var(--border-light)] p-6 mb-6">
              <h2 className="text-lg font-bold text-[var(--navy-dark)] mb-4">{dict.accountDetails}</h2>
              {saveMsg && <p className="text-sm text-green-600 mb-3">{saveMsg}</p>}

              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="py-3 font-medium text-[var(--text-gray)] w-40">{dict.name}</td>
                    <td className="py-3 text-[var(--text-dark)]">
                      {editing ? (
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="border border-[var(--border-light)] rounded-lg px-3 py-1.5 text-sm w-full max-w-xs" />
                      ) : user.name}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="py-3 font-medium text-[var(--text-gray)]">{dict.email}</td>
                    <td className="py-3 text-[var(--text-dark)]">
                      {editing ? (
                        <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="border border-[var(--border-light)] rounded-lg px-3 py-1.5 text-sm w-full max-w-xs" />
                      ) : user.email}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="py-3 font-medium text-[var(--text-gray)]">{dict.subscription}</td>
                    <td className="py-3">
                      {isPremium ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                          <Crown className="w-3 h-3" /> {dict.premium}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          {dict.freePlan}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-[var(--text-gray)]">{dict.memberSince}</td>
                    <td className="py-3 text-[var(--text-dark)]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 flex gap-3">
                {editing ? (
                  <>
                    <button onClick={handleSaveProfile} className="text-sm font-semibold text-white bg-[var(--navy-dark)] px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">{dict.save}</button>
                    <button onClick={() => { setEditing(false); setEditName(user.name); setEditEmail(user.email); }} className="text-sm font-semibold text-[var(--text-gray)] border border-[var(--border-light)] px-5 py-2 rounded-lg hover:bg-[var(--bg-light)] transition-colors">{dict.cancel}</button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="text-sm font-semibold text-[var(--navy-dark)] border border-[var(--navy-dark)] px-5 py-2 rounded-lg hover:bg-[var(--navy-dark)] hover:text-white transition-colors">
                    {dict.editProfile}
                  </button>
                )}
              </div>
            </div>

            {/* Subscription */}
            {!isPremium && (
              <div className="bg-white rounded-2xl border border-[var(--border-light)] p-6 mb-6">
                <h2 className="text-lg font-bold text-[var(--navy-dark)] mb-3">{dict.subscription}</h2>
                <p className="text-sm text-[var(--text-gray)] mb-4">{dict.upgradeDescription}</p>
                <button onClick={handleUpgrade} className="bg-[var(--blue-accent)] text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  {dict.upgradePremium}
                </button>
              </div>
            )}

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-[var(--border-light)] p-6">
              <h2 className="text-lg font-bold text-[var(--navy-dark)] mb-4">{dict.preferences}</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[var(--text-gray)]" />
                    <span className="text-sm text-[var(--text-dark)]">{dict.emailPreferences}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--navy-dark)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[var(--text-gray)]" />
                    <span className="text-sm text-[var(--text-dark)]">{dict.language}</span>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">{lang.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Moon className="w-4 h-4 text-[var(--text-gray)]" />
                    <span className="text-sm text-[var(--text-dark)]">{dict.darkMode}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--navy-dark)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

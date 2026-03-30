const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("jcm-token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: "free" | "premium";
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  chapter_count: number;
}

export interface Chapter {
  id: string;
  book_id: string;
  number: number;
  title: string;
  is_free: number;
}

export interface ChapterContent extends Chapter {
  content: string;
  locked: boolean;
}

export interface ReadingProgress {
  user_id: string;
  book_id: string;
  book_title: string;
  book_slug: string;
  current_chapter: number;
  progress_percent: number;
  total_chapters: number;
}

export interface Highlight {
  id: string;
  user_id: string;
  chapter_id: string;
  text: string;
  start_offset: number;
  end_offset: number;
  note: string;
  created_at: string;
  chapter_number?: number;
  chapter_title?: string;
  book_title?: string;
  book_slug?: string;
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      apiFetch<{ token: string; user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      apiFetch<{ token: string; user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => apiFetch<{ user: User }>("/api/auth/me"),
    forgotPassword: (email: string) =>
      apiFetch<{ message: string; resetToken?: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (token: string, password: string) =>
      apiFetch<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
  },
  books: {
    list: () => apiFetch<{ books: Book[] }>("/api/books"),
    get: (slug: string) => apiFetch<{ book: Book; chapters: Chapter[] }>(`/api/books/${slug}`),
    chapter: (slug: string, number: number) =>
      apiFetch<{ chapter: ChapterContent }>(`/api/books/${slug}/chapters/${number}`),
  },
  users: {
    update: (data: Partial<{ name: string; email: string }>) =>
      apiFetch<{ user: User }>("/api/users/me", { method: "PUT", body: JSON.stringify(data) }),
    upgradeSubscription: () =>
      apiFetch<{ user: User }>("/api/users/me/subscription", { method: "PUT" }),
    progress: () => apiFetch<{ progress: ReadingProgress[] }>("/api/users/me/progress"),
    updateProgress: (bookSlug: string, data: { current_chapter: number; progress_percent: number }) =>
      apiFetch<{ success: boolean }>(`/api/users/me/progress/${bookSlug}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  highlights: {
    list: (chapterId?: string) =>
      apiFetch<{ highlights: Highlight[] }>(`/api/users/me/highlights${chapterId ? `?chapterId=${chapterId}` : ""}`),
    create: (data: { chapter_id: string; text: string; start_offset: number; end_offset: number; note: string }) =>
      apiFetch<{ highlight: Highlight }>("/api/users/me/highlights", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: { note: string }) =>
      apiFetch<{ highlight: Highlight }>(`/api/users/me/highlights/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/users/me/highlights/${id}`, { method: "DELETE" }),
  },
};

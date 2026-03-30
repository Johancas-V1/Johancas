"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface ForgotPasswordDict {
  title: string;
  description: string;
  email: string;
  sendResetLink: string;
  backToSignIn: string;
  emailSent: string;
  emailSentDescription: string;
  error: string;
}

export default function ForgotPasswordForm({ dict, lang }: { dict: ForgotPasswordDict; lang: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.error);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">
        <h1 className="text-3xl font-extrabold text-[var(--navy-dark)] mb-4">{dict.emailSent}</h1>
        <p className="text-sm text-[var(--text-gray)] mb-6">{dict.emailSentDescription}</p>

        <Link
          href={`/${lang}/signin`}
          className="block text-center text-sm text-[var(--blue-accent)] hover:underline"
        >
          {dict.backToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">
      <h1 className="text-3xl font-extrabold text-[var(--navy-dark)] mb-3">{dict.title}</h1>
      <p className="text-sm text-[var(--text-gray)] mb-8">{dict.description}</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--navy-dark)] mb-1.5">{dict.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.email}
            className="w-full h-12 px-4 rounded-lg border border-[var(--border-light)] bg-white text-[15px] text-[var(--text-dark)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--blue-accent)] focus:ring-1 focus:ring-[var(--blue-accent)] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[var(--navy-dark)] text-white text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : dict.sendResetLink}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-gray)]">
        <Link href={`/${lang}/signin`} className="font-semibold text-[var(--navy-dark)] hover:underline">
          {dict.backToSignIn}
        </Link>
      </p>
    </div>
  );
}

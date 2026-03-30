"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordDict {
  title: string;
  newPassword: string;
  confirmPassword: string;
  resetPassword: string;
  backToSignIn: string;
  success: string;
  successDescription: string;
  goToSignIn: string;
  passwordMin: string;
  passwordMismatch: string;
  invalidToken: string;
  error: string;
}

export default function ResetPasswordForm({ dict, lang }: { dict: ResetPasswordDict; lang: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">
        <h1 className="text-3xl font-extrabold text-[var(--navy-dark)] mb-4">{dict.invalidToken}</h1>
        <Link
          href={`/${lang}/forgot-password`}
          className="block text-center text-sm text-[var(--blue-accent)] hover:underline"
        >
          {dict.backToSignIn}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(dict.passwordMin);
      return;
    }
    if (password !== confirmPassword) {
      setError(dict.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword(token, password);
      setSuccess(true);
    } catch {
      setError(dict.error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">
        <h1 className="text-3xl font-extrabold text-[var(--navy-dark)] mb-4">{dict.success}</h1>
        <p className="text-sm text-[var(--text-gray)] mb-6">{dict.successDescription}</p>
        <Link
          href={`/${lang}/signin`}
          className="block w-full text-center h-12 leading-[3rem] bg-[var(--navy-dark)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          {dict.goToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">
      <h1 className="text-3xl font-extrabold text-[var(--navy-dark)] mb-8">{dict.title}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--navy-dark)] mb-1.5">{dict.newPassword}</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={dict.newPassword}
              className="w-full h-12 px-4 pr-12 rounded-lg border border-[var(--border-light)] bg-white text-[15px] text-[var(--text-dark)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--blue-accent)] focus:ring-1 focus:ring-[var(--blue-accent)] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--navy-dark)] mb-1.5">{dict.confirmPassword}</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={dict.confirmPassword}
            className="w-full h-12 px-4 rounded-lg border border-[var(--border-light)] bg-white text-[15px] text-[var(--text-dark)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--blue-accent)] focus:ring-1 focus:ring-[var(--blue-accent)] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[var(--navy-dark)] text-white text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : dict.resetPassword}
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

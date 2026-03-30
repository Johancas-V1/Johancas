"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

interface SignUpDict {
  signUp: string;
  fullName: string;
  email: string;
  password: string;
  createAccount: string;
  signUpGoogle: string;
  alreadyHaveAccount: string;
  logIn: string;
  passwordMin: string;
  registrationFailed: string;
}

export default function SignUpForm({ dict, lang }: { dict: SignUpDict; lang: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(dict.passwordMin);
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push(`/${lang}/dashboard`);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : dict.registrationFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-10">
      <h1 className="text-3xl font-extrabold text-[var(--navy-dark)] mb-8">{dict.signUp}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--navy-dark)] mb-1.5">{dict.fullName}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.fullName}
            className="w-full h-12 px-4 rounded-lg border border-[var(--border-light)] bg-white text-[15px] text-[var(--text-dark)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--blue-accent)] focus:ring-1 focus:ring-[var(--blue-accent)] transition-all"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-[var(--navy-dark)] mb-1.5">{dict.password}</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={dict.password}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[var(--navy-dark)] text-white text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : dict.createAccount}
        </button>

        <button type="button" className="w-full h-12 bg-white border border-[var(--border-light)] text-[var(--text-dark)] text-base font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
          <GoogleIcon />
          {dict.signUpGoogle}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-gray)]">
        {dict.alreadyHaveAccount}{" "}
        <Link href={`/${lang}/signin`} className="font-semibold text-[var(--navy-dark)] hover:underline">
          {dict.logIn}
        </Link>
      </p>
    </div>
  );
}

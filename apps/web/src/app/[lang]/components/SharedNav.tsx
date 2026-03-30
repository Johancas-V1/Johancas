"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import LanguageSelector from "../LanguageSelector";
import { useAuth } from "@/lib/auth-context";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.21 8.21 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.51" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 010-10 2 2 0 011.4-1.4 49.56 49.56 0 0116.2 0A2 2 0 0121.5 7a24.12 24.12 0 010 10 2 2 0 01-1.4 1.4 49.55 49.55 0 01-16.2 0A2 2 0 012.5 17" /><path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialIcons({ size = "w-4 h-4" }: { size?: string }) {
  return (
    <>
      <TikTokIcon className={`${size} text-white`} />
      <InstagramIcon className={`${size} text-white`} />
      <YoutubeIcon className={`${size} text-white`} />
      <XIcon className={`${size} text-white`} />
    </>
  );
}

interface NavDict {
  books: string;
  blog: string;
  about: string;
  subscribe: string;
  createAccount: string;
  signIn: string;
}

export default function SharedNav({ dict, lang }: { dict: NavDict; lang: string }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <div className="bg-[var(--navy-dark)] flex items-center justify-between px-5 md:px-10 py-2.5">
        <div className="flex items-center gap-4">
          <SocialIcons size="w-4 h-4" />
        </div>
        <div className="flex items-center gap-5 text-white text-[13px]">
          {isAuthenticated ? (
            <Link href={`/${lang}/dashboard`} className="hover:opacity-80 transition-opacity">
              {user?.name || "Dashboard"}
            </Link>
          ) : (
            <>
              <Link href={`/${lang}/signup`} className="hidden sm:inline hover:opacity-80 transition-opacity">{dict.createAccount}</Link>
              <Link href={`/${lang}/signin`} className="hover:opacity-80 transition-opacity">{dict.signIn}</Link>
            </>
          )}
        </div>
      </div>

      <nav className="bg-white flex items-center justify-between px-5 md:px-10 py-3.5 border-b border-[var(--border-light)]">
        <Link href={`/${lang}`} className="text-[15px] font-bold text-[var(--navy-dark)] hidden md:inline hover:opacity-80 transition-opacity">
          JCM - Johan Castellanos Memos
        </Link>
        <Link href={`/${lang}`} className="text-[18px] font-extrabold text-[var(--navy-dark)] md:hidden">
          JCM
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link href={`/${lang}/books`} className="text-sm font-medium text-[var(--text-dark)] hover:opacity-70 transition-opacity">{dict.books}</Link>
          <Link href={`/${lang}#blog`} className="text-sm font-medium text-[var(--text-dark)] hover:opacity-70 transition-opacity">{dict.blog}</Link>
          <Link href={`/${lang}/about`} className="text-sm font-medium text-[var(--text-dark)] hover:opacity-70 transition-opacity">{dict.about}</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageSelector currentLang={lang} />
          </div>
          {isAuthenticated ? (
            <Link href={`/${lang}/dashboard`} className="bg-[var(--navy-dark)] text-white text-[13px] font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <Link href={`/${lang}/signup`} className="bg-[var(--navy-dark)] text-white text-[13px] font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity">
              {dict.subscribe}
            </Link>
          )}
          <Menu className="w-6 h-6 text-[var(--navy-dark)] md:hidden cursor-pointer" />
        </div>
      </nav>
    </>
  );
}

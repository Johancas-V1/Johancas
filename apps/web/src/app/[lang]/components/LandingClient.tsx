"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface NavLabels {
  books: string;
  blog: string;
  about: string;
  subscribe: string;
  createAccount: string;
  signIn: string;
}

const textLink = "editorial-link text-[19px] tracking-[-0.02em]";

export function HeroActions({ lang, dict }: { lang: string; dict: NavLabels }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-start gap-[14px]">
      <Link className={textLink} href={`/${lang}/books`}>
        {dict.books}
      </Link>
      <Link className={textLink} href={`/${lang}#blog`}>
        {dict.blog}
      </Link>
      <Link className={textLink} href={`/${lang}/about`}>
        {dict.about}
      </Link>
      {isAuthenticated ? (
        <Link className="ink-button mt-2 h-11 px-5 text-[16px]" href={`/${lang}/dashboard`}>
          Dashboard
        </Link>
      ) : (
        <>
          <Link className={textLink} href={`/${lang}/signin`}>
            {dict.signIn}
          </Link>
          <Link className={textLink} href={`/${lang}/signup`}>
            {dict.createAccount}
          </Link>
          <Link className="ink-button mt-2 h-11 px-5 text-[16px]" href={`/${lang}/signup`}>
            {dict.subscribe}
          </Link>
        </>
      )}
    </div>
  );
}

export function MemoSubscribeForm({
  title,
  placeholder,
  button,
}: {
  title: string;
  placeholder: string;
  button: string;
}) {
  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
      <h2 className="text-left font-domaine-display text-[clamp(2rem,3.5vw,3.4rem)] font-medium leading-[0.92] tracking-[-0.035em] text-ink-black">
        {title}
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="memo-email">
          {placeholder}
        </label>
        <input
          id="memo-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          className="h-12 w-full rounded-buttons border border-ink-black bg-parchment px-3 font-editorial-new text-[16px] font-light tracking-[-0.01em] text-ink-black outline-none placeholder:text-charcoal focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink-black sm:max-w-[280px]"
        />
        <button type="submit" className="ink-button h-12 px-6 text-[16px]">
          {button}
        </button>
      </div>
    </form>
  );
}

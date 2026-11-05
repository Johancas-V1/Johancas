"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSelector from "../LanguageSelector";
import { useAuth } from "@/lib/auth-context";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.21 8.21 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialIcons({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <>
      <TikTokIcon className={className} />
      <InstagramIcon className={className} />
      <YoutubeIcon className={className} />
      <XIcon className={className} />
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
  menu: string;
  closeMenu: string;
}

function MenuMark({ open }: { open: boolean }) {
  if (open) {
    return (
      <span aria-hidden="true" className="font-editorial-new text-[32px] font-light leading-none text-ink-black">
        ×
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="flex flex-col gap-[5px]">
      <span className="block h-px w-6 bg-ink-black" />
      <span className="block h-px w-6 bg-ink-black" />
      <span className="block h-px w-6 bg-ink-black" />
    </span>
  );
}

export default function SharedNav({
  dict,
  lang,
  dateline,
}: {
  dict: NavDict;
  lang: string;
  dateline?: string;
}) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPath(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const sectionLinks = [
    { href: `/${lang}/books`, label: dict.books },
    { href: `/${lang}#blog`, label: dict.blog },
    { href: `/${lang}/about`, label: dict.about },
  ];

  return (
    <header className="border-b border-ink-black bg-parchment text-ink-black">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
          <p className="hidden font-editorial-new text-[16px] font-light leading-[1.2] tracking-[-0.02em] lg:block xl:text-[19px]">
            {dateline ?? "JCM"}
          </p>
          <Link
            href={`/${lang}`}
            className="text-center font-editorial-new text-[19px] font-light tracking-[-0.03em] text-ink-black hover:text-pure-black md:text-[20px]"
          >
            <span className="md:hidden">JCM</span>
            <span className="hidden md:inline">Johan Castellanos Memos</span>
          </Link>
          <div className="flex items-center justify-end gap-4 md:gap-5">
            <div className="hidden items-center gap-5 md:flex">
              {isAuthenticated ? (
                <>
                  <Link href={`/${lang}/dashboard`} className="editorial-link max-w-[16ch] truncate text-[16px]">
                    {user?.name || "Dashboard"}
                  </Link>
                  <Link href={`/${lang}/dashboard`} className="ink-button h-10 px-4 text-[15px]">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/${lang}/signup`} className="editorial-link hidden text-[16px] xl:inline">
                    {dict.createAccount}
                  </Link>
                  <Link href={`/${lang}/signin`} className="editorial-link text-[16px]">
                    {dict.signIn}
                  </Link>
                  <Link href={`/${lang}/signup`} className="ink-button h-10 px-4 text-[15px]">
                    {dict.subscribe}
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center md:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpenPath(open ? null : pathname)}
            >
              <span className="sr-only">{open ? dict.closeMenu : dict.menu}</span>
              <MenuMark open={open} />
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-6 border-t border-ink-black py-2 md:flex">
          <nav className="flex items-center gap-7">
            {sectionLinks.map((item) => (
              <Link key={item.href} href={item.href} className="editorial-link text-[16px] tracking-[-0.02em] xl:text-[19px]">
                {item.label}
              </Link>
            ))}
          </nav>
          <LanguageSelector currentLang={lang} />
        </div>
      </div>

      {open && (
        <div id="site-menu" className="border-t border-ink-black bg-bone-cream md:hidden">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-4 px-5 py-5">
            {dateline && (
              <p className="font-editorial-new text-[14px] font-light tracking-caption text-charcoal">{dateline}</p>
            )}
            {sectionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="editorial-link text-[19px]"
                onClick={() => setOpenPath(null)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link href={`/${lang}/dashboard`} className="ink-button h-11 px-5 text-[16px]" onClick={() => setOpenPath(null)}>
                {user?.name || "Dashboard"}
              </Link>
            ) : (
              <>
                <Link href={`/${lang}/signin`} className="editorial-link text-[19px]" onClick={() => setOpenPath(null)}>
                  {dict.signIn}
                </Link>
                <Link href={`/${lang}/signup`} className="editorial-link text-[19px]" onClick={() => setOpenPath(null)}>
                  {dict.createAccount}
                </Link>
                <Link href={`/${lang}/signup`} className="ink-button h-11 px-5 text-[16px]" onClick={() => setOpenPath(null)}>
                  {dict.subscribe}
                </Link>
              </>
            )}
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      )}
    </header>
  );
}

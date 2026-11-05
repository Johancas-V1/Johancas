"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function persistLocale(code: string) {
  document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
}

const languages = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "pt", label: "PT", flag: "🇵🇹" },
  { code: "ja", label: "JA", flag: "🇯🇵" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "zh", label: "ZH", flag: "🇨🇳" },
];

export default function LanguageSelector({ currentLang }: { currentLang: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languages.find((language) => language.code === currentLang) ?? languages[0];

  function switchLang(code: string) {
    persistLocale(code);
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 rounded-buttons border border-ink-black bg-parchment px-3 py-1.5 font-editorial-new text-[14px] font-light tracking-caption text-ink-black hover:bg-bone-cream"
      >
        <span aria-hidden="true">{current.flag}</span>
        {current.label}
        <ChevronDown className={`h-3.5 w-3.5 text-ink-black transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={current.label}
          className="absolute right-0 top-full z-50 mt-1 min-w-[108px] rounded-buttons border border-ink-black bg-bone-cream py-1"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={language.code === currentLang}
              onClick={() => switchLang(language.code)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-editorial-new text-[14px] font-light tracking-caption ${
                language.code === currentLang
                  ? "bg-parchment text-ink-black"
                  : "text-charcoal hover:bg-parchment hover:text-ink-black"
              }`}
            >
              <span aria-hidden="true">{language.flag}</span>
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

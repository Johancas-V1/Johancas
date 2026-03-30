"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languages.find((l) => l.code === currentLang) ?? languages[0];

  function switchLang(code: string) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-[var(--border-light)] text-[13px] font-medium text-[var(--text-dark)] hover:bg-gray-50 transition-colors"
      >
        <span>{current.flag}</span>
        {current.label}
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-gray)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.1)] border border-[var(--border-light)] py-2 px-3 z-50 min-w-[90px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-[13px] font-medium transition-colors ${
                lang.code === currentLang
                  ? "text-[var(--navy-dark)] bg-[var(--bg-light)]"
                  : "text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

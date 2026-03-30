import Link from "next/link";
import { SocialIcons } from "./SharedNav";

interface FooterDict {
  books: string;
  resources: string;
  blogs: string;
  jcm: string;
  tc: string;
  privacy: string;
  about: string;
  buyOnAmazon: string;
  bookTitle1: string;
  bookTitle2: string;
}

export default function SharedFooter({ dict, lang }: { dict: FooterDict; lang: string }) {
  return (
    <footer className="bg-[var(--navy-dark)] px-6 md:px-16 py-10 flex flex-col gap-8">
      <div className="max-w-6xl mx-auto w-full flex flex-wrap justify-between gap-8">
        <div className="flex flex-col gap-3">
          <h4 className="text-[16px] font-bold text-white">{dict.books}</h4>
          <Link href={`/${lang}/books/the-great-famine`} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">{dict.bookTitle1}</Link>
          <Link href={`/${lang}/books/clay-and-iron`} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">{dict.bookTitle2}</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-[16px] font-bold text-white">{dict.resources}</h4>
          <Link href={`/${lang}#blog`} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">{dict.blogs}</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-[16px] font-bold text-white">{dict.jcm}</h4>
          <Link href={`/${lang}/terms`} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">{dict.tc}</Link>
          <Link href={`/${lang}/privacy`} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">{dict.privacy}</Link>
          <Link href={`/${lang}/about`} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">{dict.about}</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full h-px bg-white/10" />

      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-5">
          <SocialIcons size="w-5 h-5" />
        </div>
        <button className="bg-[var(--blue-accent)] text-white text-[15px] font-bold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity">
          {dict.buyOnAmazon}
        </button>
      </div>
    </footer>
  );
}

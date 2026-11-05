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
    <footer className="border-t border-ink-black bg-parchment text-ink-black">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-[minmax(0,1.4fr)_auto] md:px-10 md:py-14">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-editorial-new text-[16px] font-light tracking-[-0.02em]">{dict.books}</h2>
            <Link href={`/${lang}/books/the-great-famine`} className="editorial-link text-[16px]">
              {dict.bookTitle1}
            </Link>
            <Link href={`/${lang}/books/clay-and-iron`} className="editorial-link text-[16px]">
              {dict.bookTitle2}
            </Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-editorial-new text-[16px] font-light tracking-[-0.02em]">{dict.resources}</h2>
            <Link href={`/${lang}#blog`} className="editorial-link text-[16px]">
              {dict.blogs}
            </Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-editorial-new text-[16px] font-light tracking-[-0.02em]">{dict.jcm}</h2>
            <Link href={`/${lang}/terms`} className="editorial-link text-[16px]">
              {dict.tc}
            </Link>
            <Link href={`/${lang}/privacy`} className="editorial-link text-[16px]">
              {dict.privacy}
            </Link>
            <Link href={`/${lang}/about`} className="editorial-link text-[16px]">
              {dict.about}
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 md:items-end md:justify-between">
          <div className="flex items-center gap-5 text-ink-black" aria-hidden="true">
            <SocialIcons className="h-5 w-5" />
          </div>
          <button type="button" className="ink-button h-12 px-6 text-[16px]">
            {dict.buyOnAmazon}
          </button>
        </div>
      </div>
    </footer>
  );
}

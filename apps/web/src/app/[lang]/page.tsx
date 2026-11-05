import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import SharedNav from "./components/SharedNav";
import SharedFooter from "./components/SharedFooter";
import { InkBanner, NewBadge, PressStamp } from "./components/MirandaMarks";
import { HeroActions, MemoSubscribeForm } from "./components/LandingClient";

const articleSlugs = [
  "global-economics",
  "end-time-prophecies",
  "faith-changing-world",
  "new-power-structures",
];

const articleImages = [
  "/images/card-economics.png",
  "/images/card-prophecies.png",
  "/images/card-faith.png",
  "/images/card-power.png",
];

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <main className="flex min-h-full flex-col bg-parchment text-ink-black">
      <SharedNav dict={dict.nav} lang={lang} dateline={dict.hero.bullet1} />

      <section className="mx-auto w-full max-w-[1440px] px-5 pb-4 pt-8 md:px-10 md:pt-10">
        <p className="font-editorial-new text-caption font-light tracking-caption text-charcoal">
          {dict.hero.bullet1}
          <span aria-hidden="true"> · </span>
          {dict.hero.bullet2}
          <span aria-hidden="true"> · </span>
          {dict.hero.bullet3}
        </p>
        <h1 className="mt-3 max-w-[18ch] text-balance font-canopee text-[clamp(3.25rem,8.2vw,7.625rem)] font-bold leading-[0.78] tracking-[-0.055em] text-ink-black">
          {dict.hero.title}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-[14px] lg:h-[480px] lg:grid-cols-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.png"
            alt={dict.hero.title}
            className="h-[240px] w-full rounded-images object-cover lg:h-full"
          />
          <div className="flex min-h-[220px] flex-col items-center justify-center bg-bone-cream px-6 py-8 text-center">
            <p className="font-germgoth text-[clamp(4.75rem,8vw,7.5rem)] leading-none tracking-[-0.004em] text-ink-black">
              JCM
            </p>
            <p className="mt-4 font-editorial-new text-[16px] font-light leading-[1.35] tracking-[-0.015em] text-charcoal">
              {dict.hero.bullet1}
              <br />
              {dict.hero.bullet2}
              <br />
              {dict.hero.bullet3}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/card-prophecies.png"
            alt={dict.articles[1]?.title ?? dict.hero.bullet1}
            className="h-[240px] w-full rounded-images object-cover lg:h-full"
          />
        </div>

        <div className="mt-10 grid gap-10 border-t border-ink-black pt-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(220px,0.7fr)] lg:gap-16">
          <p className="drop-cap max-w-[68ch] font-editorial-new text-[17px] font-light leading-[1.45] tracking-[-0.015em] text-ink-black">
            {dict.hero.description}
          </p>
          <div className="flex flex-col items-start gap-8">
            <PressStamp />
            <HeroActions lang={lang} dict={dict.nav} />
          </div>
        </div>
      </section>

      <div className="mt-[43px]">
        <InkBanner word="MEMOS" />
      </div>

      <section id="books" className="mx-auto w-full max-w-[1440px] px-5 py-[43px] md:px-10">
        <div className="grid items-start gap-[43px] lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="grid gap-[22px] sm:grid-cols-2">
            <Link href={`/${lang}/books/the-great-famine`} className="group flex h-full flex-col bg-bone-cream shadow-sheet">
              <div className="flex h-[340px] items-center justify-center bg-ink-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/book-cover.png"
                  alt={dict.footer.bookTitle1}
                  className="h-full w-auto max-w-full rounded-images object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col gap-[14px] p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-editorial-new text-[20px] font-light leading-[1.2] tracking-[-0.02em] text-ink-black">
                    {dict.footer.bookTitle1}
                  </h3>
                  <NewBadge />
                </div>
                <p className="line-clamp-3 font-editorial-new text-body-sm font-light tracking-body-sm text-ink-black">
                  {dict.bookHome.storyDescription}
                </p>
                <p className="font-editorial-new text-caption font-light tracking-caption text-charcoal">
                  {dict.books.free}
                  <span aria-hidden="true"> · </span>
                  {dict.books.premium}
                </p>
                <span className="editorial-link w-fit text-[16px]">{dict.books.readNow}</span>
              </div>
            </Link>

            <Link href={`/${lang}/books/clay-and-iron`} className="group flex h-full flex-col bg-bone-cream shadow-sheet">
              <div className="flex h-[340px] items-end bg-ink-black p-6">
                <p className="font-canopee text-[clamp(2.6rem,4vw,3.6rem)] font-bold leading-[0.8] tracking-[-0.05em] text-parchment">
                  {dict.footer.bookTitle2}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-[14px] p-6">
                <h3 className="font-editorial-new text-[20px] font-light leading-[1.2] tracking-[-0.02em] text-ink-black">
                  {dict.footer.bookTitle2}
                </h3>
                <p className="font-editorial-new text-caption font-light tracking-caption text-charcoal">
                  {dict.books.free}
                  <span aria-hidden="true"> · </span>
                  {dict.books.premium}
                </p>
                <span className="editorial-link w-fit text-[16px]">{dict.books.readNow}</span>
              </div>
            </Link>
          </div>

          <MemoSubscribeForm
            title={dict.book.subscribeTitle}
            placeholder={dict.book.emailPlaceholder}
            button={dict.book.sendButton}
          />
        </div>
      </section>

      <InkBanner word="JCM" prominent />

      <section id="blog" className="mx-auto w-full max-w-[1440px] px-5 py-[43px] md:px-10">
        <h2 className="mb-8 font-canopee text-[clamp(3rem,7vw,5.4rem)] font-bold leading-[0.82] tracking-[-0.05em] text-ink-black">
          {dict.nav.blog}
        </h2>
        <div className="grid grid-cols-1 gap-x-[22px] gap-y-[36px] md:grid-cols-2">
          {dict.articles.map((article, index) => (
            <Link key={articleSlugs[index]} href={`/${lang}/blog/${articleSlugs[index]}`} className="group block bg-bone-cream shadow-sheet">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={articleImages[index]}
                alt={article.title}
                className="aspect-[16/10] w-full rounded-images object-cover"
              />
              <div className="flex flex-col gap-[14px] p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-editorial-new text-[20px] font-light leading-[1.2] tracking-[-0.02em] text-ink-black">
                    {article.title}
                  </h3>
                  {index === 0 && <NewBadge />}
                </div>
                <p className="font-editorial-new text-body-sm font-light tracking-body-sm text-ink-black">
                  {article.description}
                </p>
                <p className="font-editorial-new text-caption font-light tracking-caption text-charcoal">
                  JCM
                  <span aria-hidden="true"> · </span>
                  {dict.nav.blog}
                </p>
                <span className="editorial-link w-fit text-[16px]">{dict.readMore}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SharedFooter dict={dict.footer} lang={lang} />
    </main>
  );
}

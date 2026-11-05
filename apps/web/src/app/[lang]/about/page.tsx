import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import SharedNav from "../components/SharedNav";
import SharedFooter from "../components/SharedFooter";

const channels = ["YouTube", "Instagram", "TikTok", "X"] as const;

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const about = dict.about;

  return (
    <main className="flex min-h-full flex-col bg-parchment text-ink-black">
      <SharedNav dict={dict.nav} lang={lang} />

      <article className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-10 md:py-[43px]">
        <p className="font-editorial-new text-caption font-light tracking-caption text-charcoal">JCM</p>
        <h1 className="mt-3 max-w-[18ch] font-canopee text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.84] tracking-[-0.05em] text-ink-black">
          {about.title}
        </h1>

        <div className="mt-10 grid items-start gap-10 border-t border-ink-black pt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.62fr)] lg:gap-16">
          <div className="flex max-w-[68ch] flex-col gap-6 font-editorial-new text-[17px] font-light leading-[1.45] tracking-[-0.015em] text-ink-black">
            <p className="drop-cap">{about.paragraph1}</p>
            <p>
              {about.paragraph2Before}
              <em className="italic">{about.bookTitle}</em>
              {about.paragraph2After}
            </p>
            <p>
              {about.purposeBefore}
              <strong className="font-semibold">{about.purposeEmphasis}</strong>
            </p>
            <p>{about.paragraph4}</p>
            <p>
              <a href="https://johancas.com" className="editorial-link">
                johancas.com
              </a>
              {about.siteAfterBefore}
              {about.bookTitle}
              {about.siteAfterAfter}
            </p>
          </div>

          <aside className="flex flex-col items-start gap-8">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/book-cover.png"
                alt={about.bookTitle}
                className="h-auto w-full max-w-[280px] rounded-images object-contain"
              />
              <figcaption className="mt-4 font-canopee text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-[0.86] tracking-[-0.045em] text-ink-black">
                {about.bookTitle}
              </figcaption>
            </figure>
            <div>
              <h2 className="font-editorial-new text-[16px] font-light tracking-[-0.02em]">{about.connectTitle}</h2>
              <p className="mt-3 font-editorial-new text-caption font-light tracking-caption text-charcoal">
                {channels.join(" · ")}
              </p>
            </div>
          </aside>
        </div>
      </article>

      <SharedFooter dict={dict.footer} lang={lang} />
    </main>
  );
}

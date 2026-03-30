import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import SharedNav from "./components/SharedNav";
import SharedFooter from "./components/SharedFooter";

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
    <main className="flex flex-col min-h-full">
      <SharedNav dict={dict.nav} lang={lang} />

      {/* Hero Section */}
      <section className="bg-[var(--bg-light)] px-6 md:px-16 py-10 md:py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-3xl md:text-[42px] font-extrabold text-[var(--navy-dark)] leading-[1.1]">
              {dict.hero.title}
            </h1>
            <p className="text-[15px] text-[var(--text-gray)] leading-relaxed">
              {dict.hero.description}
            </p>
            <div className="flex flex-col gap-3">
              {[dict.hero.bullet1, dict.hero.bullet2, dict.hero.bullet3].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CircleCheck className="w-5 h-5 text-[var(--green-check)] shrink-0" />
                  <span className="text-[15px] font-medium text-[var(--text-dark)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero.png"
              alt={dict.hero.title}
              className="w-full h-[240px] md:h-[380px] object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Book / Subscribe Section */}
      <section id="books" className="bg-white px-6 md:px-16 py-12 md:py-14">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/book-cover.png"
              alt={dict.footer.bookTitle1}
              className="w-[200px] h-[280px] md:w-[240px] md:h-[340px] object-cover rounded-lg shadow-[4px_8px_24px_rgba(0,0,0,0.15)]"
            />
          </div>
          <div className="flex flex-col gap-6 w-full md:max-w-[500px]">
            <h2 className="text-[22px] md:text-[28px] font-bold text-[var(--navy-dark)] leading-[1.3] text-center md:text-left">
              {dict.book.subscribeTitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={dict.book.emailPlaceholder}
                className="h-[48px] w-full sm:w-[260px] px-4 rounded-[10px] border border-[var(--border-light)] bg-white text-[15px] text-[var(--text-dark)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--blue-accent)] focus:ring-1 focus:ring-[var(--blue-accent)] transition-all"
              />
              <button className="h-[48px] px-8 bg-[var(--navy-dark)] text-white text-[15px] font-semibold rounded-[10px] hover:opacity-90 transition-opacity whitespace-nowrap">
                {dict.book.sendButton}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section id="blog" className="bg-[var(--bg-light)] px-6 md:px-[100px] py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-6xl mx-auto">
          {dict.articles.map((article, i) => (
            <Link key={i} href={`/${lang}/blog/${articleSlugs[i]}`} className="group">
              <article className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={articleImages[i]}
                  alt={article.title}
                  className="w-full h-[180px] md:h-[200px] object-cover"
                />
                <div className="p-5 flex flex-col gap-2.5">
                  <h3 className="text-[17px] font-bold text-[var(--navy-dark)] group-hover:text-[var(--blue-accent)] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-gray)] leading-relaxed">
                    {article.description}
                  </p>
                  <span className="text-[13px] font-semibold text-[var(--navy-dark)] underline group-hover:opacity-70 transition-opacity">
                    {dict.readMore}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <SharedFooter dict={dict.footer} lang={lang} />
    </main>
  );
}

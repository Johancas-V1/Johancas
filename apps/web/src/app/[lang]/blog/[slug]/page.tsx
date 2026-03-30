import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../../dictionaries";
import SharedNav from "../../components/SharedNav";
import SharedFooter from "../../components/SharedFooter";

const slugs = ["global-economics", "end-time-prophecies", "faith-changing-world", "new-power-structures"] as const;
type Slug = (typeof slugs)[number];

const articleImages: Record<Slug, string> = {
  "global-economics": "/images/card-economics.png",
  "end-time-prophecies": "/images/card-prophecies.png",
  "faith-changing-world": "/images/card-faith.png",
  "new-power-structures": "/images/card-power.png",
};

const slugIndex: Record<Slug, number> = {
  "global-economics": 0,
  "end-time-prophecies": 1,
  "faith-changing-world": 2,
  "new-power-structures": 3,
};

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  if (!slugs.includes(slug as Slug)) notFound();

  const dict = await getDictionary(lang);
  const idx = slugIndex[slug as Slug];
  const article = dict.articles[idx];
  const blogDict = dict.blog;

  const relatedSlugs = slugs.filter((s) => s !== slug);

  return (
    <main className="flex flex-col min-h-full">
      <SharedNav dict={dict.nav} lang={lang} />

      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={articleImages[slug as Slug]}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-dark)]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {article.title}
            </h1>
            <p className="text-sm text-white/70 mt-2">{blogDict.publishedOn} March 15, 2026</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="bg-white px-6 md:px-16 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${lang}#blog`}
            className="text-sm text-[var(--blue-accent)] font-medium hover:underline mb-8 inline-block"
          >
            &larr; {blogDict.backToBlog}
          </Link>

          <div className="prose prose-lg max-w-none">
            <p className="text-[16px] text-[var(--text-gray)] leading-relaxed mb-6">
              {article.description}
            </p>
            <p className="text-[16px] text-[var(--text-gray)] leading-relaxed mb-6">
              {blogDict.content1}
            </p>
            <p className="text-[16px] text-[var(--text-gray)] leading-relaxed mb-6">
              {blogDict.content2}
            </p>
            <p className="text-[16px] text-[var(--text-gray)] leading-relaxed mb-6">
              {blogDict.content3}
            </p>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="bg-[var(--bg-light)] px-6 md:px-16 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--navy-dark)] mb-6">{blogDict.relatedArticles}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedSlugs.map((rs) => {
              const rIdx = slugIndex[rs];
              const rArticle = dict.articles[rIdx];
              return (
                <Link key={rs} href={`/${lang}/blog/${rs}`} className="group">
                  <article className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={articleImages[rs]} alt={rArticle.title} className="w-full h-[150px] object-cover" />
                    <div className="p-4">
                      <h3 className="text-[15px] font-bold text-[var(--navy-dark)] group-hover:text-[var(--blue-accent)] transition-colors">
                        {rArticle.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SharedFooter dict={dict.footer} lang={lang} />
    </main>
  );
}

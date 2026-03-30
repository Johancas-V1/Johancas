import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import SharedNav from "../components/SharedNav";
import SharedFooter from "../components/SharedFooter";

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="flex flex-col min-h-full">
      <SharedNav dict={dict.nav} lang={lang} />

      <section className="bg-[var(--bg-light)] px-6 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/book-cover.png"
                alt="Johan Castellanos"
                className="w-48 h-48 rounded-full object-cover shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--navy-dark)] mb-4">
                {dict.about.title}
              </h1>
              <p className="text-[15px] text-[var(--text-gray)] leading-relaxed">
                {dict.about.bio}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
            <h2 className="text-2xl font-bold text-[var(--navy-dark)] mb-4">{dict.about.missionTitle}</h2>
            <p className="text-[15px] text-[var(--text-gray)] leading-relaxed mb-6">
              {dict.about.missionText}
            </p>

            <h2 className="text-2xl font-bold text-[var(--navy-dark)] mb-4">{dict.about.connectTitle}</h2>
            <div className="flex gap-4">
              <span className="text-sm text-[var(--blue-accent)] font-medium">YouTube</span>
              <span className="text-sm text-[var(--blue-accent)] font-medium">Instagram</span>
              <span className="text-sm text-[var(--blue-accent)] font-medium">TikTok</span>
              <span className="text-sm text-[var(--blue-accent)] font-medium">X (Twitter)</span>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter dict={dict.footer} lang={lang} />
    </main>
  );
}

import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import SharedNav from "../components/SharedNav";
import SharedFooter from "../components/SharedFooter";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.privacy;

  return (
    <main className="flex flex-col min-h-full">
      <SharedNav dict={dict.nav} lang={lang} />

      <section className="bg-white px-6 md:px-16 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--navy-dark)] mb-2">
            {p.title}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-10">{p.lastUpdated}</p>

          {p.sections.map((section: { heading: string; body: string }, i: number) => (
            <div key={i} className="mb-8">
              <h2 className="text-xl font-bold text-[var(--navy-dark)] mb-3">
                {i + 1}. {section.heading}
              </h2>
              <p className="text-[15px] text-[var(--text-gray)] leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SharedFooter dict={dict.footer} lang={lang} />
    </main>
  );
}

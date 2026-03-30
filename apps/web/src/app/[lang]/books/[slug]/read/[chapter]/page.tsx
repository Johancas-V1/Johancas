import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../../../dictionaries";
import ReaderClient from "./ReaderClient";

export default async function ReaderPage({ params }: { params: Promise<{ lang: string; slug: string; chapter: string }> }) {
  const { lang, slug, chapter } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <ReaderClient dict={dict.reader} lang={lang} slug={slug} chapterNum={chapter} />;
}

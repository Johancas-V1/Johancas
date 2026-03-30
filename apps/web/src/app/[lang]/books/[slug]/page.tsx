import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import BookDetailClient from "./BookDetailClient";

export default async function BookDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <BookDetailClient dict={dict.books} lang={lang} slug={slug} />;
}

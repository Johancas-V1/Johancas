import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import BooksClient from "./BooksClient";

export default async function BooksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <BooksClient dict={dict.books} lang={lang} />;
}

import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import PaywallClient from "./PaywallClient";

export default async function PaywallPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <PaywallClient dict={dict.paywall} lang={lang} />;
}

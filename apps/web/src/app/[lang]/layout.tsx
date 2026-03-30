import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "./dictionaries";
import AuthProviderWrapper from "./AuthProviderWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-primary">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}

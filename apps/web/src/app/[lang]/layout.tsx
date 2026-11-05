import { Bodoni_Moda, Pirata_One, Playfair_Display, Source_Serif_4 } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "./dictionaries";
import AuthProviderWrapper from "./AuthProviderWrapper";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const pirata = Pirata_One({
  variable: "--font-pirata",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
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
    <html
      lang={lang}
      className={`${sourceSerif.variable} ${bodoni.variable} ${playfair.variable} ${pirata.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-editorial-new">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}

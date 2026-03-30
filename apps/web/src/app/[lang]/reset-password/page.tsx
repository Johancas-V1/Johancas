import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { getDictionary, hasLocale } from "../dictionaries";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-light)] relative">
        <Link href={`/${lang}`} className="absolute top-6 left-8 flex items-center gap-2 text-sm text-[var(--text-gray)] hover:text-[var(--navy-dark)] transition-colors">
          <Home className="w-4 h-4" />
          {dict.auth.backToHome}
        </Link>
        <Suspense>
          <ResetPasswordForm dict={dict.resetPassword} lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { CircleCheck, BookOpen, Lock, Crown } from "lucide-react";

interface PaywallDict {
  unlockTitle: string;
  subtitle: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  purchaseButton: string;
  alreadyPremium: string;
  logIn: string;
  upgradeToPremium: string;
  signInToUpgrade: string;
  dontHaveAccount: string;
  signUp: string;
  alreadyPremiumTitle: string;
  alreadyPremiumDesc: string;
  browseBooks: string;
}

export default function PaywallClient({ dict, lang }: { dict: PaywallDict; lang: string }) {
  const { isAuthenticated, isPremium, refreshUser } = useAuth();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      router.push(`/${lang}/signin`);
      return;
    }
    try {
      await api.users.upgradeSubscription();
      await refreshUser();
      router.push(`/${lang}/dashboard`);
    } catch {}
  };

  if (isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-light)]">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[var(--navy-dark)] mb-3">{dict.alreadyPremiumTitle}</h1>
          <p className="text-sm text-[var(--text-gray)] mb-6">{dict.alreadyPremiumDesc}</p>
          <Link href={`/${lang}/books`} className="inline-block bg-[var(--navy-dark)] text-white text-sm font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
            {dict.browseBooks}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 bg-[#f8f6f1] rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <BookOpen className="w-12 h-12 text-[var(--navy-dark)]" />
            <Lock className="w-5 h-5 text-amber-500 absolute -bottom-1 -right-1" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--navy-dark)] leading-tight mb-2">
          {dict.unlockTitle}
        </h1>
        <p className="text-[15px] text-[var(--text-gray)] mb-6">{dict.subtitle}</p>

        <div className="flex flex-col gap-3 text-left mb-8">
          {[dict.benefit1, dict.benefit2, dict.benefit3].map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <CircleCheck className="w-5 h-5 text-[var(--blue-accent)] shrink-0 mt-0.5" />
              <span className="text-[15px] text-[var(--text-dark)]">{benefit}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full bg-[var(--blue-accent)] text-white text-[16px] font-bold py-4 rounded-xl hover:opacity-90 transition-opacity mb-4"
        >
          {isAuthenticated ? dict.upgradeToPremium : dict.signInToUpgrade}
        </button>

        {!isAuthenticated && (
          <p className="text-sm text-[var(--text-gray)]">
            {dict.dontHaveAccount}{" "}
            <Link href={`/${lang}/signup`} className="font-semibold text-[var(--text-dark)] underline hover:text-[var(--navy-dark)] transition-colors">
              {dict.signUp}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

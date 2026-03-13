"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Shield, Lock, CreditCard, TrendingDown, Zap, Check, Sparkles, ChevronRight } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

const stats = [
  { value: "2,800+", label: "Statements analyzed", emoji: "📊" },
  { value: "AED 4.2K", label: "Average savings found", emoji: "💰" },
  { value: "32", label: "UAE cards compared", emoji: "💳" },
];

const features = [
  {
    icon: Zap,
    emoji: "⚡",
    title: "60-second analysis",
    description: "Upload your PDF. Get a complete breakdown of every dirham in seconds — no login needed.",
    color: "#C2410C",
    bgColor: "#FFF7ED",
  },
  {
    icon: CreditCard,
    emoji: "🎯",
    title: "Smarter card match",
    description: "We compare your real spending across 32 UAE credit cards to find the one that saves you most.",
    color: "#0F766E",
    bgColor: "#F0FDFA",
  },
  {
    icon: TrendingDown,
    emoji: "📉",
    title: "See your true interest cost",
    description: "Carrying a balance? See what it actually costs you — daily, monthly, and over time. Then fix it.",
    color: "#D97706",
    bgColor: "#FFFBEB",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your statement",
    description: "Drop your credit card PDF. We extract transactions automatically — no bank login or credentials.",
    emoji: "📄",
  },
  {
    number: "02",
    title: "See where your money goes",
    description: "Instant spending breakdown by category. Dining, groceries, transport — every dirham accounted for.",
    emoji: "🔍",
  },
  {
    number: "03",
    title: "Get matched to better cards",
    description: "We compare 32 UAE credit cards against your actual spending pattern to find the best match.",
    emoji: "✨",
  },
];

const trustPoints = [
  { icon: Lock, label: "No data stored", detail: "Processed and immediately discarded", emoji: "🔒" },
  { icon: Shield, label: "No login required", detail: "No bank credentials ever", emoji: "🛡️" },
];

const testimonials = [
  {
    quote: "I had no idea I was spending AED 3,200/month on dining. The card switch alone saves me AED 180/month in cashback.",
    name: "Sarah M.",
    detail: "Dubai · Emirates NBD",
    savings: "AED 2,160/yr",
    emoji: "🍽️",
  },
  {
    quote: "Found out my balance was costing me AED 42K in interest. Got a personal loan that saves me AED 18K. Took 2 minutes.",
    name: "Khalid R.",
    detail: "Abu Dhabi · ADCB",
    savings: "AED 18,000",
    emoji: "🏦",
  },
  {
    quote: "Love that it doesn\u2019t ask for login or bank credentials. Just upload the PDF and done. Using it every month now.",
    name: "Priya K.",
    detail: "Dubai · HSBC",
    savings: "Monthly user",
    emoji: "💜",
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF7F2" }}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass border-b border-[#E7E5E4]">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto w-full">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors font-medium"
            >
              How it works
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden" ref={heroRef}>
          {/* Organic blob backgrounds with parallax */}
          <svg
            className="absolute top-[-120px] right-[-100px] w-[500px] h-[500px] opacity-20"
            viewBox="0 0 500 500"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          >
            <path d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z" fill="#C2410C" />
          </svg>
          <svg
            className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] opacity-15"
            viewBox="0 0 500 500"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <path d="M432,314Q408,378,342,401Q276,424,211,402Q146,380,107,318Q68,256,85,183Q102,110,170,75Q238,40,312,61Q386,82,419,166Q452,250,432,314Z" fill="#0F766E" />
          </svg>

          <div className="relative max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left: Copy */}
              <div className="flex-1 text-center lg:text-left">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E] mb-8 animate-fade-in border border-[#FDE68A]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Free for all UAE cardholders
                </div>

                {/* Headline */}
                <h1
                  className="text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-[-0.04em] leading-[1.08] mb-6 animate-fade-up"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  <span className="text-[#1C1917]">Every dirham,</span>
                  <br />
                  <span className="text-[#C2410C]">accounted for.</span>
                </h1>

                {/* Subhead */}
                <p
                  className="text-lg sm:text-xl text-[#78716C] mb-10 max-w-md leading-relaxed animate-fade-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  Upload your credit card statement and see exactly where your money goes. No login. No drama. Just clarity.
                </p>

                {/* CTA Group */}
                <div
                  className="flex flex-col sm:flex-row items-center gap-3 animate-fade-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold rounded-full transition-all text-base group shadow-lg"
                    style={{ boxShadow: "var(--shadow-terra)" }}
                  >
                    See My Spending
                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2 px-6 py-4 text-sm font-medium text-[#0F766E] hover:text-[#115E59] hover:bg-[#F0FDFA] rounded-full transition-all"
                  >
                    Try demo data
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Trust micro-copy */}
                <div
                  className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#A8A29E] animate-fade-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  {[
                    "No bank login needed",
                    "Your data stays private",
                    "Completely free",
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#0F766E]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Card illustration */}
              <div
                className="flex-1 relative animate-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="w-72 sm:w-80 mx-auto relative">
                  {/* Back card (stacked effect) */}
                  <div
                    className="absolute top-4 left-4 right-[-8px] h-52 rounded-3xl bg-[#0F766E]/10 border-2 border-dashed border-[#0F766E]/20"
                    style={{ transform: "rotate(3deg)" }}
                  />
                  {/* Front card */}
                  <div className="relative p-6 rounded-3xl bg-white border-2 border-[#E7E5E4] shadow-xl">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#D97706]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1C1917]">Emirates NBD</p>
                        <p className="text-xs text-[#A8A29E]">Visa Platinum</p>
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-[#1C1917] mb-1 tabular-nums">AED 14,850</p>
                    <p className="text-xs text-[#A8A29E] mb-5">February 2026</p>
                    <div className="space-y-2.5">
                      {[
                        { name: "🍽️ Dining", pct: 28, color: "#C2410C" },
                        { name: "🛒 Groceries", pct: 21, color: "#0F766E" },
                        { name: "🛍️ Shopping", pct: 19, color: "#D97706" },
                      ].map((c) => (
                        <div key={c.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#57534E]">{c.name}</span>
                            <span className="font-semibold text-[#1C1917]">{c.pct}%</span>
                          </div>
                          <div className="h-2 bg-[#F5F5F4] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${c.pct * 3}%`, background: c.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Floating savings badge */}
                  <div
                    className="absolute -bottom-3 -right-3 px-4 py-2 rounded-2xl bg-[#0F766E] text-white text-xs font-bold shadow-lg animate-float"
                    style={{ transform: "rotate(-3deg)" }}
                  >
                    💰 Save AED 2,160/yr
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wavy section divider */}
          <svg className="w-full" height="50" viewBox="0 0 1200 50" preserveAspectRatio="none">
            <path d="M0 25 Q300 0 600 25 Q900 50 1200 25 L1200 50 L0 50 Z" fill="#F5F0E8" />
          </svg>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────── */}
        <section style={{ background: "#F5F0E8" }}>
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg mb-1">{stat.emoji}</p>
                  <p
                    className="text-2xl sm:text-3xl font-extrabold text-[#C2410C] tracking-tight tabular-nums"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#78716C] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Reverse wave */}
          <svg className="w-full" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d="M0 15 Q300 40 600 15 Q900 -10 1200 15 L1200 40 L0 40 Z" fill="#FAF7F2" />
          </svg>
        </section>

        {/* ── Features ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#C2410C] tracking-wide uppercase mb-3">Why MoneyLens</p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1C1917]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Stop guessing where your money goes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-7 rounded-3xl bg-white border-2 border-[#E7E5E4] shadow-xs hover:shadow-lg hover:border-[#D6D3D1] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-4">{f.emoji}</div>
                <h3
                  className="text-base font-bold text-[#1C1917] mb-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-[#78716C] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Blob background */}
          <svg
            className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] opacity-10"
            viewBox="0 0 500 500"
            style={{ transform: `translateY(${scrollY * 0.03}px)` }}
          >
            <path d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z" fill="#C2410C" />
          </svg>

          <div style={{ background: "#F5F0E8" }}>
            <svg className="w-full" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <path d="M0 40 Q300 10 600 30 Q900 50 1200 20 L1200 0 L0 0 Z" fill="#FAF7F2" />
            </svg>
            <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-[#0F766E] tracking-wide uppercase mb-3">How it works</p>
                <h2
                  className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1C1917]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Three steps. Sixty seconds. Zero risk.
                </h2>
              </div>

              <div className="space-y-0">
                {steps.map((s, i) => (
                  <div
                    key={s.number}
                    className="flex gap-6 py-8"
                    style={{ borderTop: i > 0 ? "1px solid #D6D3D1" : "none" }}
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="text-2xl mb-1">{s.emoji}</span>
                      <span
                        className="text-sm font-bold text-[#C2410C] tabular-nums"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        {s.number}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold text-[#1C1917] mb-1.5"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        {s.title}
                      </h3>
                      <p className="text-sm text-[#78716C] leading-relaxed max-w-md">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <svg className="w-full" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <path d="M0 0 Q300 30 600 10 Q900 -10 1200 20 L1200 40 L0 40 Z" fill="#FAF7F2" />
            </svg>
          </div>
        </section>

        {/* ── Social Proof ──────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0F766E] tracking-wide uppercase mb-3">Trusted by UAE cardholders</p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1C1917]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Real savings. Real people.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative p-6 rounded-3xl bg-white border-2 border-[#E7E5E4] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Savings badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDFA] text-xs font-semibold text-[#0F766E] mb-4 border border-[#CCFBF1]">
                  <TrendingDown className="w-3 h-3" />
                  {t.savings}
                </div>
                <p className="text-sm text-[#57534E] leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[#F5F5F4]">
                  <p className="text-sm font-semibold text-[#1C1917]">{t.emoji} {t.name}</p>
                  <p className="text-xs text-[#A8A29E]">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trust / Privacy ───────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div style={{ background: "#F5F0E8" }}>
            <svg className="w-full" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <path d="M0 40 Q300 10 600 30 Q900 50 1200 20 L1200 0 L0 0 Z" fill="#FAF7F2" />
            </svg>
            <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#1C1917] mb-3"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Your privacy is non-negotiable
              </h2>
              <p className="text-[#78716C] max-w-lg mx-auto mb-10">
                We built MoneyLens the way we&apos;d want it built for ourselves. No accounts, no credentials, no data retention.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                {trustPoints.map((tp) => (
                  <div
                    key={tp.label}
                    className="flex items-start gap-3 p-5 rounded-2xl bg-white border-2 border-[#E7E5E4] text-left shadow-xs"
                  >
                    <div className="text-2xl shrink-0">{tp.emoji}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#1C1917]">{tp.label}</p>
                      <p className="text-xs text-[#A8A29E] mt-0.5">{tp.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#A8A29E] mt-8">
                Compliant with UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021)
              </p>
            </div>
            <svg className="w-full" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <path d="M0 0 Q300 30 600 10 Q900 -10 1200 20 L1200 40 L0 40 Z" fill="#FAF7F2" />
            </svg>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <FAQ />
        </section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: "#1C1917" }}>
          {/* Decorative blobs */}
          <svg
            className="absolute top-[-60px] right-[-40px] w-[300px] h-[300px] opacity-10"
            viewBox="0 0 500 500"
          >
            <path d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z" fill="#C2410C" />
          </svg>
          <svg
            className="absolute bottom-[-40px] left-[-40px] w-[250px] h-[250px] opacity-10"
            viewBox="0 0 500 500"
          >
            <path d="M432,314Q408,378,342,401Q276,424,211,402Q146,380,107,318Q68,256,85,183Q102,110,170,75Q238,40,312,61Q386,82,419,166Q452,250,432,314Z" fill="#0F766E" />
          </svg>

          <div className="relative max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
            <p className="text-3xl mb-4">💡</p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] mb-4 text-white"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Stop overpaying. Start saving.
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Upload your statement and discover exactly how much you could be saving every month.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#C2410C] hover:bg-[#EA580C] text-white font-bold rounded-full transition-all text-base group shadow-lg"
              style={{ boxShadow: "var(--shadow-terra)" }}
            >
              Analyze My Statement — Free
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className="text-xs text-white/30 mt-4">
              Free · 60 seconds · No signup · No data stored
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

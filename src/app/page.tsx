"use client";

import { ArrowRight, Shield, Lock, CreditCard, TrendingDown, Zap, ChevronRight, Check } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

const stats = [
  { value: "2,800+", label: "Statements analyzed", suffix: "" },
  { value: "AED 4.2K", label: "Average savings found", suffix: "" },
  { value: "32", label: "UAE cards compared", suffix: "" },
];

const features = [
  {
    icon: Zap,
    title: "60-second analysis",
    description: "Upload your PDF. Get a complete breakdown of every dirham in seconds — no login needed.",
    color: "#0A6E3F",
    bgColor: "#ECFDF5",
  },
  {
    icon: CreditCard,
    title: "Smarter card match",
    description: "We compare your real spending across 32 UAE credit cards to find the one that saves you most.",
    color: "#0A6E3F",
    bgColor: "#ECFDF5",
  },
  {
    icon: TrendingDown,
    title: "See your true interest cost",
    description: "Carrying a balance? See what it actually costs you — daily, monthly, and over time. Then fix it.",
    color: "#0A6E3F",
    bgColor: "#ECFDF5",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your statement",
    description: "Drop your credit card PDF. We extract transactions automatically — no bank login or credentials.",
  },
  {
    number: "02",
    title: "See where your money goes",
    description: "Instant spending breakdown by category. Dining, groceries, transport — every dirham accounted for.",
  },
  {
    number: "03",
    title: "Get matched to better cards",
    description: "We compare 32 UAE credit cards against your actual spending pattern to find the best match.",
  },
];

const trustPoints = [
  { icon: Lock, label: "No data stored", detail: "Processed and immediately discarded" },
  { icon: Shield, label: "No login required", detail: "No bank credentials ever" },
];

const testimonials = [
  {
    quote: "I had no idea I was spending AED 3,200/month on dining. The card switch alone saves me AED 180/month in cashback.",
    name: "Sarah M.",
    detail: "Dubai · Emirates NBD",
    savings: "AED 2,160/yr",
  },
  {
    quote: "Found out my balance was costing me AED 42K in interest. Got a personal loan that saves me AED 18K. Took 2 minutes.",
    name: "Khalid R.",
    detail: "Abu Dhabi · ADCB",
    savings: "AED 18,000",
  },
  {
    quote: "Love that it doesn\u2019t ask for login or bank credentials. Just upload the PDF and done. Using it every month now.",
    name: "Priya K.",
    detail: "Dubai · HSBC",
    savings: "Monthly user",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass border-b border-[#E4E4E7]">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto w-full">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#52525B] hover:text-[#18181B] transition-colors font-medium"
            >
              How it works
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0A6E3F] hover:bg-[#085C34] text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ boxShadow: "0 1px 3px rgba(10, 110, 63, 0.3)" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Subtle gradient orb — premium feel */}
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#ECFDF5] to-transparent opacity-60 blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] text-xs font-medium text-[#0A6E3F] mb-8 animate-fade-in"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A6E3F] animate-gentle-pulse" />
                Free for UAE cardholders · No signup required
              </div>

              {/* Headline */}
              <h1
                className="text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.08] mb-6 animate-fade-up"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <span className="text-[#18181B]">Your credit card has a leak.</span>
                <br />
                <span className="bg-gradient-to-r from-[#0A6E3F] to-[#2DD4A0] bg-clip-text text-transparent">
                  Find it in 60 seconds.
                </span>
              </h1>

              {/* Subhead */}
              <p
                className="text-lg sm:text-xl text-[#52525B] mb-10 max-w-xl mx-auto leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                Upload your UAE credit card statement. See where every dirham goes. Get matched to cards that actually fit how you spend.
              </p>

              {/* CTA Group */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0A6E3F] hover:bg-[#085C34] text-white font-semibold rounded-xl transition-all text-base group"
                  style={{ boxShadow: "var(--shadow-emerald)" }}
                >
                  Analyze My Statement — Free
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 px-6 py-4 text-sm font-medium text-[#0A6E3F] hover:text-[#085C34] hover:bg-[#ECFDF5] rounded-xl transition-all"
                >
                  Try with sample data
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Trust micro-copy */}
              <div
                className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-[#A1A1AA] animate-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                {[
                  "No bank credentials",
                  "256-bit encrypted",
                  "Nothing stored",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#0A6E3F]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────── */}
        <section className="border-y border-[#E4E4E7] bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-2xl sm:text-3xl font-extrabold text-[#0A6E3F] tracking-tight tabular-nums"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#71717A] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0A6E3F] tracking-wide uppercase mb-3">Why MoneyLens</p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#18181B]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Stop guessing where your money goes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-7 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs hover:shadow-md hover:border-[#D1FAE5] transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: f.bgColor }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3
                  className="text-base font-bold text-[#18181B] mb-2"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section className="bg-[#FAFAFA] border-y border-[#E4E4E7]">
          <div className="max-w-4xl mx-auto px-6 py-20 sm:py-24">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-[#0A6E3F] tracking-wide uppercase mb-3">How it works</p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#18181B]"
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
                  style={{ borderTop: i > 0 ? "1px solid #E4E4E7" : "none" }}
                >
                  <div className="shrink-0">
                    <span
                      className="text-sm font-bold text-[#0A6E3F] tabular-nums"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {s.number}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-[#18181B] mb-1.5"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-sm text-[#71717A] leading-relaxed max-w-md">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social Proof ──────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0A6E3F] tracking-wide uppercase mb-3">Trusted by UAE cardholders</p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#18181B]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Real savings. Real people.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Savings badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-xs font-semibold text-[#0A6E3F] mb-4">
                  <TrendingDown className="w-3 h-3" />
                  {t.savings}
                </div>
                <p className="text-sm text-[#52525B] leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[#F4F4F5]">
                  <p className="text-sm font-semibold text-[#18181B]">{t.name}</p>
                  <p className="text-xs text-[#A1A1AA]">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trust / Privacy ───────────────────────────────── */}
        <section className="bg-[#FAFAFA] border-y border-[#E4E4E7]">
          <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ECFDF5] mb-6">
              <Shield className="w-6 h-6 text-[#0A6E3F]" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#18181B] mb-3"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Your privacy is non-negotiable
            </h2>
            <p className="text-[#71717A] max-w-lg mx-auto mb-10">
              We built MoneyLens the way we&apos;d want it built for ourselves. No accounts, no credentials, no data retention.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {trustPoints.map((tp) => (
                <div
                  key={tp.label}
                  className="flex items-start gap-3 p-5 rounded-xl bg-white border border-[#E4E4E7] text-left shadow-xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                    <tp.icon className="w-4 h-4 text-[#0A6E3F]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#18181B]">{tp.label}</p>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">{tp.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#A1A1AA] mt-8">
              Compliant with UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021)
            </p>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <FAQ />
        </section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#064028] to-[#0A6E3F] text-white">
          <div className="max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] mb-4"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Stop overpaying. Start saving.
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Upload your statement and discover exactly how much you could be saving every month.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-[#F4F4F5] text-[#0A6E3F] font-bold rounded-xl transition-all text-base group shadow-lg"
            >
              Analyze My Statement — Free
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className="text-xs text-white/50 mt-4">
              Free · 60 seconds · No signup · No data stored
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

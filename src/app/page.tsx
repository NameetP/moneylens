"use client";

import { ArrowRight, Clock, CreditCard, Percent, Shield, Lock, Zap, Eye } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

const valueProps = [
  {
    icon: Clock,
    title: "60-Second Analysis",
    description:
      "Upload your statement, get a complete breakdown of where every dirham goes.",
  },
  {
    icon: CreditCard,
    title: "Better Card Match",
    description:
      "See which UAE credit cards would save you more based on your actual spending.",
  },
  {
    icon: Percent,
    title: "See True Interest Cost",
    description:
      "Carrying a balance? See exactly what it costs you and how to reduce it.",
  },
];

const howItWorks = [
  {
    step: "1",
    icon: Eye,
    title: "Upload your statement",
    description: "Drop your credit card PDF. We extract transactions automatically.",
  },
  {
    step: "2",
    icon: Zap,
    title: "See your spending",
    description: "Instant breakdown by category — dining, groceries, transport, and more.",
  },
  {
    step: "3",
    icon: CreditCard,
    title: "Get matched",
    description: "We compare 32 UAE credit cards to find the best match for how you actually spend.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full border-b border-[#e5e5e5]">
        <Logo />
        <Link
          href="/analyze"
          className="text-sm text-[#525252] hover:text-[#0a0a0a] transition-colors font-medium"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero — CSS animations instead of Framer Motion for React 19 compat */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16 sm:pt-24 pb-24 bg-gradient-to-b from-white to-[#fafafa]">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f5f4] border border-[#e5e5e5] text-xs text-[#525252] mb-8 animate-fade-in"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            Works with Emirates NBD · More banks coming soon
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1] mb-6 text-[#0a0a0a] animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Your money has a leak.{" "}
            <span className="text-[#059669]">Find it in 60 seconds.</span>
          </h1>

          <p
            className="text-lg text-[#525252] mb-10 max-w-lg mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Upload your UAE credit card statement. See where your money goes.
            Get matched to better cards.
          </p>

          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-2xl transition-all text-lg group shadow-sm hover:shadow-md"
            >
              Analyze My Statement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div
            className="mt-4 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/analyze"
              className="text-sm text-[#a3a3a3] hover:text-[#059669] transition-colors"
            >
              or <span className="underline">try with sample data</span> — no upload needed
            </Link>
          </div>
        </div>

        {/* Value Props */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-24 w-full animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center mb-4">
                <prop.icon className="w-5 h-5 text-[#059669]" />
              </div>
              <h3 className="font-semibold mb-2 text-[#0a0a0a]">{prop.title}</h3>
              <p className="text-sm text-[#737373]">{prop.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="max-w-3xl mx-auto mt-24 w-full">
          <h2 className="text-2xl font-bold text-center mb-12 tracking-[-0.02em] text-[#0a0a0a]">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#059669] text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2 text-[#0a0a0a]">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust section */}
        <div className="max-w-2xl mx-auto mt-24 w-full">
          <h2 className="text-2xl font-bold text-center mb-8 tracking-[-0.02em] text-[#0a0a0a]">
            Your privacy, protected
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e5e5e5]">
              <Lock className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0a0a0a]">No data stored</p>
                <p className="text-xs text-[#737373] mt-1">Your statement is processed and immediately discarded. Nothing is saved to any server.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e5e5e5]">
              <Shield className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0a0a0a]">No login required</p>
                <p className="text-xs text-[#737373] mt-1">No accounts, no bank credentials. Just upload a PDF and go.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-2xl transition-all text-lg group shadow-sm hover:shadow-md"
          >
            Analyze My Statement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-xs text-[#a3a3a3] mt-3">
            Free · Takes 60 seconds · No signup needed
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

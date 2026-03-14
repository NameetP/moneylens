"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  TrendingDown,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrustBadge } from "@/components/TrustBadge";
import { Footer } from "@/components/Footer";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import type { StatementData } from "@/data/mock-statement";

export default function InsightHub() {
  const router = useRouter();
  const [data, setData] = useState<StatementData | null>(null);
  const [parseWarning, setParseWarning] = useState<string | null>(null);
  const [parseSource, setParseSource] = useState<string>("unknown");
  const [estimatedSavings, setEstimatedSavings] = useState(0);
  const [dailyInterest, setDailyInterest] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("statementData");
    if (!stored) {
      router.push("/analyze");
      return;
    }
    try {
      const parsed = JSON.parse(stored) as StatementData;
      setData(parsed);

      // Calculate estimated card savings (top category × 5% reward rate × 12 months)
      if (parsed.categories.length > 0) {
        const topAmount = parsed.categories[0].amount;
        setEstimatedSavings(Math.round(topAmount * 0.05 * 12));
      }

      // Calculate daily interest if debt exists
      if (parsed.outstandingBalance > 0) {
        const daily = Math.round(
          (parsed.outstandingBalance * (parsed.interestRate / 100)) / 30
        );
        setDailyInterest(daily);
      }
    } catch {
      router.push("/analyze");
      return;
    }
    const warning = sessionStorage.getItem("parseWarning");
    const source = sessionStorage.getItem("parseSource");
    if (warning) setParseWarning(warning);
    if (source) setParseSource(source);
  }, [router]);

  if (!data) return null;

  const hasDebt = data.outstandingBalance > 0;
  const topCategory = data.categories[0];
  const annualInterest = hasDebt
    ? Math.round(data.outstandingBalance * (data.interestRate / 100) * 12)
    : 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAF7F2" }}
    >
      {/* Decorative blobs */}
      <svg
        className="fixed top-[-80px] right-[-60px] w-[300px] h-[300px] opacity-8 pointer-events-none"
        viewBox="0 0 500 500"
      >
        <path
          d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z"
          fill="#C2410C"
        />
      </svg>
      <svg
        className="fixed bottom-[-60px] left-[-60px] w-[250px] h-[250px] opacity-6 pointer-events-none"
        viewBox="0 0 500 500"
      >
        <path
          d="M432,314Q408,378,342,401Q276,424,211,402Q146,380,107,318Q68,256,85,183Q102,110,170,75Q238,40,312,61Q386,82,419,166Q452,250,432,314Z"
          fill="#0F766E"
        />
      </svg>

      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-[#E7E5E4]">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto w-full">
          <Logo />
          <div className="flex items-center gap-4">
            <TrustBadge />
            <Link
              href="/analyze"
              className="flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-6 pb-24 max-w-4xl mx-auto w-full relative z-10">
        {/* Statement header */}
        <motion.div
          className="text-center mb-8 mt-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#E7E5E4] mb-4">
            <CreditCard className="w-4 h-4 text-[#D97706]" />
            <span className="text-sm font-medium text-[#1C1917]">
              {data.bankName} {data.cardType}
            </span>
            <span className="text-sm text-[#A8A29E]">****{data.cardLast4}</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1C1917] mb-2"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Your Insights
          </h1>
          <p className="text-sm text-[#78716C]">{data.statementPeriod}</p>
        </motion.div>

        {/* Parse warning banner */}
        {(parseWarning ||
          parseSource === "fallback" ||
          parseSource === "demo") && (
          <motion.div
            className="mb-6 p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A] flex items-start gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#92400E]">
                {parseSource === "demo"
                  ? "You\u2019re viewing sample data"
                  : "We couldn\u2019t fully parse your statement"}
              </p>
              <p className="text-xs text-[#A16207] mt-1">
                {parseWarning ||
                  (parseSource === "demo"
                    ? "This is a demo analysis with sample spending data. Upload your own statement to see your real breakdown."
                    : "The data below may not reflect your actual spending. Try uploading a different statement format.")}
              </p>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#D97706] hover:text-[#92400E] mt-2 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Upload a different statement
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Product Cards ──────────────────────────────────── */}
        <div
          className={`grid gap-5 ${
            hasDebt ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-lg mx-auto"
          }`}
        >
          {/* Product A: Spending & Cards */}
          <motion.div
            className="group relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/results/spending")}
          >
            <div
              className="p-7 rounded-3xl bg-white border-2 border-[#E7E5E4] group-hover:border-[#C2410C]/30 group-hover:shadow-lg transition-all duration-300 h-full"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center mb-5">
                <Sparkles className="w-7 h-7 text-[#C2410C]" />
              </div>

              {/* Content */}
              <h2
                className="text-xl font-extrabold text-[#1C1917] mb-2 tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Spending & Cards
              </h2>

              <p className="text-sm text-[#78716C] leading-relaxed mb-5">
                See where your AED{" "}
                {data.totalSpend.toLocaleString("en-AE")} went across{" "}
                {data.categories.length} categories.
              </p>

              {/* Hook numbers */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5]">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: topCategory?.color || "#C2410C" }}
                  />
                  <span className="text-xs text-[#78716C]">
                    Top category: <span className="font-semibold text-[#1C1917]">{topCategory?.name}</span> at{" "}
                    {topCategory?.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1]">
                  <TrendingDown className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span className="text-xs text-[#78716C]">
                    Save up to{" "}
                    <span className="font-bold text-[#0F766E]">
                      AED {estimatedSavings.toLocaleString("en-AE")}/yr
                    </span>{" "}
                    with a better card
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-semibold text-[#C2410C] group-hover:gap-3 transition-all">
                See My Analysis
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Product B: Debt Freedom (conditional) */}
          {hasDebt && (
            <motion.div
              className="group relative cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/results/debt")}
            >
              <div
                className="p-7 rounded-3xl bg-white border-2 border-[#E7E5E4] group-hover:border-[#0F766E]/30 group-hover:shadow-lg transition-all duration-300 h-full"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center mb-5">
                  <TrendingDown className="w-7 h-7 text-[#0F766E]" />
                </div>

                {/* Content */}
                <h2
                  className="text-xl font-extrabold text-[#1C1917] mb-2 tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Debt Freedom
                </h2>

                <p className="text-sm text-[#78716C] leading-relaxed mb-5">
                  Your balance of AED{" "}
                  {data.outstandingBalance.toLocaleString("en-AE")} is costing
                  you every day. See your options.
                </p>

                {/* Hook numbers */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FEF2F2] border border-[#FECACA]">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#DC2626]" />
                    <span className="text-xs text-[#78716C]">
                      Costing you{" "}
                      <span className="font-bold text-[#DC2626]">
                        AED {dailyInterest}/day
                      </span>{" "}
                      in interest
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1]">
                    <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span className="text-xs text-[#78716C]">
                      A personal loan could{" "}
                      <span className="font-bold text-[#0F766E]">
                        cut your interest by 60%+
                      </span>
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0F766E] group-hover:gap-3 transition-all">
                  See My Options
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* No debt message */}
        {!hasDebt && (
          <motion.div
            className="mt-4 flex items-center gap-2 justify-center text-sm text-[#78716C]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Check className="w-4 h-4 text-[#0F766E]" />
            No outstanding balance detected on this statement.
          </motion.div>
        )}

        {/* Quick Stats Bar */}
        <motion.div
          className="mt-8 p-5 rounded-3xl bg-white border-2 border-[#E7E5E4] grid grid-cols-3 gap-4 text-center"
          style={{ boxShadow: "var(--shadow-xs)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <p className="text-xs text-[#A8A29E] mb-1">Total Spend</p>
            <p className="text-lg font-bold text-[#1C1917] tabular-nums">
              AED {data.totalSpend.toLocaleString("en-AE")}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#A8A29E] mb-1">Categories</p>
            <p className="text-lg font-bold text-[#1C1917]">
              {data.categories.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#A8A29E] mb-1">Transactions</p>
            <p className="text-lg font-bold text-[#1C1917] tabular-nums">
              {data.transactions.length}
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

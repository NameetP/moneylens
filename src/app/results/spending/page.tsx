"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  TrendingDown,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrustBadge } from "@/components/TrustBadge";
import { Footer } from "@/components/Footer";
import { SpendingBreakdown } from "../SpendingBreakdown";
import { CardRecommendations } from "../CardRecommendations";
import { EmailCapture } from "../EmailCapture";
import type { StatementData } from "@/data/mock-statement";

export default function SpendingPage() {
  const router = useRouter();
  const [data, setData] = useState<StatementData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("statementData");
    if (!stored) {
      router.push("/analyze");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      router.push("/analyze");
    }
  }, [router]);

  if (!data) return null;

  const hasDebt = data.outstandingBalance > 0;
  const dailyInterest = hasDebt
    ? Math.round((data.outstandingBalance * (data.interestRate / 100)) / 30)
    : 0;
  const topCategory = data.categories[0];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAF7F2" }}
    >
      {/* Decorative blob */}
      <svg
        className="fixed top-[-80px] right-[-60px] w-[300px] h-[300px] opacity-8 pointer-events-none"
        viewBox="0 0 500 500"
      >
        <path
          d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z"
          fill="#C2410C"
        />
      </svg>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 glass border-b border-[#E7E5E4]">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto w-full">
          <Logo />
          <div className="flex items-center gap-4">
            <TrustBadge />
            <Link
              href="/results"
              className="flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Insights
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-6 pb-24 max-w-4xl mx-auto w-full relative z-10">
        {/* Page header */}
        <motion.div
          className="mb-8 mt-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#C2410C]" />
            </div>
            <span className="text-xs font-semibold text-[#C2410C] uppercase tracking-wide">
              Spending & Cards
            </span>
          </div>
          <p className="text-sm text-[#78716C]">
            {data.bankName} {data.cardType} ****{data.cardLast4} &middot;{" "}
            {data.statementPeriod}
          </p>
        </motion.div>

        {/* ── Section 1: Spending Breakdown ──────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SpendingBreakdown data={data} />
        </motion.section>

        {/* ── Section 2: Insight Bridge ───────────────────── */}
        {topCategory && (
          <motion.div
            className="mt-8 p-5 rounded-3xl bg-[#FFF7ED] border-2 border-[#FFEDD5]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-[#57534E] leading-relaxed">
              Your #1 category is{" "}
              <span className="font-bold text-[#1C1917]">
                {topCategory.name}
              </span>{" "}
              at {topCategory.percentage}% of spend. The right card could earn
              you{" "}
              <span className="font-bold text-[#C2410C]">
                AED{" "}
                {Math.round(topCategory.amount * 0.05 * 12).toLocaleString(
                  "en-AE"
                )}
                /year
              </span>{" "}
              in cashback on {topCategory.name.toLowerCase()} alone.
            </p>
          </motion.div>
        )}

        {/* ── Section 3: Card Recommendations ────────────── */}
        <motion.section
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardRecommendations
            categories={data.categories}
            bankName={data.bankName}
            cardType={data.cardType}
          />
        </motion.section>

        {/* ── Section 4: Email Capture ────────────────────── */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <EmailCapture
            totalSpend={data.totalSpend}
            topCategory={topCategory?.name || "Spending"}
            categories={data.categories}
            bankName={data.bankName}
            cardType={data.cardType}
            statementPeriod={data.statementPeriod}
          />
        </motion.div>

        {/* ── Cross-sell: Debt Freedom nudge ──────────────── */}
        {hasDebt && (
          <motion.div
            className="mt-10 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => router.push("/results/debt")}
          >
            <div
              className="p-5 rounded-3xl bg-[#F0FDFA] border-2 border-[#CCFBF1] group-hover:border-[#0F766E]/30 group-hover:shadow-md transition-all"
            >
              <p className="text-xs font-semibold text-[#0F766E] uppercase tracking-wide mb-2">
                By the way...
              </p>
              <p className="text-sm text-[#57534E] leading-relaxed mb-3">
                Your balance of{" "}
                <span className="font-bold text-[#1C1917]">
                  AED {data.outstandingBalance.toLocaleString("en-AE")}
                </span>{" "}
                is costing you{" "}
                <span className="font-bold text-[#DC2626]">
                  AED {dailyInterest}/day
                </span>{" "}
                in interest. A personal loan could cut that significantly.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F766E] group-hover:gap-3 transition-all">
                Explore Debt Freedom
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

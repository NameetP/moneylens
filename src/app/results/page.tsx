"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Stepper } from "@/components/Stepper";
import type { StatementData } from "@/data/mock-statement";
import { SpendingBreakdown } from "./SpendingBreakdown";
import { CardRecommendations } from "./CardRecommendations";
import { DebtAlert } from "./DebtAlert";
import { LoanForm } from "./LoanForm";

const STEPS = ["Spending", "Cards", "Debt", "Save"];

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<StatementData | null>(null);
  const [step, setStep] = useState(0);
  const [debtData, setDebtData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("statementData");
    if (!stored) {
      router.push("/analyze");
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    if (data && data.outstandingBalance > 0) {
      fetch("/api/calculate-debt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balance: data.outstandingBalance,
          interestRate: data.interestRate,
          minimumDue: data.minimumDue,
        }),
      })
        .then((r) => r.json())
        .then((r) => setDebtData(r.data));
    }
  }, [data]);

  if (!data) return null;

  const hasDebt = data.outstandingBalance > 0;
  const visibleSteps = hasDebt ? STEPS : STEPS.slice(0, 2);
  const maxStep = visibleSteps.length - 1;

  const next = () => setStep((s) => Math.min(s + 1, maxStep));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Logo />
        <Link
          href="/analyze"
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </Link>
      </nav>

      <main className="flex-1 px-6 pb-24 max-w-4xl mx-auto w-full">
        {/* Statement header */}
        <div className="text-center mb-6">
          <p className="text-sm text-zinc-500">
            {data.bankName} {data.cardType} ****{data.cardLast4}
          </p>
          <p className="text-xs text-zinc-600">{data.statementPeriod}</p>
        </div>

        <Stepper steps={visibleSteps} currentStep={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && <SpendingBreakdown data={data} />}
            {step === 1 && <CardRecommendations categories={data.categories} />}
            {step === 2 && hasDebt && debtData && <DebtAlert data={debtData} />}
            {step === 3 && hasDebt && (
              <LoanForm defaultAmount={data.outstandingBalance} />
            )}
            {step === 2 && !hasDebt && (
              <div className="text-center py-16">
                <p className="text-zinc-400">
                  No outstanding balance detected. You are in great shape!
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {step < maxStep && (
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#22c55e] text-black hover:bg-[#16a34a] transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

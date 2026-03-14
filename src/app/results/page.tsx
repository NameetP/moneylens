"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrustBadge } from "@/components/TrustBadge";
import { Footer } from "@/components/Footer";
import { Stepper } from "@/components/Stepper";
import type { StatementData } from "@/data/mock-statement";
import { SpendingBreakdown } from "./SpendingBreakdown";
import { CardRecommendations } from "./CardRecommendations";
import { DebtAlert } from "./DebtAlert";
import { LoanForm } from "./LoanForm";
import { EmailCapture } from "./EmailCapture";

const STEPS = ["Spending", "Cards", "Balance", "Loan"];

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<StatementData | null>(null);
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("resultsStep");
      return saved ? Math.min(Number(saved), 3) : 0;
    }
    return 0;
  });
  const [debtData, setDebtData] = useState<Record<string, unknown> | null>(null);
  const [parseWarning, setParseWarning] = useState<string | null>(null);
  const [parseSource, setParseSource] = useState<string>("unknown");

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
      return;
    }
    const warning = sessionStorage.getItem("parseWarning");
    const source = sessionStorage.getItem("parseSource");
    if (warning) setParseWarning(warning);
    if (source) setParseSource(source);
  }, [router]);

  useEffect(() => {
    sessionStorage.setItem("resultsStep", String(step));
  }, [step]);

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
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF7F2" }}>
      {/* Decorative blobs */}
      <svg className="fixed top-[-80px] right-[-60px] w-[300px] h-[300px] opacity-8 pointer-events-none" viewBox="0 0 500 500">
        <path d="M426,295Q411,390,321,411Q231,432,157,389Q83,346,73,253Q63,160,140,104Q217,48,310,62Q403,76,423,188Q443,300,426,295Z" fill="#C2410C" />
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
        <div className="text-center mb-6 mt-6">
          <p className="text-sm font-medium text-[#57534E]">
            {data.bankName} {data.cardType} ****{data.cardLast4}
          </p>
          <p className="text-xs text-[#A8A29E]">{data.statementPeriod}</p>
        </div>

        <Stepper steps={visibleSteps} currentStep={step} />

        {/* Parse warning banner */}
        {(parseWarning || parseSource === "fallback" || parseSource === "demo") && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A] flex items-start gap-3">
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
          </div>
        )}

        <div key={step}>
          {step === 0 && (
            <>
              <SpendingBreakdown data={data} />
              <div className="mt-8">
                <EmailCapture
                  totalSpend={data.totalSpend}
                  topCategory={data.categories[0]?.name || "Spending"}
                  categories={data.categories}
                  bankName={data.bankName}
                  cardType={data.cardType}
                  statementPeriod={data.statementPeriod}
                />
              </div>
            </>
          )}
          {step === 1 && <CardRecommendations categories={data.categories} />}
          {step === 2 && hasDebt && debtData && <DebtAlert data={debtData} />}
          {step === 3 && hasDebt && (
            <LoanForm defaultAmount={data.outstandingBalance} />
          )}
          {step === 2 && !hasDebt && (
            <div className="text-center py-16">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-[#57534E]">
                No outstanding balance detected. You&apos;re in great shape!
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white border-2 border-[#E7E5E4] text-[#57534E] hover:text-[#1C1917] hover:border-[#D6D3D1] transition-colors disabled:opacity-30 disabled:pointer-events-none"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {step < maxStep && (
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#C2410C] text-white hover:bg-[#9A3412] transition-colors"
              style={{ boxShadow: "var(--shadow-terra)" }}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

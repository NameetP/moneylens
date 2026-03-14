"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Calculator,
  CheckCircle,
  Loader2,
  Send,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrustBadge } from "@/components/TrustBadge";
import { Footer } from "@/components/Footer";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import type { StatementData } from "@/data/mock-statement";

interface DebtData {
  balance: number;
  creditCard: {
    monthlyRate: number;
    annualRate: number;
    totalInterest: number;
    monthsToPayOff: number;
    yearsToPayOff: number;
  };
  personalLoan: {
    annualRate: number;
    tenure: number;
    monthlyPayment: number;
    totalInterest: number;
  };
  potentialSavings: number;
}

const salaryRanges = [
  "AED 5,000 \u2013 10,000",
  "AED 10,000 \u2013 20,000",
  "AED 20,000 \u2013 35,000",
  "AED 35,000 \u2013 50,000",
  "AED 50,000+",
];

const tenures = [
  "12 months",
  "24 months",
  "36 months",
  "48 months",
  "60 months",
];

export default function DebtPage() {
  const router = useRouter();
  const [data, setData] = useState<StatementData | null>(null);
  const [debtData, setDebtData] = useState<DebtData | null>(null);
  const [loading, setLoading] = useState(true);
  const [extraPayment, setExtraPayment] = useState(0);

  // Loan form state
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState("");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    employer: "",
    salaryRange: salaryRanges[1],
    desiredAmount: "",
    tenure: tenures[2],
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("statementData");
    if (!stored) {
      router.push("/analyze");
      return;
    }
    try {
      const parsed = JSON.parse(stored) as StatementData;
      setData(parsed);

      if (parsed.outstandingBalance <= 0) {
        router.push("/results");
        return;
      }

      setForm((f) => ({
        ...f,
        desiredAmount: parsed.outstandingBalance.toString(),
      }));

      // Fetch debt calculation
      fetch("/api/calculate-debt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balance: parsed.outstandingBalance,
          interestRate: parsed.interestRate,
          minimumDue: parsed.minimumDue,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setDebtData(r.data as DebtData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch {
      router.push("/analyze");
    }
  }, [router]);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    const res = await fetch("/api/submit-loan-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setRefId(d.referenceId);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (!data) return null;

  if (loading || !debtData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FAF7F2" }}
      >
        <div className="w-6 h-6 border-2 border-[#E7E5E4] border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    );
  }

  const dailyCost = Math.round(
    (debtData.balance * (debtData.creditCard.monthlyRate / 100)) / 30
  );
  const monthlyCost = Math.round(
    debtData.balance * (debtData.creditCard.monthlyRate / 100)
  );

  // Slider calculation
  const calculateWithExtra = (extra: number) => {
    const monthlyRate = debtData.creditCard.monthlyRate / 100;
    let remaining = debtData.balance;
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 360;

    while (remaining > 100 && months < maxMonths) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      const payment = Math.max(500, remaining * 0.05) + extra;
      remaining = remaining + interest - payment;
      months++;
      if (remaining < 0) remaining = 0;
    }
    return { months, totalInterest: Math.round(totalInterest) };
  };

  const withExtra = calculateWithExtra(extraPayment);
  const yearsSaved =
    (debtData.creditCard.monthsToPayOff - withExtra.months) / 12;
  const interestSaved =
    debtData.creditCard.totalInterest - withExtra.totalInterest;

  const estimatedCardSavings =
    data.categories.length > 0
      ? Math.round(data.categories[0].amount * 0.05 * 12)
      : 0;

  const inputClasses =
    "w-full px-4 py-2.5 bg-white border-2 border-[#E7E5E4] rounded-2xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] transition-all";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAF7F2" }}
    >
      {/* Decorative blob */}
      <svg
        className="fixed bottom-[-60px] left-[-60px] w-[300px] h-[300px] opacity-8 pointer-events-none"
        viewBox="0 0 500 500"
      >
        <path
          d="M432,314Q408,378,342,401Q276,424,211,402Q146,380,107,318Q68,256,85,183Q102,110,170,75Q238,40,312,61Q386,82,419,166Q452,250,432,314Z"
          fill="#0F766E"
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
            <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#0F766E]" />
            </div>
            <span className="text-xs font-semibold text-[#0F766E] uppercase tracking-wide">
              Debt Freedom
            </span>
          </div>
          <p className="text-sm text-[#78716C]">
            {data.bankName} {data.cardType} ****{data.cardLast4} &middot;{" "}
            {data.statementPeriod}
          </p>
        </motion.div>

        {/* ── Section 1: Balance & Burn Rate ──────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2
            className="text-2xl font-extrabold mb-1 tracking-[-0.03em] text-[#1C1917]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Your Outstanding Balance
          </h2>
          <p className="text-[#78716C] text-sm mb-8">
            Here&apos;s what your AED{" "}
            {debtData.balance.toLocaleString("en-AE")} balance really costs you.
          </p>

          {/* Cost cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              className="p-5 rounded-3xl bg-[#FEF2F2] border-2 border-[#FECACA] text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs text-[#78716C] mb-1 font-medium">
                Every day
              </p>
              <p className="text-2xl font-bold text-[#DC2626] tabular-nums">
                AED {dailyCost}
              </p>
              <p className="text-[10px] text-[#A8A29E] mt-1">in interest</p>
            </motion.div>
            <motion.div
              className="p-5 rounded-3xl bg-[#FEF2F2] border-2 border-[#FECACA] text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <p className="text-xs text-[#78716C] mb-1 font-medium">
                Every month
              </p>
              <p className="text-2xl font-bold text-[#DC2626] tabular-nums">
                AED {monthlyCost.toLocaleString("en-AE")}
              </p>
              <p className="text-[10px] text-[#A8A29E] mt-1">in interest</p>
            </motion.div>
            <motion.div
              className="p-5 rounded-3xl bg-[#FEF2F2] border-2 border-[#FECACA] text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="text-xs text-[#78716C] mb-1 font-medium">
                If you pay minimum only
              </p>
              <AnimatedNumber
                value={debtData.creditCard.totalInterest}
                prefix="AED "
                className="text-2xl font-bold text-[#DC2626] tabular-nums"
                duration={1.5}
              />
              <p className="text-[10px] text-[#A8A29E] mt-1">
                over {debtData.creditCard.yearsToPayOff} years
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Section 2: Cost of Waiting ──────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="p-6 rounded-3xl bg-white border-2 border-[#E7E5E4] mb-8"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Calculator className="w-5 h-5 text-[#0F766E]" />
              <h3
                className="font-bold text-[#1C1917]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                What if you paid more each month?
              </h3>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#78716C]">
                  Extra monthly payment
                </span>
                <span className="text-sm font-bold text-[#0F766E] tabular-nums">
                  AED {extraPayment.toLocaleString("en-AE")}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.min(5000, Math.round(debtData.balance * 0.1))}
                step={100}
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E7E5E4] rounded-full appearance-none cursor-pointer accent-[#0F766E]"
              />
              <div className="flex justify-between text-[10px] text-[#A8A29E] mt-1 tabular-nums">
                <span>AED 0</span>
                <span>
                  AED{" "}
                  {Math.min(
                    5000,
                    Math.round(debtData.balance * 0.1)
                  ).toLocaleString("en-AE")}
                </span>
              </div>
            </div>

            {extraPayment > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F5F5F4]">
                <div className="text-center p-3 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1]">
                  <p className="text-xs text-[#78716C] mb-1">Time saved</p>
                  <p className="text-lg font-bold text-[#0F766E] tabular-nums">
                    {yearsSaved.toFixed(1)} years
                  </p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1]">
                  <p className="text-xs text-[#78716C] mb-1">Interest saved</p>
                  <p className="text-lg font-bold text-[#0F766E] tabular-nums">
                    AED {interestSaved.toLocaleString("en-AE")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* ── Section 3: A Better Path Forward ────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3
            className="text-xl font-extrabold text-[#1C1917] mb-2 tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            A Better Path Forward
          </h3>
          <p className="text-sm text-[#78716C] mb-6">
            See how consolidating into a personal loan changes the math.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Credit Card */}
            <motion.div
              className="p-5 rounded-3xl bg-white border-2 border-[#E7E5E4]"
              style={{ boxShadow: "var(--shadow-xs)" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs text-[#A8A29E] uppercase tracking-wide mb-3 font-semibold">
                Credit Card (Current)
              </p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Balance</span>
                  <span className="text-[#1C1917] tabular-nums">
                    AED {debtData.balance.toLocaleString("en-AE")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Rate</span>
                  <span className="text-[#DC2626] font-semibold tabular-nums">
                    {debtData.creditCard.annualRate.toFixed(1)}% p.a.
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Total Interest</span>
                  <span className="text-[#DC2626] font-bold tabular-nums">
                    AED{" "}
                    {debtData.creditCard.totalInterest.toLocaleString("en-AE")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Pay-off time</span>
                  <span className="text-[#1C1917] tabular-nums">
                    {debtData.creditCard.yearsToPayOff} years
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Personal Loan */}
            <motion.div
              className="p-5 rounded-3xl bg-white border-2 border-[#0F766E] relative"
              style={{ boxShadow: "0 0 0 4px rgba(15, 118, 110, 0.08)" }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-[#0F766E] text-white text-[10px] font-bold rounded-full tracking-wide">
                Recommended
              </span>
              <p className="text-xs text-[#0F766E] uppercase tracking-wide mb-3 font-semibold">
                Personal Loan
              </p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Amount</span>
                  <span className="text-[#1C1917] tabular-nums">
                    AED {debtData.balance.toLocaleString("en-AE")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Rate</span>
                  <span className="text-[#0F766E] font-semibold tabular-nums">
                    {debtData.personalLoan.annualRate}% p.a.
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Total Interest</span>
                  <span className="text-[#0F766E] font-bold tabular-nums">
                    AED{" "}
                    {debtData.personalLoan.totalInterest.toLocaleString(
                      "en-AE"
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#78716C]">Monthly EMI</span>
                  <span className="text-[#1C1917] tabular-nums">
                    AED{" "}
                    {debtData.personalLoan.monthlyPayment.toLocaleString(
                      "en-AE"
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Savings callout */}
          <motion.div
            className="p-5 rounded-3xl bg-[#F0FDFA] border-2 border-[#CCFBF1] text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p
              className="text-lg font-bold text-[#0F766E]"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Save AED{" "}
              {debtData.potentialSavings.toLocaleString("en-AE")} in
              interest
            </p>
            <p className="text-sm text-[#78716C] mt-1">
              By consolidating into a personal loan at{" "}
              {debtData.personalLoan.annualRate}%
            </p>
          </motion.div>
        </motion.section>

        {/* ── Section 4: Inline Loan Form ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {submitted ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-16 h-16 text-[#0F766E] mx-auto mb-4" />
              <h2
                className="text-2xl font-bold mb-2 text-[#1C1917]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Application Submitted!
              </h2>
              <p className="text-[#57534E] mb-4">
                A personal loan specialist will contact you within 24 hours.
              </p>
              <p className="text-sm text-[#A8A29E]">Reference: {refId}</p>
            </motion.div>
          ) : (
            <div
              className="p-7 rounded-3xl bg-white border-2 border-[#E7E5E4]"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <h3
                className="text-xl font-extrabold text-[#1C1917] mb-2 tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Get a Personalized Quote
              </h3>
              <p className="text-sm text-[#78716C] mb-6">
                Fill in your details and we&apos;ll connect you with the best
                rates.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1.5 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Ahmed Al Maktoum"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1.5 font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+971 50 123 4567"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#57534E] mb-1.5 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="ahmed@email.com"
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1.5 font-medium">
                      Monthly Income
                    </label>
                    <select
                      value={form.salaryRange}
                      onChange={(e) => update("salaryRange", e.target.value)}
                      className={`${inputClasses} appearance-none`}
                    >
                      {salaryRanges.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534E] mb-1.5 font-medium">
                      Tenure
                    </label>
                    <select
                      value={form.tenure}
                      onChange={(e) => update("tenure", e.target.value)}
                      className={`${inputClasses} appearance-none`}
                    >
                      {tenures.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-3 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#D6D3D1] text-[#0F766E] focus:ring-[#0F766E] accent-[#0F766E]"
                  />
                  <span className="text-xs text-[#78716C] leading-relaxed">
                    I consent to being contacted by personal loan providers. My
                    information will be shared with licensed UAE financial
                    institutions for the purpose of loan comparison.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!consent || submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold rounded-full transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  style={{
                    boxShadow: "0 4px 14px -2px rgba(15, 118, 110, 0.35)",
                  }}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Get My Quote
                    </>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-[#A8A29E] mt-4 text-center">
                A loan advisor will call you within 24 hours. No obligation.
              </p>
            </div>
          )}
        </motion.section>

        {/* ── Cross-sell: Spending & Cards nudge ──────────── */}
        <motion.div
          className="mt-10 cursor-pointer group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => router.push("/results/spending")}
        >
          <div className="p-5 rounded-3xl bg-[#FFF7ED] border-2 border-[#FFEDD5] group-hover:border-[#C2410C]/30 group-hover:shadow-md transition-all">
            <p className="text-xs font-semibold text-[#C2410C] uppercase tracking-wide mb-2">
              While you&apos;re here...
            </p>
            <p className="text-sm text-[#57534E] leading-relaxed mb-3">
              You could also be earning{" "}
              <span className="font-bold text-[#C2410C]">
                AED {estimatedCardSavings.toLocaleString("en-AE")}/year
              </span>{" "}
              in cashback with a better card matched to your spending pattern.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#C2410C] group-hover:gap-3 transition-all">
              See Card Matches
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

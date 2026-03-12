"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowDown } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";

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

interface Props {
  data: Record<string, unknown>;
}

export function DebtAlert({ data: rawData }: Props) {
  const data = rawData as unknown as DebtData;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
        Debt Alert
      </h2>
      <p className="text-zinc-500 text-sm mb-8">
        You&apos;re carrying a balance. Here&apos;s what it&apos;s really
        costing you.
      </p>

      {/* Big number */}
      <motion.div
        className="text-center py-8 mb-8 rounded-2xl bg-red-950/20 border border-red-900/30"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-zinc-500 mb-2">
          Total interest if you pay minimum only
        </p>
        <AnimatedNumber
          value={data.creditCard.totalInterest}
          prefix="AED "
          className="text-5xl font-bold text-[#ef4444]"
          duration={2}
        />
        <p className="text-sm text-zinc-600 mt-2">
          over {data.creditCard.yearsToPayOff} years at{" "}
          {data.creditCard.annualRate.toFixed(1)}% APR
        </p>
      </motion.div>

      {/* Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">
            Credit Card (Current)
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Balance</span>
              <span>AED {data.balance.toLocaleString("en-AE")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Monthly Rate</span>
              <span className="text-[#ef4444]">
                {data.creditCard.monthlyRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Interest</span>
              <span className="text-[#ef4444] font-semibold">
                AED {data.creditCard.totalInterest.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Time to Pay Off</span>
              <span>{data.creditCard.yearsToPayOff} years</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-2xl bg-zinc-900/50 border border-[#22c55e]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <p className="text-xs text-[#22c55e] uppercase tracking-wide mb-3">
            Personal Loan (Alternative)
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Amount</span>
              <span>AED {data.balance.toLocaleString("en-AE")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Annual Rate</span>
              <span className="text-[#22c55e]">
                {data.personalLoan.annualRate}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Interest</span>
              <span className="text-[#22c55e] font-semibold">
                AED{" "}
                {data.personalLoan.totalInterest.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Monthly EMI</span>
              <span>
                AED {data.personalLoan.monthlyPayment.toLocaleString("en-AE")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Savings callout */}
      <motion.div
        className="mt-6 p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ArrowDown className="w-5 h-5 text-[#22c55e] shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#22c55e]">
            You could save AED{" "}
            {data.potentialSavings.toLocaleString("en-AE")} in interest
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            By consolidating your credit card debt into a personal loan
          </p>
        </div>
      </motion.div>
    </div>
  );
}

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
      <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 tracking-[-0.02em] text-[#0a0a0a]">
        <AlertTriangle className="w-6 h-6 text-[#dc2626]" />
        Debt Alert
      </h2>
      <p className="text-[#737373] text-sm mb-8">
        You&apos;re carrying a balance. Here&apos;s what it&apos;s really
        costing you.
      </p>

      {/* Big number */}
      <motion.div
        className="text-center py-8 mb-8 rounded-2xl bg-[#fef2f2] border border-[#fecaca]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-[#737373] mb-2">
          Total interest if you pay minimum only
        </p>
        <AnimatedNumber
          value={data.creditCard.totalInterest}
          prefix="AED "
          className="text-5xl font-bold text-[#dc2626]"
          duration={2}
        />
        <p className="text-sm text-[#a3a3a3] mt-2">
          over {data.creditCard.yearsToPayOff} years at{" "}
          {data.creditCard.annualRate.toFixed(1)}% APR
        </p>
      </motion.div>

      {/* Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          className="p-5 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-3 font-medium">
            Credit Card (Current)
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Balance</span>
              <span className="text-[#0a0a0a]">
                AED {data.balance.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Monthly Rate</span>
              <span className="text-[#dc2626]">
                {data.creditCard.monthlyRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Total Interest</span>
              <span className="text-[#dc2626] font-semibold">
                AED {data.creditCard.totalInterest.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Time to Pay Off</span>
              <span className="text-[#0a0a0a]">
                {data.creditCard.yearsToPayOff} years
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-2xl bg-white border border-[#a7f3d0] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <p className="text-xs text-[#059669] uppercase tracking-wide mb-3 font-medium">
            Personal Loan (Alternative)
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Amount</span>
              <span className="text-[#0a0a0a]">
                AED {data.balance.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Annual Rate</span>
              <span className="text-[#059669]">
                {data.personalLoan.annualRate}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Total Interest</span>
              <span className="text-[#059669] font-semibold">
                AED{" "}
                {data.personalLoan.totalInterest.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Monthly EMI</span>
              <span className="text-[#0a0a0a]">
                AED {data.personalLoan.monthlyPayment.toLocaleString("en-AE")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Savings callout */}
      <motion.div
        className="mt-6 p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ArrowDown className="w-5 h-5 text-[#059669] shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#059669]">
            You could save AED{" "}
            {data.potentialSavings.toLocaleString("en-AE")} in interest
          </p>
          <p className="text-xs text-[#737373] mt-0.5">
            By consolidating your credit card debt into a personal loan
          </p>
        </div>
      </motion.div>
    </div>
  );
}

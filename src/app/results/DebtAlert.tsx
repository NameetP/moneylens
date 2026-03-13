"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, ArrowRight, Calculator } from "lucide-react";
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
  const dailyCost = Math.round(
    (data.balance * (data.creditCard.monthlyRate / 100)) / 30
  );
  const monthlyCost = Math.round(
    data.balance * (data.creditCard.monthlyRate / 100)
  );

  const [extraPayment, setExtraPayment] = useState(0);

  // Recalculate payoff with extra payment
  const calculateWithExtra = (extra: number) => {
    const monthlyRate = data.creditCard.monthlyRate / 100;
    let remaining = data.balance;
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
    (data.creditCard.monthsToPayOff - withExtra.months) / 12;
  const interestSaved = data.creditCard.totalInterest - withExtra.totalInterest;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 tracking-[-0.02em] text-[#0a0a0a]">
        Your Balance, Decoded
      </h2>
      <p className="text-[#737373] text-sm mb-8">
        Here&apos;s what your outstanding balance really costs you.
      </p>

      {/* Daily cost — the attention grabber */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          className="p-5 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs text-[#737373] mb-1">Every day</p>
          <p className="text-2xl font-bold text-[#dc2626]">
            AED {dailyCost}
          </p>
          <p className="text-[10px] text-[#a3a3a3] mt-1">in interest</p>
        </motion.div>
        <motion.div
          className="p-5 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-xs text-[#737373] mb-1">Every month</p>
          <p className="text-2xl font-bold text-[#dc2626]">
            AED {monthlyCost.toLocaleString("en-AE")}
          </p>
          <p className="text-[10px] text-[#a3a3a3] mt-1">in interest</p>
        </motion.div>
        <motion.div
          className="p-5 rounded-2xl bg-[#fef2f2] border border-[#fecaca] text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-xs text-[#737373] mb-1">If you pay minimum only</p>
          <AnimatedNumber
            value={data.creditCard.totalInterest}
            prefix="AED "
            className="text-2xl font-bold text-[#dc2626]"
            duration={1.5}
          />
          <p className="text-[10px] text-[#a3a3a3] mt-1">
            over {data.creditCard.yearsToPayOff} years
          </p>
        </motion.div>
      </div>

      {/* Interactive slider — "What if you paid more?" */}
      <motion.div
        className="p-6 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-[#059669]" />
          <h3 className="font-semibold text-[#0a0a0a]">
            What if you paid more each month?
          </h3>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#737373]">Extra monthly payment</span>
            <span className="text-sm font-semibold text-[#059669]">
              AED {extraPayment.toLocaleString("en-AE")}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.min(5000, Math.round(data.balance * 0.1))}
            step={100}
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-full h-1.5 bg-[#e5e5e5] rounded-full appearance-none cursor-pointer accent-[#059669]"
          />
          <div className="flex justify-between text-[10px] text-[#a3a3a3] mt-1">
            <span>AED 0</span>
            <span>AED {Math.min(5000, Math.round(data.balance * 0.1)).toLocaleString("en-AE")}</span>
          </div>
        </div>

        {extraPayment > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f5f5f4]">
            <div className="text-center p-3 rounded-xl bg-[#ecfdf5]">
              <p className="text-xs text-[#737373] mb-1">Time saved</p>
              <p className="text-lg font-bold text-[#059669]">
                {yearsSaved.toFixed(1)} years
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[#ecfdf5]">
              <p className="text-xs text-[#737373] mb-1">Interest saved</p>
              <p className="text-lg font-bold text-[#059669]">
                AED {interestSaved.toLocaleString("en-AE")}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Comparison — Credit Card vs Personal Loan */}
      <h3 className="font-semibold text-[#0a0a0a] mb-4">
        Or consolidate with a personal loan
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          className="p-5 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
              <span className="text-[#737373]">Rate</span>
              <span className="text-[#dc2626]">
                {data.creditCard.annualRate.toFixed(1)}% p.a.
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Total Interest</span>
              <span className="text-[#dc2626] font-semibold">
                AED {data.creditCard.totalInterest.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Pay-off time</span>
              <span className="text-[#0a0a0a]">
                {data.creditCard.yearsToPayOff} years
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-2xl bg-white border-2 border-[#059669] shadow-sm relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#059669] text-white text-[10px] font-medium rounded-full">
            Recommended
          </span>
          <p className="text-xs text-[#059669] uppercase tracking-wide mb-3 font-medium">
            Personal Loan
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Amount</span>
              <span className="text-[#0a0a0a]">
                AED {data.balance.toLocaleString("en-AE")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Rate</span>
              <span className="text-[#059669]">
                {data.personalLoan.annualRate}% p.a.
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#737373]">Total Interest</span>
              <span className="text-[#059669] font-semibold">
                AED {data.personalLoan.totalInterest.toLocaleString("en-AE")}
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
        className="mt-6 p-5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <TrendingDown className="w-6 h-6 text-[#059669] mx-auto mb-2" />
        <p className="text-lg font-bold text-[#059669]">
          Save AED {data.potentialSavings.toLocaleString("en-AE")} in interest
        </p>
        <p className="text-sm text-[#737373] mt-1">
          By consolidating into a personal loan at {data.personalLoan.annualRate}%
        </p>
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-[#a3a3a3]">
          <ArrowRight className="w-3 h-3" />
          <span>Click Next to get matched with the best rates</span>
        </div>
      </motion.div>
    </div>
  );
}

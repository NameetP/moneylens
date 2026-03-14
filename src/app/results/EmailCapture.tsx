"use client";

import { useState } from "react";
import { CheckCircle, ArrowRight, Bell } from "lucide-react";

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface Props {
  totalSpend: number;
  topCategory: string;
  categories: CategoryData[];
  bankName?: string;
  cardType?: string;
  statementPeriod?: string;
}

export function EmailCapture({
  totalSpend,
  topCategory,
  categories,
  bankName,
  cardType,
  statementPeriod,
}: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [monthlyReminder, setMonthlyReminder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          monthlyReminder,
          totalSpend: Math.round(totalSpend),
          categories,
          bankName,
          cardType,
          statementPeriod,
          context: {
            totalSpend: Math.round(totalSpend),
            topCategory,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-3xl bg-[#F0FDFA] border-2 border-[#CCFBF1] text-center">
        <CheckCircle className="w-8 h-8 text-[#0F766E] mx-auto mb-3" />
        <p className="font-semibold text-[#134E4A]">Check your inbox! ✨</p>
        <p className="text-sm text-[#0F766E] mt-1">
          {monthlyReminder
            ? "Your spending summary is on its way. We\u2019ll also remind you next month."
            : "Your spending summary is on its way."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-3xl bg-white border-2 border-[#E7E5E4]"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="text-2xl">📧</div>
        <div>
          <h3 className="font-semibold text-[#1C1917]">
            Get your spending summary
          </h3>
          <p className="text-sm text-[#78716C] mt-0.5">
            We&apos;ll email you a clean breakdown you can reference anytime.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 bg-white border-2 border-[#E7E5E4] rounded-2xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C2410C]/10 focus:border-[#C2410C] transition-all"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50"
            style={{ boxShadow: "var(--shadow-terra)" }}
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Send
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 px-1">{error}</p>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={monthlyReminder}
            onChange={(e) => setMonthlyReminder(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#D6D3D1] text-[#0F766E] accent-[#0F766E]"
          />
          <span className="flex items-center gap-1.5 text-xs text-[#78716C]">
            <Bell className="w-3 h-3" />
            Remind me to analyze next month&apos;s statement
          </span>
        </label>
      </form>

      <p className="text-[10px] text-[#A8A29E] mt-3">
        No spam. Unsubscribe anytime. We never share your email.
      </p>
    </div>
  );
}

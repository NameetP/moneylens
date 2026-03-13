"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowRight, Bell } from "lucide-react";

interface Props {
  totalSpend: number;
  topCategory: string;
}

export function EmailCapture({ totalSpend, topCategory }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [monthlyReminder, setMonthlyReminder] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);

    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          monthlyReminder,
          context: {
            totalSpend: Math.round(totalSpend),
            topCategory,
          },
        }),
      });
      setSubmitted(true);
    } catch {
      // Still show success — we don't want to block the flow
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-center">
        <CheckCircle className="w-8 h-8 text-[#059669] mx-auto mb-3" />
        <p className="font-semibold text-[#065f46]">You&apos;re all set!</p>
        <p className="text-sm text-[#047857] mt-1">
          {monthlyReminder
            ? "We\u2019ll send you a monthly reminder to track your spending."
            : "We\u2019ll send your spending summary shortly."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-[#059669]" />
        </div>
        <div>
          <h3 className="font-semibold text-[#0a0a0a]">
            Get your spending summary
          </h3>
          <p className="text-sm text-[#737373] mt-0.5">
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
            className="flex-1 px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-xl text-sm text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
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

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={monthlyReminder}
            onChange={(e) => setMonthlyReminder(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#d4d4d4] text-[#059669] accent-[#059669]"
          />
          <span className="flex items-center gap-1.5 text-xs text-[#737373]">
            <Bell className="w-3 h-3" />
            Remind me to analyze next month&apos;s statement
          </span>
        </label>
      </form>

      <p className="text-[10px] text-[#a3a3a3] mt-3">
        No spam. Unsubscribe anytime. We never share your email.
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, ExternalLink } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface Category {
  name: string;
  amount: number;
}

interface CardRec {
  id: string;
  name: string;
  bank: string;
  annualFee: number;
  annualRewards: number;
  netAnnualBenefit: number;
  highlights: string[];
  applyUrl: string;
}

interface Props {
  categories: Category[];
}

export function CardRecommendations({ categories }: Props) {
  const [cards, setCards] = useState<CardRec[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/recommend-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories }),
    })
      .then((r) => r.json())
      .then((r) => {
        setCards(r.recommendations || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#e5e5e5] border-t-[#059669] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="text-center py-16">
        <CreditCard className="w-10 h-10 text-[#a3a3a3] mx-auto mb-4" />
        <p className="text-[#525252] font-medium">Could not load card recommendations</p>
        <p className="text-sm text-[#a3a3a3] mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 tracking-[-0.02em] text-[#0a0a0a]">
        Better Cards For You
      </h2>
      <p className="text-[#737373] text-sm mb-6">
        Based on your spending pattern, these cards could save you more.
      </p>
      <div className="flex items-center gap-1.5 mb-8">
        <svg className="w-3 h-3 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[11px] text-[#a3a3a3] font-medium">
          Card rates verified March 2026
        </span>
      </div>

      <div className="space-y-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="p-5 rounded-2xl bg-white border border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f5f5f4] flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-[#525252]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a]">{card.name}</h3>
                    <p className="text-sm text-[#737373]">{card.bank}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#059669]">
                      <TrendingUp className="w-4 h-4" />
                      <AnimatedNumber
                        value={card.netAnnualBenefit}
                        prefix="AED "
                        suffix="/yr"
                        className="text-lg font-bold"
                      />
                    </div>
                    <p className="text-xs text-[#a3a3a3]">net annual benefit</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {card.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[#f5f5f4] text-[#525252] border border-[#e5e5e5]"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f5f5f4]">
                  <div className="flex gap-4 text-xs text-[#737373]">
                    <span>
                      Annual fee:{" "}
                      {card.annualFee === 0
                        ? "Free"
                        : `AED ${card.annualFee}`}
                    </span>
                    <span>
                      Annual rewards: AED{" "}
                      {card.annualRewards.toLocaleString("en-AE")}
                    </span>
                  </div>
                  <a
                    href={card.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-1.5 text-xs font-medium rounded-lg bg-[#059669] text-white hover:bg-[#047857] transition-colors shadow-sm"
                  >
                    Apply
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Affiliate disclosure */}
      <p className="text-[10px] text-[#a3a3a3] mt-6 text-center leading-relaxed">
        We may earn a commission if you apply through our links, at no extra cost to you.
        This does not affect our recommendations — cards are ranked solely by your spending match.
      </p>
    </div>
  );
}

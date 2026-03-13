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
        <div className="w-6 h-6 border-2 border-[#E7E5E4] border-t-[#C2410C] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-3xl mb-3">💳</p>
        <p className="text-[#57534E] font-semibold">Could not load card recommendations</p>
        <p className="text-sm text-[#A8A29E] mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="text-2xl font-extrabold mb-1 tracking-[-0.03em] text-[#1C1917]"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        🎯 Better Cards For You
      </h2>
      <p className="text-[#78716C] text-sm mb-6">
        Based on your spending pattern, these cards could save you more.
      </p>
      <div className="flex items-center gap-1.5 mb-8">
        <span className="text-xs">✅</span>
        <span className="text-[11px] text-[#A8A29E] font-medium">
          Card rates verified March 2026
        </span>
      </div>

      <div className="space-y-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="p-5 rounded-3xl bg-white border-2 border-[#E7E5E4] hover:border-[#D6D3D1] hover:shadow-md transition-all"
            style={{ boxShadow: "var(--shadow-xs)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-[#D97706]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#1C1917]">{card.name}</h3>
                    <p className="text-sm text-[#78716C]">{card.bank}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#0F766E]">
                      <TrendingUp className="w-4 h-4" />
                      <AnimatedNumber
                        value={card.netAnnualBenefit}
                        prefix="AED "
                        suffix="/yr"
                        className="text-lg font-bold"
                      />
                    </div>
                    <p className="text-xs text-[#A8A29E]">net annual benefit</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {card.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2.5 py-1 text-xs rounded-full bg-[#F5F5F4] text-[#57534E] border border-[#E7E5E4]"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5F5F4]">
                  <div className="flex gap-4 text-xs text-[#78716C]">
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
                    className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-full bg-[#C2410C] text-white hover:bg-[#9A3412] transition-colors"
                    style={{ boxShadow: "var(--shadow-terra)" }}
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

      <p className="text-[10px] text-[#A8A29E] mt-6 text-center leading-relaxed">
        We may earn a commission if you apply through our links, at no extra cost to you.
        This does not affect our recommendations — cards are ranked solely by your spending match.
      </p>
    </div>
  );
}

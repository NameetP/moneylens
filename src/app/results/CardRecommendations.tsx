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

  useEffect(() => {
    fetch("/api/recommend-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories }),
    })
      .then((r) => r.json())
      .then((r) => {
        setCards(r.recommendations);
        setLoading(false);
      });
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#22c55e] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Better Cards For You</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Based on your spending pattern, these cards could save you more.
      </p>

      <div className="space-y-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-zinc-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{card.name}</h3>
                    <p className="text-sm text-zinc-500">{card.bank}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#22c55e]">
                      <TrendingUp className="w-4 h-4" />
                      <AnimatedNumber
                        value={card.netAnnualBenefit}
                        prefix="AED "
                        suffix="/yr"
                        className="text-lg font-bold"
                      />
                    </div>
                    <p className="text-xs text-zinc-600">net annual benefit</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {card.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 text-zinc-400"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/50">
                  <div className="flex gap-4 text-xs text-zinc-500">
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
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#22c55e] text-black hover:bg-[#16a34a] transition-colors"
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
    </div>
  );
}

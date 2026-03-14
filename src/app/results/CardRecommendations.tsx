"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface Category {
  name: string;
  amount: number;
}

interface WhyReason {
  emoji: string;
  text: string;
  savings: number;
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
  whyReasons: WhyReason[];
}

interface OwnedCard {
  id: string;
  name: string;
  bank: string;
}

interface Props {
  categories: Category[];
  bankName?: string;
  cardType?: string;
}

// ── Helpers ────────────────────────────────────────────────
function getOwnedCards(): OwnedCard[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem("ownedCards");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveOwnedCards(cards: OwnedCard[]) {
  sessionStorage.setItem("ownedCards", JSON.stringify(cards));
}

// Try to auto-detect current card from statement data
function detectCurrentCard(
  bankName?: string,
  cardType?: string
): OwnedCard | null {
  if (!bankName) return null;

  const bankPrefixMap: Record<string, string> = {
    "Emirates NBD": "enbd",
    ENBD: "enbd",
    ADCB: "adcb",
    FAB: "fab",
    "First Abu Dhabi": "fab",
    Mashreq: "mashreq",
    HSBC: "hsbc",
    DIB: "dib",
    "Dubai Islamic": "dib",
    "RAK Bank": "rak",
    RAKBANK: "rak",
    CBD: "cbd",
    "Standard Chartered": "sc",
    Citibank: "citi",
  };

  const prefix = Object.entries(bankPrefixMap).find(([key]) =>
    bankName.toLowerCase().includes(key.toLowerCase())
  )?.[1];

  if (!prefix) return null;

  return {
    id: `${prefix}-detected`,
    name: cardType || "Credit Card",
    bank: bankName,
  };
}

// ── Component ──────────────────────────────────────────────
export function CardRecommendations({
  categories,
  bankName,
  cardType,
}: Props) {
  const [cards, setCards] = useState<CardRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ownedCards, setOwnedCards] = useState<OwnedCard[]>([]);
  const [showOwned, setShowOwned] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize owned cards (auto-detect current + load saved)
  useEffect(() => {
    const saved = getOwnedCards();
    const detected = detectCurrentCard(bankName, cardType);

    if (detected && !saved.some((c) => c.bank === detected.bank)) {
      const updated = [detected, ...saved];
      setOwnedCards(updated);
      saveOwnedCards(updated);
    } else {
      setOwnedCards(saved);
    }
    setInitialized(true);
  }, [bankName, cardType]);

  // Fetch recommendations (re-fetches when owned cards change)
  const fetchRecs = useCallback(async () => {
    if (!initialized) return;
    setLoading(true);
    try {
      const res = await fetch("/api/recommend-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories,
          ownedCardIds: ownedCards.map((c) => c.id),
        }),
      });
      const data = await res.json();
      setCards(data.recommendations || []);
      setError(false);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [categories, ownedCards, initialized]);

  useEffect(() => {
    fetchRecs();
  }, [fetchRecs]);

  const removeOwnedCard = (id: string) => {
    const updated = ownedCards.filter((c) => c.id !== id);
    setOwnedCards(updated);
    saveOwnedCards(updated);
  };

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
        <p className="text-[#57534E] font-semibold">
          Could not load card recommendations
        </p>
        <p className="text-sm text-[#A8A29E] mt-1">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="text-2xl font-extrabold mb-1 tracking-[-0.03em] text-[#1C1917]"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        Better Cards For You
      </h2>
      <p className="text-[#78716C] text-sm mb-4">
        Based on your spending pattern, these cards could save you more.
      </p>

      {/* ── Your Cards (owned) ────────────────────────── */}
      {ownedCards.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowOwned(!showOwned)}
            className="flex items-center gap-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            {ownedCards.length} card{ownedCards.length > 1 ? "s" : ""} excluded
            (yours)
            {showOwned ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          <AnimatePresence>
            {showOwned && (
              <motion.div
                className="mt-2 space-y-1.5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {ownedCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5F5F4] border border-[#E7E5E4] text-xs"
                  >
                    <CreditCard className="w-3 h-3 text-[#A8A29E]" />
                    <span className="text-[#57534E] flex-1">
                      {card.bank} {card.name}
                    </span>
                    <button
                      onClick={() => removeOwnedCard(card.id)}
                      className="p-0.5 rounded-full hover:bg-[#E7E5E4] text-[#A8A29E] hover:text-[#57534E] transition-colors"
                      title="Remove from your cards"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex items-center gap-1.5 mb-8">
        <span className="text-xs">✅</span>
        <span className="text-[11px] text-[#A8A29E] font-medium">
          Card rates verified March 2026
        </span>
      </div>

      {/* ── Card Recommendations ──────────────────────── */}
      <div className="space-y-4">
        {cards.map((card, i) => {
          const isExpanded = expandedCard === card.id;

          return (
            <motion.div
              key={card.id}
              className="rounded-3xl bg-white border-2 border-[#E7E5E4] hover:border-[#D6D3D1] hover:shadow-md transition-all overflow-hidden"
              style={{ boxShadow: "var(--shadow-xs)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-[#D97706]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[#1C1917]">
                          {card.name}
                        </h3>
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
                        <p className="text-xs text-[#A8A29E]">
                          net annual benefit
                        </p>
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
              </div>

              {/* ── Why This Card (expandable) ─────────── */}
              {card.whyReasons && card.whyReasons.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      setExpandedCard(isExpanded ? null : card.id)
                    }
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFFBEB] border-t-2 border-[#FDE68A] text-xs font-semibold text-[#92400E] hover:bg-[#FEF3C7] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Why this card is good for you
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="px-5 pb-5 bg-[#FFFBEB]"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="space-y-3 pt-3">
                          {card.whyReasons.map((reason, j) => (
                            <motion.div
                              key={j}
                              className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#FDE68A]"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.1 }}
                            >
                              <span className="text-lg shrink-0 mt-0.5">
                                {reason.emoji}
                              </span>
                              <p className="text-sm text-[#57534E] leading-relaxed">
                                {reason.text}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-[#A8A29E] mt-6 text-center leading-relaxed">
        We may earn a commission if you apply through our links, at no extra
        cost to you. This does not affect our recommendations — cards are ranked
        solely by your spending match.
      </p>
    </div>
  );
}

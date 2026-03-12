import { NextRequest, NextResponse } from "next/server";
import cards from "@/data/uae-cards.json";

interface SpendingCategory {
  name: string;
  amount: number;
}

type CategoryKey =
  | "dining"
  | "groceries"
  | "shopping"
  | "transport"
  | "subscriptions"
  | "other";

function categoryNameToKey(name: string): CategoryKey {
  const map: Record<string, CategoryKey> = {
    Dining: "dining",
    Groceries: "groceries",
    Shopping: "shopping",
    Transport: "transport",
    Subscriptions: "subscriptions",
    Other: "other",
  };
  return map[name] || "other";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const categories: SpendingCategory[] = body.categories || [];
  const currentCardId: string = body.currentCardId || "";

  // Calculate annual rewards for each card based on spending
  const scored = cards
    .filter((card) => card.id !== currentCardId)
    .map((card) => {
      let annualRewards = 0;
      for (const cat of categories) {
        const key = categoryNameToKey(cat.name);
        const rate = card.rewardRates[key] || 0;
        // Monthly spend * 12 * reward rate / 100
        annualRewards += cat.amount * 12 * (rate / 100);
      }

      const netAnnualBenefit = annualRewards - card.annualFee;

      return {
        ...card,
        annualRewards: Math.round(annualRewards),
        netAnnualBenefit: Math.round(netAnnualBenefit),
      };
    })
    .sort((a, b) => b.netAnnualBenefit - a.netAnnualBenefit)
    .slice(0, 3);

  return NextResponse.json({
    success: true,
    recommendations: scored,
  });
}

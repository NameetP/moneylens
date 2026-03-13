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
  | "entertainment"
  | "travel"
  | "health"
  | "utilities"
  | "other";

function categoryNameToKey(name: string): CategoryKey {
  const map: Record<string, CategoryKey> = {
    Dining: "dining",
    Groceries: "groceries",
    Shopping: "shopping",
    Transport: "transport",
    Subscriptions: "subscriptions",
    Entertainment: "entertainment",
    Travel: "travel",
    Health: "health",
    Utilities: "utilities",
    "Home & Services": "other",
    "Kids & Family": "other",
    Other: "other",
  };
  return map[name] || "other";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const categories: SpendingCategory[] = body.categories || [];
    const currentCardId: string = body.currentCardId || "";

    const scored = (cards as Record<string, unknown>[])
      .filter((card: Record<string, unknown>) => card.id !== currentCardId)
      .map((card: Record<string, unknown>) => {
        let annualRewards = 0;
        const rewardRates = card.rewardRates as Record<string, number>;
        const cashbackCap = (card.cashbackCap as number) || 0;

        for (const cat of categories) {
          const key = categoryNameToKey(cat.name);
          const rate = rewardRates[key] || rewardRates["other"] || 0;
          annualRewards += cat.amount * 12 * (rate / 100);
        }

        // Apply cashback cap if the card has one
        if (cashbackCap > 0) {
          const annualCap = cashbackCap * 12;
          annualRewards = Math.min(annualRewards, annualCap);
        }

        const annualFee = (card.annualFee as number) || 0;
        const netAnnualBenefit = annualRewards - annualFee;

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
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request.", recommendations: [] },
      { status: 400 }
    );
  }
}

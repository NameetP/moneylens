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

function keyToLabel(key: string): string {
  const map: Record<string, string> = {
    dining: "dining",
    groceries: "groceries",
    shopping: "shopping",
    transport: "transport",
    subscriptions: "subscriptions",
    entertainment: "entertainment",
    travel: "travel",
    health: "health",
    utilities: "utilities",
    other: "other spending",
  };
  return map[key] || key;
}

interface WhyReason {
  emoji: string;
  text: string;
  savings: number;
}

function generateWhyReasons(
  card: Record<string, unknown>,
  categories: SpendingCategory[]
): WhyReason[] {
  const rewardRates = card.rewardRates as Record<string, number>;
  const reasons: WhyReason[] = [];

  // Sort categories by amount descending — focus on top spend areas
  const sorted = [...categories].sort((a, b) => b.amount - a.amount);

  // 1. Per-category savings reasons (top 3 categories where this card excels)
  const catEmojis: Record<string, string> = {
    dining: "🍽️",
    groceries: "🛒",
    shopping: "🛍️",
    transport: "🚗",
    subscriptions: "📱",
    entertainment: "🎬",
    travel: "✈️",
    health: "🏥",
    utilities: "💡",
    other: "💳",
  };

  for (const cat of sorted.slice(0, 5)) {
    const key = categoryNameToKey(cat.name);
    const rate = rewardRates[key] || rewardRates["other"] || 0;
    if (rate <= 0.5) continue; // Skip trivial rates

    const annualSavings = Math.round(cat.amount * 12 * (rate / 100));
    if (annualSavings < 50) continue; // Skip tiny savings

    reasons.push({
      emoji: catEmojis[key] || "💳",
      text: `You spend AED ${cat.amount.toLocaleString("en-AE")}/mo on ${keyToLabel(key)} — this card gives ${rate}% back = AED ${annualSavings.toLocaleString("en-AE")}/yr`,
      savings: annualSavings,
    });
  }

  // 2. Fee advantage
  const annualFee = (card.annualFee as number) || 0;
  if (annualFee === 0) {
    reasons.push({
      emoji: "🆓",
      text: "No annual fee — every dirham of cashback is pure savings",
      savings: 0,
    });
  }

  // 3. Lounge access
  if (card.loungeAccess) {
    reasons.push({
      emoji: "✈️",
      text: "Complimentary airport lounge access included",
      savings: 0,
    });
  }

  // 4. Welcome bonus
  const welcomeBonus = card.welcomeBonus as string;
  if (welcomeBonus && welcomeBonus.length > 5) {
    reasons.push({
      emoji: "🎁",
      text: welcomeBonus,
      savings: 0,
    });
  }

  // Return top 3 reasons, prioritizing savings-based ones
  return reasons
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 3);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const categories: SpendingCategory[] = body.categories || [];
    const ownedCardIds: string[] = body.ownedCardIds || [];
    // Legacy support
    const currentCardId: string = body.currentCardId || "";

    // Build exclusion set: owned cards + legacy currentCardId
    const excludeIds = new Set<string>(ownedCardIds);
    if (currentCardId) excludeIds.add(currentCardId);

    const scored = (cards as Record<string, unknown>[])
      .filter((card: Record<string, unknown>) => !excludeIds.has(card.id as string))
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

        // Generate personalized "Why this card" reasons
        const whyReasons = generateWhyReasons(card, categories);

        return {
          ...card,
          annualRewards: Math.round(annualRewards),
          netAnnualBenefit: Math.round(netAnnualBenefit),
          whyReasons,
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

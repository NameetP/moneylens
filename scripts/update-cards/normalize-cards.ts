/**
 * Card Data Normalizer
 *
 * Takes raw scraped card data (raw-cards.json) and uses Claude Haiku
 * to extract structured reward rates from benefit text.
 *
 * Output: normalized-cards.json (matching uae-cards.json schema)
 *
 * Usage: npx tsx scripts/update-cards/normalize-cards.ts
 * Requires: ANTHROPIC_API_KEY env var
 *
 * Cost: ~$0.04 per run (40 cards × $0.001/card)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const RAW_PATH = join(__dirname, "raw-cards.json");
const OUTPUT_PATH = join(__dirname, "normalized-cards.json");

interface RawCard {
  name: string;
  bank: string;
  annualFee: string;
  benefits: string[];
  minSalary: string;
  network: string;
  url: string;
  source: string;
}

interface NormalizedCard {
  id: string;
  name: string;
  bank: string;
  network: string;
  tier: string;
  annualFee: number;
  rewardRates: {
    dining: number;
    groceries: number;
    shopping: number;
    transport: number;
    travel: number;
    subscriptions: number;
    entertainment: number;
    health: number;
    utilities: number;
    other: number;
  };
  highlights: string[];
  minSalary: number;
  welcomeBonus: string;
  loungeAccess: boolean;
  cashbackCap: number | null;
  applyUrl: string;
  _source: string;
  _normalizedAt: string;
}

const SYSTEM_PROMPT = `You are a financial data extraction specialist. Given a UAE credit card's name, bank, and benefits text, extract structured reward rates.

Return ONLY a JSON object with these exact fields:
{
  "network": "Visa" | "Mastercard" | "Amex" | "Unknown",
  "tier": "Platinum" | "Gold" | "Titanium" | "Signature" | "Infinite" | "World" | "World Elite" | "Classic" | "Standard",
  "annualFee": number (in AED, 0 if free),
  "rewardRates": {
    "dining": number (percentage, e.g. 5.0 = 5%),
    "groceries": number,
    "shopping": number,
    "transport": number,
    "travel": number,
    "subscriptions": number,
    "entertainment": number,
    "health": number,
    "utilities": number,
    "other": number
  },
  "highlights": ["top 4 key benefits as short strings"],
  "minSalary": number (AED, 0 if unknown),
  "welcomeBonus": "welcome offer text or empty string",
  "loungeAccess": boolean,
  "cashbackCap": number | null (monthly cap in AED, null if no cap),
  "applyUrl": ""
}

Rules:
- If a benefit says "X% cashback on dining" → dining rate = X
- If "X% on all purchases" → set all categories to X
- For points-based cards, convert to approximate AED value percentage
  (e.g., "3x points on dining where 1 point = AED 0.005 per AED 1" → dining: 1.5%)
- If a category isn't specifically mentioned, use the general/base rate
- Default base rate is usually 0.25-1% for most UAE cards
- Annual fee: extract from benefits text or fee field, convert to AED
- Lounge access: true if any lounge benefit is mentioned
- Return ONLY valid JSON`;

async function normalizeCard(card: RawCard): Promise<NormalizedCard | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const benefitsText = card.benefits.join("\n");
  const userMessage = `Card: ${card.name}
Bank: ${card.bank}
Listed annual fee: ${card.annualFee}
Listed minimum salary: ${card.minSalary}
Network: ${card.network}

Benefits:
${benefitsText}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      console.warn(`  ⚠ API error for ${card.name}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;

    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    const extracted = JSON.parse(jsonStr);

    // Generate stable ID
    const id = `${card.bank}-${card.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return {
      id,
      name: card.name,
      bank: card.bank,
      network: extracted.network || card.network || "Unknown",
      tier: extracted.tier || "Standard",
      annualFee: extracted.annualFee || 0,
      rewardRates: {
        dining: extracted.rewardRates?.dining || 0,
        groceries: extracted.rewardRates?.groceries || 0,
        shopping: extracted.rewardRates?.shopping || 0,
        transport: extracted.rewardRates?.transport || 0,
        travel: extracted.rewardRates?.travel || 0,
        subscriptions: extracted.rewardRates?.subscriptions || 0,
        entertainment: extracted.rewardRates?.entertainment || 0,
        health: extracted.rewardRates?.health || 0,
        utilities: extracted.rewardRates?.utilities || 0,
        other: extracted.rewardRates?.other || 0,
      },
      highlights: (extracted.highlights || []).slice(0, 4),
      minSalary: extracted.minSalary || 0,
      welcomeBonus: extracted.welcomeBonus || "",
      loungeAccess: extracted.loungeAccess || false,
      cashbackCap: extracted.cashbackCap || null,
      applyUrl: card.url || "",
      _source: card.source,
      _normalizedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(`  ⚠ Failed to normalize ${card.name}:`, (error as Error).message);
    return null;
  }
}

async function main() {
  console.log("🤖 MoneyLens Card Normalizer");
  console.log("============================\n");

  if (!existsSync(RAW_PATH)) {
    console.error("❌ raw-cards.json not found. Run scrape-cards.ts first.");
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set.");
    process.exit(1);
  }

  const rawCards: RawCard[] = JSON.parse(readFileSync(RAW_PATH, "utf-8"));
  console.log(`📥 Loaded ${rawCards.length} raw cards\n`);

  const normalized: NormalizedCard[] = [];

  // Process in batches of 5 to respect rate limits
  for (let i = 0; i < rawCards.length; i += 5) {
    const batch = rawCards.slice(i, i + 5);
    const results = await Promise.all(batch.map(normalizeCard));

    for (const result of results) {
      if (result) {
        normalized.push(result);
        console.log(`  ✅ ${result.bank} — ${result.name}`);
      }
    }

    // Small delay between batches
    if (i + 5 < rawCards.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n📊 Normalized ${normalized.length}/${rawCards.length} cards`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(normalized, null, 2));
  console.log(`💾 Saved to ${OUTPUT_PATH}`);
}

main().catch(console.error);

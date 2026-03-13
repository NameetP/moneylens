/**
 * Card Database Merger
 *
 * Diffs normalized-cards.json against current uae-cards.json
 * and produces an updated database + change report.
 *
 * Rules:
 * - New cards → auto-add
 * - Fee/rate changes → auto-update (unless manualOverride)
 * - Cards not in scrape → flag for review (never auto-delete)
 * - Cards with manualOverride → skip
 *
 * Output: updated uae-cards.json + weekly-diff.json
 *
 * Usage: npx tsx scripts/update-cards/merge-cards.ts
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const NORMALIZED_PATH = join(__dirname, "normalized-cards.json");
const CARDS_PATH = join(__dirname, "../../src/data/uae-cards.json");
const DIFF_PATH = join(__dirname, "weekly-diff.json");

interface CardEntry {
  id: string;
  name: string;
  bank: string;
  network: string;
  tier: string;
  annualFee: number;
  rewardRates: Record<string, number>;
  highlights: string[];
  minSalary: number;
  welcomeBonus: string;
  loungeAccess: boolean;
  cashbackCap: number | null;
  applyUrl: string;
  manualOverride?: boolean;
  _source?: string;
  _normalizedAt?: string;
}

interface DiffEntry {
  type: "added" | "updated" | "potentially_removed" | "skipped_manual";
  cardId: string;
  cardName: string;
  bank: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
}

function main() {
  console.log("🔀 MoneyLens Card Merger");
  console.log("========================\n");

  if (!existsSync(NORMALIZED_PATH)) {
    console.error("❌ normalized-cards.json not found. Run normalize-cards.ts first.");
    process.exit(1);
  }

  const normalized: CardEntry[] = JSON.parse(readFileSync(NORMALIZED_PATH, "utf-8"));
  const current: CardEntry[] = JSON.parse(readFileSync(CARDS_PATH, "utf-8"));

  console.log(`📥 Current database: ${current.length} cards`);
  console.log(`📥 Normalized input: ${normalized.length} cards\n`);

  const currentMap = new Map(current.map((c) => [c.id, c]));
  const normalizedMap = new Map(normalized.map((c) => [c.id, c]));
  const diff: DiffEntry[] = [];
  const updated: CardEntry[] = [];

  // Process existing cards
  for (const card of current) {
    if (card.manualOverride) {
      // Keep manual overrides untouched
      updated.push(card);
      if (normalizedMap.has(card.id)) {
        diff.push({
          type: "skipped_manual",
          cardId: card.id,
          cardName: card.name,
          bank: card.bank,
        });
      }
      continue;
    }

    const newVersion = normalizedMap.get(card.id);
    if (newVersion) {
      // Check for changes
      const changes: Record<string, { old: unknown; new: unknown }> = {};

      if (card.annualFee !== newVersion.annualFee) {
        changes.annualFee = { old: card.annualFee, new: newVersion.annualFee };
      }

      // Check reward rate changes
      for (const [category, rate] of Object.entries(newVersion.rewardRates)) {
        const oldRate = card.rewardRates[category] || 0;
        if (Math.abs(oldRate - rate) > 0.01) {
          changes[`rewardRates.${category}`] = { old: oldRate, new: rate };
        }
      }

      if (card.minSalary !== newVersion.minSalary && newVersion.minSalary > 0) {
        changes.minSalary = { old: card.minSalary, new: newVersion.minSalary };
      }

      if (Object.keys(changes).length > 0) {
        // Apply updates but keep existing applyUrl if new one is generic
        const merged = {
          ...card,
          annualFee: newVersion.annualFee,
          rewardRates: newVersion.rewardRates,
          highlights: newVersion.highlights.length > 0 ? newVersion.highlights : card.highlights,
          minSalary: newVersion.minSalary || card.minSalary,
          loungeAccess: newVersion.loungeAccess,
          cashbackCap: newVersion.cashbackCap,
          applyUrl: card.applyUrl, // Keep existing URLs (they're hand-curated)
        };
        updated.push(merged);
        diff.push({
          type: "updated",
          cardId: card.id,
          cardName: card.name,
          bank: card.bank,
          changes,
        });
        console.log(`  📝 Updated: ${card.bank} — ${card.name}`);
      } else {
        updated.push(card);
      }
    } else {
      // Not found in scrape — might be discontinued, flag for review
      updated.push(card); // Keep it, don't auto-delete
      diff.push({
        type: "potentially_removed",
        cardId: card.id,
        cardName: card.name,
        bank: card.bank,
      });
      console.log(`  ⚠️  Not found in scrape: ${card.bank} — ${card.name}`);
    }
  }

  // Add new cards
  for (const card of normalized) {
    if (!currentMap.has(card.id)) {
      // Clean up internal fields before adding
      const { _source, _normalizedAt, ...cleanCard } = card;
      updated.push(cleanCard);
      diff.push({
        type: "added",
        cardId: card.id,
        cardName: card.name,
        bank: card.bank,
      });
      console.log(`  ✨ New card: ${card.bank} — ${card.name}`);
    }
  }

  // Sort by bank, then by name
  updated.sort((a, b) => {
    if (a.bank !== b.bank) return a.bank.localeCompare(b.bank);
    return a.name.localeCompare(b.name);
  });

  // Summary
  const added = diff.filter((d) => d.type === "added").length;
  const changed = diff.filter((d) => d.type === "updated").length;
  const flagged = diff.filter((d) => d.type === "potentially_removed").length;
  const skipped = diff.filter((d) => d.type === "skipped_manual").length;

  console.log("\n📊 Summary:");
  console.log(`  ✨ New cards added: ${added}`);
  console.log(`  📝 Cards updated: ${changed}`);
  console.log(`  ⚠️  Flagged for review: ${flagged}`);
  console.log(`  🔒 Manual overrides skipped: ${skipped}`);
  console.log(`  📦 Total cards in database: ${updated.length}`);

  // Write outputs
  writeFileSync(CARDS_PATH, JSON.stringify(updated, null, 2) + "\n");
  console.log(`\n💾 Updated ${CARDS_PATH}`);

  writeFileSync(DIFF_PATH, JSON.stringify({
    date: new Date().toISOString(),
    summary: { added, changed, flagged, skipped, total: updated.length },
    changes: diff,
  }, null, 2));
  console.log(`💾 Diff report: ${DIFF_PATH}`);

  if (added + changed === 0) {
    console.log("\n✅ No changes — card database is up to date.");
  } else {
    console.log(`\n🚀 ${added + changed} changes made. Review and commit.`);
  }
}

main();

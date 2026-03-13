/**
 * Card Database Scraper
 *
 * Scrapes UAE credit card data from comparison sites.
 * Sources: compareit4me.com, yallacompare.com
 *
 * Output: raw-cards.json (unstructured card details)
 *
 * Usage: npx tsx scripts/update-cards/scrape-cards.ts
 * Requires: playwright (npx playwright install chromium)
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

interface RawCard {
  name: string;
  bank: string;
  annualFee: string;
  benefits: string[];
  minSalary: string;
  network: string;
  url: string;
  source: string;
  scrapedAt: string;
}

const OUTPUT_PATH = join(__dirname, "raw-cards.json");

async function scrapeCompareit4me(): Promise<RawCard[]> {
  const cards: RawCard[] = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("🔍 Scraping compareit4me.com...");
    await page.goto("https://compareit4me.com/en/credit-cards/uae/all", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait for card listings to load
    await page.waitForSelector("[class*='card'], [class*='product']", { timeout: 10000 }).catch(() => {});

    // Extract card data from listing page
    const cardElements = await page.$$("[class*='card-item'], [class*='product-card'], article");

    for (const el of cardElements) {
      try {
        const name = await el.$eval(
          "h2, h3, [class*='name'], [class*='title']",
          (e) => e.textContent?.trim() || ""
        ).catch(() => "");

        const bank = await el.$eval(
          "[class*='bank'], [class*='issuer'], [class*='provider']",
          (e) => e.textContent?.trim() || ""
        ).catch(() => "");

        const fee = await el.$eval(
          "[class*='fee'], [class*='annual']",
          (e) => e.textContent?.trim() || ""
        ).catch(() => "");

        const benefits = await el.$$eval(
          "li, [class*='benefit'], [class*='feature']",
          (els) => els.map((e) => e.textContent?.trim() || "").filter(Boolean)
        ).catch(() => []);

        if (name && name.length > 3) {
          cards.push({
            name,
            bank,
            annualFee: fee,
            benefits,
            minSalary: "",
            network: "",
            url: "https://compareit4me.com/en/credit-cards/uae/all",
            source: "compareit4me",
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch {
        continue;
      }
    }

    console.log(`  Found ${cards.length} cards from compareit4me`);
  } catch (error) {
    console.warn("compareit4me scrape error:", (error as Error).message);
  } finally {
    await browser.close();
  }

  return cards;
}

async function scrapeYallacompare(): Promise<RawCard[]> {
  const cards: RawCard[] = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("🔍 Scraping yallacompare.com...");
    await page.goto("https://yallacompare.com/en-ae/credit-cards/compare", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await page.waitForSelector("[class*='card'], [class*='product']", { timeout: 10000 }).catch(() => {});

    const cardElements = await page.$$("[class*='card-item'], [class*='product-card'], [class*='listing-item']");

    for (const el of cardElements) {
      try {
        const name = await el.$eval(
          "h2, h3, [class*='name'], [class*='title']",
          (e) => e.textContent?.trim() || ""
        ).catch(() => "");

        const bank = await el.$eval(
          "[class*='bank'], [class*='provider']",
          (e) => e.textContent?.trim() || ""
        ).catch(() => "");

        const fee = await el.$eval(
          "[class*='fee']",
          (e) => e.textContent?.trim() || ""
        ).catch(() => "");

        const benefits = await el.$$eval(
          "li, [class*='benefit'], [class*='feature']",
          (els) => els.map((e) => e.textContent?.trim() || "").filter(Boolean)
        ).catch(() => []);

        if (name && name.length > 3) {
          cards.push({
            name,
            bank,
            annualFee: fee,
            benefits,
            minSalary: "",
            network: "",
            url: "https://yallacompare.com/en-ae/credit-cards/compare",
            source: "yallacompare",
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch {
        continue;
      }
    }

    console.log(`  Found ${cards.length} cards from yallacompare`);
  } catch (error) {
    console.warn("yallacompare scrape error:", (error as Error).message);
  } finally {
    await browser.close();
  }

  return cards;
}

async function main() {
  console.log("🏦 MoneyLens Card Scraper");
  console.log("========================\n");

  const [c4m, yc] = await Promise.all([
    scrapeCompareit4me(),
    scrapeYallacompare(),
  ]);

  // Merge and deduplicate
  const allCards = [...c4m, ...yc];
  const seen = new Set<string>();
  const unique = allCards.filter((card) => {
    const key = `${card.bank}:${card.name}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n📊 Total unique cards: ${unique.length}`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2));
  console.log(`💾 Saved to ${OUTPUT_PATH}`);
}

main().catch(console.error);

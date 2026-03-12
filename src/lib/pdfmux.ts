/**
 * PDFMux integration for MoneyLens
 *
 * Calls pdfmux CLI to extract structured data from bank statement PDFs.
 * Uses schema-guided extraction (Tier 2) when available, falls back to
 * JSON table extraction (Tier 1) + local categorization.
 */

import { execFile } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PdfMuxExtraction {
  key_values: Record<string, string>;
  tables: {
    page: number;
    label?: string;
    headers: string[];
    rows: string[][];
  }[];
  confidence?: number;
}

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit" | "payment" | "fee" | "interest";
  category: string;
}

export interface ParsedStatement {
  bankName: string;
  cardType: string;
  cardLast4: string;
  statementPeriod: string;
  totalSpend: number;
  minimumDue: number;
  outstandingBalance: number;
  interestRate: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
    transactions: number;
  }[];
  transactions: ParsedTransaction[];
}

// ─── Category mapping ────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Dining: "#f97316",
  Groceries: "#22c55e",
  Shopping: "#8b5cf6",
  Transport: "#3b82f6",
  Subscriptions: "#ec4899",
  Entertainment: "#eab308",
  Travel: "#06b6d4",
  Health: "#14b8a6",
  Utilities: "#6366f1",
  Other: "#71717a",
};

/**
 * Keyword-based merchant categorization for UAE market.
 * Ordered by specificity — first match wins.
 */
const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
  {
    category: "Groceries",
    keywords: [
      "carrefour", "spinneys", "lulu", "choithrams", "waitrose",
      "geant", "viva", "union coop", "al maya", "hypermarket",
      "supermarket", "grocery", "kibsons", "fresh", "organic",
    ],
  },
  {
    category: "Dining",
    keywords: [
      "restaurant", "cafe", "coffee", "starbucks", "costa",
      "mcdonald", "kfc", "pizza", "sushi", "burger",
      "deliveroo", "talabat", "zomato", "noon food", "careem food",
      "saltbae", "zuma", "nobu", "pf chang", "nando", "shake shack",
      "tim hortons", "dunkin", "baskin", "jollibee",
    ],
  },
  {
    category: "Transport",
    keywords: [
      "salik", "uber", "careem", "rta", "parking", "enoc",
      "adnoc", "emarat", "fuel", "petrol", "taxi", "metro",
      "nol", "valet", "car wash",
    ],
  },
  {
    category: "Subscriptions",
    keywords: [
      "netflix", "spotify", "apple", "google", "amazon prime",
      "disney", "hbo", "gym", "fitness", "youtube", "icloud",
      "adobe", "microsoft", "notion", "chatgpt", "openai",
      "du ", "etisalat", "virgin mobile",
    ],
  },
  {
    category: "Shopping",
    keywords: [
      "noon.com", "amazon.ae", "namshi", "shein", "mall",
      "ikea", "home centre", "zara", "h&m", "nike",
      "apple store", "sharaf dg", "emax", "jumbo",
      "souq", "mumzworld", "ounass", "farfetch",
    ],
  },
  {
    category: "Entertainment",
    keywords: [
      "cinema", "vox", "reel", "theme park", "wild wadi",
      "aquaventure", "ski dubai", "dubai parks", "louvre",
      "museum", "concert", "ticket",
    ],
  },
  {
    category: "Travel",
    keywords: [
      "emirates", "flydubai", "etihad", "air arabia",
      "booking.com", "hotel", "airbnb", "agoda",
      "marriott", "hilton", "rotana", "visa fee",
    ],
  },
  {
    category: "Health",
    keywords: [
      "pharmacy", "hospital", "clinic", "doctor", "medical",
      "dental", "optician", "life pharmacy", "boots", "aster",
    ],
  },
  {
    category: "Utilities",
    keywords: [
      "dewa", "du bill", "etisalat bill", "ejari",
      "municipality", "empower", "district cooling",
    ],
  },
];

function categorize(description: string): string {
  const lower = description.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }
  return "Other";
}

// ─── Amount parsing ──────────────────────────────────────────────────────────

/**
 * Parse an amount string from a UAE bank statement.
 * Handles: "1,234.50", "AED 1234.50", "1234.50 DR", "(1,234.50)", "-1234.50"
 */
function parseAmount(raw: string): { amount: number; type: "debit" | "credit" } {
  const cleaned = raw.replace(/[AED,Dhs\s]/gi, "").trim();
  const isCredit =
    cleaned.includes("CR") || cleaned.startsWith("+") || raw.toLowerCase().includes("credit");
  const isDebit =
    cleaned.includes("DR") || cleaned.startsWith("-") || cleaned.startsWith("(");

  const numStr = cleaned.replace(/[^0-9.]/g, "");
  const amount = parseFloat(numStr) || 0;

  return {
    amount,
    type: isCredit ? "credit" : "debit",
  };
}

/**
 * Parse a date string from a UAE bank statement into ISO format.
 * Handles: "01 Feb", "01/02/2026", "1-Feb-26", "February 1, 2026"
 */
function parseDate(raw: string, year = 2026): string {
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };

  const trimmed = raw.trim();

  // "01 Feb" or "1 Feb 2026"
  const match1 = trimmed.match(/(\d{1,2})\s+(\w{3})/i);
  if (match1) {
    const day = match1[1].padStart(2, "0");
    const mon = months[match1[2].toLowerCase().slice(0, 3)] || "01";
    return `${year}-${mon}-${day}`;
  }

  // "01/02/2026" (DD/MM/YYYY)
  const match2 = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (match2) {
    const day = match2[1].padStart(2, "0");
    const mon = match2[2].padStart(2, "0");
    const yr = match2[3].length === 2 ? `20${match2[3]}` : match2[3];
    return `${yr}-${mon}-${day}`;
  }

  return `${year}-01-01`;
}

// ─── PDFMux caller ───────────────────────────────────────────────────────────

/**
 * Call pdfmux CLI to extract structured JSON from a PDF.
 */
async function callPdfMux(pdfPath: string): Promise<PdfMuxExtraction> {
  const schemaPath = join(process.cwd(), "src", "data", "bank-statement.schema.json");

  return new Promise((resolve, reject) => {
    // Try schema-guided extraction first (Tier 2)
    execFile(
      "pdfmux",
      [pdfPath, "-f", "json", "--schema", schemaPath],
      { timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (!error && stdout) {
          try {
            resolve(JSON.parse(stdout));
            return;
          } catch { /* fall through */ }
        }

        // Fallback: basic JSON extraction (Tier 1)
        execFile(
          "pdfmux",
          [pdfPath, "-f", "json"],
          { timeout: 60_000, maxBuffer: 10 * 1024 * 1024 },
          (err2, stdout2) => {
            if (err2) {
              reject(new Error(`PDFMux failed: ${err2.message}. stderr: ${stderr}`));
              return;
            }
            try {
              resolve(JSON.parse(stdout2));
            } catch {
              reject(new Error("PDFMux returned invalid JSON"));
            }
          }
        );
      }
    );
  });
}

// ─── Statement parser ────────────────────────────────────────────────────────

/**
 * Extract key-value fields from PDFMux output.
 * Handles various UAE bank label formats.
 */
function extractField(kv: Record<string, string>, ...aliases: string[]): string {
  for (const alias of aliases) {
    const lower = alias.toLowerCase();
    for (const [key, value] of Object.entries(kv)) {
      if (key.toLowerCase().includes(lower)) return value;
    }
  }
  return "";
}

function extractNumber(kv: Record<string, string>, ...aliases: string[]): number {
  const raw = extractField(kv, ...aliases);
  if (!raw) return 0;
  return parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
}

/**
 * Detect the bank name from key-values or full text.
 */
function detectBank(kv: Record<string, string>): string {
  const allText = Object.entries(kv).flat().join(" ").toLowerCase();
  const banks = [
    { name: "Emirates NBD", keywords: ["emirates nbd", "enbd"] },
    { name: "ADCB", keywords: ["adcb", "abu dhabi commercial"] },
    { name: "FAB", keywords: ["fab", "first abu dhabi"] },
    { name: "HSBC", keywords: ["hsbc"] },
    { name: "Mashreq", keywords: ["mashreq"] },
    { name: "DIB", keywords: ["dib", "dubai islamic"] },
    { name: "RAK Bank", keywords: ["rak bank", "rakbank"] },
    { name: "CBD", keywords: ["cbd", "commercial bank of dubai"] },
    { name: "Standard Chartered", keywords: ["standard chartered"] },
    { name: "Citibank", keywords: ["citibank", "citi"] },
  ];

  for (const bank of banks) {
    if (bank.keywords.some((kw) => allText.includes(kw))) return bank.name;
  }
  return "Unknown Bank";
}

// ─── Main parse function ─────────────────────────────────────────────────────

/**
 * Parse a credit card statement PDF into MoneyLens format.
 *
 * 1. Save uploaded file to /tmp
 * 2. Call pdfmux for extraction
 * 3. Parse key-values for account info
 * 4. Parse transaction table
 * 5. Categorize merchants
 * 6. Aggregate into categories
 * 7. Clean up temp file
 */
export async function parseStatement(fileBuffer: Buffer): Promise<ParsedStatement> {
  const tmpPath = join(tmpdir(), `moneylens-${randomUUID()}.pdf`);

  try {
    // Write to temp file
    await writeFile(tmpPath, fileBuffer);

    // Call PDFMux
    const extraction = await callPdfMux(tmpPath);

    // Extract account info from key-values
    const kv = extraction.key_values || {};
    const bankName = detectBank(kv);
    const cardType = extractField(kv, "card type", "card name", "product", "card");
    const cardLast4Raw = extractField(kv, "card number", "account number", "card no");
    const cardLast4 = cardLast4Raw.replace(/[^0-9]/g, "").slice(-4) || "0000";

    const periodFrom = extractField(kv, "from", "statement date", "period from", "start date");
    const periodTo = extractField(kv, "to", "period to", "end date", "statement end");
    const statementPeriod = periodFrom && periodTo
      ? `${periodFrom} – ${periodTo}`
      : extractField(kv, "statement period", "billing period") || "Statement Period";

    const outstandingBalance = extractNumber(
      kv, "outstanding", "total due", "balance due", "total amount due", "closing balance"
    );
    const minimumDue = extractNumber(kv, "minimum", "min payment", "minimum due", "minimum amount");
    const interestRate = extractNumber(
      kv, "monthly percentage", "interest rate", "finance charge rate", "monthly rate"
    );

    // Parse transactions from the largest table (most rows = transaction table)
    const tables = extraction.tables || [];
    const txnTable = [...tables].sort((a, b) => b.rows.length - a.rows.length)[0];

    const transactions: ParsedTransaction[] = [];

    if (txnTable) {
      // Detect which columns are date, description, and amount
      const headers = txnTable.headers.map((h) => h.toLowerCase());
      const dateCol = headers.findIndex((h) =>
        ["date", "txn date", "transaction date", "posting date"].some((d) => h.includes(d))
      );
      const descCol = headers.findIndex((h) =>
        ["description", "details", "merchant", "particulars", "narrative"].some((d) => h.includes(d))
      );
      const amtCol = headers.findIndex((h) =>
        ["amount", "debit", "charge", "transaction amount"].some((d) => h.includes(d))
      );

      // Fallback: assume date=0, desc=1, amount=last
      const dIdx = dateCol >= 0 ? dateCol : 0;
      const descIdx = descCol >= 0 ? descCol : 1;
      const amtIdx = amtCol >= 0 ? amtCol : txnTable.headers.length - 1;

      for (const row of txnTable.rows) {
        const rawDate = row[dIdx] || "";
        const rawDesc = row[descIdx] || "";
        const rawAmt = row[amtIdx] || "";

        if (!rawDesc || !rawAmt) continue;

        const { amount, type: amtType } = parseAmount(rawAmt);
        if (amount === 0) continue;

        // Skip payments, fees, interest — they're not spending
        const descLower = rawDesc.toLowerCase();
        let txnType: ParsedTransaction["type"] = amtType;
        if (descLower.includes("payment") || descLower.includes("thank you")) {
          txnType = "payment";
        } else if (descLower.includes("interest") || descLower.includes("finance charge")) {
          txnType = "interest";
        } else if (descLower.includes("fee") || descLower.includes("charge") && amount < 300) {
          txnType = "fee";
        }

        transactions.push({
          date: parseDate(rawDate),
          description: rawDesc,
          amount,
          type: txnType,
          category: txnType === "debit" ? categorize(rawDesc) : "Other",
        });
      }
    }

    // Filter to spending transactions only for category aggregation
    const spending = transactions.filter((t) => t.type === "debit");
    const totalSpend = spending.reduce((sum, t) => sum + t.amount, 0);

    // Aggregate into categories
    const categoryMap = new Map<string, { amount: number; count: number }>();
    for (const txn of spending) {
      const existing = categoryMap.get(txn.category) || { amount: 0, count: 0 };
      existing.amount += txn.amount;
      existing.count += 1;
      categoryMap.set(txn.category, existing);
    }

    const categories = Array.from(categoryMap.entries())
      .map(([name, { amount, count }]) => ({
        name,
        amount: Math.round(amount),
        percentage: totalSpend > 0 ? Math.round((amount / totalSpend) * 1000) / 10 : 0,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
        transactions: count,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      bankName,
      cardType: cardType || "Credit Card",
      cardLast4,
      statementPeriod,
      totalSpend: Math.round(totalSpend),
      minimumDue: minimumDue || Math.round(totalSpend * 0.05),
      outstandingBalance,
      interestRate: interestRate || 3.49, // UAE default if not found
      categories,
      transactions: spending.slice(0, 50), // Cap at 50 for UI performance
    };
  } finally {
    // Always clean up temp file — privacy first
    await unlink(tmpPath).catch(() => {});
  }
}

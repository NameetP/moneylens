/**
 * Emirates NBD regex-based statement parser.
 *
 * Uses pdf-parse v1 for text extraction + regex patterns
 * specifically tuned for ENBD credit card statement formats.
 *
 * Tested against real Emirates NBD statements:
 * - Marriott Bonvoy World Elite Mastercard
 * - Share Visa Infinite Credit Card
 */

// pdf-parse v1 tries to load a test PDF at require-time.
import { writeFileSync, mkdirSync, existsSync } from "fs";
const testDir = "./test/data";
const testFile = `${testDir}/05-versions-space.pdf`;
if (!existsSync(testFile)) {
  mkdirSync(testDir, { recursive: true });
  writeFileSync(testFile, Buffer.from("%PDF-1.0\nstub"));
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

import type { ParsedTransaction, ParsedStatement } from "./types";
import { categorize, buildCategories } from "../categorizer";

// ─── Bank / card detection ──────────────────────────────────────────────────

export function detectBank(text: string): string {
  const lower = text.toLowerCase();
  const banks = [
    { name: "Emirates NBD", keywords: ["emirates nbd"] },
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
    if (bank.keywords.some((kw) => lower.includes(kw))) return bank.name;
  }
  return "Unknown Bank";
}

function detectCardType(text: string): string {
  const lower = text.toLowerCase();
  const types = [
    { name: "Marriott Bonvoy World Elite Mastercard", kw: ["marriott bonvoy world elite"] },
    { name: "Marriott Bonvoy Mastercard", kw: ["marriott bonvoy"] },
    { name: "Share Visa Infinite", kw: ["share visa infinite"] },
    { name: "Share Visa Signature", kw: ["share visa signature"] },
    { name: "Beyond Visa Infinite", kw: ["beyond visa infinite"] },
    { name: "Lulu Visa Platinum", kw: ["lulu visa"] },
    { name: "Visa Platinum", kw: ["visa platinum"] },
    { name: "Visa Infinite", kw: ["visa infinite"] },
    { name: "Visa Signature", kw: ["visa signature"] },
    { name: "World Elite Mastercard", kw: ["world elite mastercard"] },
    { name: "World Mastercard", kw: ["world mastercard"] },
  ];
  for (const t of types) {
    if (t.kw.some((k) => lower.includes(k))) return t.name;
  }
  return "Credit Card";
}

function extractCardLast4(text: string): string {
  const match = text.match(/(\d{4})\s*X{4}\s*X{4}\s*(\d{4})/);
  if (match) return match[2];
  const match2 = text.match(/\*{4}(\d{4})/);
  if (match2) return match2[1];
  return "0000";
}

function extractStatementPeriod(text: string): string {
  const match = text.match(/(\d{1,2}-\w{3}-\d{2,4})\s+to\s+(\d{1,2}-\w{3}-\d{2,4})/i);
  if (match) return `${match[1]} to ${match[2]}`;
  return "Statement Period";
}

// ─── Transaction parser ─────────────────────────────────────────────────────

function parseTransactions(text: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split("\n");

  const txnRegex = /^(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(.+?)(?:\s{2,})([\d,]+\.\d{2})\s*$/;
  const txnRegexCR = /^(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(.+?)$/;
  const foreignRegex = /^(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})(.+?)\s+([\d,.]+)\s+(USD|INR|GBP|EUR|SGP|CHF|IRL|FIN)\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Foreign currency match
    const foreignMatch = line.match(foreignRegex);
    if (foreignMatch) {
      let aedAmount = 0;
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextLine = lines[j].trim();
        const aedMatch = nextLine.match(/^([\d,]+\.\d{2})\s*$/);
        if (aedMatch) {
          aedAmount = parseFloat(aedMatch[1].replace(/,/g, ""));
          break;
        }
      }
      if (aedAmount > 0) {
        const txnDate = foreignMatch[1];
        const desc = foreignMatch[3].trim();
        transactions.push(makeTxn(txnDate, desc, aedAmount, false));
      }
      continue;
    }

    // Standard transaction
    const match = line.match(txnRegex);
    if (match) {
      const txnDate = match[1];
      const desc = match[3].trim();
      const amount = parseFloat(match[4].replace(/,/g, ""));
      if (amount > 0) {
        transactions.push(makeTxn(txnDate, desc, amount, false));
      }
      continue;
    }

    // Credit transactions (amount on next line with CR)
    const crMatch = line.match(txnRegexCR);
    if (crMatch) {
      const nextLine = (lines[i + 1] || "").trim();
      const crAmountMatch = nextLine.match(/^([\d,]+\.\d{2})\s*CR\s*$/i);
      if (crAmountMatch) {
        const txnDate = crMatch[1];
        const desc = crMatch[3].trim();
        const amount = parseFloat(crAmountMatch[1].replace(/,/g, ""));
        if (amount > 0) {
          transactions.push(makeTxn(txnDate, desc, amount, true));
        }
      }
    }
  }

  return transactions;
}

function makeTxn(
  dateStr: string,
  description: string,
  amount: number,
  isCredit: boolean,
): ParsedTransaction {
  const descLower = description.toLowerCase();

  let type: ParsedTransaction["type"] = isCredit ? "credit" : "debit";

  if (descLower.includes("payment") || descLower.includes("thank you")) {
    type = "payment";
  } else if (descLower.includes("interest") || descLower.includes("finance charge")) {
    type = "interest";
  } else if (
    descLower.includes("overlimit fee") ||
    descLower.includes("vat on overlimit") ||
    descLower.includes("monthly fee") ||
    descLower.includes("vat on monthly") ||
    descLower.includes("processing fee") ||
    descLower.includes("vat on processing") ||
    descLower.includes("installment plan emi") ||
    descLower.includes("conversion to installment")
  ) {
    type = "fee";
  }

  // Clean description
  const cleanDesc = description
    .replace(/\s*(DUBAI|ABU DHABI|SHARJAH|RAS AL KH|AJMAN)\s*ARE\s*$/i, "")
    .replace(/\s*(AMSTERDAM|DUBLIN|SINGAPORE|PHOENIX|MOUNTAIN VIEW|MIAMI|DOVER|BROOKLYN|MIDDLETOWN|HOUSTON|LEWES|OULU|GIBRALTAR|FRANKLIN)\s*(NLD|IRL|SGP|USA|US|GIB|FIN|CHF|IND)\s*$/i, "")
    .replace(/\s*DXB\s*ARE\s*$/i, "")
    .replace(/\s*MUMBAI\s*IND\s*$/i, "")
    .replace(/\s*BENGALURU\s*IND\s*$/i, "")
    .replace(/\s*FARIDABAD\s*IND\s*$/i, "")
    .replace(/\s*CORK\s*IRL\s*$/i, "")
    .trim();

  const dm = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const isoDate = dm ? `${dm[3]}-${dm[2]}-${dm[1]}` : dateStr;

  return {
    date: isoDate,
    description: cleanDesc,
    amount,
    type,
    category: type === "debit" ? categorize(description) : "Other",
  };
}

// ─── Summary parsers ────────────────────────────────────────────────────────

function parseStatementSummary(text: string) {
  const defaults = { previousDue: 0, purchases: 0, interestCharges: 0, payments: 0, totalDue: 0, currentBalance: 0 };
  const idx = text.indexOf("STATEMENT SUMMARY");
  if (idx < 0) return defaults;

  const block = text.slice(idx, idx + 1500);
  const lines = block.split("\n");
  for (const line of lines) {
    const amounts = [...line.matchAll(/([\d,]+\.\d{2})/g)].map((m) =>
      parseFloat(m[1].replace(/,/g, ""))
    );
    if (amounts.length >= 5) {
      return {
        previousDue: amounts[0],
        purchases: amounts[1],
        interestCharges: amounts[2],
        payments: amounts[3],
        totalDue: amounts[4],
        currentBalance: amounts[5] || amounts[4],
      };
    }
  }
  return defaults;
}

function extractHeaderNumbers(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    const match = line.match(/^(\d{4,6})([\d,]+\.\d{2})(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})([\d,]+\.\d{2})$/);
    if (match) {
      return {
        creditLimit: parseFloat(match[1]),
        availableCredit: parseFloat(match[2].replace(/,/g, "")),
        minimumDue: parseFloat(match[5].replace(/,/g, "")),
      };
    }
  }

  let minimumDue = 0;
  let creditLimit = 0;
  const minDueMatch = text.match(/Minimum Payment Due[\s\S]{0,200}?([\d,]+\.\d{2})/);
  if (minDueMatch) minimumDue = parseFloat(minDueMatch[1].replace(/,/g, ""));
  const creditMatch = text.match(/Credit Limit[\s\S]{0,100}?(\d{4,6})/);
  if (creditMatch) creditLimit = parseFloat(creditMatch[1]);

  return { creditLimit, availableCredit: 0, minimumDue };
}

// ─── Main export ────────────────────────────────────────────────────────────

/**
 * Extract raw PDF text using pdf-parse.
 * Shared by all parsers that need the raw text.
 */
export async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  const pdfData = await pdfParse(fileBuffer);
  return pdfData.text;
}

/**
 * Parse an Emirates NBD statement from raw PDF text.
 * Returns null if this doesn't look like an ENBD statement.
 */
export async function parseENBDStatement(text: string): Promise<ParsedStatement | null> {
  const bankName = detectBank(text);
  if (bankName !== "Emirates NBD") return null;

  const cardType = detectCardType(text);
  const cardLast4 = extractCardLast4(text);
  const statementPeriod = extractStatementPeriod(text);
  const header = extractHeaderNumbers(text);
  const summary = parseStatementSummary(text);
  const allTransactions = parseTransactions(text);

  const spending = allTransactions.filter((t) => t.type === "debit");
  const totalSpend = spending.reduce((sum, t) => sum + t.amount, 0);

  // If we got no transactions, this parser didn't work
  if (spending.length === 0 && totalSpend === 0) return null;

  const categories = buildCategories(spending);
  const outstandingBalance = summary.currentBalance || summary.totalDue;
  const interestRate = summary.interestCharges > 0 ? 3.25 : 0;

  return {
    bankName,
    cardType,
    cardLast4,
    statementPeriod,
    totalSpend: Math.round(totalSpend || summary.purchases),
    minimumDue: header.minimumDue || Math.round(totalSpend * 0.05),
    outstandingBalance,
    interestRate,
    creditLimit: header.creditLimit,
    totalPayments: summary.payments,
    categories,
    transactions: spending
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 100),
  };
}

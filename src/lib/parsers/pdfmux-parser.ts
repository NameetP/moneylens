/**
 * PDFMux-based statement parser.
 *
 * Uses PDFMux extract_structured with bank-statement.schema.json
 * to extract transactions from any UAE bank PDF.
 * Zero per-parse cost — runs locally via CLI.
 */

import { execSync } from "child_process";
import { writeFileSync, unlinkSync, readFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type { ParsedStatement, ParsedTransaction } from "./types";
import { categorize, buildCategories } from "../categorizer";
import { detectBank } from "./regex-parser";

const SCHEMA_PATH = join(process.cwd(), "src/data/bank-statement.schema.json");

/**
 * Parse a bank statement PDF using PDFMux extract_structured.
 * Works with any bank — schema-guided extraction handles varied layouts.
 */
export async function parsePDFMux(
  fileBuffer: Buffer,
  rawText: string,
): Promise<ParsedStatement | null> {
  const tmpPath = join("/tmp", `moneylens-${randomUUID()}.pdf`);

  try {
    // Write buffer to temp file
    writeFileSync(tmpPath, fileBuffer);

    // Call PDFMux CLI for structured extraction
    const result = execSync(
      `pdfmux extract-structured "${tmpPath}" --schema "${SCHEMA_PATH}" --format json 2>/dev/null`,
      { timeout: 30000, encoding: "utf-8", maxBuffer: 5 * 1024 * 1024 }
    );

    const extracted = JSON.parse(result);
    return mapPDFMuxResult(extracted, rawText);
  } catch (error) {
    console.warn("PDFMux parse failed, will try next parser:", (error as Error).message);
    return null;
  } finally {
    try { unlinkSync(tmpPath); } catch { /* ignore cleanup errors */ }
  }
}

/**
 * Alternative: use PDFMux convert_pdf + key-value extraction
 * if extract_structured CLI isn't available.
 */
export async function parsePDFMuxMarkdown(
  fileBuffer: Buffer,
  rawText: string,
): Promise<ParsedStatement | null> {
  const tmpPath = join("/tmp", `moneylens-${randomUUID()}.pdf`);

  try {
    writeFileSync(tmpPath, fileBuffer);

    // Try convert_pdf for markdown output
    const result = execSync(
      `pdfmux convert "${tmpPath}" --format json 2>/dev/null`,
      { timeout: 30000, encoding: "utf-8", maxBuffer: 5 * 1024 * 1024 }
    );

    const converted = JSON.parse(result);

    // Extract structured data from the key-value pairs
    if (converted.key_value_pairs || converted.tables) {
      return mapPDFMuxConvertResult(converted, rawText);
    }

    return null;
  } catch {
    return null;
  } finally {
    try { unlinkSync(tmpPath); } catch { /* ignore */ }
  }
}

// ─── Result mapping ─────────────────────────────────────────────────────────

function mapPDFMuxResult(
  extracted: Record<string, unknown>,
  rawText: string,
): ParsedStatement | null {
  const txns = extracted.transactions as Array<{
    date?: string;
    description?: string;
    amount?: number;
    type?: string;
  }> | undefined;

  if (!txns || txns.length < 2) return null;

  const bankName = (extracted.bank as string) || detectBank(rawText);
  const cardType = (extracted.card_type as string) || "Credit Card";
  const cardLast4 = (extracted.card_number_last4 as string) || "0000";

  const period = extracted.statement_period as { from?: string; to?: string } | undefined;
  const statementPeriod = period
    ? `${period.from || ""} to ${period.to || ""}`
    : "Statement Period";

  // Map transactions and categorize
  const transactions: ParsedTransaction[] = txns
    .filter((t) => t.description && t.amount)
    .map((t) => ({
      date: t.date || "",
      description: t.description!,
      amount: Math.abs(t.amount!),
      type: mapTxnType(t.type, t.amount!),
      category: mapTxnType(t.type, t.amount!) === "debit"
        ? categorize(t.description!)
        : "Other",
    }));

  const spending = transactions.filter((t) => t.type === "debit");
  const totalSpend = spending.reduce((sum, t) => sum + t.amount, 0);

  if (spending.length < 2) return null;

  const categories = buildCategories(spending);

  return {
    bankName,
    cardType,
    cardLast4,
    statementPeriod,
    totalSpend: Math.round((extracted.total_spend as number) || totalSpend),
    minimumDue: (extracted.minimum_payment as number) || Math.round(totalSpend * 0.05),
    outstandingBalance: (extracted.outstanding_balance as number) || 0,
    interestRate: (extracted.interest_rate_monthly as number) || 0,
    creditLimit: (extracted.credit_limit as number) || 0,
    totalPayments: (extracted.total_payments as number) || 0,
    categories,
    transactions: spending.sort((a, b) => b.amount - a.amount).slice(0, 100),
  };
}

function mapPDFMuxConvertResult(
  converted: Record<string, unknown>,
  rawText: string,
): ParsedStatement | null {
  // Try to extract transactions from tables
  const tables = converted.tables as Array<{
    headers?: string[];
    rows?: string[][];
  }> | undefined;

  if (!tables || tables.length === 0) return null;

  const transactions: ParsedTransaction[] = [];

  for (const table of tables) {
    if (!table.rows) continue;

    // Find columns that look like date, description, amount
    const headers = (table.headers || []).map((h) => h.toLowerCase());
    const dateCol = headers.findIndex((h) => h.includes("date") || h.includes("txn"));
    const descCol = headers.findIndex((h) => h.includes("desc") || h.includes("particular") || h.includes("merchant"));
    const amtCol = headers.findIndex((h) => h.includes("amount") || h.includes("debit") || h.includes("aed"));

    if (descCol < 0 || amtCol < 0) continue;

    for (const row of table.rows) {
      const desc = row[descCol]?.trim();
      const amtStr = row[amtCol]?.replace(/[^0-9.-]/g, "");
      const amount = parseFloat(amtStr || "0");
      const date = dateCol >= 0 ? row[dateCol]?.trim() || "" : "";

      if (desc && amount > 0) {
        transactions.push({
          date,
          description: desc,
          amount,
          type: "debit",
          category: categorize(desc),
        });
      }
    }
  }

  if (transactions.length < 2) return null;

  const bankName = detectBank(rawText);
  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categories = buildCategories(transactions);

  // Extract key-value pairs
  const kvPairs = converted.key_value_pairs as Record<string, string> | undefined;

  return {
    bankName,
    cardType: "Credit Card",
    cardLast4: "0000",
    statementPeriod: "Statement Period",
    totalSpend: Math.round(totalSpend),
    minimumDue: extractNumber(kvPairs, "minimum") || Math.round(totalSpend * 0.05),
    outstandingBalance: extractNumber(kvPairs, "outstanding") || extractNumber(kvPairs, "balance") || 0,
    interestRate: 0,
    creditLimit: extractNumber(kvPairs, "credit limit") || 0,
    totalPayments: 0,
    categories,
    transactions: transactions.sort((a, b) => b.amount - a.amount).slice(0, 100),
  };
}

function mapTxnType(type?: string, amount?: number): ParsedTransaction["type"] {
  if (type) {
    const t = type.toLowerCase();
    if (t === "credit" || t === "payment" || t === "fee" || t === "interest") {
      return t as ParsedTransaction["type"];
    }
  }
  if (amount && amount < 0) return "credit";
  return "debit";
}

function extractNumber(kvPairs: Record<string, string> | undefined, keyword: string): number {
  if (!kvPairs) return 0;
  for (const [key, value] of Object.entries(kvPairs)) {
    if (key.toLowerCase().includes(keyword)) {
      const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
      if (!isNaN(num)) return num;
    }
  }
  return 0;
}

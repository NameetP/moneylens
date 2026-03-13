/**
 * LLM-based statement parser (Claude Haiku fallback).
 *
 * Used when regex and PDFMux parsers fail.
 * Sends raw PDF text to Claude Haiku with structured output
 * to extract transactions from any bank format.
 *
 * Cost: ~$0.005 per parse.
 */

import type { ParsedStatement, ParsedTransaction } from "./types";
import { categorize, buildCategories } from "../categorizer";
import { detectBank } from "./regex-parser";

const SYSTEM_PROMPT = `You are a financial document parser specializing in UAE bank credit card statements.
Extract all transactions and account details from the raw text of a PDF bank statement.

Return a JSON object with exactly these fields:
{
  "bank": "bank name",
  "card_type": "card product name",
  "card_last4": "last 4 digits",
  "statement_period": "start date to end date",
  "outstanding_balance": number,
  "minimum_payment": number,
  "credit_limit": number,
  "interest_rate_monthly": number (monthly percentage, e.g. 3.49),
  "total_spend": number,
  "total_payments": number,
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "merchant or transaction description",
      "amount": number (positive = debit/spend, negative = credit/payment),
      "type": "debit" | "credit" | "payment" | "fee" | "interest"
    }
  ]
}

Rules:
- All amounts in AED
- For foreign currency transactions, use the AED equivalent
- Include ALL transaction line items, not just a summary
- Dates should be in ISO format YYYY-MM-DD
- "type" should be: "debit" for purchases, "credit" for refunds, "payment" for payments received, "fee" for charges/fees, "interest" for finance charges
- If a field cannot be determined, use 0 for numbers and empty string for text
- Return ONLY valid JSON, no markdown or explanation`;

interface LLMTransaction {
  date?: string;
  description?: string;
  amount?: number;
  type?: string;
}

interface LLMResult {
  bank?: string;
  card_type?: string;
  card_last4?: string;
  statement_period?: string;
  outstanding_balance?: number;
  minimum_payment?: number;
  credit_limit?: number;
  interest_rate_monthly?: number;
  total_spend?: number;
  total_payments?: number;
  transactions?: LLMTransaction[];
}

/**
 * Parse statement text using Claude Haiku.
 * Only called as last resort when regex and PDFMux fail.
 */
export async function parseLLM(rawText: string): Promise<ParsedStatement | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY not set, skipping LLM parser");
    return null;
  }

  try {
    // Truncate text to fit in context window (Haiku has 200K)
    // But keep it reasonable for cost — first 15K chars usually has all transactions
    const truncated = rawText.slice(0, 15000);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Parse this UAE bank statement text and extract all transactions:\n\n${truncated}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.warn(`LLM API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) return null;

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonStr = content.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed: LLMResult = JSON.parse(jsonStr);

    return mapLLMResult(parsed, rawText);
  } catch (error) {
    console.warn("LLM parse failed:", (error as Error).message);
    return null;
  }
}

function mapLLMResult(result: LLMResult, rawText: string): ParsedStatement | null {
  const txns = result.transactions;
  if (!txns || txns.length < 2) return null;

  const transactions: ParsedTransaction[] = txns
    .filter((t) => t.description && t.amount !== undefined)
    .map((t) => {
      const amount = Math.abs(t.amount!);
      const type = mapType(t.type, t.amount!);
      return {
        date: t.date || "",
        description: t.description!,
        amount,
        type,
        category: type === "debit" ? categorize(t.description!) : "Other",
      };
    });

  const spending = transactions.filter((t) => t.type === "debit");
  const totalSpend = spending.reduce((sum, t) => sum + t.amount, 0);

  if (spending.length < 2) return null;

  const categories = buildCategories(spending);

  return {
    bankName: result.bank || detectBank(rawText),
    cardType: result.card_type || "Credit Card",
    cardLast4: result.card_last4 || "0000",
    statementPeriod: result.statement_period || "Statement Period",
    totalSpend: Math.round(result.total_spend || totalSpend),
    minimumDue: result.minimum_payment || Math.round(totalSpend * 0.05),
    outstandingBalance: result.outstanding_balance || 0,
    interestRate: result.interest_rate_monthly || 0,
    creditLimit: result.credit_limit || 0,
    totalPayments: result.total_payments || 0,
    categories,
    transactions: spending.sort((a, b) => b.amount - a.amount).slice(0, 100),
  };
}

function mapType(type?: string, amount?: number): ParsedTransaction["type"] {
  if (type) {
    const t = type.toLowerCase();
    if (["debit", "credit", "payment", "fee", "interest"].includes(t)) {
      return t as ParsedTransaction["type"];
    }
  }
  if (amount && amount < 0) return "credit";
  return "debit";
}

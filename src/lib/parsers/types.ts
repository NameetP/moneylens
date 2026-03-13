/**
 * Shared types for MoneyLens statement parsers.
 */

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
  creditLimit: number;
  totalPayments: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
    transactions: number;
  }[];
  transactions: ParsedTransaction[];
}

/** Which parser produced the result */
export type ParseSource = "regex" | "pdfmux" | "llm" | "fallback" | "demo";

export interface ParseResult {
  success: boolean;
  source: ParseSource;
  data: ParsedStatement;
  warning?: string;
}

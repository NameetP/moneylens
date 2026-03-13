/**
 * Parser Orchestrator
 *
 * Tries parsers in order of cost/reliability:
 * 1. ENBD regex (zero cost, proven for Emirates NBD)
 * 2. PDFMux extract_structured (zero cost, works for most digital PDFs)
 * 3. Claude Haiku LLM (~$0.005, catches edge cases)
 * 4. Fallback to mock data
 */

import type { ParsedStatement, ParseSource } from "./types";
import { extractPdfText, parseENBDStatement, detectBank } from "./regex-parser";
import { parsePDFMux, parsePDFMuxMarkdown } from "./pdfmux-parser";
import { parseLLM } from "./llm-parser";

export type { ParsedStatement, ParsedTransaction, ParseSource, ParseResult } from "./types";

interface OrchestratorResult {
  data: ParsedStatement | null;
  source: ParseSource;
  bankName: string;
}

/**
 * Parse a bank statement PDF through the tiered parser chain.
 *
 * @param fileBuffer - Raw PDF file buffer
 * @returns Parsed statement data with source indicator, or null if all parsers fail
 */
export async function orchestrateParse(
  fileBuffer: Buffer,
): Promise<OrchestratorResult> {
  // Step 1: Extract raw text (needed by all parsers)
  let rawText: string;
  try {
    rawText = await extractPdfText(fileBuffer);
  } catch (error) {
    console.error("PDF text extraction failed:", error);
    return { data: null, source: "fallback", bankName: "Unknown Bank" };
  }

  const bankName = detectBank(rawText);

  // Step 2: Try ENBD regex parser (proven, zero cost)
  if (bankName === "Emirates NBD") {
    try {
      const result = await parseENBDStatement(rawText);
      if (result && result.transactions.length >= 3) {
        console.log(`✅ Regex parser succeeded: ${result.transactions.length} transactions`);
        return { data: result, source: "regex", bankName };
      }
    } catch (error) {
      console.warn("Regex parser error:", error);
    }
  }

  // Step 3: Try PDFMux extract_structured (zero cost, any bank)
  try {
    const result = await parsePDFMux(fileBuffer, rawText);
    if (result && result.transactions.length >= 3) {
      console.log(`✅ PDFMux parser succeeded: ${result.transactions.length} transactions`);
      return { data: result, source: "pdfmux", bankName };
    }
  } catch (error) {
    console.warn("PDFMux parser error:", error);
  }

  // Step 3b: Try PDFMux convert fallback
  try {
    const result = await parsePDFMuxMarkdown(fileBuffer, rawText);
    if (result && result.transactions.length >= 3) {
      console.log(`✅ PDFMux convert parser succeeded: ${result.transactions.length} transactions`);
      return { data: result, source: "pdfmux", bankName };
    }
  } catch (error) {
    console.warn("PDFMux convert error:", error);
  }

  // Step 4: Try LLM fallback (Claude Haiku, ~$0.005)
  try {
    const result = await parseLLM(rawText);
    if (result && result.transactions.length >= 3) {
      console.log(`✅ LLM parser succeeded: ${result.transactions.length} transactions`);
      return { data: result, source: "llm", bankName };
    }
  } catch (error) {
    console.warn("LLM parser error:", error);
  }

  // Step 5: All parsers failed
  console.warn(`❌ All parsers failed for ${bankName} statement`);
  return { data: null, source: "fallback", bankName };
}

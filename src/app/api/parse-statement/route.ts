import { NextRequest, NextResponse } from "next/server";
import { mockStatementData } from "@/data/mock-statement";
import { orchestrateParse } from "@/lib/parsers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Demo mode: no real file → return mock data
    if (!file || file.size < 100) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({
        success: true,
        source: "demo",
        data: mockStatementData,
      });
    }

    // Security: limit file size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        success: false,
        error: "File too large. Maximum size is 10MB.",
      }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({
        success: false,
        error: "Only PDF files are supported.",
      }, { status: 400 });
    }

    // Parse with orchestrator (regex → PDFMux → LLM → fallback)
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await orchestrateParse(buffer);

    if (result.data && result.data.transactions.length > 0) {
      return NextResponse.json({
        success: true,
        source: result.source,
        data: result.data,
      });
    }

    // All parsers failed — return mock with warning
    return NextResponse.json({
      success: true,
      source: "fallback",
      warning: `Could not extract transactions from your ${result.bankName} statement. Showing sample data instead. We're working on improving support for all banks.`,
      data: mockStatementData,
    });
  } catch (error) {
    console.error("Statement parse error:", error);

    return NextResponse.json({
      success: true,
      source: "fallback",
      warning: "Could not parse your statement. Showing sample data instead.",
      data: mockStatementData,
    });
  }
}

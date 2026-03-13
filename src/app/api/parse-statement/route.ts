import { NextRequest, NextResponse } from "next/server";
import { mockStatementData } from "@/data/mock-statement";
import { parseStatement } from "@/lib/pdfmux";

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

    // Real PDF → parse with pdf-parse + regex extraction
    const buffer = Buffer.from(await file.arrayBuffer());

    const parsed = await parseStatement(buffer);

    // Validate that we got meaningful data
    if (parsed.transactions.length === 0 && parsed.totalSpend === 0) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        warning: "Could not extract transactions from your statement. The format may not be supported yet. Showing sample data instead.",
        data: mockStatementData,
      });
    }

    return NextResponse.json({
      success: true,
      source: "parsed",
      data: parsed,
    });
  } catch (error) {
    console.error("Statement parse error:", error);

    // Graceful fallback: return mock with a warning
    return NextResponse.json({
      success: true,
      source: "fallback",
      warning: "Could not parse your statement. Showing sample data instead.",
      data: mockStatementData,
    });
  }
}

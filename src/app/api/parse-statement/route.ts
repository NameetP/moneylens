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

    // Real PDF → PDFMux extraction
    const buffer = Buffer.from(await file.arrayBuffer());

    const parsed = await parseStatement(buffer);

    return NextResponse.json({
      success: true,
      source: "pdfmux",
      data: parsed,
    });
  } catch (error) {
    console.error("Statement parse error:", error);

    // Graceful fallback: if PDFMux fails, return mock with a warning
    // This keeps the app usable during development / if pdfmux isn't installed
    return NextResponse.json({
      success: true,
      source: "fallback",
      warning: "Could not parse your statement. Showing sample data instead.",
      data: mockStatementData,
    });
  }
}

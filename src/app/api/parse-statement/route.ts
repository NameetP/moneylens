import { NextResponse } from "next/server";
import { mockStatementData } from "@/data/mock-statement";

export async function POST() {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return NextResponse.json({
    success: true,
    data: mockStatementData,
  });
}

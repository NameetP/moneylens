import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // In production, this would save to a database and notify the sales team
  console.log("=== NEW LOAN LEAD ===");
  console.log("Name:", body.name);
  console.log("Phone:", body.phone);
  console.log("Email:", body.email);
  console.log("Employer:", body.employer);
  console.log("Salary Range:", body.salaryRange);
  console.log("Desired Amount:", body.desiredAmount);
  console.log("Tenure:", body.tenure);
  console.log("Timestamp:", new Date().toISOString());
  console.log("====================");

  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    message:
      "Thank you! A personal loan specialist will contact you within 24 hours.",
    referenceId: `ML-${Date.now().toString(36).toUpperCase()}`,
  });
}

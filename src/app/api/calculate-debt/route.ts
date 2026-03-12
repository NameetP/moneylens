import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const balance = body.balance || 0;
  // UAE cards charge ~3.49% monthly on outstanding — convert to effective rate
  // For display we use the monthly rate as-is but ensure minimum payment covers interest
  const monthlyRate = (body.interestRate || 3.49) / 100;

  // Minimum payment must be at least interest + 1% of principal (UAE standard)
  const minInterest = balance * monthlyRate;
  const minimumPayment = Math.max(
    body.minimumDue || balance * 0.05,
    minInterest + balance * 0.01
  );

  // Calculate cost of paying minimum only (minimum decreases as balance drops)
  let remaining = balance;
  let totalInterestPaid = 0;
  let months = 0;
  const maxMonths = 360;

  while (remaining > 100 && months < maxMonths) {
    const interest = remaining * monthlyRate;
    totalInterestPaid += interest;
    // Minimum payment = max(500, 5% of remaining balance) — typical UAE rule
    const payment = Math.max(500, remaining * 0.05);
    remaining = remaining + interest - payment;
    months++;
    if (remaining < 0) remaining = 0;
  }

  // Personal loan alternative (typical UAE rates)
  const personalLoanRate = 0.0125; // 1.25% monthly (15% annual — flat)
  const loanTenure = 48; // 4 years
  const monthlyLoanPayment =
    (balance * personalLoanRate * Math.pow(1 + personalLoanRate, loanTenure)) /
    (Math.pow(1 + personalLoanRate, loanTenure) - 1);
  const totalLoanCost = monthlyLoanPayment * loanTenure;
  const loanInterest = totalLoanCost - balance;

  const savings = totalInterestPaid - loanInterest;

  return NextResponse.json({
    success: true,
    data: {
      balance,
      creditCard: {
        monthlyRate: monthlyRate * 100,
        annualRate: monthlyRate * 12 * 100,
        totalInterest: Math.round(totalInterestPaid),
        monthsToPayOff: months,
        yearsToPayOff: +(months / 12).toFixed(1),
      },
      personalLoan: {
        annualRate: 15,
        tenure: loanTenure,
        monthlyPayment: Math.round(monthlyLoanPayment),
        totalInterest: Math.round(loanInterest),
      },
      potentialSavings: Math.round(savings),
    },
  });
}

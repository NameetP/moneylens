import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const balance = Number(body.balance) || 0;

    if (balance <= 0) {
      return NextResponse.json(
        { success: false, error: "Balance must be greater than zero." },
        { status: 400 }
      );
    }

    if (balance > 5000000) {
      return NextResponse.json(
        { success: false, error: "Balance exceeds maximum supported amount." },
        { status: 400 }
      );
    }

    const monthlyRate = (Number(body.interestRate) || 3.49) / 100;

    let remaining = balance;
    let totalInterestPaid = 0;
    let months = 0;
    const maxMonths = 360;

    while (remaining > 100 && months < maxMonths) {
      const interest = remaining * monthlyRate;
      totalInterestPaid += interest;
      const payment = Math.max(500, remaining * 0.05);
      remaining = remaining + interest - payment;
      months++;
      if (remaining < 0) remaining = 0;
    }

    const personalLoanRate = 0.0125;
    const loanTenure = 48;
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
          hitMaxMonths: months >= maxMonths,
        },
        personalLoan: {
          annualRate: 15,
          tenure: loanTenure,
          monthlyPayment: Math.round(monthlyLoanPayment),
          totalInterest: Math.round(loanInterest),
        },
        potentialSavings: Math.round(Math.max(0, savings)),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}

"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import type { StatementData } from "@/data/mock-statement";

interface Props {
  data: StatementData;
}

export function SpendingBreakdown({ data }: Props) {
  const topCategories = data.categories.slice(0, 7);
  const restCategories = data.categories.slice(7);
  const otherSum = restCategories.reduce((s, c) => s + c.amount, 0);
  const otherTxns = restCategories.reduce((s, c) => s + c.transactions, 0);
  const displayCategories = otherSum > 0
    ? [...topCategories, {
        name: "Everything Else",
        amount: otherSum,
        percentage: data.totalSpend > 0 ? Math.round((otherSum / data.totalSpend) * 1000) / 10 : 0,
        color: "#A1A1AA",
        transactions: otherTxns,
      }]
    : topCategories;

  return (
    <div>
      <h2
        className="text-2xl font-extrabold mb-1 tracking-[-0.03em] text-[#18181B]"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        Spending Breakdown
      </h2>
      <p className="text-[#71717A] text-sm mb-6">
        Here&apos;s where your AED{" "}
        {data.totalSpend.toLocaleString("en-AE")} went this month.
      </p>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative" style={{ width: 240, height: 240 }}>
          <PieChart width={240} height={240}>
            <Pie
              data={data.categories}
              cx={120}
              cy={120}
              innerRadius={65}
              outerRadius={100}
              dataKey="amount"
              nameKey="name"
              strokeWidth={2}
              stroke="#ffffff"
              isAnimationActive={false}
            >
              {data.categories.map((cat) => (
                <Cell key={cat.name} fill={cat.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #E4E4E7",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#18181B",
                boxShadow: "var(--shadow-md)",
                padding: "8px 12px",
              }}
              formatter={(value) => [
                `AED ${Number(value).toLocaleString("en-AE")}`,
                "",
              ]}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-[#A1A1AA] font-medium">Total</span>
            <AnimatedNumber
              value={data.totalSpend}
              prefix="AED "
              className="text-xl font-bold text-[#18181B] tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {displayCategories.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#D1FAE5] transition-all"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-sm font-semibold text-[#18181B] w-28 shrink-0">
              {cat.name}
            </span>
            <div className="flex-1 mx-2">
              <div className="h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-mono text-[#18181B] tabular-nums whitespace-nowrap">
              AED {cat.amount.toLocaleString("en-AE")}
            </span>
            <span className="text-xs text-[#A1A1AA] tabular-nums w-16 text-right shrink-0">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

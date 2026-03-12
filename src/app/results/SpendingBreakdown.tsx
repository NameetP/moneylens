"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import type { StatementData } from "@/data/mock-statement";

interface Props {
  data: StatementData;
}

export function SpendingBreakdown({ data }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1 tracking-[-0.02em] text-[#0a0a0a]">
        Spending Breakdown
      </h2>
      <p className="text-[#737373] text-sm mb-8">
        Here&apos;s where your AED{" "}
        {data.totalSpend.toLocaleString("en-AE")} went this month.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="amount"
                  nameKey="name"
                  strokeWidth={3}
                  stroke="#ffffff"
                >
                  {data.categories.map((cat) => (
                    <Cell key={cat.name} fill={cat.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                    fontSize: "13px",
                    color: "#0a0a0a",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [
                    `AED ${Number(value).toLocaleString("en-AE")}`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-[#a3a3a3]">Total</span>
              <AnimatedNumber
                value={data.totalSpend}
                prefix="AED "
                className="text-xl font-bold text-[#0a0a0a]"
              />
            </div>
          </div>
        </div>

        {/* Category Table */}
        <div className="space-y-3">
          {data.categories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#0a0a0a]">
                    {cat.name}
                  </span>
                  <span className="text-sm font-mono text-[#0a0a0a]">
                    AED {cat.amount.toLocaleString("en-AE")}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex-1 mr-3">
                    <div className="h-1.5 bg-[#f5f5f4] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-[#a3a3a3] tabular-nums">
                    {cat.percentage}% &middot; {cat.transactions} txns
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

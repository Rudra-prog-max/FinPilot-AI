import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

import {
  getDashboardSummary,
} from "../../services/dashboardService";

const COLORS = [
  "#06B6D4",
  "#EF4444",
];

export default function IncomeExpenseChart() {
  const [data, setData] = useState([
    {
      name: "Income",
      amount: 0,
    },
    {
      name: "Expense",
      amount: 0,
    },
  ]);

  useEffect(() => {
    async function loadChart() {
      try {
        const summary = await getDashboardSummary();

        setData([
          {
            name: "Income",
            amount: summary.income,
          },
          {
            name: "Expense",
            amount: summary.expense,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    loadChart();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-white">
            Income vs Expense
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Overview of your financial activity
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
          <TrendingUp
            className="text-cyan-400"
            size={24}
          />
        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart
          data={data}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="name"
            tick={{
              fill: "#CBD5E1",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#CBD5E1",
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill: "rgba(255,255,255,0.05)",
            }}
            contentStyle={{
              backgroundColor: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value) => [
              `₹${Number(value ?? 0).toLocaleString()}`,
             "Amount",

            ]}
          />

          <Bar
            dataKey="amount"
            radius={[10, 10, 0, 0]}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
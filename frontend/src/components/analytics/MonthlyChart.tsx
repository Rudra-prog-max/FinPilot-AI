import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  BarChart3,
} from "lucide-react";

import {
  getMonthlyAnalytics,
  type MonthlyAnalytics,
} from "../../services/analyticsService";

export default function MonthlyChart() {
  const [data, setData] = useState<MonthlyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getMonthlyAnalytics();
        setData(response);
      } catch (error) {
        console.error(
          "Failed to load monthly analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-slate-400">
          Loading monthly analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">
            Monthly Income vs Expense
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Compare your monthly cash flow
          </p>

        </div>

        <div className="rounded-xl bg-cyan-500/20 p-3">

          <BarChart3
            size={24}
            className="text-cyan-400"
          />

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <BarChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="month"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip
            cursor={{
              fill: "rgba(255,255,255,0.04)",
            }}
            contentStyle={{
              backgroundColor: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value) => [
              `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
              "Amount",
            ]}
          />

          <Bar
            dataKey="income"
            fill="#22C55E"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="expense"
            fill="#EF4444"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

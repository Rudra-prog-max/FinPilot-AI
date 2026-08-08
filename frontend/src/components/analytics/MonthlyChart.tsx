import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

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
      <div className="flex h-[430px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading monthly analytics...
          </p>
        </div>
      </div>
    );
  }

  const formattedData = data.map((item) => {
    let formattedMonth = item.month;

    if (/^\d{4}-\d{2}$/.test(item.month)) {
      const [year, month] = item.month.split("-");

      const date = new Date(
        Number(year),
        Number(month) - 1,
        1
      );

      formattedMonth = date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "numeric",
        }
      );
    }

    return {
      ...item,
      displayMonth: formattedMonth,
    };
  });

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

      {data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center">
          <div className="text-center">
            <BarChart3
              size={40}
              className="mx-auto text-slate-600"
            />

            <p className="mt-4 text-slate-400">
              No monthly transaction data available.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add some transactions to see your cash flow.
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={formattedData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />

            <XAxis
              dataKey="displayMonth"
              stroke="#94A3B8"
              tickLine={false}
              axisLine={{
                stroke: "#334155",
              }}
            />

            <YAxis
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString(
                  "en-IN"
                )}`
              }
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
              labelStyle={{
                color: "#CBD5E1",
                marginBottom: "6px",
              }}
              formatter={(value, name) => [
                `₹${Number(value ?? 0).toLocaleString(
                  "en-IN"
                )}`,
                name === "income"
                  ? "Income"
                  : "Expense",
              ]}
            />

            <Legend
              verticalAlign="bottom"
              height={30}
              iconType="circle"
              wrapperStyle={{
                color: "#CBD5E1",
              }}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#22C55E"
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
            />

            <Bar
              dataKey="expense"
              name="Expense"
              fill="#EF4444"
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
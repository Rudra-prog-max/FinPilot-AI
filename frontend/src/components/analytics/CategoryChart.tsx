import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

import {
  getCategoryAnalytics,
  type CategoryAnalytics,
} from "../../services/analyticsService";

const COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

export default function CategoryChart() {
  const [data, setData] = useState<CategoryAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategoryAnalytics();
        setData(response);
      } catch (error) {
        console.error(
          "Failed to load category analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[430px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading expense categories...
          </p>
        </div>
      </div>
    );
  }

  const totalSpent = data.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Expense Categories
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Distribution of your spending
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500/20 p-3">
          <PieChartIcon
            size={24}
            className="text-cyan-400"
          />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center">
          <div className="text-center">
            <PieChartIcon
              size={40}
              className="mx-auto text-slate-600"
            />

            <p className="mt-4 font-medium text-slate-400">
              No expense data available.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add some expense transactions to see the
              breakdown.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={115}
                  paddingAngle={4}
                  cornerRadius={8}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  labelStyle={{
                    color: "#CBD5E1",
                  }}
                  formatter={(value) => [
                    `₹${Number(
                      value ?? 0
                    ).toLocaleString("en-IN")}`,
                    "Spent",
                  ]}
                />

                <Legend
                  iconType="circle"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    color: "#CBD5E1",
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs text-slate-500">
                Total Spent
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-2 space-y-2">
            {data.map((item, index) => {
              const percentage =
                totalSpent > 0
                  ? (item.amount / totalSpent) * 100
                  : 0;

              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[
                            index % COLORS.length
                          ],
                      }}
                    />

                    <span className="text-sm text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {percentage.toFixed(1)}%
                    </span>

                    <span className="text-sm font-semibold text-white">
                      ₹
                      {item.amount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
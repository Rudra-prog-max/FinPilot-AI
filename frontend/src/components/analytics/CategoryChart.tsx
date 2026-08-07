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
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-slate-400">
          Loading categories...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-slate-400">
          No category data available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <div className="mb-6 flex items-center justify-between">

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

      <ResponsiveContainer
        width="100%"
        height={330}
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={4}
            cornerRadius={8}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
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
            formatter={(value) => [
              `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
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

    </div>
  );
}

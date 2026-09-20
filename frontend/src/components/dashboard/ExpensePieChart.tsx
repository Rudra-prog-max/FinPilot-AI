import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

import {
  getExpenseCategories,
  type ExpenseCategory,
} from "../../services/dashboardService";

const COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#22C55E",
  "#EC4899",
];

export default function ExpensePieChart() {
  const [expenseData, setExpenseData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await getExpenseCategories();
        setExpenseData(data);
      } catch (error) {
        console.error(
          "Failed to load expense categories:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    void loadExpenses();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-slate-400">
          Loading expenses...
        </p>
      </div>
    );
  }

  if (expenseData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-slate-400">
          No expense data available.
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
            Expense Distribution
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Category-wise spending
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
          <PieChartIcon
            size={24}
            className="text-cyan-400"
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={expenseData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            cornerRadius={8}
          >
            {expenseData.map((_, index) => (
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
              color: "#ffffff",
            }}
            formatter={(value) => [
              `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
              "Spent",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
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
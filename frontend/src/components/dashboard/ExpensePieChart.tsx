import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  getExpenseCategories,
  type ExpenseCategory,
} from "../../services/dashboardService";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

export default function ExpensePieChart() {
  const [data, setData] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getExpenseCategories();
        setData(categories);
      } catch (error) {
        console.error("Failed to load expense categories:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">
        Expense Categories
      </h2>

      <div className="h-80">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
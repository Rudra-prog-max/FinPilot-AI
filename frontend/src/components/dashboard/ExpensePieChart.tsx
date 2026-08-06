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
];


const ExpensePieChart = () => {
  const [expenseData, setExpenseData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchExpenses = async () => {
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
    };

    fetchExpenses();
  }, []);


  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-gray-900 text-gray-400">
        Loading expenses...
      </div>
    );
  }


  if (expenseData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-gray-900 text-gray-400">
        No expense data available
      </div>
    );
  }


  return (
    <div className="rounded-xl bg-gray-900 p-6 shadow-lg">

      <h2 className="mb-4 text-xl font-semibold text-white">
        Expense Distribution
      </h2>


      <ResponsiveContainer width="100%" height={320}>
        <PieChart>

          <Pie
            data={expenseData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >

            {expenseData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>


          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          />


          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};


export default ExpensePieChart;
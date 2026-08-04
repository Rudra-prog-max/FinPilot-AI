import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getDashboardSummary,
} from "../../services/dashboardService";

export default function IncomeExpenseChart() {
  const [data, setData] = useState([
    { name: "Income", amount: 0 },
    { name: "Expense", amount: 0 },
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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Income vs Expense
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="amount"
            fill="#06b6d4"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
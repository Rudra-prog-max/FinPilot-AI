import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "../../services/dashboardService";

export default function StatsGrid() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    }

    loadSummary();
  }, []);

  if (!summary) {
    return (
      <p className="text-gray-500">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Balance"
        value={`₹${summary.balance}`}
        icon="💰"
        color="bg-blue-600"
      />

      <StatCard
        title="Income"
        value={`₹${summary.income}`}
        icon="📈"
        color="bg-green-600"
      />

      <StatCard
        title="Expenses"
        value={`₹${summary.expense}`}
        icon="📉"
        color="bg-red-600"
      />

      <StatCard
        title="Transactions"
        value={`${summary.transactions}`}
        icon="📋"
        color="bg-purple-600"
      />
    </div>
  );
}
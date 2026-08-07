import { useEffect, useState } from "react";

import StatCard from "./StatCard";

import {
  getDashboardSummary,
  type DashboardSummary,
} from "../../services/dashboardService";

export default function StatsGrid() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        console.log("Dashboard Summary:", data);
        setSummary(data);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      }
    }

    loadSummary();
  }, []);

  if (!summary) {
    return (
      <div className="text-slate-400 text-center py-10">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        title="Total Balance"
        value={`₹${summary.balance}`}
        icon="💰"
        color="bg-gradient-to-r from-cyan-600 to-blue-600"
      />

      <StatCard
        title="Income"
        value={`₹${summary.income}`}
        icon="📈"
        color="bg-gradient-to-r from-green-600 to-emerald-500"
      />

      <StatCard
        title="Expenses"
        value={`₹${summary.expense}`}
        icon="📉"
        color="bg-gradient-to-r from-red-600 to-rose-500"
      />

      <StatCard
        title="Transactions"
        value={`${summary.transactions}`}
        icon="📋"
        color="bg-gradient-to-r from-violet-600 to-purple-500"
      />

    </div>
  );
}
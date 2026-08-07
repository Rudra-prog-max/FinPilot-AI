import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import {
  getDashboardSummary,
  type DashboardSummary,
} from "../../services/dashboardService";

export default function AnalyticsSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error(
          "Failed to load analytics summary:",
          error
        );
      }
    }

    loadSummary();
  }, []);

  if (!summary) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
          />
        ))}
      </div>
    );
  }

  const savingsRate =
    summary.income > 0
      ? ((summary.balance / summary.income) * 100).toFixed(1)
      : "0";

  const cards = [
    {
      title: "Total Income",
      value: `₹${summary.income.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/20",
    },
    {
      title: "Total Expense",
      value: `₹${summary.expense.toLocaleString("en-IN")}`,
      icon: TrendingDown,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/20",
    },
    {
      title: "Net Balance",
      value: `₹${summary.balance.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/20",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      icon: PiggyBank,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon
                  size={28}
                  className={card.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

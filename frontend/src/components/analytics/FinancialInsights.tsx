import { useEffect, useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Trophy,
  PieChart,
} from "lucide-react";

import {
  getDashboardSummary,
  type DashboardSummary,
} from "../../services/dashboardService";

import {
  getCategoryAnalytics,
  type CategoryAnalytics,
} from "../../services/analyticsService";

export default function FinancialInsights() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [categories, setCategories] =
    useState<CategoryAnalytics[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const [summaryData, categoryData] =
          await Promise.all([
            getDashboardSummary(),
            getCategoryAnalytics(),
          ]);

        setSummary(summaryData);
        setCategories(categoryData);
      } catch (error) {
        console.error(
          "Failed to load financial insights:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-800" />

          <div>
            <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />

            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-800" />
          </div>
        </div>

        <div className="mt-6 h-20 animate-pulse rounded-xl bg-slate-800" />

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const savingsRate =
    summary.income > 0
      ? (summary.balance / summary.income) * 100
      : 0;

  const totalCategoryExpense = categories.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const topCategory =
    categories.length > 0
      ? [...categories].sort(
          (a, b) => b.amount - a.amount
        )[0]
      : null;

  const topCategoryPercentage =
    topCategory && totalCategoryExpense > 0
      ? (topCategory.amount /
          totalCategoryExpense) *
        100
      : 0;

  let mainInsight = "";
  let insightIcon = Lightbulb;
  let insightColor = "text-cyan-400";
  let insightBg = "bg-cyan-500/10";
  let insightBorder = "border-cyan-500/20";

  if (summary.balance < 0) {
    mainInsight =
      "Your expenses are higher than your income. Consider reducing unnecessary spending.";

    insightIcon = AlertTriangle;
    insightColor = "text-red-400";
    insightBg = "bg-red-500/10";
    insightBorder = "border-red-500/20";
  } else if (savingsRate >= 30) {
    mainInsight =
      "Excellent savings rate! You're keeping a healthy portion of your income.";

    insightIcon = TrendingUp;
    insightColor = "text-green-400";
    insightBg = "bg-green-500/10";
    insightBorder = "border-green-500/20";
  } else if (savingsRate >= 15) {
    mainInsight =
      "You're maintaining a positive savings rate. Keep building your financial cushion.";

    insightIcon = TrendingUp;
    insightColor = "text-cyan-400";
    insightBg = "bg-cyan-500/10";
    insightBorder = "border-cyan-500/20";
  } else {
    mainInsight =
      "Your savings rate is low. Consider reviewing your spending and setting stronger limits.";

    insightIcon = TrendingDown;
    insightColor = "text-yellow-400";
    insightBg = "bg-yellow-500/10";
    insightBorder = "border-yellow-500/20";
  }

  const MainIcon = insightIcon;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
          <Lightbulb
            size={22}
            className="text-cyan-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Financial Insights
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Smart observations about your finances.
          </p>
        </div>
      </div>

      {/* Main Insight */}
      <div
        className={`mt-6 rounded-xl border p-5 ${insightBg} ${insightBorder}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insightBg}`}
          >
            <MainIcon
              size={21}
              className={insightColor}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Financial Health
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-300">
              {mainInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Insight Stats */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Savings Rate */}
        <div className="rounded-xl bg-slate-800/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp
                size={18}
                className="text-green-400"
              />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Savings Rate
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Top Spending */}
        <div className="rounded-xl bg-slate-800/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <Trophy
                size={18}
                className="text-purple-400"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-500">
                Top Spending
              </p>

              <p className="mt-1 truncate text-lg font-bold capitalize text-white">
                {topCategory?.category || "No data"}
              </p>
            </div>
          </div>
        </div>

        {/* Top Category Share */}
        <div className="rounded-xl bg-slate-800/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
              <PieChart
                size={18}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Top Category Share
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {topCategoryPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Biggest Expense */}
      {topCategory && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
          <div>
            <p className="text-sm text-slate-400">
              Biggest expense category
            </p>

            <p className="mt-1 font-semibold capitalize text-white">
              {topCategory.category}
            </p>
          </div>

          <p className="text-lg font-bold text-cyan-400">
            ₹
            {topCategory.amount.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      )}
    </div>
  );
}
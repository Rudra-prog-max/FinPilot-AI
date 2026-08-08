import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
} from "lucide-react";

import {
  createBudget,
  deleteBudget,
  getBudgets,
  getBudgetAnalysis,
  type Budget,
  type BudgetAnalysis,
} from "../../services/budgetService";

import Layout from "../../components/layout/Layout";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [analysis, setAnalysis] = useState<BudgetAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    category: "",
    monthly_limit: "",
  });

  async function loadBudgets() {
    try {
      setLoading(true);

      const budgetData = await getBudgets();
      const analysisData = await getBudgetAnalysis();

      setBudgets(budgetData);
      setAnalysis(analysisData);
    } catch (error) {
      console.error("Failed to load budgets:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !form.category.trim() ||
      !form.monthly_limit
    ) {
      alert("Please fill all fields.");
      return;
    }

    const monthlyLimit = Number(
      form.monthly_limit
    );

    if (monthlyLimit <= 0) {
      alert("Monthly limit must be greater than 0.");
      return;
    }

    try {
      await createBudget({
        category: form.category.trim(),
        monthly_limit: monthlyLimit,
      });

      setForm({
        category: "",
        monthly_limit: "",
      });

      await loadBudgets();
    } catch (error) {
      console.error(
        "Failed to create budget:",
        error
      );

      alert("Failed to create budget.");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBudget(id);
      await loadBudgets();
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      alert("Failed to delete budget.");
    }
  }

  function getAnalysis(category: string) {
    return analysis.find(
      (item) => item.category === category
    );
  }

  const totalLimit = budgets.reduce(
    (sum, budget) =>
      sum + budget.monthly_limit,
    0
  );

  const totalSpent = analysis.reduce(
    (sum, item) => sum + item.spent,
    0
  );

  const totalRemaining =
    totalLimit - totalSpent;

  const overallPercentage =
    totalLimit > 0
      ? (totalSpent / totalLimit) * 100
      : 0;

  function getStatus(percentage: number) {
    if (percentage >= 100) {
      return {
        label: "Over Budget",
        icon: AlertTriangle,
        container:
          "border-red-500/30 bg-red-500/10",
        text: "text-red-400",
        bar: "bg-red-500",
      };
    }

    if (percentage >= 80) {
      return {
        label: "Near Limit",
        icon: AlertTriangle,
        container:
          "border-yellow-500/30 bg-yellow-500/10",
        text: "text-yellow-400",
        bar: "bg-yellow-500",
      };
    }

    return {
      label: "On Track",
      icon: CheckCircle2,
      container:
        "border-green-500/30 bg-green-500/10",
      text: "text-green-400",
      bar: "bg-green-500",
    };
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-slate-400">
              Loading budgets...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <Wallet
                size={24}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">
                Budget Planner
              </h1>

              <p className="mt-1 text-slate-400">
                Set spending limits and stay on top
                of your finances.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Budget
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  ₹{totalLimit.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Target
                  size={20}
                  className="text-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Spent
                </p>

                <p className="mt-2 text-2xl font-bold text-red-400">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <TrendingDown
                  size={20}
                  className="text-red-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Remaining
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    totalRemaining >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ₹
                  {totalRemaining.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <TrendingUp
                  size={20}
                  className="text-green-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overall Usage */}
        {budgets.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Overall Budget Usage
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {overallPercentage.toFixed(1)}% of
                  your total budget used
                </p>
              </div>

              <span className="text-lg font-bold text-cyan-400">
                {overallPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${
                  overallPercentage >= 100
                    ? "bg-red-500"
                    : overallPercentage >= 80
                    ? "bg-yellow-500"
                    : "bg-cyan-500"
                }`}
                style={{
                  width: `${Math.min(
                    overallPercentage,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Add Budget */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <Plus
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Add Budget
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a monthly spending limit.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <input
                type="text"
                placeholder="e.g. Food"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Monthly Limit
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  placeholder="5000"
                  value={form.monthly_limit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      monthly_limit:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-9 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-500"
              >
                <Plus size={18} />
                Add Budget
              </button>
            </div>
          </form>
        </div>

        {/* Budget Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Your Budgets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor spending across your categories.
              </p>
            </div>

            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-400">
              {budgets.length}{" "}
              {budgets.length === 1
                ? "Budget"
                : "Budgets"}
            </span>
          </div>

          {budgets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                <Target
                  size={26}
                  className="text-slate-500"
                />
              </div>

              <p className="mt-4 font-medium text-slate-300">
                No budgets created yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first budget above to start
                tracking your spending.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {budgets.map((budget) => {
                const data = getAnalysis(
                  budget.category
                );

                const percentage =
                  data?.percentage ?? 0;

                const status =
                  getStatus(percentage);

                const StatusIcon =
                  status.icon;

                return (
                  <div
                    key={budget.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg transition hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                            <Wallet
                              size={19}
                              className="text-cyan-400"
                            />
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold capitalize text-white">
                              {budget.category}
                            </h3>

                            <p className="text-sm text-slate-500">
                              Monthly budget
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            budget.id
                          )
                        }
                        title="Delete budget"
                        className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {data && (
                      <>
                        <div className="mt-6 grid grid-cols-3 gap-3">
                          <div className="rounded-xl bg-slate-800/70 p-3">
                            <p className="text-xs text-slate-500">
                              Limit
                            </p>

                            <p className="mt-1 font-semibold text-white">
                              ₹
                              {budget.monthly_limit.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-800/70 p-3">
                            <p className="text-xs text-slate-500">
                              Spent
                            </p>

                            <p className="mt-1 font-semibold text-red-400">
                              ₹
                              {data.spent.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-800/70 p-3">
                            <p className="text-xs text-slate-500">
                              Remaining
                            </p>

                            <p
                              className={`mt-1 font-semibold ${
                                data.remaining >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              ₹
                              {data.remaining.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div
                            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.container} ${status.text}`}
                          >
                            <StatusIcon size={14} />
                            {status.label}
                          </div>

                          <span className="text-sm font-semibold text-slate-300">
                            {percentage.toFixed(1)}%
                            used
                          </span>
                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${status.bar}`}
                            style={{
                              width: `${Math.min(
                                percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
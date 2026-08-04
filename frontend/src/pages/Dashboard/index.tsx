import Layout from "../../components/layout/Layout";

import StatsGrid from "../../components/dashboard/StatsGrid";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "../../components/dashboard/ExpensePieChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import AIInsights from "../../components/dashboard/AIInsights";

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back to FinPilot-AI.
          </p>
        </div>

        <StatsGrid />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <IncomeExpenseChart />
          </div>

          <ExpensePieChart />
        </div>

        <RecentTransactions />

        <AIInsights />
      </div>
    </Layout>
  );
}